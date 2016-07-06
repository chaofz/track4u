import React from 'react';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="not-found">
        <p className="title">Oh, Noes, 404!</p>
        <p className="title">The requsted URL cannot be found!</p>
      </div>
    );
  }
};

// Manually add this prop so we can easily check for it in server render
NotFound.isNotFound = true;
