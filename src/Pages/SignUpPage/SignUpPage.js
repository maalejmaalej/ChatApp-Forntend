import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { Link, Redirect } from "react-router-dom";
import { apiURL } from "../../Config/Config";
import { Button, Form } from "react-bootstrap";
import ModalImage from "./ModalImage";

const socket = io(apiURL);
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
class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nom: null,
      email: null,
      prenom: null,
      day: null,
      month: null,
      year: null,
      tel: null,
      password: null,
      emailExist: false,
      telExist: false,
      formdata: false,
      userId:null,
      show:false,
    };
  }
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
  async signUp() {
    if (this.state.nom === null || this.state.nom === false) {
      this.setState({ nom: false });
    } else if (this.state.prenom === null || this.state.prenom === false) {
      this.setState({ prenom: false });
    } else if (this.state.tel === null || this.state.tel === false) {
      this.setState({ tel: false });
    } else if (this.state.email === null || this.state.email === false) {
      this.setState({ email: false });
    } else if (this.state.password=== null || this.state.password === false) {
      this.setState({ password: false });
    } else if (this.state.day === null || this.state.day === false) {
      this.setState({ day: false });
    } else if (this.state.month === null || this.state.month === false) {
      this.setState({ month: false });
    } else if (this.state.year === null || this.state.year === false) {
      this.setState({ year: false });
    } else {
      fetch(apiURL + "/user", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: this.state.nom,
          prenom: this.state.prenom,
          day: this.state.day,
          month: this.state.month,
          year: this.state.year,
          tel: this.state.tel,
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            this.setState({userId: data.user._id});
            this.setState({show:true})
          } else if (data.status === 400) {
            if (data.erreur.emailExist) {
              this.setState({ emailExist: true, telExist: false });
            } else if (data.erreur.telExist) {
              this.setState({ telExist: true, emailExist: false });
            }
          }
        }).catch((err) => {console.log(err);});
    }
  }
  goToLogin=()=>{
    this.props.history.push("/signin")
  }
  render() {
    return (
      this.props.auth.token ? <Redirect to="/homepage" /> :
      <div className="loginPage">
        <div className="signup">
          <p className="Sign">S’inscrire</p>
          <div className="NomPrenom">
          {this.state.nom === false ? (
              <p className="rongPass">Obligatoire*</p>
            ): <p></p>}
            {this.state.prenom === false ? (
              <p className="rongPass">Obligatoire*</p>
            ):<p></p>}
          </div>
          <div className="NomPrenom">
            <Form.Control
              className="input"
              type="text"
              placeholder="Nom"
              aria-label="nom"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                if (e.target.value) {
                  this.setState({ nom: e.target.value });
                } else {
                  this.setState({ nom: false });
                }
              }}
            />

            <Form.Control
              className="input"
              type="text"
              placeholder="Prénom"
              aria-label="prenom"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                if (e.target.value) {
                  this.setState({ prenom: e.target.value });
                } else {
                  this.setState({ prenom: false });
                }
              }}
            />
          </div>
          {this.state.tel === false ? (
              <p className="rongPass">Obligatoire*</p>
            ): <p></p>}
          {this.state.telExist &&(
            <p className="rongPass">le numero deja existe</p>
          )}
          <Form.Control
            className="input"
            type="text"
            placeholder="Numero de telephone"
            aria-label="tel"
            aria-describedby="basic-addon1"
            onChange={(e) => {
              if (e.target.value) {
                this.setState({ tel: parseInt(e.target.value) });
              } else {
                this.setState({ tel: false });
              }
              
            }}
          />
          {this.state.email === false ? (
              <p className="rongPass">Obligatoire*</p>
            ): <p></p>}
          {this.state.emailExist && (
            <p className="rongPass">E-mail deja existe</p>
          )}
          <Form.Control
            className="input"
            type="email"
            placeholder="E-mail"
            aria-label="email"
            aria-describedby="basic-addon1"
            onChange={(e) => {
              if (e.target.value) {
                this.setState({ email: e.target.value });
              } else {
                this.setState({ email: false });
              }
              
            }}
          />
          {this.state.password === false ? (
              <p className="rongPass">Obligatoire*</p>
            ): <p></p>}
          
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
                this.setState({ password: false });
              }
            }}
          />
          <p className="attInput">Date de naissance</p>
          
          {(this.state.day === false || this.state.month === false || this.state.year === false)? (
              <p className="rongPass">verifier la date </p>
            ): <p></p>}
          
          <div className="DateDeNaissance">
            <Form.Select
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
                <option key={month} value={Months.indexOf(month) + 1}>
                  {month}
                </option>
              ))}
            </Form.Select>
            <Form.Select
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
          {/* {formData} */}

          <p></p>
          <Button
            className="botonCon"
            onClick={() => this.signUp()}
            variant="primary"
            type="submit"
          >
            Créer un compte
          </Button>
          <Button
            className="botoncre"
            onClick={() => this.props.history.push("/signin")}
            variant="primaary"
            type="submit"
          >
            Vous avez deja un compte
          </Button>
          <ModalImage goToLogin={this.goToLogin} show={this.state.show} userId={this.state.userId}/>
        </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
