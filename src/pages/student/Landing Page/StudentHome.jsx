import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Analytics from "../../../assets/Analytics.png";
import Curriculum from "../../../assets/Curriculum.png";
import Evaluation from "../../../assets/Evaluation.png";
import StudentImage from "../../../assets/students.jpg";
import Footer from "../../../components/footer/footer";
import Navbar from "../../../components/navbar/navbar";
import { endPoint } from "../../config";

function StudentHome() {
  const studentNumber = Cookies.get("student_number");
  console.log("Student Number in studentHome", studentNumber);
  const [student, setStudent] = useState({});
  const [programs, setPrograms] = useState([]);
  const [programName, setProgramName] = useState("");
  const [programId, setProgramId] = useState();
  const [remainingCreditUnits, setRemainingCreditUnits] = useState(0);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [validatedTotalunits, setValidatedTotalUnits] = useState(0);
  const [validatedCourse, setValidatedCourse] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [progAbbr, setProgAbbr] = useState("");
  const [strand, setStrand] = useState("");

  //fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        if (studentData) {
          setStudent(studentData);
          setProgramId(studentData.program_id);
          setStrand(studentData.strand);
        } else {
          console.error("Empty or unexpected response:", studentResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [programs, studentNumber]);

  //fetch program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        setPrograms(programs);

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (programTable) => programTable.program_id === programId
        );

        console.log("Selected Program:", selectedProgram);

        if (selectedProgram) {
          const program_name = selectedProgram.program_name;
          console.log("Program Name:", program_name);
          setProgramName(program_name);
          setProgAbbr(selectedProgram.program_abbr);
          console.log("Program Name has been set:", program_name);
        } else {
          console.error("Program not found");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, [programId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId || !studentNumber) {
          return;
        }

        console.log("Fetching data for studentNumber:", studentNumber);

        // Fetch data from validateData endpoint
        const validateResponse = await axios.get(
          `${endPoint}/validateData?studentNumber=${studentNumber}`
        );

        console.log("Response data:", validateResponse.data);
        const validateData = validateResponse.data || [];

        setValidatedCourse(validateData);
        console.log("Data fetched successfully");

        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [studentNumber, programId]);

  useEffect(() => {
    axios
      .get(`${endPoint}/curriculum-yearstarted`)
      .then((response) => {
        const data = response.data;
        console.log("res", response.data);

        const yearsSet = new Set(data);
        console.log("Set", yearsSet);

        const years = Array.from(yearsSet);
        console.log("Years", years);

        const admissionYear = parseInt(studentNumber.substring(0, 4));
        console.log("Admission Year:", admissionYear);

        let courseType = "";
        years.sort();

        const matchingYear = years.find((year) => year <= admissionYear);
        if (matchingYear !== undefined) {
          courseType = matchingYear;
        } else {
          courseType = years[years.length - 1] || "";
        }

        console.log("Course type:", courseType);

        return courseType;
      })
      .then((courseType) => {
        axios
          .get(
            `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
          )
          .then((res) => {
            const combinedData = res.data;

            console.log("Curriculum Data:", combinedData);

            if (!Array.isArray(combinedData)) {
              console.error("Invalid data format. Expected an array.");
              return;
            }

            if (combinedData.length > 0 && !("course_id" in combinedData[0])) {
              console.error(
                "Invalid data format. Missing 'course_id' property."
              );
              return;
            }

            let totalCreditUnits = 0;
            combinedData.forEach((course) => {
              if (
                !(
                  (progAbbr === "BSIT" && strand === "STEM") ||
                  (strand === "ICT" && course.course_sem === "BRIDGING")
                )
              ) {
                console.log(
                  `Credit Unit for ${course.course_id}: ${course.credit_unit}`
                );
                totalCreditUnits += course.credit_unit;
              }
            });

            console.log("Total Credit Units:", totalCreditUnits);
            setTotalCreditUnits(totalCreditUnits);

            const courseIds = combinedData.map((course) => course.course_id);

            const matchingCourseIds = validatedCourse.filter((course) =>
              courseIds.includes(course.course_id)
            );

            console.log("Matching Course IDs:", matchingCourseIds);

            const creditUnitsMap = {};
            let totalValidatedCreditUnits = 0;

            matchingCourseIds.forEach((course) => {
              const matchingData = combinedData.find(
                (data) => data.course_id === course.course_id
              );
              creditUnitsMap[course.course_id] = matchingData.credit_unit;

              totalValidatedCreditUnits += matchingData.credit_unit;
            });

            console.log(
              "Validated Total Credit Units:",
              totalValidatedCreditUnits
            );
            setValidatedTotalUnits(totalValidatedCreditUnits);

            const remainingCreditUnits =
              totalCreditUnits - totalValidatedCreditUnits;
            setRemainingCreditUnits(remainingCreditUnits);

            console.log("Credit Units:", creditUnitsMap);
            console.log("Remaining:", remainingCreditUnits);
            console.log("Total:", totalCreditUnits);
            // setCreditUnits(creditUnitsMap);
          })
          .catch((error) => {
            console.error("Error fetching curriculum data:", error.message);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [progAbbr, programId, strand, studentNumber, validatedCourse]);

  return (
    <Flex
      direction="column"
      w="100vw"
      h="100vh"

      // backgroundImage={`url(${StudentImage})`}
      // backgroundSize="100 "
      // backgroundPosition="center"
      // backgroundRepeat="repeat"
    >
      <Box
        w="100%"
        pos="sticky"
        h="6rem"
        boxShadow="lg"
        top="0"
        right="0"
        bgColor="#F3F8FF"
        zIndex="2"
      >
        <Navbar />
      </Box>
      <Box
        className="red-square"
        position="absolute"
        // top="0"
        //left="49%"
        // transform="translate(-50%, -50%) rotate(-15deg)"
        width="100vw"
        height="100vh"
        bgColor="rgba(116, 2, 2, 1)"
        overflow="hidden"
        zIndex={1}
        // borderRadius="20px"
      >
        <Box
          className="image"
          position="absolute"
          width="100%"
          height="100%"
          bgImage={`url(${StudentImage})`}
          bgRepeat="no-repeat"
          bgPos="center"
          bgSize="100"
          //   left="-35"
          // bottom=""
          border="white"
          zIndex={-1}
          opacity="0.3"
          // transform="rotate(15deg)"
          // overflow="hidden"
          // overflowX="hidden"
        ></Box>
        <VStack w="100%" p="10rem" textAlign="center" color="white">
          <Text fontWeight="bold" fontSize="25px">
            PUP Student Curriculum Evaluation System{" "}
          </Text>
          <Text mt="1rem" fontWeight="semi-bold" fontSize="20px">
            {programName}
          </Text>
          <Text mt="5rem" fontWeight="bold" fontSize="20px">
            Good Day!
          </Text>
          <Text
            fontSize={{ base: "16px", md: "20px", lg: "30px" }}
            fontWeight="semibold"
            mt="1rem"
            // fontStyle="Bitter"
            textAlign="center"
          >
            {student.first_name} {student.middle_name} {student.last_name}
          </Text>
          <HStack mt="6rem" spacing={20}>
            <VStack>
              <Heading
                as="h4"
                //   w={{ base: "6rem", sm: "6rem", md: "8rem", lg: "10rem" }}
                sx={{
                  fontSize: {
                    base: "14px",
                    sm: "14px",
                    md: "15px",
                    lg: "20px",
                  },
                  fontWeight: "bold",
                }}
                color="white"
              >
                Total Credit Units
              </Heading>
              <Spacer
                borderBottom="2px solid black"
                width={{ base: "20%", lg: "50%" }}
                spacing={4}
                marginLeft={{ base: "20", lg: "10" }}
                borderColor="#F9AB00"
              />
              <Text
                fontSize={{ base: "", lg: "25px" }}
                w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}
              >
                {totalCreditUnits}
              </Text>
            </VStack>
            <VStack>
              <Heading
                as="h4"
                //   w={{ base: "6rem", sm: "6rem", md: "8rem", lg: "10rem" }}
                sx={{
                  fontSize: {
                    base: "14px",
                    sm: "14px",
                    md: "15px",
                    lg: "20px",
                  },
                  fontWeight: "bold",
                }}
                color="white"
              >
                Remaining Credit Units
              </Heading>
              <Spacer
                borderBottom="2px solid black"
                width={{ base: "20%", lg: "50%" }}
                spacing={4}
                marginLeft={{ base: "20", lg: "12" }}
                borderColor="#F9AB00"
              />
              <Text
                fontSize={{ base: "", lg: "25px" }}
                w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}
              >
                {remainingCreditUnits}
              </Text>
            </VStack>
          </HStack>
          <NavLink to="/studentdashboard">
            <Button
              mt="3rem"
              bg="#F9AB00"
              sx={{
                fontSize: {
                  base: "10px",
                  sm: "10px",
                  md: "13px",
                  lg: "15px",
                },
                fontWeight: "bold",
                width: { base: "6rem", sm: "6rem", md: "6rem", lg: "8rem" },
                color: "white",
                ":hover": {
                  bg: "#FFD855", // lighter color when hovered
                },
              }}
            >
              View Analytics
            </Button>
          </NavLink>
        </VStack>
      </Box>
      <VStack
        position="absolute"
        w="100vw"
        h="70vh"
        top={{ base: "800px", sm: "800px", md: "800px", lg: "900px" }}
      >
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="space-between"
          ml="auto"
          mr="auto"
          w="70vw"
          alignItems="center"
        >
          <VStack
            w={{ base: "15rem", sm: "15rem", md: "10rem", lg: "15rem" }}
            mb={{ base: "3rem", sm: "2rem", md: "0rem", lg: "0rem" }}
          >
            <Image
              src={Analytics}
              alt="Analytics"
              w="70px"
              h="auto"
              borderRadius="md"
            />
            <Heading
              as="h4"
              w={{ base: "10rem", sm: "10rem", md: "20rem", lg: "10rem" }}
              sx={{
                fontSize: { base: "md", sm: "lg", md: "xl", lg: "20px" },
                fontWeight: "bold",
              }}
              textAlign="center"
            >
              Analytics
            </Heading>
            <Text w="100%" textAlign="justify">
              The graph representation of student academic performance,
              including their strengths, weaknesses, and areas for improvement.
              Also the overall taken and not take units every semester.
            </Text>
          </VStack>
          <VStack
            w={{ base: "15rem", sm: "15rem", md: "10rem", lg: "15rem" }}
            ml={{ base: "0rem", sm: "0rem", md: "2rem", lg: "5rem" }}
            mr={{ base: "0rem", sm: "0rem", md: "2rem", lg: "5rem" }}
            mb={{ base: "3rem", sm: "2rem", md: "0rem", lg: "0rem" }}
          >
            <Image
              src={Curriculum}
              alt="Curriculum"
              w="70px"
              h="auto"
              borderRadius="md"
            />
            <Heading
              as="h4"
              w={{ base: "10rem", sm: "10rem", md: "20rem", lg: "10rem" }}
              sx={{
                fontSize: { base: "md", sm: "lg", md: "xl", lg: "20px" },
                fontWeight: "bold",
              }}
              textAlign="center"
            >
              Curriculum
            </Heading>
            <Text w="100%" textAlign="justify">
              The list of subjects in a course organizely arranged by semester.
            </Text>
          </VStack>
          <VStack
            w={{ base: "15rem", sm: "15rem", md: "10rem", lg: "15rem" }}
            mb={{ base: "3rem", sm: "2rem", md: "0rem", lg: "0rem" }}
          >
            <Image
              src={Evaluation}
              alt="Evaluation"
              w="70px"
              h="auto"
              borderRadius="md"
            />
            <Heading
              as="h4"
              w={{ base: "10rem", sm: "10rem", md: "20rem", lg: "10rem" }}
              sx={{
                fontSize: { base: "md", sm: "lg", md: "xl", lg: "20px" },
                fontWeight: "bold",
              }}
              textAlign="center"
            >
              Evaluation
            </Heading>
            <Text w="100%" textAlign="justify">
              The request for curriculum evaluation take place and all history
              of previous evaluated curriculum can be viewed.
            </Text>
          </VStack>
        </Box>
        {/* <Spacer mt="2rem" /> */}
        <Box
          position="absolute"
          w="100vw"
          h="20vh"
          bottom={{ base: "-510", sm: "-600", md: "0", lg: "0" }}
        >
          <Footer />
        </Box>
      </VStack>
    </Flex>
  );
}

export default StudentHome;
