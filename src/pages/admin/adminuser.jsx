import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import InitialsAvatar from "react-initials-avatar";
import { Link as RouterLink } from "react-router-dom";
import AdminModal from "./adminUserModal";
import PUP from "../../assets/PUPlogo.png";
import { endPoint } from "../config";
import Footer from "../../components/footer/footer";

function AdminUser() {
  const [adminData, setAdminData] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${endPoint}/admin`);
        setAdminData(response.data[0]);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    history("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleModalClose = async () => {
    try {
      const response = await axios.get(`${endPoint}/admin`);
      setAdminData(response.data[0]);
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
    // Close the modal
    setIsModalOpen(false);
  }




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
      padding=" 2rem 0 0 0"
      overflowY="auto"
    >
      <HStack justifyContent="space-between">
        <HStack
          pl={{ base: "1rem", md: "5rem", lg: "10rem" }}
          pr={{ base: "1rem", md: "5rem", lg: "10rem" }}
        >
          <Image src={PUP} alt="PUP Logo" boxSize="60px" objectFit="contain" />
          <Text fontWeight="semibold">PUP Curriculum Evaluaton System</Text>
        </HStack>
        <ChakraLink
          as={RouterLink}
          to="/adminuser"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <Box
            style={{
              width: "40px", // Set to your preferred size
              height: "40px", // Set to your preferred size
              borderRadius: "50%",
              backgroundColor: "#740202",
              color: "#E5F4E2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            mr={{ base: "1rem", md: "5rem", lg: "10rem" }}
          >
            <InitialsAvatar name="Admin" />
          </Box>
        </ChakraLink>
      </HStack>


       <Flex
        h="100vh"
         position="absolute" w="100%" justifyContent="center">
        <VStack gap="6" mt="9rem">
          <HStack>
            <Box mr={{base:"0", lg:"35rem"}}>
              <Text fontSize="25px" fontWeight="bold">
                Personal Data
              </Text>
            </Box>
            <Button gap="2rem" ml="7.5rem" onClick={() => setIsModalOpen(true)}>
              <FaUserEdit />
            </Button>
          </HStack>
          {isModalOpen && <AdminModal onClose={handleModalClose} />}

          {adminData && (
            <Box
             w={{base:"90%", lg:"100%"}}
              h="12rem"
              borderRadius="25px"
              boxShadow="2xl"
              bg="gray.50"
              padding="3rem 4rem"
            >
              <VStack alignItems="flex-start" textAlign="left" gap="1rem">
                <HStack gap="4rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Name:
                  </Text>
                  <Text fontSize="18px" width="12rem">
                    {adminData.admin_fname && adminData.admin_fname + " "}
                    {adminData.admin_mname && adminData.admin_mname + " "}
                    {adminData.admin_lname}
                  </Text>
                </HStack>
                <HStack gap="4rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Email:
                  </Text>
                  <Text>{adminData.admin_email}</Text>
                </HStack>
              </VStack>
              <Button ml={{base:"7rem", lg:"42rem"}} mt={{base:"3", lg:"-2"}}onClick={handleLogout}>
                Log out
              </Button>
            </Box>
          )}
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
      <Footer/>
    </Box>
  );
}

export default AdminUser;
