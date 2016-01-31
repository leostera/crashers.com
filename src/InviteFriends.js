import React from 'react';

export default React.createClass({

  invite: function () {
    FB.ui(
      {
        method: 'share',
        href: 'https://crashers.com'
      },
      function(response) {
        if (response && !response.error_message) {
          alert('Posting completed.');
        } else {
          alert('Error while posting.');
        }
      }
    )
  },

  render: function () {
    return (
      <section className="invite-friends">
        Travelling is better with friends! Invite some :)
        <button className="invite-button" onClick={this.invite}> Invite Friends </button>
      </section>
    );
  }

});
