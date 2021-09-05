import React, { Component } from "react";
import { connect } from "react-redux";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import { Button, Form, Modal } from "react-bootstrap";
import { apiURL } from "../../../Config/Config";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
class ModalUpdateCompte extends Component {
  constructor(props) {
    super(props);
    this.birthdate = new Date(this.props.auth.user.birthdate);
    this.birthdate.setDate(this.birthdate.getDate() - 1);
    this.date = new Date(
      this.birthdate.getFullYear(),
      this.birthdate.getMonth(),
      this.birthdate.getDay()
    );
    this.state = {
      nom: this.props.auth.user.nom,
      email: this.props.auth.user.email,
      prenom: this.props.auth.user.prenom,
      day: this.birthdate.getDate(),
      month: this.birthdate.getMonth(),
      year: this.birthdate.getFullYear(),
      tel: this.props.auth.user.tel,
      password: null,
      emailExist: false,
      telExist: false,
      formdata: false,
      userId: null,
      show: false,
      updateInfo: true,
      updatePass: false,
      updatePhoto: false,
      photo: null,
      profileImg: null,
      passwordInc: false,
      oldPassword: null,
      newPassword: null,
      cofirmPassword: null,
      rongOldPass: false,
      mdpUpdated: false,
      infoUpdated: false,
    };
  }
  componentDidMount() {
    if (this.props.auth.user.image) {
      this.setState({
        profileImg: `${apiURL}/user/image/${this.props.auth.user.image}`,
      });
    }
  }
  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ profileImg: reader.result });
    };
    reader.readAsDataURL(e.target.files[0]);
    this.setState({ photo: e.target.files[0] });
  };
  cancelImg = () => {
    this.setState({
      profileImg: null,
      photo: null,
    });
  };
  savePhoto = () => {
    let data = new FormData();
    data.append("image", this.state.photo);
    fetch(apiURL + "/user/image/" + this.props.auth.user._id, {
      method: "post",
      headers: {
        authorization: `Bearer ${this.props.auth.token}`,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          let action = {};
          if (data.image !== null) {
            action = {
              type: "UPDATE_PHOTO",
              value: { image: data.image },
            };
            this.props.dispatch(action);
          } else {
            action = {
              type: "UPDATE_PHOTO",
              value: {
                image: null,
              },
            };
            this.props.dispatch(action);
          }
        }
      }).catch((err) => {console.log(err);});
    this.props.handleShowUpdate();
  };
  days = () => {
    let d = [];
    for (let i = 1; i < 32; i++) {
      d.push(i);
    }
    return d;
  };
  years = () => {
    let y = [];
    const moonLanding = new Date();
    const year = moonLanding.getFullYear();
    for (let i = year; i > 1900; i--) {
      y.push(i);
    }
    return y;
  };
  updateInfo = () => {
    this.setState({ updateInfo: true, updatePass: false, updatePhoto: false });
  };
  updatePass = () => {
    this.setState({ updateInfo: false, updatePass: true, updatePhoto: false });
  };
  updatePhoto = () => {
    this.setState({ updateInfo: false, updatePass: false, updatePhoto: true });
  };
  updateAccount = () => {
    if (this.state.nom === null || this.state.nom === "") {
      this.setState({ nom: "" });
    } else if (this.state.prenom === null || this.state.prenom === "") {
      this.setState({ prenom: "" });
    } else if (this.state.tel === null || this.state.tel === "") {
      this.setState({ tel: "" });
    } else if (this.state.email === null || this.state.email === "") {
      this.setState({ email: "" });
    } else if (this.state.password === null || this.state.password === "") {
      this.setState({ password: "" });
    } else if (this.state.day === null || this.state.day === false) {
      this.setState({ day: false });
    } else if (this.state.month === null || this.state.month === false) {
      this.setState({ month: false });
    } else if (this.state.year === null || this.state.year === false) {
      this.setState({ year: false });
    } else {
      fetch(apiURL + "/user/updateinfo/" + this.props.auth.user._id, {
        method: "post",
        headers: {
          authorization: `Bearer ${this.props.auth.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: this.state.nom,
          prenom: this.state.prenom,
          day: this.state.day,
          month: this.state.month + 1,
          year: this.state.year,
          tel: this.state.tel,
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            this.setState({ passwordInc: false });
            const user = this.props.auth.user;
            user.nom = this.state.nom;
            user.prenom = this.state.prenom;
            user.tel = this.state.tel;
            user.email = this.state.email;
            // user.birthdate=new Date()
            let action = { type: "UPDATE_USER", value: { user: user } };
            this.props.dispatch(action);
            this.setState({
              telExist: false,
              emailExist: false,
              passwordInc: false,
              infoUpdated: true,
            });
          } else if (data.status === 400) {
            if (data.erreur.emailExist) {
              this.setState({
                emailExist: true,
                telExist: false,
                passwordInc: false,
              });
            } else if (data.erreur.telExist) {
              this.setState({
                telExist: true,
                emailExist: false,
                passwordInc: false,
              });
            } else if (data.erreur.message) {
              this.setState({
                telExist: false,
                emailExist: false,
                passwordInc: true,
              });
            }
          }
        }).catch((err) => {console.log(err);});
    }
  };
  handleShowUpdate = () => {
    this.props.handleShowUpdate();
    this.setState({
      nom: this.props.auth.user.nom,
      email: this.props.auth.user.email,
      prenom: this.props.auth.user.prenom,
      day: this.birthdate.getDate(),
      month: this.birthdate.getMonth(),
      year: this.birthdate.getFullYear(),
      tel: this.props.auth.user.tel,
      password: null,
      emailExist: false,
      telExist: false,
      userId: null,
      show: false,
      photo: null,
      passwordInc: false,
      oldPassword: null,
      newPassword: null,
      cofirmPassword: null,
      rongOldPass: false,
      mdpUpdated: false,
      infoUpdated: false,
    });
  };
  updatePassword = () => {
    if (this.state.oldPassword === null || this.state.oldPassword === "") {
      this.setState({ oldPassword: "" });
    } else if (
      this.state.newPassword === null ||
      this.state.newPassword === ""
    ) {
      this.setState({ newPassword: "" });
    } else if (
      this.state.cofirmPassword === null ||
      this.state.cofirmPassword === ""
    ) {
      this.setState({ cofirmPassword: "" });
    } else if (this.state.newPassword === this.state.cofirmPassword) {
      fetch(apiURL + "/user/updatepassword/" + this.props.auth.user._id, {
        method: "post",
        headers: {
          authorization: `Bearer ${this.props.auth.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            if (data.user === "passwordIncorrect") {
              this.setState({ rongOldPass: true });
            } else {
              this.setState({
                rongOldPass: false,
                mdpUpdated: true,
                oldPassword: null,
                newPassword: null,
                cofirmPassword: null,
              });
            }
          }
        }).catch((err) => {console.log(err);});
    } else {
      this.setState({ cofirmPassword: "" });
    }
  };

  render() {
    return (
      <Modal
        size="lg"
        className="ModalUpdate"
        show={this.props.show}
        onHide={() => this.handleShowUpdate()}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <div className="ModalUpdate">
          <div className="ModalOption">
            <div onClick={() => this.updateInfo()}>Informations Personnels</div>
            <div onClick={() => this.updatePass()}>Mot de passe</div>
            <div onClick={() => this.updatePhoto()}>Photo de profile</div>
          </div>
          {this.state.updateInfo && (
            <div className="ModalUpdateContainer">
              <div className="NomPrenom">
                {this.state.nom === "" ? (
                  <p className="rongPass">Obligatoire*</p>
                ) : (
                  <p></p>
                )}
                {this.state.prenom === "" ? (
                  <p className="rongPass">Obligatoire*</p>
                ) : (
                  <p></p>
                )}
              </div>
              <div className="NomPrenom">
                <Form.Control
                  className="input"
                  type="text"
                  value={this.state.nom}
                  placeholder="Nom"
                  aria-label="nom"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    this.setState({ nom: e.target.value });
                  }}
                />

                <Form.Control
                  className="input"
                  type="text"
                  value={this.state.prenom}
                  placeholder="Prénom"
                  aria-label="prenom"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    this.setState({ prenom: e.target.value });
                  }}
                />
              </div>
              {this.state.tel === "" ? (
                <p className="rongPass">Obligatoire*</p>
              ) : (
                <p></p>
              )}
              {this.state.telExist && (
                <p className="rongPass">le numero deja existe</p>
              )}
              <Form.Control
                className="input"
                type="text"
                value={this.state.tel}
                placeholder="Numero de telephone"
                aria-label="tel"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  if (parseInt(e.target.value)) {
                    this.setState({ tel: parseInt(e.target.value) });
                  } else {
                    this.setState({ tel: "" });
                  }
                }}
              />
              {this.state.email === "" ? (
                <p className="rongPass">Obligatoire*</p>
              ) : (
                <p></p>
              )}
              {this.state.emailExist && (
                <p className="rongPass">E-mail deja existe</p>
              )}
              <Form.Control
                className="input"
                type="email"
                value={this.state.email}
                placeholder="E-mail"
                aria-label="email"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
              />

              <p className="attInput">Date de naissance</p>

              {this.state.day === false ||
              this.state.month === false ||
              this.state.year === false ? (
                <p className="rongPass">verifier la date </p>
              ) : (
                <p></p>
              )}

              <div className="DateDeNaissance">
                <Form.Select
                  value={this.state.day}
                  name="day"
                  className="select"
                  onChange={(e) => {
                    if (e.target.value) {
                      this.setState({ day: parseInt(e.target.value) });
                    } else {
                      this.setState({ day: false });
                    }
                  }}
                >
                  <option disabled="disabled" value={false} selected>
                    Jour
                  </option>
                  {this.days().map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  value={this.state.month}
                  name="month"
                  className="select"
                  onChange={(e) => {
                    if (e.target.value) {
                      this.setState({ month: parseInt(e.target.value) });
                    } else {
                      this.setState({ month: false });
                    }
                  }}
                >
                  <option disabled="disabled" value={false} selected>
                    Mois
                  </option>
                  {Months.map((month) => (
                    <option key={month} value={Months.indexOf(month)}>
                      {month}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  value={this.state.year}
                  name="year"
                  className="select"
                  onChange={(e) => {
                    if (e.target.value) {
                      this.setState({ year: parseInt(e.target.value) });
                    } else {
                      this.setState({ year: false });
                    }
                  }}
                >
                  <option disabled="disabled" value={false} selected>
                    Année
                  </option>
                  {this.years().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {this.state.password === "" ? (
                <p className="rongPass">Obligatoire*</p>
              ) : (
                <p></p>
              )}
              {this.state.passwordInc && (
                <p className="rongPass">mot de passe incorrect</p>
              )}

              <Form.Control
                className="input"
                type="password"
                placeholder="Mot de passe"
                aria-label="Password"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  if (e.target.value) {
                    this.setState({ password: e.target.value });
                  } else {
                    this.setState({ password: "" });
                  }
                }}
              />
              <p></p>
              <Button
                onClick={() => this.updateAccount()}
                variant="success"
                type="submit"
              >
                Enregistrer les modifications
              </Button>
              {this.state.infoUpdated && (
                <div className="updated">
                  <CheckCircleOutlineIcon />
                  <p>les modifications sont bien enregistrer</p>
                </div>
              )}
            </div>
          )}
          {this.state.updatePass && (
            <div className="ModalUpdateContainer">
              {this.state.oldPassword === "" ? (
                <p className="rongPass">Obligatoire*</p>
              ) : (
                <p></p>
              )}
              {this.state.rongOldPass && (
                <p className="rongPass">le mot de passe est incorrect</p>
              )}
              <Form.Control
                className="input"
                type="password"
                value={this.state.oldPassword}
                placeholder="Ancien mot de passe"
                aria-label="Password"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  this.setState({ oldPassword: e.target.value });
                }}
              />
              {this.state.newPassword === "" ? (
                <p className="rongPass">Obligatoire*</p>
              ) : (
                <p></p>
              )}
              <Form.Control
                className="input"
                type="password"
                value={this.state.newPassword}
                placeholder="nouveau mot de passe"
                aria-label="Password"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  this.setState({ newPassword: e.target.value });
                }}
              />
              {this.state.cofirmPassword === "" ? (
                <p className="rongPass">faux</p>
              ) : (
                <p> </p>
              )}
              <Form.Control
                className="input"
                type="password"
                value={this.state.cofirmPassword}
                placeholder="cofirmer le mot de passe"
                aria-label="Password"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  this.setState({ cofirmPassword: e.target.value });
                }}
              />
              <p></p>
              <Button
                onClick={() => this.updatePassword()}
                variant="success"
                type="submit"
              >
                Enregistrer le mot de passe
              </Button>
              {this.state.mdpUpdated && (
                <div className="updated">
                  <CheckCircleOutlineIcon />
                  <p>mot de passe bien enregistrer</p>
                </div>
              )}
            </div>
          )}
          {this.state.updatePhoto && (
            <div className="ModalUpdateContainer">
              <div className="pageph">
                <div className="containerup">
                  <div className="img-holder" onClick={() => this.cancelImg()}>
                    {this.state.profileImg !== null ? (
                      <img
                        src={this.state.profileImg}
                        alt=""
                        id="img"
                        className="img"
                      />
                    ) : (
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        alt=""
                        id="img"
                        className="img"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    name="image-upload"
                    id="input"
                    onChange={(e) => this.imageHandler(e)}
                  />
                  <div className="label">
                    <label className="image-upload" htmlFor="input">
                      <InsertPhotoIcon />
                      choisir votre photo
                    </label>
                  </div>
                  <Button
                    style={{ marginTop: "12px" }}
                    variant="success"
                    onClick={() => this.savePhoto()}
                  >
                    Enregistrer la photo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
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
export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateCompte);
