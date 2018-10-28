// Core Libraries
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { IsLoggedIn, CreateCourse } from "../../scripts/appService";
import { Redirect } from "react-router-dom";
import { Error, Info, Success } from "components/Snackbar/snackbarTypes";
// Components
import {
  CardContent, MenuItem, TextField, Typography, Divider,
  InputAdornment, Input, Tooltip, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, FormControl
} from "@material-ui/core";
import Datetime from 'react-datetime';
import Button from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Header from "components/Header/Header";
import MultiPassHeaderLinks from "components/Header/MultiPassHeaderLinks";
import Card from "components/Card/Card";
import IconButton from "components/CustomButtons/IconButton";
import SnackbarContent from "components/Snackbar/SnackbarContent";
// Stylesheets
import CreateCoursePageStyle from "assets/jss/material-kit-react/views/createCoursePageStyle.jsx";
// Icons
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faBalanceScale, faUpload
} from "@fortawesome/fontawesome-free-solid";
import {
  faTimesCircle, faFileAlt
} from "@fortawesome/fontawesome-free-regular";


class CreateCoursePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: true,

      snackbarMessageType: "",
      snackbarType: "",
      snackbarMessage: "",
      snackbarOpen: false,

      dialogOpen: false,

      courseId: "",
      courseType: "",
      courseNameAbr: "",
      courseName: "",
      studentCount: "",
      courseSemester: "",
      courseEcts: "",
      courseDescription: "",
      courseRequirements: "",
      courseEnrollmentDate: "",

      assignmentCount: 0,
      assignmentGradePercentage: 0,
      assignmentFiles: {},

      testCount: 0,
      testGradePercentage: 0,

      courseGrade4: 60,
      courseGrade3: 70,
      courseGrade2: 80,
      courseGrade1: 90,
    }
  }

//  Event Handler & Functionality section

  async componentWillMount() {
    const userState = await IsLoggedIn();
    if (this.state.loggedIn !== userState) this.setState({loggedIn: userState});
  }

  // Handles most of the field input changes, saves into state
  handleChange = name => ({ target: { value }}) => {
    this.setState({ [name]: value });
  }

  // Save/remove assignment file from upload to state
  saveFile = name => ({target}) => {
    try {
      const fileObj = this.state.assignmentFiles;
      fileObj[name] = target.files[0];
      this.setState({ assignmentFiles: fileObj });
      
    } catch (err) {
      console.log(err);
    }
  };
  removeFile = ({target}) => {
    try {
      const fileObj = this.state.assignmentFiles;
      delete fileObj[target.id];
      this.setState({assignmentFiles: fileObj});
    } catch (err) {
      console.log(err);
    }
  };
  
  // Handles point input fields, eliminates negative values
  handleNonNegativeValue = name => ({ target: { value }}) => {
    if(value < 0) this.setState({ [name]: 0 });
    else this.setState({ [name] : value })
  };
  
  // Snackbar handlers
  popSnackbar = (messageType, snackMessage) =>{
    this.setState({
      snackbarMessageType: messageType.snackMessageType,
      snackbarType: messageType.snackType,
      snackbarMessage: snackMessage,
      snackbarOpen: true
    });
  };

  closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  // Dialog handlers
  popDialog = () => {
    this.setState({
      dialogOpen: true
    });
  };

  handleDisagree = () => {
    this.setState({
      confirmSubmit: false,
      dialogOpen: false
    })
  };
  
  handleAgree = async () => {

    this.setState({
      confirmSubmit: true,
      dialogOpen: false
    });
    const response = await CreateCourse(this.state.courseData);
    if (response.status === 200) {
      this.popSnackbar(Success, "Course successfuly created");
      setTimeout(() => {
        this.props.history.push({
          pathname: "/my-courses"
        })
      }, 3000);
    } else if (response === 400) {
      this.popSnackbar(Info, "Course already exists");
    } else {
      this.popSnackbar(Error, "Oops something went wrong" );
    }
  };
  
  convertToFormDataObj = (data) => {
    const formData = new FormData();
  
    const { general, gradingScheme, assignmentFiles } = data;
    const {
      assignments, tests, gradeScale, assignmentCount,
      assignmentGradePercentage, testCount, testGradePercentage
    } = gradingScheme;
    
    const iterableObj = Object.assign(general, assignmentFiles,
      assignments, tests, gradeScale);

    for (const field in iterableObj){
      formData.append([field], iterableObj[field]);
    }
    formData.append("assignmentCount", assignmentCount);
    formData.append("assignmentGradePercentage", assignmentGradePercentage);
    formData.append("testCount", testCount);
    formData.append("testGradePercentage", testGradePercentage);
    
    return formData;
  }

  handleDatePicker = (key, date) => {
    try {
      this.setState({ [key]: date.format("YYYY-MM-DD") });
    } catch (err) {
      //console.log(err);
    }
  }

  // Form Submit
  submit = async () => {
    try {
      const data = {
        general: {
          courseId: this.state.courseId,
          courseType: this.state.courseType,
          courseName: this.state.courseName,
          studentCount: parseInt(this.state.studentCount,10),
          courseSemester: this.state.courseSemester,
          courseEcts: parseInt(this.state.courseEcts,10),
          courseDescription: this.state.courseDescription,
          courseRequirements: this.state.courseRequirements,
          courseNameAbr: this.state.courseNameAbr,
          courseEnrollmentDate: this.state.courseEnrollmentDate
        },
        gradingScheme: {
          assignmentCount: parseInt(this.state.assignmentCount,10) || 0,
          assignmentGradePercentage: parseInt(this.state.assignmentGradePercentage,10) || 0,
          testCount: parseInt(this.state.testCount,10) || 0,
          testGradePercentage: parseInt(this.state.testGradePercentage,10) || 0,
          assignments: {},
          tests: {},
          gradeScale: {
            grade1: parseInt(this.state.courseGrade1,10),
            grade2: parseInt(this.state.courseGrade2,10),
            grade3: parseInt(this.state.courseGrade3,10),
            grade4: parseInt(this.state.courseGrade4,10),
            grade5: parseInt(this.state.courseGrade5,10)
          }
        },
        assignmentFiles: this.state.assignmentFiles
      };

      for (let i=1; i<data.gradingScheme.assignmentCount+1; i++){
        data.gradingScheme.assignments[`assignmentPoints${i}`] = parseInt(this.state[`assignmentPoints${i}`],10);
        data.gradingScheme.assignments[`assignmentDate${i}`] = this.state[`assignmentDate${i}`];
      }
      for (let i=1; i<data.gradingScheme.testCount+1; i++) {
        data.gradingScheme.tests[`testPoints${i}`] = parseInt(this.state[`testPoints${i}`], 10);
      }


      if(this.formDataError(data)) return;
      const formData = this.convertToFormDataObj(data);
      await this.setState({courseData: formData});
      // for(const key of formData) console.log(key);
      this.popDialog();

    } catch (err) {
      const msg = "Please check the Form for Errors, most likely empty fields " +
       "that should contain a valid numeric value or unaploaded assignments";
      this.popSnackbar(Error, msg);
    }
  }

  // Validates form fields, returns true if error is present
  formDataError = ({ general, gradingScheme, assignmentFiles }) => {
    let messageGeneral = "";
    if(!general.courseId) messageGeneral+="Course ID, ";
    if(!general.courseType) messageGeneral+="Course Type, ";
    if(!general.courseNameAbr) messageGeneral+="Course Name Abreviation, ";
    if(!general.courseName) messageGeneral+="Course Name, ";
    if(!general.studentCount) messageGeneral+="Student Count, ";
    if(!general.courseSemester) messageGeneral+="Course Semester, ";
    if(!general.courseEcts) messageGeneral+="ECTS, ";
    if(!general.courseEnrollmentDate) messageGeneral+="Course Enrollment Deadline, ";

    if(messageGeneral !== ""){
      messageGeneral = `Check Fields for errors: ${messageGeneral}`;
      this.popSnackbar(Error, messageGeneral);
      return true;
    }

    let messageGrading = "";
    const {
      assignmentGradePercentage, testGradePercentage, gradeScale,
      assignmentCount, testCount, assignments, tests
    } = gradingScheme;
    if((assignmentGradePercentage === "") || (testGradePercentage === "")) {
      messageGrading += "Assignment and Test Grade Percentages fields must not be empty";
      this.popSnackbar(Error, messageGrading);
      return true;
    }
    else if((assignmentGradePercentage+testGradePercentage) !== 100) {
      messageGrading += "Assignment and Test Grade Percentage fields must add up to 100%";
      this.popSnackbar(Error, messageGrading);
      return true;
    }

    for (let i=2; i<6; i++) {
      if (gradeScale[`grade${i}`] >= gradeScale[`grade${i-1}`]){
        messageGrading = `Grade Percentage for Note ${i} is higher or equal to Note ${i-1}\n`;
      }
    }
    if(messageGrading!==""){
      this.popSnackbar(Error, messageGrading);
      return true;
    }

    if(assignmentCount>0){
      if (Object.keys(assignmentFiles).length !== assignmentCount) messageGrading += 'Assignment files missing from upload, '
      for(let i=1; i<assignmentCount+1; i++){
        if(!assignments[`assignmentPoints${i}`]) messageGrading+=`No points set for assignment ${i}, `;
        if(!assignments[`assignmentDate${i}`]) messageGrading+=`No deadline set for assignment ${i}, `; 
      }
    }
    if(messageGrading!==""){
      this.popSnackbar(Error, messageGrading);
      return true;
    }

    if(testCount>0){
      for(let i=1; i<testCount+1; i++){
        if(!tests[`testPoints${i}`]) messageGrading+=`No points set for test ${i}, `; 
      }
    }
    if(messageGrading!==""){
      this.popSnackbar(Error, messageGrading);
      return true;
    }


    return false;
  }

  
// Inner Components Section
  assignmentsSection = () => {
    if(this.state.assignmentCount === 0) return;
    const { classes } = this.props;
    let assignments = [];
    let tooltip = "Click the upload button to upload a document";
    let hasFile = false;
    let removeIconId = "";
    for (let i=1; i<(parseInt(this.state.assignmentCount,10)+1); i++){
      if(this.state.assignmentFiles[`assignmentFile${i}`]){
        tooltip = this.state.assignmentFiles[`assignmentFile${i}`].name;
        hasFile = true;
        removeIconId = `assignmentFile${i}`;
      }
      assignments.push(
        <GridContainer justify="center" key={`assignmentFilez${i}`} className={classes.myContainer}>
          <GridItem className={classes.noDimens}>
            <Input
              style={{display:"none"}}
              accept="application/pdf"
              id={`fileInput${i}`}
              type="file"
              onChange={this.saveFile(`assignmentFile${i}`)}
            />
            <label htmlFor={`fileInput${i}`}>
              <Tooltip
                title={tooltip}
                placement="top"
                classes={{tooltip:classes.tooltip}}
              >
                <Button
                  className={classes.uploadButton}
                  size="sm"
                  color="primary"
                  component="span"
                  id={`fileInputButton${i}`}
                >
                Upload
                <FontAwesomeIcon icon={faUpload} size="lg" style={{marginLeft: "10px"}}/>
                </Button>
              </Tooltip>
            </label>
            <IconButton
              color="transparent"
              children={<FontAwesomeIcon id={removeIconId} icon={faTimesCircle} size="sm"/>}
              centerRipple
              className={classes.rmFileButton}
              disabled={!hasFile}
              onClick={this.removeFile.bind(this)}
            />
          </GridItem>
          <GridItem className={classes.noDimens}>
            <TextField
              type="number"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">{i}. Points:</InputAdornment>
              }}
              value={this.state[`assignmentPoints${i}`] || ""}
              onChange={this.handleNonNegativeValue(`assignmentPoints${i}`)}
            />
          </GridItem>
          <GridItem className={classes.noDimens} style={{paddingLeft:"10px"}}>
            <FormControl >
              <Datetime
                inputProps={{ placeholder: "Submission Date" }}
                value={this.state[`assignmentDate${i}`] || ""}
                onChange={this.handleDatePicker.bind(this, `assignmentDate${i}`)}
              />
            </FormControl>
          </GridItem>
        </GridContainer>
      );
      tooltip = "Click the upload button to upload a document";
      hasFile = false;
      removeIconId = "";
    }
    
    return <GridContainer justify="center" className={classes.myContainer}>{assignments}</GridContainer>
  }

  gradingSchemeAssignments = (containerWidth) => {
    const { classes } = this.props;
    return(
      <GridItem xs={containerWidth} 
        style={{
          borderRight: "solid 1px",
          borderBottom: "solid 1px",
          borderColor:"#DDDDDD"
        }}
      >
        <GridContainer justify="center">
          <GridItem xs={4} className={classes.grading}>
            <TextField
              label="Assignment Count"
              type="number"
              value={this.state.assignmentCount}
              fullWidth
              onChange={this.handleNonNegativeValue('assignmentCount')}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faFileAlt}/>
                  </InputAdornment>
              }}
            />
          </GridItem>
          <GridItem xs={4} className={classes.grading}>
            <TextField
              label="Grade Percentage"
              type="number"
              fullWidth
              value={this.state.assignmentGradePercentage}
              onChange={this.handleNonNegativeValue('assignmentGradePercentage')}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faBalanceScale}/>
                  </InputAdornment>
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            {this.assignmentsSection()}
          </GridItem>
        </GridContainer>
      </GridItem>
    )
  }

  testsSection = () => {
    if (this.state.testCount === 0) return;
    const { classes } = this.props;
    const tests = [];
    for (let i=1; i<(parseInt(this.state.testCount,10)+1); i++){
      tests.push(
          <GridItem key={`test${i}`} className={classes.noDimens}>
            <TextField
              type="number"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">{i}. Points:</InputAdornment>
              }}
              value={this.state[`testPoints${i}`] || ""}
              onChange={this.handleNonNegativeValue(`testPoints${i}`)}
            />
          </GridItem>
      )
    }
    return (<GridContainer justify="center" className={classes.myContainer}>{tests}</GridContainer>)
  }

  gradingSchemeTests = (containerWidth) => {
    const { classes } = this.props;
    return (
      <GridItem xs={containerWidth}
        style={{
          borderBottom: "solid 1px",
          borderColor:"#DDDDDD"
        }}
      >
        <GridContainer justify="center">
          <GridItem xs={6} className={classes.grading}>
            <TextField
              label="Test Count"
              type="number"
              fullWidth
              onChange={this.handleNonNegativeValue('testCount')}
              value={this.state.testCount}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faFileAlt}/>
                  </InputAdornment>
              }}
            />
          </GridItem>
          <GridItem xs={6} className={classes.grading}>
            <TextField
              label="Grade Percentage"
              type="number"
              fullWidth
              value={this.state.testGradePercentage}
              onChange={this.handleNonNegativeValue('testGradePercentage')}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faBalanceScale}/>
                  </InputAdornment>
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            {this.testsSection()}
          </GridItem>
        </GridContainer>                  
      </GridItem>
    )
  }

  gradeScale = (containerWidth) => {
    const { classes } = this.props;
    return (
      <GridItem xs={containerWidth} >
        <GridContainer justify="space-between" alignItems="center" spacing={16}
          style={{marginRight:"0px", marginLeft:"0px"}}
        >
          <GridItem xs={3} className={classes.grading}>
            <TextField type="number" label="Grade 1 Percentage:" value={this.state.courseGrade1}
              onChange={this.handleNonNegativeValue("courseGrade1")} fullWidth
            />
          </GridItem>
          <GridItem xs={3} className={classes.grading}>
            <TextField type="number" label="Grade 2 Percentage:" value={this.state.courseGrade2}
              onChange={this.handleNonNegativeValue("courseGrade2")} fullWidth
            />
          </GridItem>
          <GridItem xs={3} className={classes.grading}>
            <TextField type="number" label="Grade 3 Percentage:" value={this.state.courseGrade3}
              onChange={this.handleNonNegativeValue("courseGrade3")} fullWidth
            />
          </GridItem>
          <GridItem xs={3} className={classes.grading}>
            <TextField type="number" label="Grade 4 Percentage:" value={this.state.courseGrade4}
              onChange={this.handleNonNegativeValue("courseGrade4")} fullWidth
            />
          </GridItem>
        </GridContainer>
      </GridItem>
    )
  }

  render(){
    if (!this.state.loggedIn) return (<Redirect to="/Login"/>);
    const { classes } = this.props;
    return(
      <GridContainer justify='center'>
        <GridItem xs={12} className={classes.header}>
          <Header brand="MultiPass" fixed color="primary"
            leftLinks={<MultiPassHeaderLinks type="teacher" />}
            rightLinks={<MultiPassHeaderLinks type="right" history />}
          />
        </GridItem>

        <GridItem xs={11}>
          <Card className={classes.cardFormStyle}>
            <CardContent >
              <GridContainer justify='center'>

                <GridItem xs={12}>
                  <Typography variant="headline">General</Typography>
                  <Divider style={{marginBottom:"10px"}} />
                </GridItem>
                <GridItem xs={2}>
                  <TextField label="Course ID" onChange={this.handleChange('courseId')}
                    type="text" fullWidth
                  />
                </GridItem>

                <GridItem xs={1}>
                  <TextField
                    select value={this.state.courseType} fullWidth margin="normal"
                    onChange={this.handleChange('courseType')}
                  >
                    <MenuItem value="VO">VO</MenuItem>
                    <MenuItem value="UE">UE</MenuItem>
                    <MenuItem value="VU">VU</MenuItem>
                    <MenuItem value="PR">PR</MenuItem>
                  </TextField>
                </GridItem>

                <GridItem xs={1}>
                  <TextField
                    label="Abr." type="text" fullWidth
                    onChange={this.handleChange('courseNameAbr')}
                  />
                </GridItem>

                <GridItem xs={3}>
                  <TextField
                    label="Course Name" type="text" fullWidth
                    onChange={this.handleChange('courseName')}
                  />
                </GridItem>

                <GridItem xs={2}>
                  <TextField
                    label="Student Count" type="number" fullWidth
                    value={this.state.studentCount}
                    onChange={this.handleNonNegativeValue('studentCount')}
                  />
                </GridItem>

                <GridItem xs={2}>
                  <TextField
                    label="Course Semester" type="text" fullWidth
                    onChange={this.handleChange('courseSemester')}
                  />
                </GridItem>

                <GridItem xs={1}>
                  <TextField
                    label="ECTS" type="number" fullWidth value={this.state.courseEcts}
                    onChange={this.handleNonNegativeValue('courseEcts')}
                  />
                </GridItem>

                <GridItem xs={12} className={classes.description}>
                  <TextField
                    multiline label="Course Description" rows="10" fullWidth
                    onChange={this.handleChange('courseDescription')}
                  />
                </GridItem>

                <GridItem xs={12}>
                  <Typography variant="headline"> Grading Scheme </Typography>
                  <Divider/>
                  <GridContainer justify="center" >
                    {this.gradingSchemeAssignments(7)}
                    {this.gradingSchemeTests(5)}
                    {this.gradeScale(9)}
                  </GridContainer>
                </GridItem>

                <GridItem xs={4}>
                  <TextField
                    type="text" label="Requirements" fullWidth
                    onChange={this.handleChange('courseRequirements')}
                  />
                </GridItem>
                <GridItem className={classes.noDimens} style={{paddingLeft:"10px"}}>
                  <FormControl >
                    <Datetime
                      inputProps={{ placeholder: "Enrollment Deadline" }}
                      value={this.state.courseEnrollmentDate}
                      onChange={this.handleDatePicker.bind(this, 'courseEnrollmentDate')}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <GridContainer justify="center" style={{paddingTop:"20px"}}>
                    <GridItem xs={3}>
                      <Button
                        fullWidth
                        color="info"
                        onClick={this.submit.bind(this)}
                      >
                        Submit
                      </Button>
                    </GridItem>
                  </GridContainer>
                </GridItem>

              </GridContainer>
            </CardContent>
          </Card>
        </GridItem>

        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={5000}
          onClose={this.closeSnackbar}
        >
          <SnackbarContent
            color={this.state.snackbarType}
            text={
              <span style={{marginRight: "15px" }}>
                <b>{`${this.state.snackbarMessageType}: `}</b>
                {this.state.snackbarMessage}
              </span>
            }
          />
        </Snackbar>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDisagree}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Submission"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to submit the course form?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              paddingRight: "15px",
              paddingLeft: "15px",
              justifyContent: "space-between"
            }}>
            <Button onClick={this.handleDisagree} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleAgree} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>

      </GridContainer>
    );
  }
}

export default withStyles(CreateCoursePageStyle)(CreateCoursePage)