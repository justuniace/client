import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import logo from "../../../assets/PUPlogo.png";

function Terms() {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      padding={{ base: "0 2rem", lg: "0" }}
    >
      <VStack
        textAlign="left"
        mt="5rem"
        spacing="4"
        alignItems="flex-start" 
        maxWidth="800px" // Limit the maximum width of content
        margin="0 auto" // Center the content horizontally
      >
        <HStack mt="5rem">
          <Image w="60px" src={logo} alt="PUP Logo" />
          <Text fontWeight="bold">PUPSCES</Text>
        </HStack>
        <Text fontWeight="bold" mt="4rem" width="100%">
          About Us
        </Text>
        <Text fontWeight="bold" mt="4rem" width="100%">
          Cybriatech
        </Text>
        <VStack mt="2rem" w="100%" spacing="3" align="start">
          <Text textAlign="justify" width="100%">
            Cybriatech founded on the year 2022. Our journey began from the
            drive for innovation, whether big or simple. Since the founding of
            Cybriatech, its members aspire to be innovators and provide progress
            for its constituents and furthermore in the future.
          </Text>
        </VStack>
        <Text fontWeight="bold" mt="2rem" width="100%">
          Mission
        </Text>
        <VStack mt="2rem" w="100%" spacing="3" align="start">
          <Text textAlign="justify" width="100%">
            Exceptional Quality – we are committed to providing a way to easily
            monitor students’ progress in the academe ensuring exceptional
            satisfaction from the users.
          </Text>
          <Text mt="2rem" textAlign="justify" width="100%">
            Innovation and Creativity – Integrating innovation for the people
            and constantly showing creative and comprehensive analytics for the
            progress of its users.
          </Text>
        </VStack>
        <Text fontWeight="bold" mt="2rem" width="100%">
          Connect with Cybriatech
        </Text>
        <VStack mt="2rem" w="100%" spacing="3" align="start">
          <Text textAlign="justify" width="100%">
            Connect with Cybriatech Ready to explore the possibilities? Contact
            us to learn more about our innovative solutions for education.
            Cybriatech is dedicated to making educational progress accessible,
            measurable, and exciting. Send us a message at our email
            PUPSCES@gmail.com
          </Text>
          <Text mt="2rem" textAlign="justify" width="100%">
            Thank you for considering Cybriatech as your partner in driving
            innovation for the future progress of education.
          </Text>
        </VStack>
        <Text mt="5rem" fontFamily="bitter" fontWeight="semibold" width="100%">
          COPYRIGHT INFRINGEMENT
        </Text>
      </VStack>
    </Box>
  );
}

export default Terms;
