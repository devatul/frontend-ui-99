import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import template from './ResetConfirmation.rt';

var ResetConfirmation = React.createClass({
  render: template
});

module.exports = ResetConfirmation;