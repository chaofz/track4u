import http from './appHttp';

module.exports = {
  login(email, password, callback) {
    // what if token is invalid
    // if (localStorage.token) {
    //   this.onChange(true);
    //   if (callback) {
    //     callback(true);
    //   }
    //   return;
    // }
    var credentials = { email: email, password: password };
    http._post('/auth/login', credentials, (err, res) => {
      if (!err) {
        localStorage.token = res.token;
      }
      this.onChange(!err);
      callback(err);
    });
  },

  register(email, password, passwordrp, callback) {
    var credentials = { email: email, password: password, passwordrp: passwordrp };
    http._post('/auth/register', credentials, (err, res) => {
      if (!err) {
        localStorage.token = res.token;
      }
      this.onChange(!err);
      callback(err);
    });
  },

  changePass(oldPass, newPass, newPassrp, callback) {
    var credentials = { oldPass: oldPass, newPass: newPass, newPassrp: newPassrp };
    http._put('/auth/local/password', credentials, (err, res) => {
      this.onChange(!err);
      callback(err);
    });
  },

  saveToken(token) {
    localStorage.token = token;
  },

  logout(callback) {
    delete localStorage.token;
    if (callback) {
      callback();
    }
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  redirectTo(self, route) {
    const { location } = self.props
    if (location.state && location.state.nextPathname) {
      self.props.router.replace(location.state.nextPathname);
    } else {
      self.props.router.replace(route);
    }
  },

  onChange() {},

  inDashboard() {},

  updateActiveLink() {},

  profile: {},

  validateEmail(email) {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return pattern.test(email);
  },

  requireLoggedIn(nextState, replace) {
    if (!localStorage.token) {
      replace({
        pathname: '/signin',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  },

  redirectIfLoggedIn(nextState, replace) {
    if (localStorage.token) {
      replace({
        pathname: '/dashboard',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }
}
