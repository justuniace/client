import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import FacultyNavabr from "../../../components/navbar/facultynavbar";
import { endPoint } from "../../config";
import ProgramTable from "./ProgramTable";
import Students from "./Students";

function Changes() {
  const [facultyprogram, setFacultyProgram] = useState([]);
  const [yearStartedSet, setYearStartedSet] = useState(new Set());
  const facultyEmail = Cookies.get("facultyEmail");
  const [programName, setProgramName] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then(async (response) => {
          const facultyData = response.data;
          setFacultyProgram(facultyData.program_id);

          try {
            const programsResponse = await axios.get(`${endPoint}/programs`);
            const programs = programsResponse.data;

            const selectedProgram = programs.find(
              (programTable) =>
                programTable.program_id === facultyData.program_id
            );

            if (selectedProgram) {
              const program_name = selectedProgram.program_name;
              setProgramName(program_name);

              // Fetch year_started from pcurriculum table
              const curriculumResponse = await axios.get(
                `${endPoint}/curriculum/all`
              );
              const curriculum = curriculumResponse.data;

              const matchingCurriculums = curriculum.filter(
                (curriculumItem) =>
                  curriculumItem.program_id === facultyData.program_id
              );

              if (matchingCurriculums.length > 0) {
                const yearStartedValues = new Set(
                  matchingCurriculums.map(
                    (curriculumItem) => curriculumItem.year_started
                  )
                );
                setYearStartedSet(yearStartedValues);
              } else {
                console.error(
                  "No matching curriculum found for faculty program"
                );
              }
            } else {
              console.error("Program not found");
            }
          } catch (error) {
            console.error("Error fetching programs:", error);
          }
        })
        .catch((error) => {
          console.error("Error fetching faculty data:", error);
        });
    }
  }, [facultyEmail]);

  return (
    <Flex w="100vw" h="100vh" direction="column">
      <Box
        w="100%"
        pos="sticky"
        h="6rem"
        boxShadow="lg"
        top="0"
        right="0"
        bgColor="#F3F8FF"
        zIndex="2"
      >
        <FacultyNavabr />
      </Box>
      <Box
        padding="3rem 10rem"
        height="100%"
        justifyContent="center"
        alignContent="center"
      >
        <Text>Curriculum</Text>
        <Tabs
          variant="enclosed"
          onChange={(index) => setSelectedTabIndex(index)}
        >
          <TabList>
            {[...yearStartedSet].map((yearStarted, index) => (
              <Tab key={index}>{yearStarted}</Tab>
            ))}
            <Tab>Students</Tab>
          </TabList>
          <TabPanels>
            {[...yearStartedSet].map((yearStarted, index) => (
              <TabPanel key={index}>
                <Text>{`Year Started: ${yearStarted}`}</Text>
                
                <ProgramTable yearStarted={yearStarted} />
              </TabPanel>
            ))}
            <TabPanel>
              <Students />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
}

export default Changes;
