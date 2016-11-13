import React, {Component, PropTypes} from 'react';
import {render, findDOMNode} from 'react-dom';
import {cloneDeep, isEqual} from 'lodash';

var panel = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  render() {
    let _props = this.props,
        _class = _props.className ? _props.className : '';

    return React.createElement('section', Object.assign({}, _props, {
          className: 'panel panel-featured panel-featured-primary ' + _class
        }), this.props.children);
  }
});

var head = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  render() {
    let _props = this.props,
        _class = _props.className ? _props.className : '';

    return (
      <header {..._props} className={'panel-heading ' + _class}>
        { this.props.title && <h2 className="panel-title">{this.props.title}</h2>}
        {this.props.children}
      </header>
    );
  }
});

var body = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  render() {
    let _props = this.props,
        _class = _props.className ? _props.className : '';

    return (
      <div {..._props} className={'panel-body ' + _class}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = {
  custom: panel,
  head: head,
  body: body
};