import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router';
import auth from '../../controller/auth.js';

const Signup = withRouter(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.validateInputs = this.validateInputs.bind(this);
      this.onChange = this.onChange.bind(this);
      this.state = {
        err: '',
        emailErr: false,
        passwordErr: false,
        passwordrpErr: false
      }
    }

    handleSubmit(e) {
      e.preventDefault();
      const email = this.refs.email.value;
      const password = this.refs.password.value;
      const passwordrp = this.refs.passwordrp.value;
      if(this.validateInputs(email, password, passwordrp)) {
        auth.register(email, password, passwordrp, (err, res) => {
          if(err) {
            return this.setState({ err: err.message });
          } else {
            auth.redirectTo(this, '/dashboard');
          }
        });
      }
    }

    onChange(e) {
      this.setState({err: '', emailErr: false, passwordErr: false, passwordrpErr: false});
    }

    validateInputs(email, password, passwordrp) {
      if(!email) {
        this.setState({err : 'Please enter the email.', emailErr: true});
      } else if(!password) {
        this.setState({err : 'Please enter the password.', passwordErr: true});
      } else if(!passwordrp) {
        this.setState({err : 'Please verify the password.', passwordrpErr: true});
      } else if(!auth.validateEmail(email)) {
        this.setState({err : 'Invalid email address.', emailErr: true});
      } else if(password !== passwordrp) {
        this.setState({err : 'Failed to verify the password.', passwordErr: true, passwordrpErr: true});
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
          <p className="title">Sign Up</p>
            <form className="login-form" onSubmit={this.handleSubmit}>
              <input type="text" className={this.state.emailErr && "err"}  onChange={this.onChange} ref='email' placeholder="Email" />
              <input type="password" className={this.state.passwordErr && "err"}  onChange={this.onChange} ref='password' placeholder="Password" />
              <input type="password" className={this.state.passwordrpErr && "err"}  onChange={this.onChange} ref='passwordrp' placeholder="Confirm Password" />
              {this.state.err && <p className="signin-err">{this.state.err}</p>}
              <button id="signin" type="submit">Sign up</button>
            </form>
            <p id="acnt-hint">Already have an account? <Link to='/signin'>Sign in</Link></p>

        </div>
      );
    }
  }
);

            // <p id="oauth">
            //   Sign up with <a href='/auth/google'><i className="fa fa-google-plus-square"></i></a>
            //   <a href='/auth/facebook'><i className="fa fa-facebook-square"></i></a>
            // </p>

export default Signup;
