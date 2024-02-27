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
import { useEffect, useRef, useState } from "react";
import { endPoint } from "../../config";
import ClassList from "../Home/ClassList";
import Upload from "../Home/Upload";

import { NavLink } from "react-router-dom";
import Analytics from "../../../assets/Analytics.png";
import Curriculum from "../../../assets/Curriculum.png";
import Evaluation from "../../../assets/Evaluation.png";
import Faculty_bg from "../../../assets/faculty_bg.png";
import Footer from "../../../components/footer/footer";
import FacultyNavbar from "../../../components/navbar/facultynavbar";

function LandingPage() {
  const uploadRef = useRef(null);
  const [facultyName, setFacultyName] = useState("");
  const [facultyprogram, setFacultyProgram] = useState([]);

  const [totalStudents, setTotalStudents] = useState(0);
  const [femaleStudents, setFemaleStudents] = useState(0);
  const [maleStudents, setMaleStudents] = useState(0);
  const [programName, setProgramName] = useState("");

  const facultyEmail = Cookies.get("facultyEmail");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then(async (response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_lname}`
          );
          setFacultyProgram(facultyData.program_id.toString());

          try {
            const programsResponse = await axios.get(`${endPoint}/programs`);
            const programs = programsResponse.data;

            const selectedProgram = programs.find(
              (programTable) =>
                programTable.program_id === facultyData.program_id
            );

            console.log("Selected Program:", selectedProgram);

            if (selectedProgram) {
              const program_name = selectedProgram.program_name;
              console.log("Program Name:", program_name);
              setProgramName(program_name);
              console.log("Program Name has been set:", program_name);
            } else {
              console.error("Program not found");
            }
          } catch (error) {
            console.error("Error fetching programs:", error);
          }
        })
        .catch((error) => {
          console.error("Error fetching faculty data:", error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    // Fetch and count all students with the specified program_id
    axios
      .get(`${endPoint}/students/all`)
      .then((response) => {
        const allStudents = response.data;
        const studentsWithProgramId = allStudents.filter(
          (student) => student.program_id === facultyprogram
        );
        setTotalStudents(studentsWithProgramId.length);
        console.log(" studentsWithProgramId", studentsWithProgramId);

        // Count female students
        const femaleStudentsCount = studentsWithProgramId.filter(
          (student) => student.gender === "Female"
        ).length;
        setFemaleStudents(femaleStudentsCount);

        // Count male students
        const maleStudentsCount = studentsWithProgramId.filter(
          (student) => student.gender === "Male"
        ).length;
        setMaleStudents(maleStudentsCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyprogram]);

  const scrollToUpload = () => {
    uploadRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Flex w="100%">
      <Box>
        <Box
          w="100%"
          pos="sticky"
          h="6rem"
          boxShadow="lg"
          top="0"
          right="0"
          bgColor="#F3F8FF"
          zIndex="2"
          // overflow="hidden"
        >
          <FacultyNavbar />
        </Box>

        <Box
          position="relative"
          w="100vw"
          h="80vh"
          overflow="hidden"
          //  zIndex={1}
        >
          <Box
            className="red-square"
            position="absolute"
            top="0"
            left="49%"
            transform="translate(-50%, -50%) rotate(-15deg)"
            width="100vw"
            height="100vh"
            bgColor="rgba(116, 2, 2, 1)"
            overflow="hidden"
            //  zIndex={1}
            borderRadius="20px"
          >
            <Box
              className="image"
              position="absolute"
              width="calc(100% + 56px)"
              height="100%"
              bgImage={`url(${Faculty_bg})`}
              bgRepeat="no-repeat"
              bgPos="center"
              bgSize="cover"
              left="-35"
              bottom="-192"
              border="white"
              //   zIndex={-1}
              opacity="0.2"
              transform="rotate(15deg)"
              // overflow="hidden"
              // overflowX="hidden"
            ></Box>
          </Box>
          <Box opacity="0.9" position="absolute" zIndex={1}>
            <Heading
              as="h5"
              size="lg"
              position="absolute"
              top={{ base: "90px", sm: "90px", md: "90px", lg: "90px" }}
              left="170px"
              h="2rem"
              color="white"
              w={{ base: "10rem", sm: "30rem", md: "40rem", lg: "50rem" }}
              sx={{
                fontSize: { base: "md", sm: "md", md: "lg", lg: "xl" },
                fontWeight: "bold",
              }}
            >
              PUP Student Curriculum Evaluation System
            </Heading>
            <VStack
              position="absolute"
              top={{ base: "220px", sm: "220px", md: "220px", lg: "220px" }}
              left="160px"
            >
              <Heading
                as="h2"
                size="lg"
                h="2rem"
                color="white"
                w={{ base: "10rem", sm: "10rem", md: "15rem", lg: "20rem" }}
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "35px" },
                  fontWeight: "bold",
                }}
              >
                Good Day!
              </Heading>
              <Heading
                as="h2"
                size="lg"
                // position="absolute"
                // top="350"
                // left="120px"
                h="2rem"
                mt="1.5rem"
                color="white"
                w={{ base: "10rem", sm: "10rem", md: "15rem", lg: "20rem" }}
                sx={{
                  fontSize: { base: "md", sm: "lg", md: "xl", lg: "35px" },
                  fontWeight: "bold",
                }}
              >
                {facultyName}
              </Heading>
            </VStack>
          </Box>
          <VStack
            position="absolute"
            bottom={{ base: "10px", sm: "30px", md: "20px", lg: "10px" }}
            right={{ base: "30px", sm: "30px", md: "20px", lg: "10px" }}
            mr={{ base: "0rem", sm: "0rem", md: "2rem", lg: "5rem" }}
          >
            <Heading
              as="h2"
              size="lg"
              h={{ base: "3rem", sm: "3rem", md: "4rem", lg: "5rem" }}
              color="black"
              w={{ base: "20rem", sm: "20rem", md: "20rem", lg: "30rem" }}
              sx={{
                fontSize: { base: "15px", sm: "15px", md: "20px", lg: "30px" },
                fontWeight: "bold",
              }}
              textAlign={{
                base: "center",
                sm: "rights",
                md: "right",
                lg: "right",
              }}
            >
              {programName}
            </Heading>
            <HStack
              textAlign="right"
              mt={{ base: "0rem", sm: "0rem", md: "1rem", lg: "2rem" }}
              mb={{ base: "0rem", sm: "0rem", md: "1rem", lg: "2rem" }}
            >
              <VStack>
                <Heading
                  as="h4"
                  w={{ base: "6rem", sm: "6rem", md: "8rem", lg: "10rem" }}
                  sx={{
                    fontSize: {
                      base: "14px",
                      sm: "14px",
                      md: "15px",
                      lg: "20px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Total Students
                </Heading>
                <Spacer
                  borderBottom="2px solid black"
                  width={{ base: "20%", lg: "50%" }}
                  spacing={4}
                  marginLeft={{ base: "20", lg: "auto" }}
                  borderColor="#F9AB00"
                />
                <Text
                  fontSize={{ base: "", lg: "20px" }}
                  w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}
                >
                  {totalStudents}
                </Text>
              </VStack>
              <VStack>
                <Heading
                  as="h4"
                  w={{ base: "5rem", sm: "5rem", md: "8rem", lg: "10rem" }}
                  sx={{
                    fontSize: {
                      base: "14px",
                      sm: "14px",
                      md: "15px",
                      lg: "20px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Female
                </Heading>
                <Spacer
                  borderBottom="2px solid black"
                  width={{ base: "20%", lg: "30%" }}
                  spacing={4}
                  marginLeft={{ base: "20", lg: "auto" }}
                  borderColor="#F9AB00"
                />
                <Text
                  fontSize="20px"
                  w={{ base: "6rem", sm: "8rem", md: "8rem", lg: "10rem" }}
                >
                  {femaleStudents}
                </Text>
              </VStack>
              <VStack>
                <Heading
                  as="h4"
                  w={{ base: "5rem", sm: "5rem", md: "8rem", lg: "10rem" }}
                  sx={{
                    fontSize: {
                      base: "14px",
                      sm: "14px",
                      md: "15px",
                      lg: "20px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Male
                </Heading>
                <Spacer
                  borderBottom="2px solid black"
                  width="20%"
                  spacing={4}
                  marginLeft={{ base: "20", lg: "auto" }}
                  borderColor="#F9AB00"
                />
                <Text
                  fontSize="20px"
                  w={{ base: "6rem", sm: "rem", md: "8rem", lg: "10rem" }}
                >
                  {maleStudents}
                </Text>
              </VStack>
            </HStack>
            <HStack
              spacing={10}
              fontSize="20px"
              marginLeft={{ base: "0", sm: "0", md: "auto", lg: "auto" }}
            >
              <NavLink to="/facultyHome">
                <Button
                  bg="#F9AB00"
                  sx={{
                    fontSize: {
                      base: "10px",
                      sm: "10px",
                      md: "13px",
                      lg: "15px",
                    },
                    fontWeight: "bold",
                  }}
                  w={{ base: "5rem", sm: "5rem", md: "6rem", lg: "8rem" }}
                  color="white"
                >
                  View Analytics
                </Button>
              </NavLink>

              <Button
                onClick={scrollToUpload}
                bg="#F9AB00"
                color="white"
                sx={{
                  fontSize: {
                    base: "10px",
                    sm: "10px",
                    md: "13px",
                    lg: "15px",
                  },
                  fontWeight: "bold",
                }}
                w={{ base: "5rem", sm: "5rem", md: "6rem", lg: "8rem" }}
              >
                Upload
              </Button>
            </HStack>
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
                including their strengths, weaknesses, and areas for
                improvement. Also the overall taken and not take units every
                semester.
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
                The list of subjects in a course organizely arranged by
                semester. Credited subject is displayed.
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
                All student curriculum evaluation request can be viewed and
                evaluated for subject recommendation.
              </Text>
            </VStack>
          </Box>
          <VStack mt="3rem" fontSize="14px">
            <HStack>
              <Text>To convert docx to excel use this converter:</Text>
              <Text>
                <a
                  href="https://products.aspose.app/words/conversion/word-to-excel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here to convert
                </a>
              </Text>
            </HStack>
            <HStack>
              <Text>
                {" "}
                Also, make sure to have this format in docx before converting
              </Text>
              <Text>
                <a
                  href="https://drive.google.com/file/d/1Ix528VZOwUSWhX_KBkanO-CLwn7sE0w2/view?usp=sharing"
                  download="curriculum.pdf"
                >
                  Click here to download the PDF
                </a>
              </Text>
            </HStack>
          </VStack>
          <Box ref={uploadRef} direction="column" mt="2rem">
            <VStack
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              mb="5rem"
            >
              <Text fontSize="20px" fontWeight="bold">
                Upload
              </Text>
              <Box width="80%">
                <Upload />
              </Box>
              <VStack mt="3rem" fontSize="15px">
                <Text>
                  In uploading the List of Students please follow the Excel
                  Header Text Format:{" "}
                </Text>
                <Text>
                  Student Number, First Name, Last Name, Middle Name, Email,
                  Gender
                </Text>
              </VStack>
              <Box width="80%" mb="7rem">
                <ClassList />
              </Box>
            </VStack>
          </Box>
        </VStack>
        <Spacer mt="90rem" />
        <Footer />
      </Box>
    </Flex>
  );
}
export default LandingPage;
