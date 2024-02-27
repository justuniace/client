import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { RiFileList3Line } from "react-icons/ri";

import MaleRed from "../../../assets/femaleRed.png";
import FemaleRed from "../../../assets/girlRed.png";
import UserBlack from "../../../assets/usersRed.png";
import { endPoint } from "../../config";
import FemaleStudents from "./Modal/FemaleStudents";
import MaleStudents from "./Modal/MaleStudents";
import TotalStudents from "./Modal/TotalStudent";

function Card() {
  const [programName, setProgramName] = useState("");
  const [facultyprogram, setFacultyProgram] = useState("");
  const facultyEmail = Cookies.get("facultyEmail");
  const [totalStudents, setTotalStudents] = useState(0);
  const [femaleStudents, setFemaleStudents] = useState(0);
  const [maleStudents, setMaleStudents] = useState(0);
  const [isTotalStudentsModalOpen, setIsTotalStudentsModalOpen] =
    useState(false);
  const [isFemaleModalOpen, setIsFemaleModalOpen] = useState(false);
  const [isMaleModalOpen, setIsMaleModalOpen] = useState(false);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [validatedCreditUnits, setValidatedCredit] = useState(0);
  console.log("faculty email in cookies:", facultyEmail);

  const calculateYearLevel = (studentNumber) => {
    const studentYear = parseInt(studentNumber.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const academicYearStartMonth = 9;
    const isNewAcademicYear = new Date().getMonth + 1 >= academicYearStartMonth;

    return isNewAcademicYear
      ? currentYear - studentYear + 1
      : currentYear - studentYear;
  };

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;

          setFacultyProgram(facultyData.program_id);
          console.log("FacultyID in Card", facultyData.program_id);

          // Fetch program data only if facultyData and program_id are available
          if (facultyData && facultyData.program_id) {
            const fetchProgramData = async () => {
              try {
                const response = await axios.get(`${endPoint}/programs`);
                const programs = response.data;

                console.log("Progr", programs);

                const selectedProgram = programs.find(
                  (programTable) =>
                    programTable.program_id.toString() ===
                    facultyData.program_id.toString()
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
                console.error("Error fetching program data:", error);
              }
            };

            fetchProgramData();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    // Fetch and count all students with the specified program_id
    axios
      .get(`${endPoint}/students/all`)
      .then(async (response) => {
        console.log("respones", response.data);

        const allStudents = response.data;

        const studentsWithProgramId = allStudents.filter(
          (student) => student.program_id === facultyprogram
        );

        const studentNumbers = studentsWithProgramId.map(
          (student) => student.student_number
        );

        console.log(studentNumbers);

        const validatedDataPromises = studentNumbers.map((studentNumber) =>
          axios.get(`${endPoint}/validateData?studentNumber=${studentNumber}`)
        );

        // Wait for all requests to resolve
        const validatedDataResponses = await Promise.all(validatedDataPromises);

        const studentData = validatedDataResponses.map((response, index) => {
          const studentNumber = studentNumbers[index];
          const validatedData = response.data || []; // If response.data is falsy, default to an empty array
          return { studentNumber, validatedData };
        });

        console.log("Validated data for api:", studentData);

        let courseType = "";
        if (
          studentNumbers.some(
            (studentNumber) =>
              studentNumber.startsWith("2020") ||
              studentNumber.startsWith("2021")
          )
        ) {
          courseType = 2019;
        } else {
          courseType = 2022;
        }

        const curriculumResponse = await axios.get(
          `${endPoint}/curriculum?program_id=${facultyprogram}&year_started=${courseType}`
        );

        const curriculumData = curriculumResponse.data;

        const totalCreditUnits = curriculumData.reduce(
          (sum, course) => sum + course.credit_unit,
          0
        );

        setTotalCreditUnits(totalCreditUnits);
        console.log(totalCreditUnits);

        // Iterate through each student entry
        const mappedStudentData = studentData.map((student) => {
          // Map the validatedData and add credit_unit to each data object
          const validatedDataWithCreditUnit = student.validatedData.map(
            (data) => {
              // Find the corresponding course in the curriculum data
              const matchedCourse = curriculumData.find(
                (course) => course.course_id === data.course_id
              );

              // Extract the credit_unit from matchedCourse
              const creditUnit = matchedCourse
                ? matchedCourse.credit_unit
                : null;

              // Return the data object with credit_unit added
              return {
                ...data,
                credit_unit: creditUnit,
              };
            }
          );

          // Sum all credit units for the student
          const validatedtotalCreditUnits = validatedDataWithCreditUnit.reduce(
            (acc, curr) => {
              return acc + (curr.credit_unit || 0); // Add credit_unit to accumulator, default to 0 if credit_unit is null
            },
            0
          );

          setValidatedCredit(validatedtotalCreditUnits);

          // Return the mapped student data with validatedData containing credit_unit and total credit units
          return {
            studentNumber: student.studentNumber,
            validatedData: validatedDataWithCreditUnit,
            totalCreditUnits: validatedtotalCreditUnits,
          };
        });

        console.log("Mapped Data", mappedStudentData);

        // Count total students
        const totalStudentsCount = studentsWithProgramId.filter(
          (student) =>
            !(
              validatedCreditUnits === totalCreditUnits &&
              calculateYearLevel(student.student_number) === 5
            )
        ).length;
        setTotalStudents(totalStudentsCount);

        console.log(" studentsWithProgramId", studentsWithProgramId);

        // Count female students
        const femaleStudentsCount = studentsWithProgramId.filter(
          (student) =>
            student.gender === "Female" &&
            !(
              validatedCreditUnits === totalCreditUnits &&
              calculateYearLevel(student.student_number) === 5
            )
        ).length;
        setFemaleStudents(femaleStudentsCount);

        // Count male students
        const maleStudentsCount = studentsWithProgramId.filter(
          (student) =>
            student.gender === "Male" &&
            !(
              validatedCreditUnits === totalCreditUnits &&
              calculateYearLevel(student.student_number) === 5
            )
        ).length;
        setMaleStudents(maleStudentsCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyprogram, validatedCreditUnits, totalCreditUnits]);

  const handleButtonTotalClicked = () => {
    setIsTotalStudentsModalOpen(true);
  };
  const handleMaleButton = () => {
    setIsMaleModalOpen(true);
  };

  const handleFemaleButton = () => {
    setIsFemaleModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsTotalStudentsModalOpen(false);
    setIsFemaleModalOpen(false);
    setIsMaleModalOpen(false);
  };

  // console.log(totalStudents);
  return (
    <Box>
      <VStack display="flex" justifyContent="space-between" paddingTop="1rem">
        <Text fontWeight="bold" fontSize="25px">
          {programName}
        </Text>
        <VStack mt="2rem">
          <HStack spacing={9} flexDirection={{ base: "column", md: "row" }}>
            {/* Total Student */}
            <Box
              width="100%"
              height="12rem"
              //bgColor="#E7B10A"
              borderRadius="8px"
              //boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              boxShadow="lg"
              overflow="hidden"
            >
              <HStack padding="1rem 2rem" justifyContent="space-between">
                <Text mt="1rem" fontSize="22px" color="black">
                  Total Students
                </Text>
                <Button bgColor="" onClick={handleButtonTotalClicked}>
                  {" "}
                  <RiFileList3Line color="#740202" fontSize={20} />
                </Button>
              </HStack>
              <HStack>
                <Text fontSize="40px" padding="0  2rem 0 " color="black">
                  {totalStudents}
                </Text>
                <Image
                  opacity="0.8"
                  position="absolute"
                  mt="3rem"
                  ml={{ base: "10rem" }}
                  src={UserBlack}
                />
              </HStack>
            </Box>

            {/* Totat Female */}
            <Box
              width="100%"
              height="12rem"
              //   bgColor="#E7B10A"
              borderRadius="8px"
              //boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              boxShadow="lg"
              overflow="hidden"
            >
              <HStack padding="1rem 2rem" justifyContent="space-between">
                <Text mt="1rem" fontSize="22px" color="black">
                  Female Students
                </Text>
                <Button onClick={handleFemaleButton}>
                  {" "}
                  <RiFileList3Line color="#740202" fontSize={20} />
                </Button>
              </HStack>
              <HStack>
                <Text fontSize="40px" padding="0  2rem 0 " color="black">
                  {femaleStudents}
                </Text>
                <Image
                  opacity="0.8"
                  position="absolute"
                  // mt="3rem"
                  ml={{ base: "12rem" }}
                  src={FemaleRed}
                />
              </HStack>

              {/* <Image opacity={0.3} w="19rem" h="5.4rem" src={Vec} /> */}
            </Box>
            {/* Total Male */}
            <Box
              width="100%"
              height="12rem"
              //  bgColor="#FF9800"
              borderRadius="8px"
              // boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              boxShadow="lg"
              overflow="hidden"
            >
              <HStack padding="1rem 2rem" justifyContent="space-between">
                <Text mt="1rem" fontSize="22px" color="black">
                  Male Students
                </Text>
                <Button onClick={handleMaleButton}>
                  {" "}
                  <RiFileList3Line color="#740202" fontSize={20} />
                </Button>
              </HStack>
              <HStack>
                <Text fontSize="40px" padding="0  2rem 0 " color="black">
                  {maleStudents}
                </Text>
                <Image
                  opacity="0.8"
                  position="absolute"
                  mt="3rem"
                  ml={{ base: "12rem" }}
                  src={MaleRed}
                />
              </HStack>

              {/* <Image opacity={0.3} w="19rem" h="5.4rem" src={Vec} /> */}
            </Box>
          </HStack>

          <Text
            mt="5rem"
            maxW={{ base: "100%", md: "80%", lg: "60%" }}
            textAlign="center"
          >
            There is a total of {totalStudents} student(s) in {programName} with
            the total of {femaleStudents} Female Student(s) and {maleStudents}{" "}
            Male Student(s)
          </Text>
        </VStack>

        <TotalStudents
          isOpen={isTotalStudentsModalOpen}
          onClose={handleCloseModal}
        />
        <FemaleStudents isOpen={isFemaleModalOpen} onClose={handleCloseModal} />
        <MaleStudents isOpen={isMaleModalOpen} onClose={handleCloseModal} />
      </VStack>
    </Box>
  );
}
export default Card;
