// Core libraries
import React from "react";
import { Link, Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { Login, IsLoggedIn } from "../../scripts/appService";
// UI Components
import InputAdornment from "@material-ui/core/InputAdornment";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { Error } from "components/Snackbar/snackbarTypes";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
// Stylesheets
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg-faculty.jpg";
// @material-ui/icons
import LockOutline from "@material-ui/icons/LockOutline";
import People from "@material-ui/icons/People";


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      formData: {},
      loggedIn: false,

      snackbarMessageType: "",
      snackbarType: "",
      snackbarMessage: "",
      snackbarOpen: false,
    };
  }

  async componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      300
    );
  }

  async componentWillMount () {
    const userState = await IsLoggedIn();
    if (this.state.loggedIn !== userState) this.setState({loggedIn: userState});
  }

  handleChange = name => ({ target: { value } }) => {
    const newState = Object.assign({}, this.state);
    newState.formData[name] = value;
    this.setState(newState);
  }

  requestLogin = async () => {
    try {
      const response = await Login(this.state.formData);
      if (response.status === 500) {
        this.popSnackbar(Error, 'Server is offline');
        return;
      }
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('jwt', data.jwt);
        this.props.history.push({
          pathname: "/my-courses"
        });
      } else if (response.status === 400) {
        this.popSnackbar(Error, data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Snackbar and its handlers
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

  render() {
    if (this.state.loggedIn) return(<Redirect to="/my-courses"/>);
    const { classes } = this.props;
    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container} >
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Login</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="UserID / Matricualtion ID"
                        id="first"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handleChange('matriculationId'),
                          type: "text",
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor}/>
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="pass"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handleChange('password'),
                          type: "password",
                          endAdornment: (
                            <InputAdornment position="end">
                              <LockOutline className={classes.inputIconsColor}/>
                            </InputAdornment>
                          )
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button 
                          simple
                          color="primary"
                          size="lg" 
                          onClick={this.requestLogin}
                        >
                        Login
                      </Button>
                      <Link to={"/sign-up"}> 
                        <Button simple color="primary" size="lg">
                          Signup
                        </Button>
                      </Link>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
            {this.notificationSnack()}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
