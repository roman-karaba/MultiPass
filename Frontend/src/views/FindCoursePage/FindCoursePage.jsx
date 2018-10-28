// Core libraries
import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import { IsLoggedIn, GetAllCourseData } from "../../scripts/appService";
import jsonwebtoken from "jsonwebtoken";
// Components
import { Redirect } from 'react-router-dom';
import {
  Typography, Divider
} from "@material-ui/core";
import Header from "components/Header/Header.jsx";
import MultiPassHeaderLinks from "components/Header/MultiPassHeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CourseCard from "components/CourseCard/CourseCard.jsx";
// Stylesheets
import findCoursePageStyle from "../../assets/jss/material-kit-react/views/findCoursePageStyle";

const tooltipCard = {
  id: "Course ID",
  type: "Type",
  nameAbr: "Name Abreviation",  
  name: "Course Name",
  studentCount: "Student Count",
  semester: "Course Semester",
  ects: "ECTS"
};

class FindCoursePage extends React.Component {
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
    // Fetch course data
    try { 
      const response = await GetAllCourseData();
      if (response.status === 200) {
        const data = await response.json();
        this.setState({ courseData: data.courses });
      }
    } catch (error) {
      console.error('Could not get course data');
    }
  }

  displayCourses = () => {
    const { classes } = this.props;
    const { courseData } = this.state;
    return(
      <GridContainer spacing={16} className={classes.content}>
        <GridItem xs={12}>
          <Typography variant="display1">Find Course</Typography>
          <Divider />
        </GridItem>
        <CourseCard course={tooltipCard} tableDescription/>
          {
            courseData !== undefined ? 
            courseData.map((obj, i) => <CourseCard
              course={obj.course} key={i}
              courseCardType="all"
            />) : null
          }
      </GridContainer>
    );
  };

  render() {
    if (!this.state.loggedIn) return (<Redirect to="/Login"/>);
    const { classes } = this.props;
    const { token } = this.state;
    
    return (
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
          {this.displayCourses()}
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(findCoursePageStyle)(FindCoursePage);