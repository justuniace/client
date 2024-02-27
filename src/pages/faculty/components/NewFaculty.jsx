import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

import { AnimatePresence, motion } from "framer-motion";
//import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { endPoint } from "../../config";

import ForgotPassword from "../components/forgotpassword/facultyForgotPassword";
import FacultySignIn from "./facultySignin";

export default function NewFaculty() {
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  const [programId, setProgramId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);
  // styling the eye for password
  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  const [showSignIn, setShowSignIn] = useState(false);
  // Function to format birthdate to "yyyy-MM-dd" format

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
  };
 const handleSignIn = async (email) => {
   try {
     // Make a request to your backend to check if the email exists in the faculty table
     const response = await axios.post(`${endPoint}/checkEmail`, {
       email: email,
     });

     // Assuming your backend responds with a status indicating whether the email exists or not
     if (response.data.exists) {
       // Email exists in the faculty table
       // Generate a verification token
       const verificationTokenResponse = await axios.post(
         `${endPoint}/generateVerificationToken`,
         {
           email: email,
           expiresIn: "1d", // Set expiration time for the token
         }
       );

       const verificationToken = verificationTokenResponse.data.token;

       // Construct the verification link
       const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;

       // Send email with verification link containing the token
       await axios.post(`${endPoint}/sendEmail`, {
         to: email,
         subject: "Welcome to Our Platform",
         text: `Hello, welcome to our platform! Please click on the following link to verify your email: ${verificationLink}`,
       });

       // Display a message to the user to verify their email
       setError("Please verify your email before signing in.");
     } else {
       // Email does not exist in the faculty table
       // Handle the case where the email is not found
       console.log("Email does not exist in the faculty table");
       setError("Email not found. Please check your email.");
     }
   } catch (error) {
     console.error("Error checking email:", error);
     // Handle error
     setError("Failed to check email. Please try again.");
   }
 };

  // const handleSignIn = async (email) => {
  //   try {
  //     // Generate a verification token
  //     const verificationTokenResponse = await axios.post(
  //       `${endPoint}/generateVerificationToken`,
  //       {
  //         email: email,
  //         expiresIn: "1d",
  //       }
  //     );

  //     const verificationToken = verificationTokenResponse.data.token;

  //     // Construct the verification link
  //     const verificationLink = `${window.location.origin}/verify-email?token=${verificationToken}`;

  //     // Send email with verification link containing the token
  //     await axios.post(`${endPoint}/sendEmail`, {
  //       to: email,
  //       subject: "Welcome to Our Platform",
  //       text: `Hello, welcome to our platform! Please click on the following link to verify your email: ${verificationLink}`,
  //     });

  //     // Display a message to the user to verify their email
  //     setError("Please verify your email before signing in.");
  //   } catch (error) {
  //     console.error("Error sending verification email:", error);
  //     setError("Failed to send verification email. Please try again.");
  //   }
  // };

  // const createFacultyAccount = async (email, password, gender, birthdate) => {
  //   try {
  //     // Send faculty signup request to your backend
  //     const response = await axios.post(`${endPoint}/faculty/${email}`, {
  //       faculty_password: password,
  //       gender,
  //       birthdate,
  //     });

  //     console.log("Faculty signed up successfully:", response.data);

  //     // Optionally, you can handle the successful signup process here
  //   } catch (error) {
  //     console.error("Error creating faculty account:", error);
  //     setError("Failed to create faculty account. Please try again.");
  //   }
  // };

  // const extractTokenFromURL = () => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   return urlParams.get("token");
  // };

  // const handleVerificationLinkClick = async () => {
  //   try {
  //     // Extract the token from the verification link
  //     const token = extractTokenFromURL();

  //     // Send a request to the backend to verify the email
  //     await axios.get(`${endPoint}/verify-email/${token}`);

  //     // If the request is successful, you can display a success message to the user
  //     console.log("Email verified successfully");

  //     // Proceed with creating the faculty account
  //     createFacultyAccount(email, password, gender, birthdate);
  //   } catch (error) {
  //     console.error("Error verifying email:", error);
  //     // Handle error
  //   }
  // };

  // Faculty Number
  const handleInputChange = (e) => {
    setFacultyId(e.target.value);
    moveCursorToEnd(e.target); // Move cursor to the end of the input after typing
  };

  const facultylabelStyles = {
    position: "absolute",
    pointerEvents: "none",
    transform: facultyId ? "translateY(-130%)" : "translateY(-50%)", // Center the placeholder initially
    top: "1.5rem",
    left: "16px",
    color: "#6f81a5",
    zIndex: 1,
    opacity: facultyId ? 1 : 0.8,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    fontSize: facultyId ? "0.8rem" : "1rem",
  };

  const handleInputFocus = () => {
    if (!facultyId) {
      setFacultyId(" ");
    }
  };

  const handleInputBlur = () => {
    if (!facultyId.trim()) {
      setFacultyId("");
    }
  };

  const moveCursorToEnd = (input) => {
    // Move cursor to the end of the input
    input.selectionStart = input.selectionEnd = input.value.length;
  };
  const inputStyles = {
    zIndex: 0,
    textAlign: "left", // Align text to the left
    paddingTop: "1rem",
    width: "150%",
    boxSizing: "border-box",
  };

  const facultyIdInputContainerStyle = {
    position: "relative",
    // Add some bottom margin
  };

  // email
  const emailInputContainerStyle = {
    position: "relative",
    // Add some bottom margin
  };

  const emailhandleInputFocus = () => {
    if (!email) {
      setEmail(" ");
    }
  };

  const emailhandleInputBlur = () => {
    if (!email.trim()) {
      setEmail("");
    }
  };
  const emaillabelStyles = {
    position: "absolute",
    pointerEvents: "none",
    transform: email ? "translateY(-130%)" : "translateY(-50%)", // Center the placeholder initially
    top: "1.5rem",
    left: "16px",
    color: "#6f81a5",
    zIndex: 1,
    opacity: email ? 1 : 0.8,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    fontSize: email ? "0.8rem" : "1rem",
  };

  //password
  const passInputContainerStyle = {
    position: "relative",
    // Add some bottom margin
  };

  const passhandleInputFocus = () => {
    if (!password) {
      setPassword(" ");
    }
  };

  const passhandleInputBlur = () => {
    if (!password.trim()) {
      setPassword("");
    }
  };
  const passlabelStyles = {
    position: "absolute",
    pointerEvents: "none",
    transform: password ? "translateY(-130%)" : "translateY(-50%)", // Center the placeholder initially
    top: "1.5rem",
    left: "16px",
    color: "#6f81a5",
    zIndex: 1,
    opacity: password ? 1 : 0.8,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    fontSize: password ? "0.8rem" : "1rem",
  };
  const passinputStyles = {
    zIndex: 0,
    textAlign: "left", // Align text to the left
    paddingTop: "1rem",
    width: "200%",
    boxSizing: "border-box",
  };

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      mt={{ base: 0, md: "-5rem", lg: "" }}

      //  mt="-7rem"
      // mx="1rem"
    >
      <AnimatePresence>
        {showForgotPassword ? (
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        ) : null}
      </AnimatePresence>

      {!showSignIn && !showForgotPassword && (
        <Box mr="0">
          <VStack align="flex-start" justifyContent="center">
            <Text fontSize="2rem" color="white" mb="1rem">
              Sign In
            </Text>
            <AnimatePresence>
              {error ? (
                <Center
                  bg="#FAECD6"
                  w="65.5%"
                  p=".8rem"
                  borderRadius=".3rem"
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
                  color="palette.primary"
                  fontWeight="inter"
                  fontSize=".9rem"
                  fontFamily="inter"
                  textAlign="center"
                >
                  {error}
                </Center>
              ) : null}
            </AnimatePresence>
            <Divider mb="1rem" />
            {/* FACULTY ID */}
            <Box style={facultyIdInputContainerStyle}>
              <label style={facultylabelStyles}>Faculty Number</label>
              <Input
                height="3rem" // Adjusted height
                bg="palette.secondary"
                variant="outline"
                color="palette.primary"
                focusBorderColor="palette.secondary"
                value={facultyId}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={inputStyles}
              />
            </Box>

            {/* EMAIL */}
            <Box style={emailInputContainerStyle}>
              <label style={emaillabelStyles}>Email</label>
              <Input
                height="3rem" // Adjusted height
                bg="palette.secondary"
                variant="outline"
                color="palette.primary"
                focusBorderColor="palette.secondary"
                onFocus={emailhandleInputFocus}
                onBlur={emailhandleInputBlur}
                style={inputStyles}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            {/* Birthdate */}
            <DatePicker
              customInput={
                <Input
                  height="3rem"
                  _placeholder={{
                    color: "#5C596E",
                    opacity: ".8",
                  }}
                  focusBorderColor="palette.secondary"
                  // maxW="21rem"
                  w="150%"
                  bg="palette.secondary"
                  style={{ borderRadius: "5px" }}
                />
              }
              selected={birthdate}
              onChange={(date) => setBirthdate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Birthdate"
              dateFormat="yyyy-MM-dd"
              style={inputStyles}
              maxDate={new Date()}
            />

            {/* Program */}
            <HStack width="97%">
              {/* <Select
                height="3rem"
                bg="palette.secondary"
                variant="outline"
                placeholder="Program"
                color="gray"
                maxW="12rem"
                opacity="1"
                cursor={"pointer"}
                value={programAbbr}
                onChange={(event) => setProgramAbbr(event.target.value)}
              >
                <option value="BSIT">BSIT</option>
                <option value="DIT">DIT</option>
                <option value="BSOA">BSOA</option>
                <option></option>
              </Select> */}

              <Select
                height="3rem"
                bg="palette.secondary"
                variant="outline"
                color="gray"
                maxW="22rem"
                opacity="1"
                cursor={"pointer"}
                placeholder="Gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </Select>
            </HStack>

            {/* PASSWORD */}
            <Box style={passInputContainerStyle}>
              <label style={passlabelStyles}>Password</label>
              <InputGroup w="120%">
                <Input
                  height="3rem"
                  bg="palette.secondary"
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  color="palette.primary"
                  focusBorderColor="palette.secondary"
                  onFocus={passhandleInputFocus}
                  onBlur={passhandleInputBlur}
                  style={passinputStyles}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement mr="auto">
                  <Button
                    h="1.75rem"
                    width="100%"
                    size="sm"
                    _hover={{ background: "none", border: "none" }}
                    _focus={{ background: "none", border: "none" }}
                    _active={{ background: "none", border: "none" }}
                    style={buttonStyles}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEye color="palette.primary" />
                    ) : (
                      <FaEyeSlash color="palette.primary" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>

            <Text
              ml="auto"
              fontSize="14px"
              color="gray"
              fontWeight="bold"
              align="flex-end"
              mt="1rem"
              mb="1rem"
              onClick={handleForgotPasswordClick}
              cursor="pointer"
            >
              Forgot Password?
            </Text>

            <Button
              size="md"
              height="3rem"
              // maxW="21rem"
              width="100%"
              border="2px"
              bg="#FAECD6"
              onClick={() => handleSignIn(email)}
            >
              Sign In
            </Button>

            <HStack mt="2rem" flexWrap="wrap" justifyContent="center">
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Link to="/terms">
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  Terms
                </Text>
              </Link>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Link to="/policy">
                <Text fontSize="xs" fontWeight="bold" color="gray.400">
                  Privacy Policy
                </Text>
              </Link>
            </HStack>
          </VStack>
          <HStack mt="1rem" flexWrap="wrap" justifyContent="center">
            <Text fontSize="xs" color="gray">
              Not a new user?
            </Text>
            <Text
              fontSize="xs"
              color="white"
              cursor="pointer"
              onClick={handleSignInClick}
            >
              {" "}
              Click here to login
            </Text>
          </HStack>
          <Text mt="1rem" fontSize="xs" color="gray" textAlign="center">
            Copyright 2024 PUPSCES || All rights reserved.
          </Text>
        </Box>
      )}
      {showSignIn && <FacultySignIn onCancel={() => setShowSignIn(false)} />}
    </Flex>
  );
}
