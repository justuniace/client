import React, { useRef } from "react";
import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={{ margin: 5 }}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const PDFDownloadButton = ({ data }) => {
  const pdfRef = useRef();

  const downloadPDF = () => {
    pdfRef.current.updateContainer();
    const blob = pdfRef.current.blob;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "table.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <PDFViewer ref={pdfRef}>
        <PDFDocument data={data} />
      </PDFViewer>
      <button onClick={downloadPDF}>Download PDF</button>
    </>
  );
};

export default PDFDownloadButton;
