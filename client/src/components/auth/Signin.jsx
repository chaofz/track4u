import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router';
import http from '../../controller/appHttp';
import auth from '../../controller/auth';

const Signin = withRouter(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
      this.validateInputs = this.validateInputs.bind(this);
      this.state = {
        err: '',
        emailErr: false,
        passwordErr: false
      }
    }

    handleSubmit(e) {
      e.preventDefault();
      const email = this.refs.email.value;
      const password = this.refs.password.value;
      if(this.validateInputs(email, password)) {
        auth.login(email, password, (err, res) => {
          if(err) {
            return this.setState({ err: err.message, emailErr: true, passwordErr: true });
          }
          auth.redirectTo(this, "/dashboard");
        });
      }
    }

    onChange(e) {
      this.setState({err: '', emailErr: false, passwordErr: false});
    }

    validateInputs(email, password) {
      if(!email) {
        this.setState({err : 'Please enter the email.', emailErr: true});
      } else if(!password) {
        this.setState({err : 'Please enter the password.', passwordErr: true});
      } else {
        return true;
      }
      return false;
    }

    componentDidMount(){
      ReactDOM.findDOMNode(this.refs.email).focus();
    }

    render() {
      return (
        <div className="auth">
          <p className="title">Sign In</p>
            <form className="login-form" onSubmit={this.handleSubmit}>
              <input type="text" className={this.state.emailErr && "err"} onChange={this.onChange} ref='email' placeholder="Email" />
              <input type="password" className={this.state.passwordErr && "err"} onChange={this.onChange} ref='password' placeholder="Password" />
              {this.state.err && <p className="signup-err">{this.state.err}</p>}
              <button id="signin" type="submit">Sign in</button>
            </form>
            <p id="acnt-hint">Don't have an account? <Link to='/signup'>Creat one!</Link></p>

        </div>
      );
    }
  }
);
            // <p id="oauth">
            //   Sign in with <i className="fa fa-google-plus-square"></i><i className="fa fa-facebook-square"></i>
            // </p>

export default Signin;
