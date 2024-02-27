import { Box, VStack , Text, HStack} from "@chakra-ui/react";
import Footer from "../../components/footer/footer";
import "./admin.css";
import Dashboard from "./component/Dashboard";
import Gender from "./component/GenderCard";
import StudentFaculty from "./component/StudentsPerProgramStatus";
import FacultyUpload from "./pages/FacultyUpload";
import ProgramUpload from "./pages/ProgramUpload";
import AdminLandingpage from "./pages/landingPage";
import { useRef } from "react";

export default function Admin() {
  const adminDashboardRef = useRef(null);

  const scrollToAdminDashboard = () => {
    adminDashboardRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      mt="0"
      mb="0"
      flexGrow={1}
      w="100vw"
      h="100vh"
      bgColor="#F8F8F8"
      display="flex"
      flexDirection="column"
      //padding=" 0 0 0"
      //overflowY="auto"
    >
      <Box>
        <AdminLandingpage scrollToAdminDashboard={scrollToAdminDashboard} />
      </Box>
      <VStack
        position="absolute"
        w="100vw"
        // h="70vh"
        top={{ base: "800px", sm: "800px", md: "800px", lg: "900px" }}
        ref={adminDashboardRef}
      >
        <Text
          fontWeight="bold"
          fontSize={{ base: "20px", md: "20px", lg: "20px" }}
        >
          Admin Dashboard
        </Text>
        <Box
          ml={{ base: "auto", md: "4rem", lg: "auto" }}
          mr={{ base: "auto", md: "0rem", lg: "auto" }}
          mt="3rem"
        >
          <Dashboard />
        </Box>

        <Box
          ml={{ base: "auto", md: "4rem", lg: "auto" }}
          mr={{ base: "auto", md: "0rem", lg: "auto" }}
          mt="3rem"
        >
          <Gender />
        </Box>
        <Box
          ml={{ base: "auto", md: "4rem", lg: "auto" }}
          mr={{ base: "auto", md: "0rem", lg: "auto" }}
          mt="3rem"
        >
          <StudentFaculty />
        </Box>
        <Box
          ml={{ base: "auto", md: "4rem", lg: "auto" }}
          mr={{ base: "auto", md: "0rem", lg: "auto" }}
          mt="3rem"
          id="facultyUploadSection"
        >
          <ProgramUpload />
        </Box>
        <HStack mt="3rem" fontSize="15px">
          <Text>
            In uploading the List of Faculty Advisers please follow the Excel
            Header Text Format:{" "}
          </Text>
          <Text>
            Faculty Number, First Name, Last Name, Middle Name, Email,
            Birthdate, Gender
          </Text>
        </HStack>

        <Box
          ml={{ base: "auto", md: "4rem", lg: "auto" }}
          mr={{ base: "auto", md: "0rem", lg: "auto" }}
          mt="3rem"
          id="facultyUploadSection"
        >
          <FacultyUpload />
        </Box>

        <Box
          position="absolute"
          w="100vw"
          h="20vh"
          bottom={{ base: "-510", sm: "-600", md: "0", lg: "-20rem" }}
        >
          <Footer />
        </Box>
      </VStack>
    </Box>
  );
}
