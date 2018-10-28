// Core libraries
import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import { IsLoggedIn, GetMyCourseData } from "../../scripts/appService";
import jsonwebtoken from "jsonwebtoken";
// Components
import { Redirect } from 'react-router-dom';
import Header from "components/Header/Header.jsx";
import MultiPassHeaderLinks from "components/Header/MultiPassHeaderLinks.jsx";
import MyCourses from './MyCourses';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem";
// Stylesheets
import myCoursesPageStyle from "assets/jss/material-kit-react/views/myCoursesPageStyle.jsx";

class MyCoursesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      content: "something",
      token: jsonwebtoken.decode(localStorage.getItem('jwt'))
    };
  }

  async componentWillMount(){
    const userState = await IsLoggedIn();
    if (this.state.loggedIn !== userState) this.setState({loggedIn: userState});
    // Fetch course data
    const response = await GetMyCourseData();
    if (response.status === 200) {
      const data = await response.json();
      this.setState({ courseData: data.courses });
    }
  }

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
          <MyCourses courseData={this.state.courseData} courseCardType={token.userType}/>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(myCoursesPageStyle)(MyCoursesPage);