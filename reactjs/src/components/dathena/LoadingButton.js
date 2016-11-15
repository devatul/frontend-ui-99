import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {isEqual} from 'lodash';

var loading = React.createClass({
  getDefaultProps() {
    return {
      elementType: 'div',
      color: "black",
      open: false
    };
  },

  render() {
    let {elementType, color, open, className, style, id} = this.props,
        display = (open ? 'block' : 'none'),
        children = [
          <div key={'g1'} id="circularG_1" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g2'} id="circularG_2" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g3'} id="circularG_3" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g4'} id="circularG_4" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g5'} id="circularG_5" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g6'} id="circularG_6" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g7'} id="circularG_7" className="circularG" style={{backgroundColor: color}}></div>,
          <div key={'g8'} id="circularG_8" className="circularG" style={{backgroundColor: color}}></div>
        ],
        _props = Object.assign({}, this.props, {
          id: (id ? id : 'circularG'),
          className: (className ? className : 'inline-block-item'),
          style: Object.assign({}, style, {display: (style && style.display ? style.display : display)})
        });

    _props.elementType && delete _props.elementType;

    return React.createElement(elementType, _props, children);
  }
});

module.exports = loading;
