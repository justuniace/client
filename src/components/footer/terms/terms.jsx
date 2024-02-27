import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import logo from "../../../assets/PUPlogo.png";

function Terms() {
  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent={{ base: "left", lg: "center" }}
      padding={{ base: "0 2rem" }}
    >
      <VStack mt="5rem" spacing="4">
        <HStack>
          <Image w="60px" src={logo} alt="PUP Logo" />
          <Text
            mr={{ base: "20rem", md: "30rem", lg: "50rem" }}
            fontWeight="bold"
          >
            PUPSCES
          </Text>
        </HStack>
        <Text
          mr={{ base: "20rem", md: "30rem", lg: "50rem" }}
          fontWeight="bold"
          mt="4rem"
        >
          TERMS OF USE
        </Text>
        <VStack
          mt="2rem"
          w="100%"
          spacing="3"
          align="start"
          justifyContent="center"
        >
          <Text textAlign="justify" ml={{ base: "20", md: "", lg: "25rem" }}>
            Thank you for using the PUPCES online services. Developed by CyBria
            Tech, in PUP Lopez Branch.
          </Text>
          <Text textAlign="justify" ml={{ base: "20", md: "", lg: "25rem" }}>
            By using our online services, you are agreeing to these terms.
            Please read carefully.
          </Text>
        </VStack>
        <Text
          mr={{ base: "15rem", md: "25rem", lg: "45rem" }}
          fontWeight="bold"
          mt="2rem"
        >
          ACCEPTANCE OF TERMS
        </Text>
        <VStack
          mt="2rem"
          w="100%"
          spacing="3"
          align="start"
          justifyContent="center"
        >
          <Text
            ml={{ base: "20", md: "", lg: "25rem" }}
            mr={{ base: "", md: "", lg: "22rem" }}
            textAlign="justify"
          >
            The online services that PUPCES provides to you are the subject to
            the following Terms of Use. This is an agreement between you and the
            developers. By browsing and utilizing our online services, you agree
            to be governed by these Terms.
          </Text>
          <Text
            mt="5rem"
            textAlign="justify"
            ml={{ base: "20", md: "", lg: "25rem" }}
          >
            The online services you are accessing provides various used for both
            students and university faculty employees.
          </Text>
        </VStack>
        <Text mt="5rem" fontFamily="bitter" fontWeight="semibold">
          COPY RIGHTS INFRINGEMENT
        </Text>
      </VStack>
    </Box>
  );
}

export default Terms;
