import React from 'react';

import Parse from 'parse';

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
    Parse.initialize("2LcS4gYGGQ5ocNki74Iat1aOZNJePjSkS87ANnDU", "WPePc76VeJMUgdQMduqIS5TAZkiiWCb0ErbJBuFt");
  },

  getInitialState: function () {
    return {
      isLoggednIn: false
    };
  },

  onLogin: function (response) {
    if(response.status === 'connected') {
      let id = `${response.authResponse.userID}`;
      FB.api(`/${id}?fields=name,email,location`, function (me) {
        console.log("Logged in as", me);
        let Profile = new Parse.Object.extend("Profile");
        let query = new Parse.Query(Profile);
        query.equalTo('fb_id', id);
        query.find({
          success: function (users) {
            console.log("Found users", users);
            if(users.length === 0) {
              this.user = new Profile();
              this.user.set("fb_id", id);
              this.user.set("location", me.location && me.location.name || undefined);
              this.user.set("email", me.email);
              this.user.set("name", me.name);
              this.user.set("friends", []);
              this.user.save(null, {
                success: function (user) {
                  console.log("Created user", user);
                },
                error: function (user, err) {
                  console.log("OH MY GAWD", user, err);
                }
              });
            } else {
              this.user = users[0];
            }
            this.setState({
              isLoggedIn: true,
              user: this.user
            });
          }.bind(this)
        });
      }.bind(this));
    }
  },

  body: function () {
    if(this.state.isLoggedIn) {
      return (<FriendsList user={this.state.user} />);
    } else {
      return (<FBLogin config={this.config} onLogin={this.onLogin} />)
    }
  },

  render: function () {
    return (<section>{this.body()}</section>);
  }

});
