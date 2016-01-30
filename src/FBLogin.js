import React from 'react';

export default React.createClass({

  propTypes: {
    config:  React.PropTypes.object.isRequired,
    onLogin: React.PropTypes.func.isRequired,
  },

  componentDidMount: function () {
    FB.init(this.props.config.init);
  },

  login: function () {
    FB.login(this.props.onLogin, this.props.config.login);
  },

  render: function () {
    return (<button onClick={this.login}> Login with Facebook </button>);
  }

});
