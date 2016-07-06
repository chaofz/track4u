import React from 'react';
import auth from '../../controller/auth';

export default class extends React.Component {

  componentWillMount() {
    auth.updateActiveLink('about');
  }

  render() {
    return (
      <div>
        <p>Hi!</p>
        <p>Thanks for using this website!</p>
        <p>My personal page can be accessed at <a href='http://chaofz.me'>chaofz.me</a>.</p>
      </div>
    );
  }
};

