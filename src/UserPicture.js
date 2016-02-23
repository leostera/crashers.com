import React from 'react';

export default React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  render: function () {
    let url = `//graph.facebook.com/v2.5/${this.props.user.id}/picture`;
    return (<img  className="friend-picture" src={url} />);
  }

});
