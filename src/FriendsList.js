import React from 'react';

import { Observable } from 'rxjs';

export default React.createClass({

  propTypes: {
    auth:  React.PropTypes.object.isRequired
  },

  componentWillMount: function () {
    FB.api('/me/friends', this.onFriends);
  },

  getInitialState: function () {
    return {
      friends: []
    };
  },

  with: function (fields) {
    return function (friend) {
      let getLocation = (resolve, reject) => {
        console.log("Promise running with", friend);
        FB.api(`/${friend.id}?fields=${fields.join(',')}`, function (response) {
          console.log("Promise got", response);
          if(response && !response.error) {
            let friendWithLocation = Object.assign(friend, {
              location: response.location.name
            });
            resolve(friendWithLocation);
          }
        });
      }
      let promise = new Promise(getLocation);
      return Observable.fromPromise(promise);
    };
  },

  onFriends: function (response) {
    if(response && !response.error) {
      let friends = response.data;
      Observable.from(friends)
        .map(this.with(['location']))
        .combineAll()
        .take(friends.length)
        .subscribe(function (friends) {
          console.log("Friends", friends);
          this.setState({ friends });
        }.bind(this));
    }
  },

  friends: function () {
    if(this.state.friends.length === 0) {
      return "Boo hoo! You have no friends!";
    } else {
      return this.state.friends.map( (friend) => {
        return (<section key={friend.id}>{friend.name} - {friend.location}</section>);
      });
    }
  },

  render: function () {
    return (<section>
      {this.friends()}
    </section>);
  }

});
