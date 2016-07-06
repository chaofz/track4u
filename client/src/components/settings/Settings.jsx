import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Link } from 'react-router';
import http from '../../controller/appHttp';
import auth from '../../controller/auth';

const Settings = withRouter(
  class extends React.Component {
  constructor(props) {
    super(props);
    this.updateActiveLink = this.updateActiveLink.bind(this);
    this.state = {
      activeLink: 'account',
      email : {},
      err : ''
    }; 
  }

  // onAddQuery(e) {
  //   e.preventDefault();
  //   var queryToAdd = {
  //     semester: this.refs.semester.value,
  //     subject: this.refs.subject.value,
  //     courseNo: this.refs.courseNo.value
  //   };
  //   http._post('/api/queries', queryToAdd, (err, res) => {
  //     if(err) {
  //       console.log(err);
  //     } else {
  //       var updated = this.state.queries;
  //       updated.push(res);
  //       this.setState({queries: updated});
  //     }
  //   });
  // }

  updateActiveLink(link) {
    this.setState({activeLink: link});
  }

  componentWillMount() {
    auth.updateActiveLink = this.updateActiveLink;   
    auth.inDashboard(false);  
  }

  // componentWillMount(newProps, oldProps) {
  //   http._get('/api/users/me', (err, res) => {
  //     if(err) { 
  //       this.setState({err : err})
  //     } else {
  //       this.setState({profile: res});
  //       auth.profile = res;
  //     }
  //   });
  //   auth.inDashboard(false);
  // }

  render() {

    var active = {'account': '', 'social': '', 'notification': '', 'about': '' };
    active[this.state.activeLink] = 'active';
    
    return (
      <div className="settings">
        <p className="title">Settings</p>
        <div id="left-side">
          <Link className={active.account} to="/settings/account">Account</Link>
          
          <Link className={active.notification} to="/settings/notification">Notifications</Link>
          <Link className={active.about} to="/settings/about">About</Link>
        </div>
        <div id="right-side">{this.props.children}</div>
        
        {this.state.error && <div className="error">{this.state.error}</div>}
      </div>
    );
  }
});

// <Link className={active.social} to="/settings/social">Social Account</Link>

export default Settings;
