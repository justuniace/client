import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import BarChartPerProgram from "./Graphs/BarChartPerProgram";
import PolarAreaChart from "./Graphs/PolarAreaStatus";
import { endPoint } from "../../config";

function StudentsPerProgramStatus() {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [clickedProgramId, setClickedProgramId] = useState(null);
  const [femaleCount, setFemaleCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [regularCount, setRegularCount] = useState(0);
  const [transfereeCount, setTransfereeCount] = useState(0);
  const [shifteeCount, setShifteeCount] = useState(0);
  const [ladderizedCount, setLadderizedCount] = useState(0);
  const [returneeCount, setReturneeCount] = useState(0);
  const [backSubjectCount, setBackSubjectCount] = useState(0);

  const fetchStudentCounts = (programId) => {
    axios
      .get(`${endPoint}/students/program/${programId}`)
      .then((response) => {
        const students = response.data;

        // Count students based on gender and status
        const femaleCount = students.filter(
          (student) => student.gender === "Female"
        ).length;
        const maleCount = students.filter(
          (student) => student.gender === "Male"
        ).length;

        const regularCount = students.filter(
          (student) => student.status === "Regular"
        ).length;
        const transfereeCount = students.filter(
          (student) => student.status === "Transferee"
        ).length;
        const shifteeCount = students.filter(
          (student) => student.status === "Shiftee"
        ).length;
        const ladderizedCount = students.filter(
          (student) => student.status === "Ladderized"
        ).length;
        const returneeCount = students.filter(
          (student) => student.status === "Returnee"
        ).length;
        const backSubjectCount = students.filter(
          (student) => student.status === "Back Subject"
        ).length;

        // Set state with the counts
        setFemaleCount(femaleCount);
        setMaleCount(maleCount);
        setRegularCount(regularCount);
        setTransfereeCount(transfereeCount);
        setShifteeCount(shifteeCount);
        setLadderizedCount(ladderizedCount);
        setReturneeCount(returneeCount);
        setBackSubjectCount(backSubjectCount);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  };

  const handleBarClick = (clickedProgramId) => {
    // Set the clicked programId and show the box
    setClickedProgramId(clickedProgramId);
    setIsBoxVisible(true);

    // Fetch student counts for the clicked program
    fetchStudentCounts(clickedProgramId);
  };

  const handleBoxClose = () => {
    // Hide the box when closed
    setIsBoxVisible(false);
  };

  useEffect(() => {
    // Initial fetch for the first program (you may adjust this based on your use case)
    const initialProgramId = 1; // Change this to the appropriate initial program ID
    fetchStudentCounts(initialProgramId);
  }, []);

  return (
    <Box
      gap="3rem"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Card
        w={{ base: "20rem", md: "auto", lg: "43vw" }}
        h={{ base: "auto", lg: "40rem" }}
        boxShadow="2xl"
        borderRadius="30px"
      >
        <CardHeader>Students by Program</CardHeader>
        <Divider bg="gray.300" />
        <CardBody ml="2rem" justifyContent="center">
          {isBoxVisible && (
            <Box
              w="100%"
              h={{ base: "30rem", md: "34rem", lg: "7rem" }}
              justifyContent="center"
              alignItems="center"
              borderRadius="20px" // Adjust as needed
            >
              <Box ml="32rem">
                <IoCloseCircleOutline
                  onClick={handleBoxClose}
                  style={{ fontSize: "24px" }}
                />
              </Box>

              <HStack
                spacing={{ base: "1rem", md: "2rem" }} // Adjust the spacing for different screen sizes
                flexWrap="wrap" // Allow items to wrap to the next line on smaller screens
                justifyContent={{ base: "center", md: "flex-start" }} // Center items on mobile and start from the left on larger screens
              >
                <VStack
                  alignItems="flex-start"
                  marginBottom={{ base: "1rem", md: "0" }}
                >
                  {" "}
                  {/* Add margin bottom on mobile only */}
                  <Text fontWeight="semibold">Female:</Text>
                  <Text fontWeight="semibold">Male:</Text>
                </VStack>
                <VStack marginBottom={{ base: "1rem", md: "0" }}>
                  {" "}
                  {/* Add margin bottom on mobile only */}
                  <Text>{femaleCount}</Text>
                  <Text>{maleCount}</Text>
                </VStack>
                <VStack
                  alignItems="flex-start"
                  marginBottom={{ base: "1rem", md: "0" }}
                >
                  <Text fontWeight="semibold">Regular:</Text>
                  <Text fontWeight="semibold">Transferee:</Text>
                </VStack>
                <VStack marginBottom={{ base: "1rem", md: "0" }}>
                  <Text>{regularCount}</Text>
                  <Text>{transfereeCount}</Text>
                </VStack>
                <VStack
                  alignItems="flex-start"
                  marginBottom={{ base: "1rem", md: "0" }}
                >
                  <Text fontWeight="semibold">Shiftee:</Text>
                  <Text fontWeight="semibold">Ladderized:</Text>
                </VStack>
                <VStack marginBottom={{ base: "1rem", md: "0" }}>
                  <Text>{shifteeCount}</Text>
                  <Text>{ladderizedCount}</Text>
                </VStack>
                <VStack
                  alignItems="flex-start"
                  marginBottom={{ base: "1rem", md: "0" }}
                >
                  <Text fontWeight="semibold">Returnee:</Text>
                  <Text fontWeight="semibold">Back Subject:</Text>
                </VStack>
                <VStack marginBottom={{ base: "1rem", md: "0" }}>
                  <Text>{returneeCount}</Text>
                  <Text>{backSubjectCount}</Text>
                </VStack>
              </HStack>
            </Box>
          )}
          <Box mt="rem">
            <BarChartPerProgram onBarClick={handleBarClick} />
          </Box>
        </CardBody>
      </Card>
      <Card
        w={{ base: "20rem", md: "auto", lg: "43vw" }}
        h={{ base: "30rem", md: "34rem", lg: "40rem" }}
        boxShadow="2xl"
        borderRadius="30px"
      >
        <CardHeader>Students by Status</CardHeader>
        <Divider bg="gray.300" />
        <CardBody
          ml={{ base: "0", md: "0rem", lg: "auto" }}
          mr={{ base: "0", md: "0rem", lg: "auto" }}
          justifyContent="center"
        >
          <PolarAreaChart />
        </CardBody>
      </Card>
    </Box>
  );
}

export default StudentsPerProgramStatus;
