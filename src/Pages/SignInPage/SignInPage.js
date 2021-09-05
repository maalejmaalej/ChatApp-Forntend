import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { apiURL } from "../../Config/Config";
import { Button, Form } from "react-bootstrap";

class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      dataInvalid: false,
    };
  }
  checkEmail(email) {
    let re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  async signIn() {
    const exist = this.checkEmail(this.state.email)
    if (exist && this.state.password!=="") {
    fetch(apiURL + "/user/signin", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          let user = { ...data.user };
          let action = {
            type: "SET_CURRENT_USER",
            value: { token: data.token, user: user },
          };
          this.props.dispatch(action);
          this.props.history.push("/homepage");
        } else if (data.status === 400) {
          this.setState({ dataInvalid: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else{
      this.setState({ dataInvalid: true });
    }
  }

  render() {
    return this.props.auth.token ? (
      <Redirect to="/homepage" />
    ) : (
      <div>
        <div className="loginPage">
          <div className="login">
            <div className="Sign">
              <p>Connexion</p>
            </div>

            <Form.Control
              className="input"
              type="email"
              placeholder="E-mail"
              aria-label="email"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
            />
            <p></p>

            <Form.Control
              className="input"
              type="password"
              placeholder="Mot de passe"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
            />
            <div className="mdpoublie">
              <Link to="#" className="link_mdpo">
                Mot de passe oublié?
              </Link>
            </div>

            {this.state.dataInvalid ? (
              <p className="rongPass">Email or password invalid</p>
            ) : null}

            <Button
              className="botonCon"
              onClick={() => this.signIn()}
              variant="primaary"
              type="submit"
            >
              Se connecter
            </Button>

            <Button
              className="botoncre"
              onClick={() => this.props.history.push("/signup")}
              variant="primaary"
              type="submit"
            >
              Créer un compte
            </Button>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
