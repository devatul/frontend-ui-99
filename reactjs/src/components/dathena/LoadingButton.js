'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { isEqual } from 'lodash'

var loading = React.createClass({

    getDefaultProps() {
        return {
            elementType: 'div',
            color: "black",
            open: false
        };
    },

    render() {
        let { elementType, color, open, className, style, id } = this.props,
            display = (open ? 'block' : 'none'),
            children = [
                <div id="circularG_1" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_2" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_3" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_4" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_5" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_6" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_7" className="circularG" style={{ backgroundColor: color }}></div>,
                <div id="circularG_8" className="circularG" style={{ backgroundColor: color }}></div>
            ],
            element = React.createElement(elementType, 
                Object.assign({}, this.props, {
                    id: (id ? id : 'circularG'),
                    className: (className ? className : 'inline-block-item'),
                    style: Object.assign({}, style, { display: (style && style.display ? style.display : display) })
                })
            , children);
        return (element);
    }
});

module.exports = loading;