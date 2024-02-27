import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

import Cookies from "js-cookie";

import { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";

import Footer from "../../../components/footer/footer";
import FacultyNavbar from "../../../components/navbar/facultynavbar";

import { endPoint } from "../../config";
import UsersData from "../userData/usersData";
import FacultyTable from "./facultyTable";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [programName, setProgramName] = useState("");

  //const toast = useToast();

  const [filteredStudentCount, setFilteredStudentCount] = useState(0);
  const [showTableBody, setShowTableBody] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const [isUsersDataVisible, setIsUsersDataVisible] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");

  const [currentStudentNumber, setCurrentStudentNumber] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);
  const [selectedStrand, setSelectedStrand] = useState("");

  const [selectedProgramForView, setSelectedProgramForView] = useState(null);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [facultyprogram, setFacultyProgram] = useState("");
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyName, setFacultyName] = useState("");
  console.log("faculty email in cookies:", facultyEmail);
  const [facultyId, setFacultyId] = useState("");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then(async (response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
          );
          setFacultyId(facultyData.faculty_number);
         setFacultyProgram(facultyData.program_id.toString());


          try {
            const programsResponse = await axios.get(`${endPoint}/programs`);
            const programs = programsResponse.data;

            const selectedProgram = programs.find(
              (programTable) =>
                programTable.program_id === facultyData.program_id.toString()
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
          console.error(error);
        });
    }
  }, [facultyEmail]);

  console.log("Program id", facultyprogram);
  console.log("Faculty Id", facultyId);

  const handleToggleUsersData = (studentNumber) => {
    const selectedStudent = filteredStudents.find(
      (student) => student.student_number === studentNumber
    );

    if (selectedStudent) {
      setSelectedStrand(selectedStudent.strand);
      setStudentNumber(studentNumber);
      setCurrentStudentNumber(studentNumber);

      setSelectedProgramForView(facultyprogram);
      setIsUsersDataVisible(true);

      // Log information for debugging
      console.log(`Scrolling to userData-${studentNumber}`);
      console.log(
        "Element exists:",
        document.getElementById(`userData-${studentNumber}`)
      );

      // Scroll to the UsersData wrapper div
      const userDataWrapper = document.getElementById(
        `userData-${studentNumber}`
      );
      if (userDataWrapper) {
        userDataWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setIsUsersDataVisible(false);
    }
  };

  useEffect(() => {
    if (isUsersDataVisible && currentStudentNumber) {
      // Wait for the next frame to ensure the DOM is updated
      requestAnimationFrame(() => {
        const userDataWrapper = document.getElementById(
          `userData-${currentStudentNumber}`
        );
        if (userDataWrapper) {
          userDataWrapper.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [isUsersDataVisible, currentStudentNumber]);

  const handleStudentNumberClick = (studentNumber) => {
    console.log("studentNumber:", studentNumber);
    console.log("facultyId:", facultyId);
  };

  //fetch student
  useEffect(() => {
    axios
      .get(`${endPoint}/students/program/${encodeURIComponent(facultyprogram)}`)
      .then((response) => {
        setStudents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [facultyprogram]);

  //filter status
  useEffect(() => {
    console.log("Selected Filters:", selectedStatus);

    const newFilteredStudents = students.filter((student) => {
      const statusMatch =
        selectedStatus === "" || student.status === selectedStatus;

      return selectedStatus === "All Students" || statusMatch;
    });

    setFilteredStudents(newFilteredStudents);
    setFilteredStudentCount(newFilteredStudents.length);
  }, [selectedStatus, students]);

  //filter
  useEffect(() => {
    console.log("Selected Filters:", selectedSchoolYear);

    const newFilteredYear = students.filter((student) => {
      // Calculate student year level
      const studentYear = parseInt(student.student_number.substring(0, 4), 10);
      const currentYear = new Date().getFullYear();
      const academicYearStartMonth = 9; // September
      const isNewAcademicYear =
        new Date().getMonth() + 1 >= academicYearStartMonth; // Adding 1 to get the current month in the range [1-12]

      const calculatedYearLevel = isNewAcademicYear
        ? currentYear - studentYear + 1
        : currentYear - studentYear;

      console.log("Calculated Year Level:", calculatedYearLevel);

      // Check if the calculated year level matches the selected year
      const yearLevelMatch =
        selectedSchoolYear === "All Years" ||
        calculatedYearLevel.toString() === selectedSchoolYear;

      console.log("Year Level Match (after comparison):", yearLevelMatch);

      console.log("Student Year:", studentYear);
      console.log("Calculated Year Level:", calculatedYearLevel);

      console.log("Selected School Year:", selectedSchoolYear);
      console.log("Year Level Match:", yearLevelMatch);

      console.log("Filtered Student:", student);

      return selectedSchoolYear === "All Years" || yearLevelMatch;
    });

    setFilteredStudents(newFilteredYear);
    setFilteredStudentCount(newFilteredYear.length);
  }, [selectedSchoolYear, students]);

  useEffect(() => {
    if (
      currentStudentNumber &&
      !filteredStudents.some(
        (student) => student.student_number === currentStudentNumber
      )
    ) {
      setIsUsersDataVisible(false);
      setCurrentStudentNumber(null);
    }
  }, [currentStudentNumber, filteredStudents]);

  useEffect(() => {
    setSelectedStudentNumber(null);

    setShowTableBody(selectedSchoolYear !== "" || selectedStatus !== "");
  }, [selectedSchoolYear, selectedStatus]);

  useEffect(() => {
    const newFilteredSearch = students.filter((student) => {
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      return fullName.includes(searchLower);
    });

    setFilteredStudents(newFilteredSearch);
    setFilteredStudentCount(newFilteredSearch.length);
  }, [searchQuery, students]);

  console.log(facultyId);

  const [tableStudentsCount, setTableStudentsCount] = useState(0);

  return (
    <Flex
      minHeight="100vh"
      position="absolute"
      justifyContent="center"
      alignItems="center"
      w="100%"
      flexDirection="column"
    >
      <FacultyNavbar />

      {/* <VStack mt="9rem" w="80vw"> */}
      {/* <Wrap spacing="3" w={breakPoints} mb="8rem"> */}
      <Box mt="2rem" w="80vw">
        <VStack gap="3rem">
          <Box
            // bg="#E3B04B"
            w="100%"
            //  boxShadow="lg"
            minH="8rem"
            height="auto"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderRadius="20px"
            overflow="hidden"
            flexWrap="wrap"
            padding="2rem"
            gap={2}
          >
            <VStack gap="2rem" justifyContent="flex-start" display="left" >
              <Text fontWeight="bold" fontSize="20px">{programName}</Text>
              <Text
                fontSize="20px"
                fontWeight="semibold"
                fontStyle="Bitter"
                mt="1rem"
               
              >
                 {facultyName}
              </Text>
            </VStack>
          </Box>

          <HStack justify="flex-start" w="100%" flexWrap="wrap">
            <Select
              placeholder="Year Level"
              focusBorderColor="white"
              opacity="1"
              w={{ base: "100%", md: "11rem" }}
              fontSize=".9rem"
              bgColor="#EEEEEE"
              color="black"
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              value={selectedSchoolYear}
              onChange={(event) => setSelectedSchoolYear(event.target.value)}
            >
              <option style={{ color: "black" }} value="All Years">
                All Years
              </option>
              <option style={{ color: "black" }} value="1">
                First Year
              </option>
              <option style={{ color: "black" }} value="2">
                Second Year
              </option>
              <option style={{ color: "black" }} value="3">
                Third Year
              </option>
              <option style={{ color: "black" }} value="4">
                Fourth Year
              </option>
            </Select>
            <Select
              placeholder="Status"
              focusBorderColor="white"
              opacity="1"
              w={{ base: "100%", md: "11rem" }}
              fontSize=".9rem"
              bgColor="#EEEEEE"
              color="black"
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option style={{ color: "black" }} value="Regular">
                Regular
              </option>
              <option style={{ color: "black" }} value="Back Subject">
                Back Subject
              </option>
              <option style={{ color: "black" }} value="Returnee">
                Returnee
              </option>
              <option style={{ color: "black" }} value="Shiftee">
                Shiftee
              </option>
              <option style={{ color: "black" }} value="Transferee">
                Transferee
              </option>
              <option style={{ color: "black" }} value="Ladderized">
                Ladderized
              </option>
              <option style={{ color: "black" }} value="All Students">
                All Students
              </option>
            </Select>

            <InputGroup w={{ base: "100%", md: "20rem" }}>
              <Input
                p="1rem"
                fontFamily="inter"
                placeholder="Search..."
                focusBorderColor="palette.primary"
                borderColor="rgba(0, 0, 0, .2)"
                _placeholder={{
                  color: "#5C596E",
                  opacity: ".7",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputRightElement
                marginRight=".2rem"
                fontSize="1.2rem"
                color="#2B273E"
                opacity=".5"
                transition="all .3s ease"
                borderRadius=".5rem"
              >
                <BsSearch />
              </InputRightElement>
            </InputGroup>

            <HStack ml="auto">
              <Text opacity={0.7}>Total:</Text>
              {/* Conditionally render the count */}
              {showTableBody ? (
                <Text opacity={0.7}>{tableStudentsCount}</Text>
              ) : (
                <Text opacity={0.7}>0</Text>
              )}
            </HStack>
          </HStack>
        </VStack>

        <FacultyTable
          students={filteredStudents}
          isLoading={isLoading}
          handleStudentNumberClick={handleStudentNumberClick}
          showTableBody={showTableBody}
          toggleUsersData={handleToggleUsersData}
          setTableStudentsCount={setTableStudentsCount}
        />
        <Flex mt="5rem">
          {isUsersDataVisible &&
            (console.log(
              "selectedProgram in UsersData:",
              selectedProgramForView
            ),
            (
              <div id={`userData-${studentNumber}`}>
                <UsersData
                  studentNumber={studentNumber}
                  facultyId={facultyId}
                  program={selectedProgramForView}
                  strand={selectedStrand}
                />
              </div>
            ))}
        </Flex>
      </Box>
      {/* </Wrap> */}
      {/* </VStack> */}
      <Spacer mt="10rem" />
      <Footer />
    </Flex>
  );
}
