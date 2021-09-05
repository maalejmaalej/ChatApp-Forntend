import React, { Component } from "react";
import { Dropdown, Button, Offcanvas } from "react-bootstrap";
import { connect } from "react-redux";
import { apiURL } from "../../../Config/Config";
import io from "socket.io-client";

const socket = io(apiURL+"/connexion").connect();

const image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
// const socket = io(apiURL);
class DropdownProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  desconnect = () => {
    let action = {
      type: "LOGOUT",
    };
    this.props.dispatch(action);
    socket.emit("userDisconnected", this.props.auth.user._id);
    action = { type: "CLOSE" };
    this.props.dispatch(action);
  };
  handleShow = () => {
    const show = this.state.show;
    this.setState({ show: !show });
  };

  render() {
    return (
            <Dropdown>
              <Dropdown.Toggle
                className="dropdownProfile"
                variant="succeses"
                id="dropdown-basic"
              >
                <div className="photoProfile">
                  {this.props.auth.user.image ? (
                    <img
                      className="imgProfile"
                      src={`${apiURL}/user/image/${this.props.auth.user.image}`}
                    ></img>
                  ) : (
                    <img
                      className="imgProfile"
                      src={image}
                    ></img>
                  )}
                </div>
                <div className="nomProfile">{this.props.auth.user.prenom}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() =>this.props.handleShowUpdate()}>Modifier votre profile</Dropdown.Item>
                <Dropdown.Item onClick={() => this.desconnect()}>
                  Deconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    },
  };
};
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownProfile);