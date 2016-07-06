import React from 'react';
import auth from '../../controller/auth';
import http from '../../controller/appHttp';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      msg: '',
      err: ''
    };
  }

  onChange(e) {
    e.preventDefault();
    const freq = this.refs.freqSelect.value;
    this.setState({frequency: freq});
    http._put('/api/users/me', {notifiFreq: freq}, (err, res) => {
      if(err) { 
        this.setState({err : err})
      } else {
        this.setState({msg: 'Saved!'});
      }
    });
  }

  componentWillMount() {
    auth.updateActiveLink('notification');
    http._get('/api/users/me', (err, res) => {
      if(err) { 
        this.setState({err : err})
      } else {
        this.setState({frequency: res.notifiFreq});
      }
    });
  }

  render() {
    return (
      <div className="notification">
        <p className="item">Notification frequency:</p>
        <p className="descr">You will be emailed immediately if a seat is found. This setting is to to reduce redundent
        following emails after the first email is sent.
        </p>
        <select ref='freqSelect' onChange={this.onChange} value={this.state.frequency}>
          <option value="1">Every 1 minute</option>
          <option value="5">Every 5 minutes</option>
          <option value="10">Every 10 minutes</option>
        </select>
        {this.state.msg && <span className="msg">{this.state.msg}</span>}
      </div>
    );
  }
};

