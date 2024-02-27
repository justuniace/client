import { Flex, VStack, Spacer } from "@chakra-ui/react";
import FacultyNavbar from "../../../components/navbar/facultynavbar";
import Card from "./Card";
import Graduating from "./GraduatingStudents";
import Achiever from "./graphs/Achiever";
import Percentage from "./graphs/AchieverPercentage";
import Evaluated from "./graphs/Evaluated";
import FailedGrades from "./graphs/FailedGrades";
import FailedPercentage from "./graphs/FailedPercentage";
import StudentPerYear from "./graphs/StudentPerYear";
import Footer from "../../../components/footer/footer"

const FacultyHome = () => {
  return (
    <Flex
      direction="column"
      position="absolute"
      minHeight="100vh"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      // paddingY="2rem"
    >
      <FacultyNavbar />

      <VStack width="80vw" mt="5rem" mb="5rem">
        <Card />
        <StudentPerYear />
        <Percentage />
        <Achiever />
        <FailedPercentage />
        <FailedGrades />
        <Evaluated />
        <Graduating />
        <Spacer mt="5rem"/>
        <Footer/>
      </VStack>
    </Flex>
  );
};

export default FacultyHome;
