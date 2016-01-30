import React from 'react';

import FBLogin from './FBLogin';
import FriendsList from './FriendsList';

export default React.createClass({

  config: {
    init: {
      appId: '1531593493801582',
      status: true,
      xfbml: false,
      version: 'v2.5'
    },
    login: {
      scope: 'email,user_location,user_friends'
    }
  },

  componentDidMount: function () {

  },

  getInitialState: function () {
    return {
      isLoggednIn: false
    };
  },

  onLogin: function (response) {
    if(response.status === 'connected') {
      console.log("Logged in as", response);
      this.setState({
        isLoggedIn: true,
        auth: response.authResponse
      });
    }
  },

  body: function () {
    if(this.state.isLoggedIn) {
      return (<FriendsList auth={this.state.auth} />);
    } else {
      return (<FBLogin config={this.config} onLogin={this.onLogin} />)
    }
  },

  render: function () {
    return (<section>{this.body()}</section>);
  }

});
