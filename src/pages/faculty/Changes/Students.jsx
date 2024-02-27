import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Button,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { endPoint } from "../../config";
import { MdDelete } from "react-icons/md";

function Students() {
  const facultyEmail = Cookies.get("facultyEmail");
  const [programName, setProgramName] = useState("");
  const [facultyprogram, setFacultyProgram] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyProgram(facultyData.program_id);

          if (facultyData && facultyData.program_id) {
            axios
              .get(`${endPoint}/programs`)
              .then((response) => {
                const programs = response.data;
                const selectedProgram = programs.find(
                  (program) => program.program_id === facultyData.program_id
                );

                if (selectedProgram) {
                  const programName = selectedProgram.program_name;
                  setProgramName(programName);
                } else {
                  console.error("Program not found");
                }
              })
              .catch((error) => {
                console.error("Error fetching program data:", error);
              });

            axios
              .get(`${endPoint}/students/all`)
              .then((response) => {
                const allStudents = response.data;
                const studentsWithProgramId = allStudents.filter(
                  (student) => student.program_id === facultyData.program_id
                );
                setStudents(studentsWithProgramId);
                console.log("Students", studentsWithProgramId);
              })
              .catch((error) => {
                console.error("Error fetching student data:", error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  return (
    <Box>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Student Number</Th>
              <Th>First Name</Th>
              <Th>Middle Name</Th>
              <Th>Last Name</Th>
              <Th>Gender</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student.student_id}>
                <Td>{student.student_number}</Td>
                <Td>{`${student.first_name} `}</Td>
                <Td>{student.middle_name} </Td>
                <Td>{student.last_name}</Td>
                <Td>{student.gender}</Td>
                <Td>{student.status}</Td>
                <Td>
                  <Button>
                    {" "}
                    <MdDelete />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Students;
