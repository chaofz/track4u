import React from 'react';
import ReactDOM from 'react-dom';
import http from '../../controller/appHttp';
import auth from '../../controller/auth';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.onShowModal = this.onShowModal.bind(this);
    this.state = {
      profile: {},
      err: '',
      oldPassErr: false,
      newPassErr: false,
      newPassrpErr: false,
      showModal: false
    }
  }

  componentDidMount(newProps, oldProps) {
    http._get('/api/users/me', (err, res) => {
      if(err) { 
        this.setState({err : err})
      } else {
        this.setState({profile: res});
      }
    });
  }

  componentWillMount() {
    auth.updateActiveLink('account');
  }

  onShowModal(e) {
    this.setState({showModal: true});
  }

  render() {
    return (
      <div className="local">
        <table>
          <tr>
            <td className="item">Email:</td>
            <td>{this.state.profile.local && this.state.profile.local.email}</td>
          </tr>
          <tr>
            <td className="item">Password:</td>
            <td>{this.state.profile.local && <span>********<i onClick={this.onShowModal} className="fa fa-pencil-square-o"></i></span>}</td>
          </tr>
        </table>
        <Modal show={this.state.showModal}/>
      </div>
    );
  }
};

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    
    this.state = {
      err: '',
      msg: '',
      exit: true,
      oldPassErr: false,
      newPassErr: false,
      newPassrpErr: false
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const oldPass = this.refs.oldPass.value;
    const newPass = this.refs.newPass.value;
    const newPassrp = this.refs.newPassrp.value;
    if(this.validateInputs(oldPass, newPass, newPassrp)) {
      auth.changePass(oldPass, newPass, newPassrp, (err) => {
        if(err) {
          return this.setState({ err: err.message });
        } else {
          this.setState({msg: 'You have changed your password!'});
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({exit: !nextProps.show});
  }

  exitModal(e) {
    this.setState({exit: true});
  }

  validateInputs(oldPass, newPass, newPassrp) {
    if(!oldPass) {
      this.setState({err : 'Please enter the old password.', oldPassErr: true});
    } else if(!newPass) {
      this.setState({err : 'Please enter the new password.', newPassErr: true});
    } else if(!newPassrp) {
      this.setState({err : 'Please verify the password.', newPassrpErr: true});
    } else if(newPass !== newPassrp) {
      this.setState({err : 'Failed to verify the password.', newPassErr: true, newPassrpErr: true});
    } else {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className={"model-full " + (this.state.exit ? "exit" : "")}>
        <div className="model-dialog">
          <p className="title">Reset Password</p>
          <div className="login-form">
            <input type="password" className={this.state.oldPassErr && "err"} onChange={this.onChange} ref='oldPass' placeholder="Old password" />
            <input type="password" className={this.state.newPassErr && "err"} onChange={this.onChange} ref='newPass' placeholder="New Password" />
            <input type="password" className={this.state.newPassrpErr && "err"} onChange={this.onChange} ref='newPassrp' placeholder="Confirm New Password" />
            {this.state.err && <p className="signin-err">{this.state.err}</p>}
            {this.state.msg && <p className="signin-msg">{this.state.msg}</p>}
            <button id="signin" onClick={this.handleSubmit}>Submit</button>
            <button id="cancel" onClick={this.exitModal}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}
