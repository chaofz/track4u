import React from 'react';
import { browserHistory, Link } from 'react-router';
import auth from '../../controller/auth';
import Welcome from './Welcome.jsx';

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.updateAuth = this.updateAuth.bind(this);
    this.inDashboard = this.inDashboard.bind(this);
    this.state = { 
      loggedIn: auth.loggedIn(),
      inDashboard: false
     };
  }

  updateAuth(loggedIn) {
    this.setState({ loggedIn : loggedIn });
  }

  inDashboard(inDashboard) {
    this.setState({ inDashboard : inDashboard });
  }

  componentWillMount() {
    auth.onChange = this.updateAuth;
    auth.inDashboard = this.inDashboard;
  }

  render() {
    const loggedIn = this.state.loggedIn;
    const inDashboard = this.state.inDashboard;
    var ul = (
      <ul>
        <li className="brand"><Link to="/">Track4U</Link></li>
        <li className="pull-right-down">
          {(loggedIn && !inDashboard) && <Link to="/dashboard">Dashboard</Link>}
          {(loggedIn && inDashboard) && <Link to="/settings">Settings</Link>}
          {loggedIn && <Link to="/logout" className="warning">Logout</Link>}
          {!loggedIn && <Link to="/signin">Sign in</Link>}
          {!loggedIn && <Link to="/signup">Sign up</Link>}
        </li>
      </ul>
    );
    
    return (
      <div>
        <nav className="nav-bar"> {ul} </nav>
        <div className="content"> {this.props.children} </div>
        <footer><p> &copy; Chaofz</p></footer>
      </div>
    );
  }
};
