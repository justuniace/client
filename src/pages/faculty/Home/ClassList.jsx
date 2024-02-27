import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import * as XLSX from "xlsx";
import { endPoint } from "../../config";

function ClassList() {
  const fileInputRef = useRef(null);
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [insertError, setInsertError] = useState(false);
  const [file, setFile] = useState(null);

  const [facultyprogram, setFacultyProgram] = useState("");
  const facultyEmail = Cookies.get("facultyEmail");
  const [successTimeout, setSuccessTimeout] = useState(null);

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;

         setFacultyProgram(facultyData.program_id.toString());

        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  console.log("Program id", facultyprogram);

  const readExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        console.log("File loaded successfully!");

        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const requiredColumns = [
          "Student Number",
          "First Name",
          "Middle Name",
          "Last Name",
          "Email",
          "Gender",
          "Birthdate",
          "Status",
          "Email",
          "Student Password",
          "Strand",
        ];

        const headerRow = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: false,
        })[0];

        if (!headerRow) {
          reject(new Error("Header row not found in the Excel sheet."));
          return;
        }

        const columnPositions = {};

        requiredColumns.forEach((col) => {
          const index = headerRow.findIndex(
            (headerCol) => headerCol.trim() === col.trim()
          );
          columnPositions[col] = index;
        });

        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
        const data = rows
          .slice(1) // Skip the header row
          .filter((row) =>
            row.some((cell) => cell !== undefined && cell !== null)
          ) // Skip rows with undefined or null values
          .map((row) => {
            const rowData = {};
            requiredColumns.forEach((col) => {
              const columnIndex = columnPositions[col];
              rowData[col] = columnIndex !== -1 ? row[columnIndex] : null;
            });
            return rowData;
          });

        console.log("Fetched Data:", data);

        resolve(data);
      };

      reader.onerror = (error) => {
        console.error("File reading failed:", error);
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  const handleAdditionalFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      readExcel(selectedFile);
    }
  };

  const handleOtherUploadButtonClick = async () => {
    try {
      // Call readExcel to receive the fetch data from other function
      const fetchedData = await readExcel(file);

      // Log the fetched data
      console.log("Fetched data in handleOtherUploadButtonClick:", fetchedData);

      // Create a data object that will be sent to the server

      console.log(facultyprogram, "Faculty ID");

      
      const postData = {
        studentsData: fetchedData,
        program_id: facultyprogram,
      };

      const response = await axios.post(`${endPoint}/studentsupload`, postData);

      // Successtime out time
      if (successTimeout) {
        clearTimeout(successTimeout);
      }

      // Set a new timeout to reset the success message after 10 seconds
      const timeoutId = setTimeout(() => {
        setInsertSuccess(false);
        // setSuccessMessage("");
      }, 10000);

      // Save the timeout ID in state
      setSuccessTimeout(timeoutId);

      if (response.status === 200) {
        // Successfully inserted the data
        console.log(response.data.message);

        setInsertSuccess(true);
      } else if (response.status === 409) {
        //There are duplicate data
        console.log("Duplicate Entries:", response.data.duplicateEntries);
        setInsertError(true);
      } else {
        console.error("Failed to insert data.");
      }
    } catch (error) {
      console.error("Error reading Excel file:", error);
      setInsertError(true);
    }
  };

  return (
    <Card
      mt="2rem"
      w="100%"
      h="auto"
      boxShadow="2xl"
      borderRadius="30px"
      padding={{ base: "1rem", md: "2rem" }}
    >
      <CardHeader>Upload ClassList</CardHeader>
      <Divider bg="gray.300" />
      <CardBody ml={{ base: "0", md: "2rem" }} justifyContent="center">
        <HStack spacing={3} flexWrap="wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAdditionalFileChange}
            style={{
              cursor: "pointer",
            }}
          />

          <Button
            onClick={handleOtherUploadButtonClick}
            bg="palette.primary"
            color="white"
            fontWeight="semibold"
            fontStyle="bitter"
            cursor="pointer"
            w="11rem"
            focusBorderColor="white"
            leftIcon={<AiOutlinePlus />}
            _hover={{
              bg: "palette.primaryDark",
              transition: "background-color 0.3s",
            }}
          >
            Upload Classlist
          </Button>
          {insertSuccess && (
            <Alert status="success" mt="2">
              <AlertIcon />
              <AlertTitle mr={2}>Success!</AlertTitle>
              <AlertDescription>Data inserted successfully.</AlertDescription>
            </Alert>
          )}

          {insertError && (
            <Alert status="error" mt="2">
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>
                Error inserting data. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
}

export default ClassList;
