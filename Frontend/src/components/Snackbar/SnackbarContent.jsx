import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Snack from  "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton"
import Close from "@material-ui/icons/Close";
// nodejs library to set properties for components
import PropTypes from "prop-types";

import snackbarContentStyle from "assets/jss/material-kit-react/components/snackbarContentStyle.jsx";

class SnackbarContent extends React.Component {
  constructor(props) {
    super(props);
    this.closeAlert = this.closeAlert.bind(this);
    const { classes, text, color, close, icon } = props;
    var action = [];
    if (close !== undefined) {
      action = [
        <IconButton
          className={classes.iconButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={this.closeAlert}
        >
          <Close className={classes.close} />
        </IconButton>
      ];
    }
    this.state = {
      alert: (
        <Snack
          message={
            <div>
              {icon !== undefined ? (
                <props.icon className={classes.icon} />
              ) : null}
              {text}
              {close !== undefined ? action : null}
            </div>
          }
          classes={{
            root: classes.root + " " + classes[color],
            message: classes.message + " " + classes.container
          }}
        />
      )
    };
  }
  closeAlert() {
    this.setState({ alert: null });
  }
  render() {
    return this.state.alert;
  }
}

SnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.func
};

export default withStyles(snackbarContentStyle)(SnackbarContent);
