import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Vec from "../../../assets/Vector.png";
import { endPoint } from "../../config";

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get(`${endPoint}/students/all`);
        setStudentCount(response.data.length);
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    const fetchFacultyCount = async () => {
      try {
        const faculty = await axios.get(`${endPoint}/faculty`);
        setFacultyCount(faculty.data.length);
        console.log(faculty.data.length);
      } catch (error) {
        console.error("Error fetching faculty count:", error);
      }
    };

    fetchStudentCount();
    fetchFacultyCount();
  }, []);

  return (
    <main>
      <VStack justifyContent="center">
        <Box
          display="flex"
          gap="3rem"
          flexDirection={{ base: "column", md: "column", lg: "row" }}
        >
          <Box
            w="43vw"
            justifyContent="center"
            minW="15rem"
            h="12rem"
            ml={{ base: "12rem", md: "10rem", lg: "0" }}
            bgColor="white"
            boxShadow="2xl"
            borderRadius="30px"
            position="relative" // Set position to relative
            zIndex="1"
          >
            <HStack padding="2rem 2rem 0 " justifyContent="space-between">
              <Text fontSize="25px" fontWeight="semibold">
                Students
              </Text>
              <Text fontWeight="semibold" fontSize="50px" padding="0  2rem 0 ">
                {studentCount}
              </Text>
            </HStack>

            <Box>
              {/* <Image
                opacity={0.3}
                // mt="2rem"
                w="54rem"
                h="6.8rem"
                src={Vec}
                borderRadius="30px"
              /> */}
            </Box>
          </Box>
          <Box
            w="43vw"
            minW="15rem"
            h="12rem"
            justifyContent="center"
            ml={{ base: "12rem", md: "10rem", lg: "0" }}
            bgColor="white"
            boxShadow="2xl"
            borderRadius="30px"
            position="relative"
            zIndex="1"
          >
            <HStack padding="2rem 2rem 0 " justifyContent="space-between">
              <Text fontSize="25px" fontWeight="semibold">
                Faculty
              </Text>
              <Text fontWeight="semibold" fontSize="50px" padding="0  2rem 0 ">
                {facultyCount}
              </Text>
            </HStack>

            <Box>
              {/* <Image
                opacity={0.3}
                // mt="2rem"
                w="54rem"
                h="6.8rem"
                src={Vec}
                borderRadius="30px"
              /> */}
            </Box>
          </Box>
        </Box>
        <Text
          ml={{ base: "8rem", lg: "0" }}
          justifyContent="center"
          textAlign="center"
          mt="2rem"
          fontWeight="semibold"
          fontSize="20px"
        >
          There are total of {studentCount} student(s) and total of{" "}
          {facultyCount} Faculty
        </Text>
      </VStack>
    </main>
  );
}

export default Dashboard;
