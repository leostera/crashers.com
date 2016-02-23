import React from 'react';

import InviteFriends from './InviteFriends';

import Parse from 'parse';

import { Observable } from 'rxjs';
import './Utils';

export default React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  componentWillMount: function () {
    FB.api('/me/friends', this.onFriends);
  },

  getInitialState: function () {
    return {
      friends: [],
      friendsOfFriends: [],
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
              location: response.location && response.location.name || undefined
            });
            resolve(friendWithLocation);
          }
        });
      }
      let promise = new Promise(getLocation);
      return Observable.fromPromise(promise);
    };
  },

  by: function (key) {
    return function (friends) {
      return friends[key] === undefined || friends[key] === null;
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

          let userFriends = this.props.user.get("friends");
          let friendIds = friends.map( (f) => f.id );
          let allIds = userFriends.concat(friendIds);
          let uniqIds = allIds.unique();

          this.props.user.set('friends', uniqIds);
          this.props.user.save();

          // gets friends of friends
          let Profile = Parse.Object.extend("Profile");
          let idQuery = new Parse.Query(Profile);
            idQuery.containedIn("fb_id", uniqIds);

          let fofsQuery = uniqIds.map((id) => {
            let q = new Parse.Query(Profile);
            q.equalTo("friends", id);
            return q;
          });
          let query = Parse.Query.or.apply(null, [idQuery, ...fofsQuery]);
          query.include("friends");

          query.find({
            success: function (fs) {
              console.log("Found all these people", fs.map( (f) => f.get('fb_id') ));

              let fofs = fs.filter( (f) => {
                return [...uniqIds, this.props.user.get('fb_id')].indexOf(f.get('fb_id')) === -1
              }).map( (f) => {
                return {
                  id: f.get('fb_id'),
                  name: f.get('name'),
                  location: f.get('location')
                };
              });

              console.log("Of which these are not direct friends", fofs.map( (f) => f.id ));

              this.setState({ friends, friendsOfFriends: fofs });
            }.bind(this)
          });
        }.bind(this));
    }
  },

  friends: function (key) {
    console.log("getting ", key, "=>", this.state[key]);
    if(this.state[key].length === 0) {
      return "Boo hoo! You have no friends!";
    } else {
      return this.state[key].filter( (friend) => {
        return friend.location !== undefined;
      }).map( (friend) => {
        return (<section className="friend" key={friend.id}>
          <UserPicture user={friend} />
          <span className="friend-name">{friend.name}</span>
          <span className="friend-location">{friend.location}</span>
          </section>);
      });
    }
  },

  render: function () {
    return (<section className="container">
        <h2>Friends</h2>
        <section className="friends">
          {this.friends('friends')}
        </section>
        <h2> Friends of Friends </h2>
        <section className="friends-of-friends">
          {this.friends('friendsOfFriends')}
        </section>
      </section>);
  }

});
