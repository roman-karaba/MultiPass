// Core modules
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// Components
import { Divider, Typography } from '@material-ui/core';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CourseCard from "components/CourseCard/CourseCard.jsx";

// StyleSheets
import myCoursesStyle from "assets/jss/material-kit-react/views/myCoursesStyle.jsx";

const tooltipCard = {
  id: "Course ID",
  type: "Type",
  nameAbr: "Name Abreviation",  
  name: "Course Name",
  studentCount: "Student Count",
  semester: "Course Semester",
  ects: "ECTS"
};

class MyCourses extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render(){
    const { classes, courseData } = this.props;
    return (
      <GridContainer spacing={16} className={classes.content}>
        <GridItem xs={12}>
          <Typography variant="display1">My Courses</Typography>
          <Divider />
        </GridItem>
          <CourseCard course={tooltipCard} tableDescription style={{backgroundColor: "rgb(53, 224, 172)"}}/>
          {
            courseData !== undefined ? 
            courseData.map((obj, i) => <CourseCard course={obj.course} key={i} courseCardType={this.props.courseCardType}/>) : null
          }
      </GridContainer>
    );
  }
}

export default withStyles(myCoursesStyle)(MyCourses);

