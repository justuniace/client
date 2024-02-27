import {Flex, Box,Image,HStack, Text, VStack, Button} from "@chakra-ui/react";
import PUP from "../../../assets/PUPlogo.png";
import Pylon from "../../../assets/pylon.jpg"
import PropTypes from "prop-types";
import User from "../../../assets/user.png";
import { NavLink } from "react-router-dom";

function AdminLandingpage({ scrollToAdminDashboard }) {
  return (
    <Flex direction="column" w="100vw" h="100vh">
      <Box
        className="red-square"
        position="absolute"
        top="0"
        //left="49%"
        // transform="translate(-50%, -50%) rotate(-15deg)"
        width="100vw"
        height="100vh"
        bgColor="rgba(116, 2, 2, 1)"
        overflow="hidden"
        zIndex={1}
        // borderRadius="20px"
      >
        <Box
          className="image"
          position="absolute"
          width="100%"
          height="100%"
          bgImage={`url(${Pylon})`}
          bgRepeat="no-repeat"
          bgPos="center"
          bgSize={{ base: "200%", md: "150%", lg: "100%" }}
          //   left="-35"
          // top={10}
          border="white"
          zIndex={-1}
          opacity="0.2"
          // transform="rotate(15deg)"
          // overflow="hidden"
          // overflowX="hidden"
        ></Box>
        <Box mt="2rem">
          <HStack justifyContent="space-between">
            <HStack
              pl={{ base: "1rem", md: "5rem", lg: "10rem" }}
              pr={{ base: "1rem", md: "5rem", lg: "5rem" }}
            >
              <Image
                src={PUP}
                alt="PUP Logo"
                boxSize="60px"
                objectFit="contain"
              />
              <Text fontSize="20px" color="white" fontWeight="bold">
                PUP Curriculum Evaluaton System
              </Text>
            </HStack>
            <Box mr="10rem">
              <NavLink to="/adminuser">
                <Image
                  src={User}
                  w="50px"
                  display={{ base: "none", md: "flex" }}
                />
              </NavLink>
            </Box>
          </HStack>
        </Box>
        <Box
          pl={{ base: "5rem", md: "5rem", lg: "12rem" }}
          w="100%"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <VStack align="flex-start" mt="5rem">
            <Text
              color="white"
              fontWeight="bold"
              fontSize={{ base: "30px", md: "30px", lg: "50px" }}
              textAlign="left"
            >
              Good Day!
            </Text>
            <Text
              pt={{ base: "1rem", md: "5rem", lg: "8rem" }}
              fontWeight="bold"
              fontSize={{ base: "20px", md: "20px", lg: "30px" }}
              color="white"
            >
              PUP Student Curriculum Evaluation System{" "}
            </Text>
            <Text
              textAlign={"justify"}
              w={{ base: "20rem", md: "40rem", lg: "60rem" }}
              mt="2rem"
              fontSize="18px"
              color="white"
            >
              PUPSCES is an online platform designed for easy, fast and
              convenient student curriculum evaluation with predictive
              analytics. It connects student and faculty virtually making it
              possible for student to keep track on their academic performance
              and receive real-time updates from faculty. Faculty on the other
              hand, can easily validate evaluations request from student and
              recommend available subjects suitable for student require credit
              unit.
            </Text>
            <Button
              mt="7rem"
              bg="#F9AB00"
              sx={{
                fontSize: {
                  base: "10px",
                  sm: "10px",
                  md: "13px",
                  lg: "15px",
                },
                fontWeight: "bold",
                width: { base: "6rem", sm: "6rem", md: "8rem", lg: "8rem" },
                color: "white",
                ":hover": {
                  bg: "#FFD855", // lighter color when hovered
                },
              }}
              onClick={scrollToAdminDashboard}
            >
              {" "}
              View Analytics
            </Button>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}

AdminLandingpage.propTypes = {
  scrollToAdminDashboard: PropTypes.func.isRequired,
};
export default AdminLandingpage;