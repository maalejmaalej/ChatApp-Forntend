import React, { Component } from "react";
import { connect } from "react-redux";
import { apiURL } from "../../../Config/Config";
import MenuIcon from "@material-ui/icons/Menu";


const image =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastMessage: null,
      lastMessageFrom: null,
      discussion: [],
    };
  }
  showDiscussions = (user) => {
    fetch(
      apiURL +
        `/messages/discussion/${this.props.auth.user._id}/${user._id}?page=1`,
      {
        method: "get",
        headers: {
        authorization: `Bearer ${this.props.auth.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          let action = {
            type: "SET_CONTACT",
            value: { contact: user, discussion: data.duscussion },
          };
          this.props.dispatch(action);
          action = {
            type: "CLEAR_NOTIF",
            value: { id: user._id },
          };
          this.props.dispatch(action);
        }
      })
      .catch((error) => console.log(error));
  };
  getLastmsg = (user, disp) => {
    this.setState({ lastMessage: null, lastMessageFrom: null });
    fetch(
      apiURL + `/messages/lastmsg/${this.props.auth.user._id}/${user._id}`,
      {
        method: "get",
        headers: {
        authorization: `Bearer ${this.props.auth.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          this.setState({
            lastMessage: data.lastMessage.message,
            lastMessageFrom: data.lastMessage.from,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      this.props.show && (
        <div className="sidebar" style={{marginLeft:{}}}>
          <div className="topSidebar">
            <div className="divMenuIcon">
              <MenuIcon
                fontSize="large"
                className="menuIcon"
                onClick={() => this.props.handleShow()}
              />
            </div>
          </div>
          <div className="contacts">
            <div className="contacttext">
              <p>Vos Contacts</p>
            </div>
            {this.props.usersConnected.map(
              (user) =>
                this.props.auth.user._id !== user._id && (
                  <div className="contact" key={user._id}>
                    <div
                      onMouseEnter={() => this.getLastmsg(user)}
                      onClick={() => this.showDiscussions(user)}
                      className="amis"
                    >
                      {this.state.lastMessageFrom ? (
                        <div className="LastMessage">
                          {this.state.lastMessageFrom ===
                          this.props.auth.user._id ? (
                            <div>
                              Moi :
                              {this.state.lastMessage.length >= 15 ? (
                                <div>
                                  {this.state.lastMessage.slice(0, 14)}...
                                </div>
                              ) : (
                                <div>{this.state.lastMessage}</div>
                              )}
                            </div>
                          ) : (
                            <div>
                              {user.nom} :{" "}
                              {this.state.lastMessage.length >= 12 ? (
                                <div>
                                  {this.state.lastMessage.slice(0, 11)}...
                                </div>
                              ) : (
                                <div>{this.state.lastMessage}</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <div className="imgNom">
                        {user.image ? (
                          <img
                            className="imageContact"
                            src={`${apiURL}/user/image/${user.image}`}
                          />
                        ) : (
                          <img className="imageContact" src={image}></img>
                        )}

                        <div>
                          {user.prenom} {user.nom}
                        </div>
                        {this.props.notifMessage[user._id] ? (
                          <div className="msgNonLu"></div>
                        ) : null}
                      </div>
                      {user.active ? (
                        <div className="active"> </div>
                      ) : (
                        <div className="active" style={{ opacity: "0%" }}>
                        </div>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )
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
    notifMessage: state.notifMessage.notifMessage,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
