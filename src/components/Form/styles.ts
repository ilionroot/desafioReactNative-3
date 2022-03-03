import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingTop: 32,
  },
  textInput: {
    marginVertical: 16,
    borderBottomColor: "rgba(0,0,0,0.75)",
    borderBottomWidth: 1,
    paddingLeft: 8,
    paddingVertical: 6,

    fontSize: 16,
  },
  text: {
    fontSize: 15,
    fontFamily: "ubuntu-italic",
  },
  generatePDFButton: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 6,
    height: 64,
  },
  generatePDFButtonText: {
    color: "white",
    fontSize: 16,
  },
  statePicker: {
    marginTop: 12,
  },
  dateContainer: {
    marginVertical: 32,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    textDecorationLine: "underline",
    color: "black",
    fontSize: 16,
  },
  pdfViewerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  savePdfButton: {
    position: "absolute",
    bottom: 90,
    left: 24,
    backgroundColor: "black",
    borderRadius: 32,
    padding: 18,
    width: 128,
  },
  closePdfButton: {
    position: "absolute",
    bottom: 18,
    left: 24,
    backgroundColor: "black",
    borderRadius: 32,
    padding: 18,
    width: 128,
  },
});
