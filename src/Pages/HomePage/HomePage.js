import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { apiURL } from "../../Config/Config";
import DropdownProfile from "./components/DropdownProfile";
import SideBar from "./components/SideBar";
import MenuIcon from "@material-ui/icons/Menu";
import Discussion from "./components/Discussion";
import ModalUpdateCompte from "./components/ModalUpdateCompte";
import { Button, Modal } from "react-bootstrap";
import Peer from "simple-peer";
import CallEndIcon from "@material-ui/icons/CallEnd";
import MicIcon from "@material-ui/icons/Mic";
import CancelPresentationOutlinedIcon from "@material-ui/icons/CancelPresentationOutlined";
import ScreenShareOutlinedIcon from "@material-ui/icons/ScreenShareOutlined";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import VideocamOffRoundedIcon from "@material-ui/icons/VideocamOffRounded";

const socket = io(apiURL + "/connexion").connect();
const image =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: true,
      showUpdate: false,
      usersConnected: [],
      caller: false,
      signal: null,
      stream: null,
      CallAccepted: false,
      CallEnded: false,
      showCallModal: false,
      showDiscussions: true,
      clientId: null,
      showVideoCall: "none",
      videoOn: true,
      micOn: true,
      screenShared: false,
      widthDisc: "700px",
    };
    this.myVideo = React.createRef();
    this.userVideo = React.createRef();
    this.connectionRef = React.createRef();
  }
  partageEcran = () => {
    let displayMediaOptions = {
      video: {
        cursor: "always" | "motion" | "never",
        displaySurface: "application" | "browser" | "monitor" | "window",
      },
      audio: true,
    };
    navigator.mediaDevices
      .getDisplayMedia(displayMediaOptions)
      .then((stream) => {
        stream.addTrack(this.state.stream.getAudioTracks()[0]);
        this.connectionRef.current.removeStream(this.state.stream);
        this.setState({ stream: stream, screenShared: true });
        this.myVideo.current.srcObject = this.state.stream;
        this.connectionRef.current.addStream(this.state.stream);
      });
  };
  arreterPartageEcran = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getVideoTracks()[0].enabled = this.state.videoOn;
        this.connectionRef.current.removeStream(this.state.stream);
        this.setState({ stream: stream, screenShared: false });
        this.myVideo.current.srcObject = this.state.stream;
        this.connectionRef.current.addStream(this.state.stream);
      });
  };
  handleCam = () => {
    const cam = this.state.videoOn;
    if (cam) {
      this.myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
    } else {
      this.myVideo.current.srcObject.getVideoTracks()[0].enabled = true;
    }
    this.setState({ videoOn: !cam });
  };
  handleMic = () => {
    const mic = this.state.micOn;
    if (mic) {
      this.myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      this.myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
    this.setState({ micOn: !mic });
  };
  callUserVideo = (video) => {
    this.setState({
      videoOn: video,
      showVideoCall: "flex",
      widthDisc: "100%",
      caller: this.props.contact.contact,
    });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.setState({ stream: stream });
        stream.getVideoTracks()[0].enabled = video;
        this.myVideo.current.srcObject = stream;
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        });
        peer.on("error", (err) => console.error(err));
        peer.on("signal", (data) => {
          socket.emit("callUser", {
            video: video,
            from: this.props.auth.user,
            to: this.props.contact.contact,
            signal: data,
          });
        });
        socket.on("callAccepted", (data) => {
          this.setState({ CallAccepted: true });
          peer.signal(data.signal);
          peer.on("stream", (stream) => {
            this.userVideo.current.srcObject = stream;
          });
          socket.on("callEnded", () => {
            socket.off(`callUser`);
            this.setState({ CallEnded: true, stream: null });
            this.connectionRef.current.destroy();
            this.setState({ showVideoCall: "none", widthDisc: "700px" });
            this.reciveCallOn();
            socket.on("callEnded");
          });
          this.connectionRef.current = peer;
        });
      });
  };
  answerCall = () => {
    this.setState({ showVideoCall: "flex", widthDisc: "100%" });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getVideoTracks()[0].enabled = this.state.videoOn;
        this.setState({ stream: stream });
        this.myVideo.current.srcObject = stream;
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });
        peer.on("error", (err) => console.error(err));
        peer.on("signal", (data) => {
          socket.emit("answerCall", { signal: data, to: this.state.clientId });
        });
        peer.on("stream", (st) => {
          this.setState({ CallAccepted: true });
          this.userVideo.current.srcObject = st;
        });
        peer.signal(this.state.signal);
        this.connectionRef.current = peer;

        this.setState({ showCallModal: false });
      });
    socket.on(`callUser`, (data) => {
      if (this.state.caller._id === data.from._id) {
        this.setState({
          signal: data.signal,
        });
        this.connectionRef.current.on("stream", (st) => {
          this.userVideo.current.srcObject = st;
        });
        this.connectionRef.current.signal(this.state.signal);
      }
    });
    socket.on("callEnded", () => {
      socket.off(`callUser`);
      this.setState({ CallEnded: true, stream: null });
      this.connectionRef.current.destroy();
      this.setState({ showVideoCall: "none" });
      this.reciveCallOn();
      socket.on("callEnded");
    });
  };
  handleShowCallDisc = () => {
    this.setState({ showDiscussions: true });
  };
  leaveCall = () => {
    socket.off(`callUser`);
    socket.emit("callEnded", { to: this.state.caller._id });
    this.setState({ CallEnded: true, stream: null });
    this.connectionRef.current.destroy();
    this.reciveCallOn();
    this.setState({ showVideoCall: "none"});
  };
  handleShowUpdate = () => {
    const show = this.state.showUpdate;
    this.setState({ showUpdate: !show });
  };
  componentDidMount() {
    socket.emit("userConnected", this.props.auth.user._id);
    socket.on("usersConnected", (payload) => {
      this.setState({ usersConnected: [...payload] });
    });
    socket.on("msgToClient/" + this.props.auth.user._id, (payload) => {
      if (this.props.contact.contact !== null) {
        if (
          this.props.contact.contact._id === payload.from ||
          this.props.contact.contact._id === payload.to
        ) {
          let action = { type: "SEND_MESSAGE", value: { message: payload } };
          this.props.dispatch(action);
        }
      } else {
        let action = { type: "MESSAGE_NON_LU", value: { message: payload } };
        this.props.dispatch(action);
      }
    });
    this.reciveCallOn();
  }
  reciveCallOn = () => {
    socket.on(`callUser`, (data) => {
      this.setState({
        videoOn: data.video,
        showCallModal: true,
        caller: data.from,
        clientId: data.clientId,
        signal: data.signal,
      });
      socket.off(`callUser`);
    });
  };
  rejeter = () => {
    this.setState({ showCallModal: false, caller: false, signal: false });
    this.reciveCallOn();
  };
  handleshow = () => {
    const show = this.state.showSidebar;
    this.setState({ showSidebar: !show });
  };
  render() {
    return (
      <div>
        <div className="homepage">
          <SideBar
            usersConnected={this.state.usersConnected}
            show={this.state.showSidebar}
            handleShow={this.handleshow}
          />
          <div className="page">
            <div className="topbar">
              {!this.state.showSidebar ? (
                <div className="divMenuIcon">
                  <MenuIcon
                    fontSize="large"
                    className="menuIcon"
                    onClick={() => this.handleshow()}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <DropdownProfile handleShowUpdate={this.handleShowUpdate} />
            </div>
            <div className="CallDisc">
              <Discussion
                widthDisc={this.state.widthDisc}
                show={this.state.showDiscussions}
                callUser={this.callUserVideo}
              />
              <div
                className="containerVideoChat"
                style={{ display: this.state.showVideoCall }}
              >
                <div className="containerVideoChatHeader">
                  {this.state.caller ? (
                    <div>
                      {this.state.caller.prenom} {this.state.caller.nom}
                    </div>
                  ) : null}
                </div>
                <div className="video-container">
                  <div className="userVideo">
                    {this.state.CallAccepted && !this.state.CallEnded ? (
                      <video
                        playsInline
                        ref={this.userVideo}
                        autoPlay
                        style={{ width: "100%" }}
                      />
                    ) : null}
                    {this.state.caller && !this.state.CallAccepted && (
                      <div className="voiceCall">
                        <div className="imgCall">
                          {this.state.caller.image ? (
                            <img
                            alt=""
                              src={`${apiURL}/user/image/${this.state.caller.image}`}
                            />
                          ) : (
                            <img
                            alt="" src={image} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="myVideoCont">
                    <div className="myVideo">
                      {this.state.stream && (
                        <video
                          playsInline
                          muted
                          ref={this.myVideo}
                          autoPlay
                          style={{ width: "100%" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="containerVideoChatfooter">
                  <div className="containerVideoChatfooterddd">
                    {!this.state.screenShared ? (
                      <div
                        className="btnCall"
                        style={{ backgroundColor: "silver" }}
                        onClick={() => this.partageEcran()}
                      >
                        <ScreenShareOutlinedIcon />
                      </div>
                    ) : (
                      <div
                        className="btnCall"
                        style={{ backgroundColor: "gray" }}
                        onClick={() => this.arreterPartageEcran()}
                      >
                        <CancelPresentationOutlinedIcon />
                      </div>
                    )}
                    <div
                      className="btnCall"
                      style={{ backgroundColor: "silver" }}
                      onClick={() => this.handleMic()}
                    >
                      {this.state.micOn ? <MicIcon /> : <MicOffIcon />}
                    </div>
                    <div
                      className="btnCall"
                      style={{ backgroundColor: "silver" }}
                      onClick={() => this.handleCam()}
                    >
                      {this.state.videoOn ? (
                        <VideocamRoundedIcon />
                      ) : (
                        <VideocamOffRoundedIcon />
                      )}
                    </div>
                    <Button
                      variant="danger"
                      className="btnCall"
                      onClick={() => this.leaveCall()}
                    >
                      <CallEndIcon></CallEndIcon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalUpdateCompte
          handleShowUpdate={this.handleShowUpdate}
          show={this.state.showUpdate}
        />
        <Modal
          show={this.state.showCallModal}
          style={{ marginTop: "20vh" }}
          // onHide={false}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="callModalTitle"
            >
              <div className="imgNom">
                {this.state.caller.image ? (
                  <img
                  alt=""
                    className="imageContact"
                    src={`${apiURL}/user/image/${this.state.caller.image}`}
                  />
                ) : (
                  <img
                  alt=""
                    className="imageContact"
                    src={image}
                  />
                )}
              </div>
              <div>
                {this.state.caller.prenom} {this.state.caller.nom}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{display:"flex"}}>
              {this.state.caller.prenom} veut que vous participiez a l'appel 
              {!this.state.videoO&&<div style={{marginLeft:"5px"}}>video</div> }
            </div>
            <div className="callModalBtn">
              <Button
                variant="danger"
                onClick={() => {
                  this.rejeter();
                }}
              >
                Rejeter
              </Button>
              <Button variant="success" onClick={() => this.answerCall()}>
                Participer
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
