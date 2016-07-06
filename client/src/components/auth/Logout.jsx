import React from 'react';
import auth from '../../controller/auth';

export default class Logout extends React.Component{

  componentDidMount() {
    auth.logout();
  }

  render() {
    return (
      <div className="logout">
        <p className="title">You are now logged out.</p>
      </div>
    );
  }
  
};
