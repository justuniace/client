import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import Axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/footer";
import Navbar from "../../../components/navbar/navbar";
import UserModal from "./userModal";
import { endPoint } from "../../config";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const studentNumber = Cookies.get("student_number");
  const history = useNavigate();

  // Function to format the birthdate
  const formatBirthdate = (birthdate) => {
    const date = new Date(birthdate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (studentNumber) {
        try {
          const response = await Axios.get(
            `${endPoint}/students?studentNumber=${studentNumber}`
          );

          const user = response.data;
          user.birthdate = formatBirthdate(user.birthdate);
          setUserData(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [studentNumber]);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await Axios.get(`${endPoint}/programs`);
        setProgramData(response.data);
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    // Call the fetchProgramData function when the component mounts
    fetchProgramData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = async () => {
    try {
      // Fetch the updated user data directly from the server
      const response = await Axios.get(
        `${endPoint}/students?studentNumber=${studentNumber}`
      );

      const updatedUser = response.data;
      updatedUser.birthdate = formatBirthdate(updatedUser.birthdate);

      // Update the state with the new data
      setUserData(updatedUser);
      console.log("Modal closed successfully!");
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }

    // Close the modal
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    Cookies.remove("student_number");
    setUserData(null);
    history("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <Flex
      h="100vh"
      position="absolute"
      w="100%"
      justifyContent="center"
      zIndex={-1}
    >
      <Navbar />
      <VStack flexDirection="column" position="absolute" gap="6" mt="9rem">
        <HStack>
          <Box mr={{ base: "0", lg: "40rem" }}>
            <Text fontSize="25px" fontWeight="bold">
              Personal Data
            </Text>
          </Box>
          <Button gap="2rem" ml="7.5rem" onClick={handleOpenModal}>
            <FaUserEdit />
          </Button>
        </HStack>
        {isModalOpen && (
          <UserModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}

        {userData ? ( // Render user data if available
          <Box
            w={{ base: "100%", lg: "100%" }} // Full width on mobile, half width on desktop
            h={{ base: "28rem", lg: "20rem" }}
            borderRadius="25px"
            boxShadow="2xl"
            bg="gray.50"
            padding={{ base: "2rem", md: "3rem 5rem" }}
          >
            <Flex
              direction={{ base: "column", lg: "row" }} // Stack vertically on mobile, side-by-side on desktop
              justify="space-between"
              align="flex-start"
              h="100%" // Ensure children stretch vertically
            >
              <VStack
                alignItems="flex-start"
                textAlign="left"
                gap="1rem"
                flex="1"
              >
                {/* Student Number */}
                <HStack gap="3rem">
                  <HStack>
                    <Text fontSize="20px" fontWeight="semibold">
                      Student Number:
                    </Text>
                    <Text w="10rem" fontSize="18px">
                      {userData.student_number}
                    </Text>
                  </HStack>
                </HStack>

                {/* Name */}
                <HStack gap="6rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Name:
                  </Text>
                  <Text fontSize="18px" width="12rem">
                    {userData.first_name && userData.first_name + " "}
                    {userData.middle_name && userData.middle_name + " "}
                    {userData.last_name}
                  </Text>
                </HStack>

                {/* Gender */}
                <HStack gap="5rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Gender:
                  </Text>
                  <Text fontSize="18px">{userData.gender}</Text>
                </HStack>

                {/* Date of Birth */}
                <HStack gap="2rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Date of Birth:
                  </Text>
                  <Text fontSize="18px">{userData.birthdate}</Text>
                </HStack>

                {/* Email */}
                <HStack gap="6rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Email:
                  </Text>
                  <Text fontSize="18px">{userData.email}</Text>
                </HStack>
              </VStack>

              {/* Program, Status, Logout Button */}
              <VStack
                alignItems="flex-start"
                gap="1rem"
                flex="1"
                mt={{ base: "2rem", lg: "0" }}
              >
                {/* Program */}
                <HStack gap="2rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Program:
                  </Text>
                  <Text fontSize="18px" mr="4rem">
                    {programData &&
                      programData.find(
                        (program) => program.program_id === userData.program_id
                      )?.program_abbr}
                  </Text>
                </HStack>

                {/* Status */}
                <HStack gap="2rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Status:
                  </Text>
                  <Text fontSize="18px">{userData.status}</Text>
                </HStack>

                {/* Logout Button */}
                <Button alignSelf="flex-end" mt={{base:"0" , lg:"5rem"}} onClick={handleLogout}>
                  Log out
                </Button>
              </VStack>
            </Flex>
          </Box>
        ) : (
          <Text>Loading user data...</Text>
        )}
        <Spacer mt="19.2rem" />
        <Footer />
      </VStack>
      {showLogoutConfirmation && (
        <Modal isOpen={showLogoutConfirmation} onClose={cancelLogout}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Logout Confirmation</ModalHeader>
            <ModalBody>
              <Text>Are you sure you want to log out?</Text>
            </ModalBody>
            <ModalFooter gap="1rem">
              <Button colorScheme="red" onClick={confirmLogout}>
                Yes
              </Button>

              <Button onClick={cancelLogout}>No</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
