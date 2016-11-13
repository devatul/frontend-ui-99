import React, {Component, PropTypes} from 'react';
import {render, findDOMNode} from 'react-dom';
import Alert from 'react-bootstrap/lib/Alert';

var alert = React.createClass({
  getInitialState() {
    return {
      visible: this.props.open
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.open != nextProps.open) {
      this.setState({visible: nextProps.open});
    }
  },

  handleDismiss() {
    this.setState({visible: false});
  },

  render() {
    if (this.state.visible) {
      return (
        <Alert {...this.props} onDismiss={this.handleDismiss}>
          {this.props.children}
        </Alert>
      );
    }

    return (<span></span>);
  }
});

module.exports = alert;
