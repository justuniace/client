import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import html2pdf from "html2pdf.js";
import PropTypes from "prop-types";
import { useRef } from "react";

function GraduatingModal({ isOpen, onClose, graduatingStudents }) {
  console.group("Students Data", graduatingStudents);
  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");

    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "Graduating-Students.pdf",
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <div ref={containerRef}>
          <ModalHeader>Graduating Students</ModalHeader>
          <ModalBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Student Number</Th>
                    <Th>Name</Th>
                    <Th>Gender</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {graduatingStudents.map((student, index) => (
                    <Tr key={index}>
                      <Td>{student.student_number}</Td>
                      <Td>{`${student.first_name} ${student.middle_name} ${student.last_name}`}</Td>
                      <Td>{student.gender}</Td>
                      <Td>{student.status}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </div>
        <ModalFooter>
          <Button
            mr="1rem"
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
            onClick={handleDownloadPDF}
          >
            Download
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
}

GraduatingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  graduatingStudents: PropTypes.array.isRequired,
};

export default GraduatingModal;
