import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Text,
} from "@chakra-ui/react";
import GraduatingGraph from "./graphs/GraduatingGraph";
import { useState } from "react";
import GraduatingModal from "./Modal/GraduatingModal";

function Graduating() {
  const [graduatingPercentage, setGraduatingPercentage] = useState(0);
  const [graduatingStudents, setGraduatingStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  console.log("graduatingPercentage", graduatingPercentage);
  console.log("studentsData", graduatingStudents);

  return (
    <Card
      mt="2rem"
      w="100%"
      h={{ base: "auto", md: "30rem", lg: "30rem" }}
      boxShadow="2xl"
      borderRadius="30px"
      mb="5rem"
    >
      <CardHeader>Graduating Students</CardHeader>
      <Divider bg="gray.300" />
      <CardBody justifyContent="center">
        <HStack
          justifyContent={{ base: "center", md: "space-between", lg:"center" }}
          flexDirection={{ base: "column", md: "column", lg:"row" }}
          spacing={{ base: "1rem", md: "3rem" }}
        >
          <Box
            justifyContent="center"
            alignItems="center"
            mb={{ base: "2rem", md: 0 }}
          >
            <GraduatingGraph
              setGraduatingPercentage={setGraduatingPercentage}
              setGraduatingStudents={setGraduatingStudents}
            />
          </Box>
          <Box textAlign={{ base: "center", md: "left" }}>
            <Text>
              {graduatingPercentage} % from the class are graduating student
            </Text>
            <Button mt={{ base: "1rem", md: 0 }} onClick={toggleModal}>
              View List
            </Button>
          </Box>
        </HStack>
      </CardBody>
      <GraduatingModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        graduatingStudents={graduatingStudents}
      />
    </Card>
  );
}

export default Graduating;
