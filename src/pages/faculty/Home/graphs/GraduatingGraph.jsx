import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { endPoint } from "../../../config";

function GraduatingGraph({ setGraduatingStudents, setGraduatingPercentage }) {
  const facultyEmail = Cookies.get("facultyEmail");

  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [graduatingPercentage, setGraduatingLocalPercentage] = useState(0);

  const fetchDataForStudent = async (studentNumber) => {
    try {
      const validateResponse = await axios.get(
        `${endPoint}/validateData?studentNumber=${studentNumber}`
      );
      return validateResponse.data;
    } catch (error) {
      console.error("Error fetching data for student:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (facultyEmail) {
          const facultyResponse = await axios.get(
            `${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`
          );
          const facultyData = facultyResponse.data;

          if (facultyData && facultyData.program_id) {
            const studentsResponse = await axios.get(
              `${endPoint}/students/program/${facultyData.program_id}`
            );
            const studentsData = studentsResponse.data;

            const yearFourStudents = studentsData.filter(
              (student) => calculateYearLevel(student.student_number) === 4
            );

            setStudentCount(yearFourStudents.length);

            const studentsWithAdditionalData = await Promise.all(
              yearFourStudents.map(async (student) => {
                const additionalData = await fetchDataForStudent(
                  student.student_number
                );

                let courseType = "";
                if (
                  student.student_number.startsWith("2020") ||
                  student.student_number.startsWith("2021")
                ) {
                  courseType = 2019;
                } else {
                  courseType = 2022;
                }

                const mapped = await Promise.all(
                  additionalData.map(async (data) => {
                    try {
                      const courseResponse = await axios.get(
                        `${endPoint}/curriculum?program_id=${student.program_id}&year_started=${courseType}&course_id=${data.course_id}`
                      );
                      const courseData = courseResponse.data;

                      const totalCreditUnits = courseData.reduce(
                        (sum, course) => sum + course.credit_unit,
                        0
                      );

                      setTotalCreditUnits(totalCreditUnits);

                      if (courseData.length > 0) {
                        const creditUnit = courseData[0].credit_unit;

                        return {
                          ...data,
                          creditUnit: creditUnit,
                        };
                      } else {
                        console.error(
                          "Course data not found for course_id:",
                          data.course_id
                        );
                        return {
                          ...data,
                          creditUnit: undefined,
                        };
                      }
                    } catch (error) {
                      console.error("Error fetching course data:", error);
                      return {
                        ...data,
                        creditUnit: undefined,
                      };
                    }
                  })
                );
                const validatedCredit = mapped.reduce(
                  (sum, data) =>
                    data.creditUnit ? sum + data.creditUnit : sum,
                  0
                );

                return {
                  ...student,
                  additionalData: mapped,
                  totalCreditUnits: totalCreditUnits,
                  validatedCredit: validatedCredit,
                };
              })
            );

            console.log(
              "studentsWithAdditionalData",
              studentsWithAdditionalData
            );

            // Filter graduating students
            const graduatingStudentsFiltered =
              studentsWithAdditionalData.filter((student) => {
                console.log(
                  "Student:",
                  student.student_number,
                  "Total Credit Units:",
                  student.totalCreditUnits,
                  "Validated Credit:",
                  student.validatedCredit
                );
                return student.totalCreditUnits === student.validatedCredit;
              });

            console.log(
              "graduatingStudentsFiltered",
              graduatingStudentsFiltered
            );

            setGraduatingStudents(graduatingStudentsFiltered);

            // Calculate percentage
            const percentage =
              studentCount !== 0
                ? (graduatingStudentsFiltered.length / studentCount) * 100
                : 0;

            setGraduatingLocalPercentage(percentage);
            setGraduatingPercentage(percentage);
            console.log("p", percentage);

            setGraduatingLocalPercentage(percentage);
            setGraduatingPercentage(percentage);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    facultyEmail,
    studentCount,
    totalCreditUnits,
    setGraduatingStudents,
    setGraduatingPercentage,
  ]);

  const calculateYearLevel = (studentNumber) => {
    const studentYear = parseInt(studentNumber.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const academicYearStartMonth = 9; // September
    const isNewAcademicYear =
      new Date().getMonth() + 1 >= academicYearStartMonth;
    return isNewAcademicYear
      ? currentYear - studentYear + 1
      : currentYear - studentYear;
  };

  const options = {
    series: [graduatingPercentage],
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          name: {
            offsetY: -20,
            show: true,
            color: "#888",
            fontSize: "10px",
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: "#111",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    labels: ["Graduating"], // Use an array for labels
  };

  return (
    <ReactApexChart
      options={options}
      series={options.series}
      type="radialBar"
      height={400}
      w={400}
      key={options.series[0]} // Add a key prop
    />
  );
}

GraduatingGraph.propTypes = {
  setGraduatingPercentage: PropTypes.func.isRequired,
  setGraduatingStudents: PropTypes.func.isRequired,
};

export default GraduatingGraph;
