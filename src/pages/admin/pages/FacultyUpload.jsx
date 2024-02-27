import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Stack,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Input,
  Select,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { endPoint } from "../../config";
import * as XLSX from "xlsx";

function FacultyUpload() {
  
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]);

  const fileInputRef = useRef(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  // const [data, setData] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
     const [insertSuccess, setInsertSuccess] = useState(false);
     const [insertError, setInsertError] = useState(false);
     const [successTimeout, setSuccessTimeout] = useState(null);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${endPoint}/programs`);
      if (response.ok) {
        const programsData = await response.json();
        setPrograms(programsData);
      } else {
        console.error("Error fetching programs:", response);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

 const readExcel = (file) => {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();

     reader.onload = (e) => {
       

       const binaryString = e.target.result;
       const workbook = XLSX.read(binaryString, { type: "binary" });
       const sheetName = workbook.SheetNames[0];
       const sheet = workbook.Sheets[sheetName];

       const requiredColumns = [
         "Faculty Number",
         "First Name",
         "Middle Name",
         "Last Name",
         "Email",
         "Gender",
         "Email",
         "Birthdate",
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

          setInsertSuccess(false);
       // Call readExcel to receive the fetch data from other function
       const fetchedData = await readExcel(file);

       // Log the fetched data
       console.log(
         "Fetched data in handleOtherUploadButtonClick:",
         fetchedData
       );

       // Create a data object that will be sent to the server

       console.log(selectedProgram, "program ID");
       const postData = {
         facultyData: fetchedData,
         program_id: selectedProgram,
       };

         setInsertSuccess(true);
         setSuccessMessage("Data inserted successfully");

       const response = await axios.post(
         `${endPoint}/facultyupload`,
         postData
       );

       // Successtime out time
       if (successTimeout) {
         clearTimeout(successTimeout);
       }

       // Set a new timeout to reset the success message after 10 seconds
      const timeoutId = setTimeout(() => {
        setInsertSuccess(false);
        setSuccessMessage("");
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
    w={{ base: "20rem", md: "auto", lg: "90vw" }}
    h={{ base: "", lg: "10rem" }}
    boxShadow="2xl"
    borderRadius="30px"
  >
    <CardHeader>Upload Faculty List</CardHeader>
    <Divider bg="gray.300" />
    <CardBody
      ml={{ base: "0rem", md: "1rem", lg: "2rem" }}
      justifyContent="center"
    >
      <Stack
        direction={{ base: "column", md: "row" }} // Stack vertically on small screens, horizontally on medium and larger screens
        spacing={{ base: "1rem", md: "0" }} // Add spacing between items
        justify="center" // Center items horizontally
        align="center" // Center items vertically
      >
        <Select
          w={{ base: "100%", md: "50rem" }} // Full width on small screens, fixed width on medium and larger screens
          placeholder="Program"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          id="programInput"
        >
          {programs.map((program) => (
            <option key={program.program_id} value={program.program_id}>
              {program.program_abbr}
            </option>
          ))}
        </Select>

        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleAdditionalFileChange}
        />

        <Button
          style={{
            backgroundColor: "#740202",
            color: "white",
            transition: "background-color 0.3s ease, transform 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#950303";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#740202";
            e.currentTarget.style.transform = "scale(1)";
          }}
          fontWeight="semibold"
          fontStyle="bitter"
          cursor="pointer"
          w={{ base: "100%", md: "30rem" }} // Full width on small screens, fixed width on medium and larger screens
          focusBorderColor="white"
          leftIcon={<AiOutlinePlus />}
          onClick={handleOtherUploadButtonClick}
          disabled={!file || loading}
        >
          {loading
            ? "Uploading..."
            : isPreviewMode
            ? "Upload"
            : "Insert Record"}
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
      </Stack>
    </CardBody>
  </Card>
);
}

export default FacultyUpload;
