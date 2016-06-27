import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './EmailSend.rt';

var EmailSend = React.createClass({
  render() {
    const { userID } = this.props.params

    return template()
  }
});
module.exports = EmailSend;