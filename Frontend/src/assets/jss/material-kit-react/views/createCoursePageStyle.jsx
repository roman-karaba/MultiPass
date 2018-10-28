
const createCoursePageStyle = theme => ({
  cardFormStyle: {
    paddingTop: "15px",
    paddingBottom: "15px",
    marginBottom: "0px",
  },
  header: {
    paddingBottom: "50px",
  },
  description: {
    borderRadius: "5px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#c0c8d6",
    margin: "15px 15px 25px 15px",
    paddingBottom: "10px"
  },
  gradingScheme: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  myContainer: {
    marginLeft: "0",
    marginRight: "0",
    paddingLeft: "0",
    paddingRight: "0"
  },
  grading: {
    marginTop: "10px",
    marginBottom: "10px",
    // margin: "10px 10px 10px 10px"
    // paddingLeft: "10px",
    // paddingRight: "10px",
  },
  uploadButton: {
    marginTop: "5px",
    marginBottom: "5px",
  },
  rmFileButton: {
    width: "25px",
    height: "25px",
    minWidth: "25px",
  },
  noDimens: {
    width: "auto",
    padding: "2px 5px 2px 0px",
    marginBottom: "0"
  },
  noDimens1: {
    width: "auto%",
    paddingTop: "2px",
    paddingBottom: "0px",
    marginBottom: "0"
  },
  maxPts: {
    width: "60px",
  },
  tooltip: {
    padding: "10px 15px",
    minWidth: "130px",
    color: "#555555",
    lineHeight: "1.7em",
    background: "#FFFFFF",
    border: "none",
    borderRadius: "3px",
    boxShadow:
      "0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2)",
    maxWidth: "200px",
    textAlign: "center",
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: "0.875em",
    fontStyle: "normal",
    fontWeight: "400",
    textShadow: "none",
    textTransform: "none",
    letterSpacing: "normal",
    wordBreak: "normal",
    wordSpacing: "normal",
    wordWrap: "normal",
    whiteSpace: "normal",
    lineBreak: "auto"
  },
  label: {
    color: "rgba(0, 0, 0, 0.26)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    transition: "0.3s ease all",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingLeft: "0"
  },
});

export default createCoursePageStyle;