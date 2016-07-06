import React from 'react';
import { withRouter, Link } from 'react-router';
import http from '../../controller/appHttp';
import auth from '../../controller/auth';

const SocialAcount = withRouter(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.linkGoogle = this.linkGoogle.bind(this);
      this.linkFacebook = this.linkFacebook.bind(this);
      this.state = {
        profile: {}
      }; 
    }

    linkGoogle(e) {
      http._get('/auth/google', (err, res) => {
        if(err) { 
          this.setState({err: err.message});
        } else {
          auth.saveToken(res.token);
          auth.redirectTo()
        }
      });
    }

    linkFacebook(e) {
      http._get('/auth/facebook', (err, res) => {
        if(err) { 
          this.setState({err: err.message});
        } else {
          
        }
      });
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
      auth.updateActiveLink('social');
    }

    render() {
      return (
        <div className="social">
          <table>
            <tr>
              <td className="item">Google:</td>
              <td>{this.state.profile.google ? 
                <span>this.state.profile.google.email</span> : <a href="/auth/google">Link</a>}</td>
            </tr>
            <tr>
              <td className="item">Facebook:</td>
              <td>{this.state.profile.facebook ? 
                <span>this.state.profile.facebook.email</span> : <a href="/auth/facebook">Link</a>}</td>
            </tr>
          </table>
        </div>
      );
    }
  }
);

export default SocialAcount;

