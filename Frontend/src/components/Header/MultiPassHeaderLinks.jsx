// Core libraries
import React from "react";
import { withStyles } from "@material-ui/core/styles";
// Components
import { Link } from "react-router-dom";
import Button from "components/CustomButtons/Button.jsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// Stylesheets
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";
// Icons
import { ExitToApp } from '@material-ui/icons';

class MultiPassHeaderLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type
    }
  }
  logout = () => {
    localStorage.removeItem('jwt');
  }
  studentLinks = () => {
    const { classes } = this.props;
    return(
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <Link to={"/my-courses"}>
            <Button
              color="transparent"
              className={classes.navLink}  
            >
            My courses
            </Button>
          </Link>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Link to={"/find-course"}>
            <Button
              color="transparent"
              className={classes.navLink}  
            >
            Find Course
            </Button>
          </Link>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Link to={"/study-records"}>
            <Button
              color="transparent"
              className={classes.navLink}  
            >
            Study Records
            </Button>
          </Link>
        </ListItem>
      </List>
    );
  }
  teacherLinks = () => {
    const { classes } = this.props;
    return(
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <Link to={"/my-courses"}>
            <Button
              color="transparent"
              className={classes.navLink}  
            >
            My courses
            </Button>
          </Link>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Link to={"/create-course"}>
            <Button
              color="transparent"
              className={classes.navLink}  
            >
            Create Course
            </Button>
          </Link>
        </ListItem>
      </List>
    );
  }
  rightLinks = () => {
    const { classes } = this.props;
    return(
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <Link to={"/login"}>
            <Button
              color="transparent"
              onClick={this.logout}
              className={classes.navLink}
            >
              Logout
              <ExitToApp className={classes.icons} />
            </Button>
          </Link>
        </ListItem>
      </List>
    );
  }
  render(){
    if (this.state.type === 'right') return(this.rightLinks());
    if (this.state.type === 'teacher') return(this.teacherLinks());
    else return(this.studentLinks());
  }
}

export default withStyles(headerLinksStyle)(MultiPassHeaderLinks);