// Core modules
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import {
  GetAssignment, EnrollMe, getStudentData,
  SubmitStudentEvaluation, SubmitGrade, GetMyCurrentCourseData, WithdrawMe
} from '../../scripts/appService.js';
import { Error, Info, Success } from "components/Snackbar/snackbarTypes";
// Components
import Card from 'components/Card/Card.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import NavPills from 'components/NavPills/NavPills.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import SnackbarContent from "components/Snackbar/SnackbarContent";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  Divider, CardContent, Collapse, Typography, CardActions, IconButton, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table,
  TableHead, TableBody, TableCell, TableRow, TextField
} from '@material-ui/core';
// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { faChalkboardTeacher } from '@fortawesome/fontawesome-free-solid';
// Stylesheets
import courseCardStyle from 'assets/jss/material-kit-react/components/courseCardStyle.jsx';


class CourseCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: false,
      
      snackbarMessageType: "",
      snackbarType: "",
      snackbarMessage: "",
      snackbarOpen: false,
      
      enrollDialogOpen: false,
      withdrawDialogOpen: false,
      evaluateStudentDialogOpen: false,

      studentData: []
    }
  }

//  Event Handler & Functionality section
  async componentWillMount() {
    try {
      const { courseCardType, course } = this.props;
      if (courseCardType === "teacher") {
        const response = await getStudentData(course.id, course.semester, course.students);
        const _studentData = await response.json();
        this.setState({ studentData : _studentData.data });
      }
      if (courseCardType === "student") {
        const response = await GetMyCurrentCourseData(course.id, course.semester);
        const _data = await response.json();

        this.setState({ myCourseData: _data.data });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Snackbar handlers
  popSnackbar = (messageType, snackMessage) => {
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
  popEnrollDialog = () => {
    this.setState({
      enrollDialogOpen: true
    });
  };

  handleDisagree = () => {
    this.setState({
      confirmSubmit: false,
      enrollDialogOpen: false,
      evaluateStudentDialogOpen: false,
      withdrawDialogOpen: false,
    })
  };
  
  

  popEvaluateStudentDialog = async (_student) => {
    await this.setState({
      evaluateStudentDialogOpen: true,
      student: _student
    });
  }

  popWithdrawDialog = () => {
    this.setState({ withdrawDialogOpen: true });
  };

  // Data Handlers
  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  downloadAssignment = async (target) => {
    try { 
      const response = await GetAssignment(target);
      if (response.status === 200) {
        const data = await response.arrayBuffer(); 
        const file = new File([data], target.file, { type: 'application/pdf' });
        const objUrl = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = objUrl;
        link.download = file.name;
        link.click();
      } else {
        console.log(response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleFeedback = name => ({ target: { value }}) => {
    const obj = this.state.student.eval.feedbacks;
    obj[name] = value;
    this.setState({ feedbacks: obj });
  }

  handlePoints = (maxPoints, type, name, component) => {
    const value = parseInt(component.target.value, 10);
    if (value <= maxPoints) {
      const obj = this.state.student.eval[type];
      obj[name] = value;
      this.setState({
        [type]: obj
      })
    }
  }

  // request handlers (submit grade, evaluation, enrollment, withdrawal)

  handleAgree = async () => {
    const { id, semester } = this.props.course;
    this.setState({
      confirmSubmit: true,
      enrollDialogOpen: false
    });
    const response = await EnrollMe({ id, semester });
    if (response.status === 200) {
      this.popSnackbar(Success, "Successfuly enrolled into course");
    } else if (response.status === 400 || response.status === 401) {
      const reason = await response.json();
      this.popSnackbar(Info, reason.message);
    } else {
      this.popSnackbar(Error, "Oops, something went wrong!" );
    }
  };

  submitGrade = async (grade) => {
    const { student } = this.state;
    const { course } = this.props;

    const response = await SubmitGrade(student.matriculationId, grade, course.semester, course.id);
    const data = await response.json();

    if (response.status === 200) {
      this.popSnackbar(Success, data.message);
    } else if (response.status === 401) {
      this.popSnackbar(Error, data.message);
    } else if (response.status === 403) {
      this.popSnackbar(Error, data.message);
    } else {
      this.popSnackbar(Error, 'Opps something went wrong!');
    }
  }

  sendEvaluation = async () => {
    const { student } = this.state;
    const { course } = this.props;
    const response = await SubmitStudentEvaluation(student, course.semester, course.id);
    const data = await response.json();

    if (response.status === 200) {
      this.popSnackbar(Success, data.message);
    } else if (response.status === 401) {
      this.popSnackbar(Error, data.message);
    } else if (response.status === 403) {
      this.popSnackbar(Error, data.message);
    } else {
      this.popSnackbar(Error, 'Opps something went wrong!');
    }
    this.setState({evaluateStudentDialogOpen: false});
  };

  handleWithdraw = async () => {
    const { id, semester } = this.props.course;
    this.setState({
      withdrawDialogOpen: false
    });
    const response = await WithdrawMe({ id, semester });
    if (response.status === 200) {
      this.popSnackbar(Success, "Successfuly withdrawed course");
    } else if (response.status === 400 || response.status === 401) {
      const reason = await response.json();
      this.popSnackbar(Info, reason.message);
    } else {
      this.popSnackbar(Error, "Oops, something went wrong!" );
    }
  }

// Components section
  // The "summary" of a card => small card panel containing (ects, course id etc)
  courseCardSummary = () => {  
    const { classes, course, tableDescription } = this.props;
    const borderColor = tableDescription === undefined ? "rgb(220, 220, 220)" : "black";
    return(
      <GridContainer justify="center" className={classes.summaryContainer}>
        <GridItem xs={1} className={classes.column}
          style={{borderLeft: `2px solid ${borderColor}`, borderRightColor:borderColor}}
        >
          <Typography align="center">{course.id}</Typography>
        </GridItem>
        <GridItem xs={1} className={classes.column} 
          style={{maxWidth: "5%", borderLeftColor:borderColor , borderRightColor:borderColor}}
        >
          <Typography align="center">{course.type}</Typography>
        </GridItem>  
        <GridItem xs={1} className={classes.column} 
          style={{maxWidth: "15.5%", borderLeftColor:borderColor , borderRightColor:borderColor}}
        >
          <Typography align="center">{course.nameAbr}</Typography>
        </GridItem>
        <GridItem xs={4} className={classes.column} 
          style={{maxWidth: "36%", borderLeftColor:borderColor , borderRightColor:borderColor}}
        >
          <Typography align="center">{course.name}</Typography>
        </GridItem>
        <GridItem xs={2} className={classes.column} 
          style={{maxWidth: "12.5%", borderLeftColor:borderColor , borderRightColor:borderColor}}
        >
          <Typography align="center">{course.studentCount}</Typography>
        </GridItem>
        <GridItem xs={2} className={classes.column} 
          style={{maxWidth: "13.5%", borderLeftColor:borderColor , borderRightColor:borderColor}}
        >
          <Typography align="center">{course.semester}</Typography>
        </GridItem>
        <GridItem xs={1} className={classes.column} 
          style={{borderRight: `2px solid ${borderColor}`, borderLeftColor:borderColor}}
        >
          <Typography align="center">{course.ects}</Typography>
        </GridItem>
      </GridContainer>
    );
  };
  
  aboutTab = () => {
    const { course } = this.props;
    return(
      {
        tabButton: "General",
        tabContent: (
          <span>
            <Typography variant="title">Course Info</Typography>
            <br/>
            <Typography>{course.description}</Typography>
          </span>
        )
      }
    )
  };

  getCourseData = (type) => {
    try {
      const { course } = this.props;
      const componentArray = [];
      if (course[`${type}Count`] === 0) return(<Typography>None for this Course</Typography>);
      if (type === 'test'){
        for (let i=1; i < (course[`${type}Count`]+1); i++){
          componentArray.push(
            <Typography key={`${type}${i}`}>Test {i} Points: {course[`${type}Points${i}`]}</Typography>
          );
        }
      } else {
        for (let i=1; i < (course[`${type}Count`]+1); i++){
          const target = {
            id: `${course.id}-${course.semester}`,
            file: course[`${type}s`][i-1]
          };
          componentArray.push(
            <div key={`${type}${i}`}>
              <Typography>{course[`${type}s`][i-1].replace('.pdf', '')} Points: {course[`${type}Points${i}`]}</Typography>
              <Typography>Submission Deadline: {course[`${type}Date${i}`]}</Typography>
              <Typography>
                Download <a onClick={this.downloadAssignment.bind(this, target)}>{course[`${type}s`][i-1]}</a>
              </Typography>
            </div>
          );
          componentArray.push(<br key={`br${i}`}/>);
        }
      }
      componentArray.push(<Typography key={course[`${type}Count`]}>Grade Percentage: {course[`${type}GradePercentage`]}</Typography>)
      return <span>{componentArray}</span>
    } catch (err) {
      //console.log(err);
    }
  }

  courseStructureTab = () => {
    const { course } = this.props;
    return(
      {
        tabButton: "Structural",
        tabContent: (
          <span>
            <Typography variant="title">Course Structure</Typography>
            <br/>
              <GridContainer>
                <GridItem xs={4}>
                  <Typography variant="subheading">Assignments</Typography>
                  <br/>
                  {this.getCourseData('assignment')}
                </GridItem>
                <GridItem xs={4}>
                  <Typography variant="subheading">Tests </Typography>
                  <br/>
                  {this.getCourseData('test')}
                </GridItem>
                <GridItem xs={4}>
                  <Typography variant="subheading">Grade Scale:</Typography>
                  <br/>
                  <Typography>Grade 1 from: {course.grade1}% of max points</Typography>
                  <Typography>Grade 2 from: {course.grade2}% of max points</Typography>
                  <Typography>Grade 3 from: {course.grade3}% of max points</Typography>
                  <Typography>Grade 4 from: {course.grade4}% of max points</Typography>
                  <Typography>Grade 5: when less than {course.grade4}% of maximum points</Typography>
                  <br/>
                  {course.requirements[0] !== "" ? 
                  <Typography>Requirements: {course.requirements.join(', ')}</Typography> :
                  <Typography>No enrollment requirements</Typography>}
                  <Typography>Enrollment Deadline: {course.enrollmentDate}</Typography>
                </GridItem>
              </GridContainer>
          </span>
        )
      }
    )
  };

  myTab = () => {
    const { myCourseData } = this.state;
    const myFeedbacksAndEvaluation = [];
    if (myCourseData === undefined ) return;

    const assignments = Object.keys(myCourseData.assignmentPoints);
    const tests = Object.keys(myCourseData.testPoints);

    for (let i = 0; i < assignments.length; i++) {
      myFeedbacksAndEvaluation.push(
        <GridContainer key={assignments[i]} style={{ paddingBottom: '15px' }}>
          <GridItem>
          </GridItem>
            <Typography variant='subheading'>{assignments[i]}</Typography>
          <GridItem>
            <Typography variant='body2'>Feedback:</Typography>
            <Typography style={{ paddingLeft: '15px', paddingRight: '15px' }}>
              {
                myCourseData.feedbacks[assignments[i]] === undefined ?
                `No Feedback for ${assignments[i]}` :
                myCourseData.feedbacks[assignments[i]]
              }
            </Typography>
          </GridItem>
          <GridItem>
            <Typography variant='body2'>
              {
                myCourseData.assignmentPoints[assignments[i]] === undefined ? 
                `Evaluation for ${assignments[i]} pending` :
                `Points: ${myCourseData.assignmentPoints[assignments[i]]}`
              }
            </Typography>
          </GridItem>
          <GridItem>
            <Divider/>
          </GridItem>
        </GridContainer>
      )
    }
    
    for (let i = 0; i < tests.length; i++) {
      myFeedbacksAndEvaluation.push(
        <GridContainer key={tests[i]} style={{ paddingBottom: '15px' }}>
          <GridItem>
          </GridItem>
            <Typography variant='subheading'>{tests[i]}</Typography>
          <GridItem>
            <Typography variant='body2'>Feedback:</Typography>
            <Typography style={{ paddingLeft: '15px', paddingRight: '15px' }}>
              {
                myCourseData.feedbacks[tests[i]] === undefined ?
                `No Feedback for ${tests[i]}` :
                myCourseData.feedbacks[tests[i]]
              }
            </Typography>
          </GridItem>
          <GridItem>
            <Typography variant='body2'>
              {
                myCourseData.testPoints[tests[i]] === undefined ? 
                `Evaluation for ${tests[i]} pending` :
                `Points: ${myCourseData.testPoints[tests[i]]}`
              }
            </Typography>
          </GridItem>
          <GridItem>
            <Divider/>
          </GridItem>
        </GridContainer>
      )
    }

    return(
      {
        tabButton: "My",
        tabContent: (
          <span>
            <Typography variant='title'>My Feedbacks and Evaluation</Typography>
              {
                myCourseData.evaluation === 0 ?
                  <Typography variant='subheading'>
                    Final Grade: Pending
                  </Typography>
                :
                  <Typography variant='subheading'>
                    Final Grade: {myCourseData.evaluation}
                  </Typography>
              }
            <br/>
            {myFeedbacksAndEvaluation}
          </span>
        )
      }
    )
  };

  studentTabTableBody = () => {
    const { studentData } = this.state;
    const studentRow = [];

    for (let i = 0; i < studentData.length; i++) {
      studentRow.push(
        <TableRow key={studentData[i].matriculationId}>
          <TableCell>{studentData[i].matriculationId}</TableCell>
          <TableCell>{studentData[i].firstName}</TableCell>
          <TableCell>{studentData[i].lastName}</TableCell>
          <TableCell>
            <IconButton
              onClick={this.popEvaluateStudentDialog.bind(this, studentData[i])}
            >
              <FontAwesomeIcon icon={faChalkboardTeacher} size="sm"/>
            </IconButton>
          </TableCell>  
        </TableRow>
      )
    }

    return <TableBody>{studentRow}</TableBody>
  }

  studentsTab = () => {
    return(
      {
        tabButton: "Students",
        tabContent: (
          <span>
            <Typography variant='title'>Students in Course</Typography>
            <br/>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matriculation ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
                {this.studentTabTableBody()}
            </Table>
          </span>
        )
      }
    );
  }

  // Content of the expanded course card
  courseCardDetails = () => {
    const { courseCardType } = this.props;
    return(
      <GridContainer styles={{ margin: "0px", padding: "0px"}}>
        <GridItem xs={11} >
          <NavPills 
            color="primary"
            horizontal={{
              tabsGrid: { xs: 2 },
              contentGrid: { xs: 10 }
            }}
            tabs={
              courseCardType === "all" ? [this.aboutTab(), this.courseStructureTab()] : 
                (courseCardType === "teacher" ? 
                  [
                    this.aboutTab(), this.courseStructureTab(), this.studentsTab()
                  ] :
                  (courseCardType === "student" ? 
                    [
                      this.aboutTab(), this.courseStructureTab(), this.myTab()
                    ] : [this.aboutTab(), this.courseStructureTab()]
                  )
                )
            }
          />
        </GridItem>
        <GridItem xs={1} style={{ padding: "0" }}>
          <GridContainer style={{ padding: "0px", margin: "0px" }}>
            {
              courseCardType === "all" ? 
              (<GridItem style={{ padding: "0" }}>
                <Button
                  fullWidth
                  color="info"
                  onClick={this.popEnrollDialog.bind(this)}
                >
                Enroll
                </Button>
              </GridItem>) : null
            }
            {
              courseCardType === "student" ? 
              (<GridItem style={{ padding: "0" }}>
                <Button
                  fullWidth
                  color="info"
                  onClick={this.popWithdrawDialog.bind(this)}
                >
                Withdraw
                </Button>
              </GridItem>) : null
            }
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
  };

  notificationSnack = () => {
    return(
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
    ) 
  }

  enrollDialog = () => {
    return(
      <Dialog
        open={this.state.enrollDialogOpen}
        onClose={this.handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Enrollment"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            paddingRight: "15px",
            paddingLeft: "15px",
            justifyContent: "space-between"
          }}>
          <Button onClick={this.handleDisagree} color="primary">
            No
          </Button>
          <Button onClick={this.handleAgree} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  
  dialogContentStudentEval = () => {
    try {
      const studentData = this.state.student.eval;
      const { course } = this.props;
      const studentDataArray = [];
      if (course.assignmentCount > 0){
        for (let i = 1; i < (course.assignmentCount+1); i++) {
          const assignmentName = course.assignments[i-1].split('.')[0];
          const assignmentPointsMax = course[`assignmentPoints${i}`];

          const assignmentFeedback = studentData.feedbacks[assignmentName] === undefined ?
            '' : studentData.feedbacks[assignmentName];
          const assignmentPoints = studentData.assignmentPoints[assignmentName] === undefined ?
            0 : studentData.assignmentPoints[assignmentName];

          studentDataArray.push(
            <GridContainer key={`assignment${i}`}>
              <GridItem>
                <Typography variant='title'>{assignmentName}</Typography>
                <Divider/>
              </GridItem>
              <GridItem xs={12} style={{paddingTop: '15px', paddingBottom: '15px'}}>
                <TextField
                  label="Feedback"
                  multiline
                  fullWidth
                  rows="5"
                  onChange={this.handleFeedback(assignmentName)}
                  value={assignmentFeedback}
                />
                <Divider/>
              </GridItem>
              <GridItem xs={12} style={{paddingTop: '15px', paddingBottom: '15px'}}>
                <TextField
                  label={`Points (Max: ${assignmentPointsMax})`}
                  type='number'
                  onChange={this.handlePoints.bind(this, assignmentPointsMax, 'assignmentPoints', assignmentName)}
                  value={assignmentPoints}
                />
              </GridItem>
              <GridItem xs={12}><Divider/></GridItem>
            </GridContainer>
          );
        }
      }

      if (course.testCount > 0) {
        for (let i = 1; i < (course.testCount+1); i++) {
          const test = `Test${i}`;
          const testPointsMax = course[`testPoints${i}`];

          const testFeedback = studentData.feedbacks[test] === undefined ?
            '' : studentData.feedbacks[test];
          const testPoints = studentData.testPoints[test] === undefined ?
            0 : studentData.testPoints[test];

          studentDataArray.push(
            <GridContainer key={`test${i}`}>
              <GridItem>
                <Typography variant='title'>Test {i}</Typography>
                <Divider/>
              </GridItem>
              <GridItem xs={12} style={{paddingTop: '15px', paddingBottom: '15px'}}>
                <TextField
                  label="Feedback"
                  multiline
                  fullWidth
                  rows="5"
                  onChange={this.handleFeedback(test)}
                  value={testFeedback}
                />
              </GridItem>
              <GridItem xs={12} style={{paddingTop: '15px', paddingBottom: '15px'}}>
                <TextField
                  label={`Points (Max: ${testPointsMax})`}
                  type='number'
                  onChange={this.handlePoints.bind(this, testPointsMax, 'testPoints', test)}
                  value={testPoints}
                />
              </GridItem>
              <GridItem xs={12}><Divider/></GridItem>
            </GridContainer>
          );
        }
      }

      let finalGrade = studentData.evaluation;
      const testEvaluations = Object.keys(studentData.testPoints);
      const assignmentEvaluations = Object.keys(studentData.assignmentPoints);
      
      if ((testEvaluations.length+assignmentEvaluations.length) === (course.assignmentCount+course.testCount)) {
        let totalAssignmentPoints = 0;
        let totalTestPoints = 0;
        let maxTotalAssignmentPoints = 0;
        let maxTotalTestPoints = 0;
        let assignmentGrade = 0;
        let testGrade = 0;

        for (let i = 0 ; i < assignmentEvaluations.length; i++) {
          totalAssignmentPoints += studentData.assignmentPoints[assignmentEvaluations[i]];
          maxTotalAssignmentPoints += course[`assignmentPoints${i+1}`];
        }

        for (let i = 0 ; i < testEvaluations.length; i++) {
          totalTestPoints += studentData.testPoints[testEvaluations[i]];
          maxTotalTestPoints += course[`testPoints${i+1}`];
        }
        
        if (course.assignmentCount !== 0){
          assignmentGrade = (totalAssignmentPoints / maxTotalAssignmentPoints)*course.assignmentGradePercentage; 
        }

        if (course.testCount !== 0){
          testGrade = (totalTestPoints / maxTotalTestPoints)*course.testGradePercentage;
        }

        const calculatedPoints = testGrade+assignmentGrade;

        for (let i = 1 ; i<5 ; i++) {
          if (calculatedPoints >= course[`grade${i}`]){
            finalGrade = i;
            break;
          } 
        }
        studentDataArray.push(
          <GridContainer key='grade'>
            <GridItem xs={6} style={{paddingTop: '15px', paddingBottom: '15px'}}>
              <Typography>Calculated from assessed Test and Assignment points</Typography>
            </GridItem> 
            <GridItem xs={3} style={{paddingTop: '15px', paddingBottom: '15px'}}>
              <TextField
                type='number'
                label='Final Course Grade'
                value={finalGrade}
                fullWidth
                style={{paddingTop: '10px'}}
              />
            </GridItem>
            <GridItem xs={3} style={{paddingTop: '15px', paddingBottom: '15px'}}>
              <Button
                color='primary'
                label='Submit Grade'
                fullWidth
                onClick={this.submitGrade.bind(this, finalGrade)}
                >
                Submit Grade
              </Button>
            </GridItem>
          </GridContainer>
        );
      } else {
        studentDataArray.push(
          <GridContainer key='grade'>
            <GridItem xs={6} style={{paddingTop: '15px', paddingBottom: '15px'}}>
              <Typography>All evaluations needed to calculate final grade</Typography>
            </GridItem> 
            <GridItem xs={3} style={{paddingTop: '15px', paddingBottom: '15px'}}>
              <TextField
                type='number'
                label='Final Course Grade'
                value={finalGrade}
                disabled
                fullWidth
                style={{paddingTop: '10px'}}
              />
            </GridItem>
            <GridItem xs={3} style={{paddingTop: '15px', paddingBottom: '15px'}}>
              <Button
                color='primary'
                disabled
                fullWidth
              >
                Submit Grade
              </Button>
            </GridItem>
          </GridContainer>
        ); 
      }

      return(<DialogContent>{studentDataArray}</DialogContent>)
    } catch (err) {
      // console.log(err);
    }
  };

  widthdrawDialog = () => {
    return(
      <Dialog
        open={this.state.withdrawDialogOpen}
        onClose={this.handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Withdrawal"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            paddingRight: "15px",
            paddingLeft: "15px",
            justifyContent: "space-between"
          }}>
          <Button onClick={this.handleDisagree} color="primary">
            No
          </Button>
          <Button onClick={this.handleWithdraw} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  evaluateStudentDialog = () => {
    return(
      <Dialog
        open={this.state.evaluateStudentDialogOpen}
        onClose={this.handleClose}
        scroll={'body'}
        aria-labelledby="scroll-dialog-title"
        fullWidth
        style={{
          minWidth: '70%',
          maxWidth: '100%'
        }}
      >
        <DialogTitle id="scroll-dialog-title">Evaluate Student</DialogTitle>
        {this.dialogContentStudentEval()}
        <DialogActions
          style={{
            paddingRight: "15px",
            paddingLeft: "15px",
            justifyContent: "space-between"
          }}
        >
          <Button onClick={this.handleDisagree} color="primary">
            Back
          </Button>
          <Button onClick={this.sendEvaluation} color="primary">
            Submit (Points and Feedback)
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  
  render(){
    const { classes, tableDescription } = this.props;
    return(
    <Card className={classes.card} style={tableDescription !== undefined ? {backgroundColor: "rgb(173, 237, 202)"} : null}>
      <GridContainer spacing={0}>
        <GridItem xs={11} className={classes.cardContent}>
          <CardContent style={{paddingTop: "0px", paddingBottom: "0px" }} onClick={this.handleExpandClick}>
            {this.courseCardSummary()}
          </CardContent>
        </GridItem>
        <GridItem xs={1} className={classes.expandButton} style={{padding: "10px 15px 10px 10px"}}>
          {tableDescription === undefined ?
            (<CardActions className={classes.actions} >
              <IconButton
                className={classNames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                }, classes.butsize)}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
                >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>) : null}
        </GridItem>
        {tableDescription === undefined ?
          (<GridItem xs={12}>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit >
              <Divider />
              <CardContent style={{paddingLeft: "0px", paddingRight: "0px"}}>
                {this.courseCardDetails()}
              </CardContent>
            </Collapse>
          </GridItem>) : null
        }
      </GridContainer>
      {this.notificationSnack()}
      {this.enrollDialog()}
      {this.evaluateStudentDialog()}
      {this.widthdrawDialog()}
    </Card>
    );
  }
  
}

export default withStyles(courseCardStyle)(CourseCard);
