import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
import auth from './controller/auth';
import Index from './components/index/Index.jsx';
import Welcome from './components/index/Welcome.jsx';
import NotFound from './components/index/NotFound.jsx';
import Signup from './components/auth/Signup.jsx';
import Signin from './components/auth/Signin.jsx';
import Logout from './components/auth/Logout.jsx';
import MainApp from './components/query/MainApp.jsx';
import Settings from './components/settings/Settings.jsx';
import LocalAccount from './components/settings/LocalAccount.jsx';
import SocialAccount from './components/settings/SocialAccount.jsx';
import Notification from './components/settings/Notification.jsx';
import About from './components/settings/About.jsx';

var AppRouter = (
  <Router history={browserHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Welcome} onEnter={auth.redirectIfLoggedIn}/>
      <Route path="signin" component={Signin} onEnter={auth.redirectIfLoggedIn}/>
      <Route path="signup" component={Signup} onEnter={auth.redirectIfLoggedIn}/>
      <Route path="logout" component={Logout} />
      <Route path="dashboard" component={MainApp} onEnter={auth.requireLoggedIn} />
      <Route path="settings" component={Settings} onEnter={auth.requireLoggedIn}>
        <IndexRedirect to="account" />
        <Route path="account" component={LocalAccount} />
        <Route path="social" component={SocialAccount} />
        <Route path="notification" component={Notification} />
        <Route path="about" component={About} />
      </Route>
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
);

ReactDOM.render(AppRouter, document.getElementById('app'));
