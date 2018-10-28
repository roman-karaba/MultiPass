// Core libraries
import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import jsonwebtoken from 'jsonwebtoken';
import { IsLoggedIn, GetMyData } from '../../scripts/appService'
import classNames from 'classnames';
// Components
import { Redirect } from 'react-router-dom';
import Header from "components/Header/Header.jsx";
import MultiPassHeaderLinks from "components/Header/MultiPassHeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
// Stylesheets
import studyRecordsPageStyle from "../../assets/jss/material-kit-react/views/studyRecordsPageStyle";
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

class StudyRecordsPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: true,
      token: jsonwebtoken.decode(localStorage.getItem('jwt'))
    };
  }

  async componentWillMount(){
    const userState = await IsLoggedIn();
    if (this.state.loggedIn !== userState) this.setState({loggedIn: userState});
    // Fetch my data
    try { 
      const response = await GetMyData();
      if (response.status === 200) {
        const body = await response.json();
        this.setState({ myCourses: body.data });
      }
    } catch (error) {
      console.error('Could not get course data');
    }
  }

  studyRecordRow = () => {
    const { myCourses } = this.state;
    if (myCourses === undefined) return;
    const courseElements = [];
    const courseKeys = Object.keys(myCourses);
    
    for (let i = 0; i < courseKeys.length; i++) {
      if(myCourses[courseKeys[i]].grade === 0) continue;
      courseElements.push(
        <TableRow key={courseKeys[i]}>
          <TableCell>{myCourses[courseKeys[i]].id}</TableCell>
          <TableCell>{myCourses[courseKeys[i]].type}</TableCell>
          <TableCell>{myCourses[courseKeys[i]].nameAbr}</TableCell>
          <TableCell>{myCourses[courseKeys[i]].name}</TableCell>
          <TableCell>{myCourses[courseKeys[i]].semester}</TableCell>
          <TableCell>{myCourses[courseKeys[i]].ects}</TableCell>
          <TableCell>{myCourses[courseKeys[i]].grade}</TableCell>
        </TableRow>
      )
    }
    courseElements.push(<TableRow key='blank'></TableRow>)
    return(<TableBody>{courseElements}</TableBody>)
  }

  render(){
    if (!this.state.loggedIn) return (<Redirect to="/Login"/>);
    const { classes } = this.props;
    const { token } = this.state;
    return(
      <GridContainer justify='center'>
        <GridItem xs={12} className={classes.header}>
          <Header
            brand="MultiPass"
            fixed
            color="primary"
            leftLinks={<MultiPassHeaderLinks type={token.userType}/>}
            rightLinks={<MultiPassHeaderLinks type="right"/>}
          />
        </GridItem>
        <GridItem  xs={12} className={classNames(classes.main, classes.mainRaised)}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course ID</TableCell>
                <TableCell>Course Type</TableCell>
                <TableCell>Abreviation</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>ECTS</TableCell>
                <TableCell>Grade</TableCell>
              </TableRow>
            </TableHead>
            {this.studyRecordRow()}
          </Table>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(studyRecordsPageStyle)(StudyRecordsPage);
