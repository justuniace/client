import {
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Button,
  Tr,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import { useEffect, useState, useRef } from "react";
import { endPoint } from "../../config";

function ProgramTable({ yearStarted }) {
  const facultyEmail = Cookies.get("facultyEmail");
  const [programData, setProgramData] = useState([]);
  const [programName, setProgramName] = useState("");
  const [facultyData, setFacultyData] = useState([]);

    const containerRef = useRef(null);
  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");
    console.log("Container reference:", element);
    console.log("HTML content before conversion:", element.innerHTML);

    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "Curriculum.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    }).then(() => {
      if (table) {
        table.style.width = ""; // Reset to default width
      }
    });
  };



  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then(async (response) => {
          const facultyData = response.data;

          const programId = facultyData.program_id;
          setFacultyData(programId);

          try {
            const curriculumResponse = await axios.get(
              `${endPoint}/curriculum`,
              {
                params: {
                  program_id: programId,
                  year_started: yearStarted,
                },
              }
            );
            const curriculumData = curriculumResponse.data;
            setProgramData(curriculumData);
          } catch (error) {
            console.error("Error fetching curriculum data:", error);
          }
        })
        .catch((error) => {
          console.error("Error fetching faculty data:", error);
        });
    }
  }, [facultyEmail, yearStarted]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programsResponse = await axios.get(`${endPoint}/programs`);
        const programs = programsResponse.data;

        const selectedProgram = programs.find(
          (programTable) => programTable.program_id === facultyData
        );

        if (selectedProgram) {
          const program_name = selectedProgram.program_name;
          setProgramName(program_name);
        } else {
          console.error("Program not found");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = {
    "First First Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "FIRST SEMESTER"
    ),
    "First Second Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "SECOND SEMESTER"
    ),
    "First Summer Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "SUMMER SEMESTER"
    ),
    "Second First Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "FIRST SEMESTER"
    ),
    "Second Second Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "SECOND SEMESTER"
    ),
    "Second Summer Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "SUMMER SEMESTER"
    ),
    "Third First Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "FIRST SEMESTER"
    ),
    "Third Second Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "SECOND SEMESTER"
    ),
    "Third Summer Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "SUMMER SEMESTER"
    ),
    "Fourth First Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "FIRST SEMESTER"
    ),
    "Fourth Second Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "SECOND SEMESTER"
    ),
    "Fourth Summer Semester": programData.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "SUMMER SEMESTER"
    ),
    Bridging: programData.filter(
      (courseItem) => courseItem.course_sem === "BRIDGING"
    ),
  };

  return (
    <Box w="80rem">
      {Object.entries(filteredCourses).map(([label, courses], index) => {
        if (courses.length === 0) return null; // Don't render if no courses
        const [year, semester] = label.split(" "); // Separate year and semester

        // Calculate total credit units, lecture hours, and lab hours
        const totalCreditUnits = courses.reduce(
          (acc, course) =>
            acc + (isNaN(course.credit_unit) ? 0 : course.credit_unit),
          0
        );
        const totalLectureHours = courses.reduce(
          (acc, course) => acc + (isNaN(course.num_lec) ? 0 : course.num_lec),
          0
        );
        const totalLabHours = courses.reduce(
          (acc, course) => acc + (isNaN(course.num_lab) ? 0 : course.num_lab),
          0
        );

        return (
          <VStack key={index} mt={index === 0 ? "3rem" : "5rem"}>
            <div ref={containerRef}>
              <Button onClick={handleDownloadPDF} ml="65rem">
                Download
              </Button>

              <Text fontSize="20px" fontWeight="semibold" w="30rem">
                {programName}
              </Text>

              <VStack mr="65rem" justifyContent="flex-start" display="left">
                <HStack>
                  <Text>Year:</Text>
                  <Text>{year} Year</Text>
                </HStack>
                <HStack>
                  <Text>Semester:</Text>
                  <Text>{semester} Semester </Text>
                </HStack>
              </VStack>
              <TableContainer overflowX="auto" w="90vw" mt="1rem">
                <Table
                  variant="simple"
                  fontFamily="inter"
                  size="sm"
                  w="100%"
                  overflowX="auto"
                  style={{ minWidth: "200px" }}
                >
                  <Thead bg="palette.primary" h="5rem">
                    <Tr>
                      <Th
                        style={{ textAlign: "center" }}
                        color="palette.secondary"
                      >
                        Course Code
                      </Th>
                      <Th
                        style={{ textAlign: "center" }}
                        color="palette.secondary"
                      >
                        Course Title
                      </Th>
                      <Th
                        style={{ textAlign: "center" }}
                        color="palette.secondary"
                      >
                        Pre-Requisite(s)
                      </Th>
                      <Th
                        style={{ textAlign: "center" }}
                        color="palette.secondary"
                      >
                        Lecture Hours
                      </Th>
                      <Th
                        style={{ textAlign: "center" }}
                        color="palette.secondary"
                      >
                        Lab Hours
                      </Th>
                      <Th
                        style={{ textAlign: "center" }}
                        color="palette.secondary"
                      >
                        Course Credit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {courses.map((course, index) => (
                      <Tr key={index}>
                        <Td
                          fontSize="14px"
                          fontStyle="bitter"
                          style={{ textAlign: "center" }}
                        >
                          {course.course_code}
                        </Td>
                        <Td
                          width="20rem"
                          fontStyle="bitter"
                          style={{
                            lineHeight: "1.4",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {course.course_title}
                        </Td>

                        <Td
                          fontSize="14px"
                          fontStyle="bitter"
                          style={{ textAlign: "center" }}
                        >
                          {course.pre_requisite}
                        </Td>
                        <Td
                          fontSize="14px"
                          fontStyle="bitter"
                          style={{ textAlign: "center" }}
                        >
                          {course.num_lec}
                        </Td>
                        <Td
                          fontSize="14px"
                          fontStyle="bitter"
                          style={{ textAlign: "center" }}
                        >
                          {course.num_lab}
                        </Td>
                        <Td
                          fontSize="14px"
                          fontStyle="bitter"
                          style={{ textAlign: "center" }}
                        >
                          {course.credit_unit}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tfoot
                    h="2.5rem"
                    bgColor="#F0EEED"
                    colSpan="5"
                    textAlign="center"
                  >
                    <Tr>
                      <Th>Total:</Th>
                      <Th></Th>
                      <Th></Th>
                      <Th style={{ textAlign: "center" }}>
                        {isNaN(totalLectureHours) ? 0 : totalLectureHours}
                      </Th>
                      <Th style={{ textAlign: "center" }}>
                        {isNaN(totalLabHours) ? 0 : totalLabHours}
                      </Th>
                      <Th style={{ textAlign: "center" }}>
                        {isNaN(totalCreditUnits) ? 0 : totalCreditUnits}
                      </Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </div>
          </VStack>
        );
      })}
    </Box>
  );
}

export default ProgramTable;
