import React from 'react';

import UserPicture from './UserPicture';

export default React.createClass({

  user: function () {
    if(this.props.user) {
      return (<section className="right">
        <UserPicture user={this.props.user} />
        <span> {this.props.user.name } </span>
      </section>);
    }
  },

  render: function () {
    return (
      <section className="navbar">
        <img className="left" src="./img/logo.png" />
        {this.user()}
      </section>
    );
  }

});
