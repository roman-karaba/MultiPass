// Core libraries
import React from "react";
import { Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { SignUp, IsLoggedIn } from "../../scripts/appService";
// UI Components
import InputAdornment from "@material-ui/core/InputAdornment";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from 'components/Snackbar/SnackbarContent'
import { Error, Success } from "components/Snackbar/snackbarTypes";
// Stylesheets
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg-faculty.jpg";
// @material-ui/icons
import LockOutline from "@material-ui/icons/LockOutline";
import People from "@material-ui/icons/People";


class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      formData: {
        firstName: '',
        lastName: '',
        matriculationId: '',
        password: '',
        passwordConfirm: '',
      }
    };
  }

  async componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      300
    );
    const userState = await IsLoggedIn();
    if (this.state.loggedIn !== userState) this.setState({loggedIn: userState});
  }

  handleChange = name => ({ target: { value } }) => {
    const newState = Object.assign({}, this.state);
    newState.formData[name] = value;
    this.setState(newState);
  }

  requestSignup = async (type) => {
    try{
      const formData = Object.assign({}, this.state.formData);
      for (const value in formData) {
        if (formData[value] === "") {
          this.popSnackbar(Error, 'All fields must not be blank');
          return;
        }
      }

      if (formData.password !== formData.passwordConfirm) {
        this.popSnackbar(Error, 'Password mismatch')
        return;
      }

      delete formData.passwordConfirm;
      formData.userType = type;
      const response = await SignUp(formData, type);
      const data = await response.json();
      if (response.status === 200) {
        this.popSnackbar(Success, 'Signup Successful!');
        setTimeout(() => {this.props.history.push('/')}, 2000);
        // this.props.history.push('/');
      } else if (response.status === 409) {
        this.popSnackbar(Error, data.message);
      } else {
        this.popSnackbar(Error, 'Oops, something went wrong!');
      }
    } catch (err) {
      // console.log(err);
    }
  };

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
  };

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
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={5}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>SignUp</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="UserID / Matricualtion ID"
                        id="first"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange:this.handleChange('matriculationId'),
                          type: "text",
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor}/>
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="First Name"
                        id="firstName"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handleChange('firstName'),
                          type: "text",
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor}/>
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Last Name"
                        id="lastName"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handleChange('lastName'),
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
                      <CustomInput
                        labelText="Confirm Password"
                        id="passconf"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: this.handleChange('passwordConfirm'),
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
                      <Button simple color="primary" size="lg" onClick={this.requestSignup.bind(this, 'student')}>
                        Submit (Student)
                      </Button>
                      <Button simple color="primary" size="lg" onClick={this.requestSignup.bind(this, 'teacher')}>
                        Submit (Teacher)
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
              {this.notificationSnack()}
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(SignupPage);
