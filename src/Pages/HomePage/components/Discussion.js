import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { apiURL } from "../../../Config/Config";
import CloseIcon from "@material-ui/icons/Close";
import CallIcon from "@material-ui/icons/Call";
import VideocamIcon from "@material-ui/icons/Videocam";
import { Form } from "react-bootstrap";
import SendIcon from "@material-ui/icons/Send";
import Picker from "emoji-picker-react";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { io } from "socket.io-client";

const socket = io(apiURL + "/connexion").connect();
const image =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

class Duscussion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      discussion: [],
      page: 2,
      showPicker: false,
      oldDiscussion: [],
      showMoreMsg: true,
    };
  }

  closeDisc = () => {
    let action = { type: "CLOSE" };
    this.props.dispatch(action);
  };
  showOldMessage = () => {
    fetch(
      apiURL +
        `/messages/discussion/${this.props.auth.user._id}/${this.props.contact.contact._id}?page=${this.state.page}`,
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
          const disc = this.state.oldDiscussion;
          const p = this.state.page;
          this.setState({
            oldDiscussion: [...disc, ...data.duscussion],
            page: p + 1,
            showMoreMsg: true,
          });
          if (data.duscussion.length < 30) {
            this.setState({ showMoreMsg: false });
          }
        }
      })
      .catch((error) => console.log(error));
  };
  componentDidMount() {
    if (this.props.contact.contact !== null) {
      if (this.props.contact.discussion.length < 30) {
        this.setState({ showMoreMsg: false });
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.contact.contact !== null &&
      this.props.contact.contact !== null
    ) {
      if (this.props.contact.contact._id !== prevProps.contact.contact._id) {
        this.setState({
          oldDiscussion: [],
          page: 2,
          showMoreMsg: true,
        });
        if (this.props.contact.discussion.length < 30) {
          this.setState({ showMoreMsg: false });
        }
      }
    }
    if (
      prevProps.contact.contact === null &&
      this.props.contact.contact !== null
    ) {
      this.setState({
        oldDiscussion: [],
        page: 2,
        showMoreMsg: true,
      });
      if (this.props.contact.discussion.length < 30) {
        this.setState({ showMoreMsg: false });
      }
    }
  }
  envoyerMessage = () => {
    if (this.state.message !== null && this.state.message !== "") {
      fetch(apiURL + "/messages", {
        method: "post",
        headers: {
          authorization: `Bearer ${this.props.auth.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.props.auth.user._id,
          to: this.props.contact.contact._id,
          message: this.state.message,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            let action = {
              type: "SEND_MESSAGE",
              value: { message: data.message },
            };
            this.props.dispatch(action);
            socket.emit("msgtoserver", data.message);
            this.setState({ message: "", showPicker: false });
          }
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    return this.props.contact.contact && this.props.show ? (
      <div style={{ width: "50%" }}>
        <div className="discussion">
          <div className="discussionHeader">
            <div className="discussionName">
              <div className="photoProfile">
                {this.props.contact.contact.image ? (
                  <img
                    className="imgProfile"
                    src={`${apiURL}/user/image/${this.props.contact.contact.image}`}
                  ></img>
                ) : (
                  <img className="imgProfile" src={image}></img>
                )}
              </div>
              {this.props.contact.contact.nom}{" "}
              {this.props.contact.contact.prenom}
            </div>
            <div className="discussionIconsHed">
              <div
                className="dischoverIcon"
                onClick={() => this.props.callUser(true)}
              >
                <VideocamIcon fontSize="large" />
              </div>
              <div className="dischoverIcon">
                <CallIcon
                  fontSize="large"
                  onClick={() => this.props.callUser(false)}
                />
              </div>
              <div onClick={() => this.closeDisc()} className="dischoverIcon">
                <CloseIcon fontSize="large" />
              </div>
            </div>
          </div>

          <div className="Messages">
            {this.state.showPicker && (
              <div className="picker">
                <Picker
                  onEmojiClick={(e, emojiObject) => {
                    const msg = this.state.message + emojiObject.emoji;
                    this.setState({ message: msg });
                  }}
                  preload={true}
                  disableSearchBar={true}
                />
              </div>
            )}
            {this.props.contact.discussion
              ? [...this.props.contact.discussion].map((message) => {
                  if (message.from === this.props.auth.user._id) {
                    return (
                      <div
                        ref={(el) => {
                          this.messagesEnd = el;
                        }}
                        key={message._id}
                        className="send"
                      >
                        <div className="msg">
                          <p>{message.message}</p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        // ref={(el) => {
                        //   this.messagesEnd = el;
                        // }}
                        key={message._id}
                        className="recive"
                      >
                        <div className="photoProfile">
                          {this.props.contact.contact.image ? (
                            <img
                              className="imgProfile"
                              src={`${apiURL}/user/image/${this.props.contact.contact.image}`}
                            ></img>
                          ) : (
                            <img className="imgProfile" src={image}></img>
                          )}
                        </div>
                        <div className="msg">
                          <p>{message.message}</p>
                        </div>
                      </div>
                    );
                  }
                })
              : null}
            {this.state.oldDiscussion.map((message) => {
              if (message.from === this.props.auth.user._id) {
                return (
                  <div
                    ref={(el) => {
                      this.messagesEnd = el;
                    }}
                    key={message._id}
                    className="send"
                  >
                    <div className="msg">
                      <p>{message.message}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    // ref={(el) => {
                    //   this.messagesEnd = el;
                    // }}
                    key={message._id}
                    className="recive"
                  >
                    <div className="photoProfile">
                      {this.props.contact.contact.image ? (
                        <img
                          className="imgProfile"
                          src={`${apiURL}/user/image/${this.props.contact.contact.image}`}
                        ></img>
                      ) : (
                        <img className="imgProfile" src={image}></img>
                      )}
                    </div>
                    <div className="msg">
                      <p>{message.message}</p>
                    </div>
                  </div>
                );
              }
            })}
            {this.state.showMoreMsg && (
              <div className="showMore" onClick={() => this.showOldMessage()}>
                Voir les anciens message
              </div>
            )}
          </div>
          <div className="discussionFooterContainer">
            <div
              className="EmojiHandle"
              onClick={() => {
                let sh = this.state.showPicker;
                this.setState({ showPicker: !sh });
              }}
            >
              <EmojiEmotionsIcon fontSize="large" />
            </div>
            <form className="discussionFooter">
              <Form.Control
                className="inputMessage"
                type="text"
                placeholder="Ecrire un message..."
                aria-label="message"
                aria-describedby="basic-addon1"
                value={this.state.message}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    this.envoyerMessage();
                  }
                }}
                onChange={(e) => {
                  this.setState({ message: e.target.value });
                }}
              />

              <div
                type="submit"
                onClick={() => this.envoyerMessage()}
                className="dischoverIcon"
              >
                <SendIcon fontSize="large" />
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ height: "93vh" }}></div>
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
    contact: state.contact,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Duscussion);
