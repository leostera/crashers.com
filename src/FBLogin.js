import React from 'react';

export default React.createClass({

  propTypes: {
    config:  React.PropTypes.object.isRequired,
    onLogin: React.PropTypes.func.isRequired,
  },

  login: function () {
    FB.login(this.props.onLogin, this.props.config.login);
  },

  render: function () {
    return (<button className="facebook-button" onClick={this.login}> Login with Facebook </button>);
  }

});
