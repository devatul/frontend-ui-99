'use strict';
import React,  { Component, PropTypes } from 'react'
import { render, findDOMNode } from 'react-dom'
import { cloneDeep, isEqual } from 'lodash'

var tabs = React.createClass({

    handleActive: function(event) {

    },

    render() {
        let _props = this.props,

            children = React.Children.map(this.props.children,
                    (child) => {
                        if(child) {
                            return React.cloneElement(child, {
                                activeCurrent: _props.activeCurrent ? _props.activeCurrent : '',
                                handleActive: this.handleActive
                            });
                        }
                    }
                );
        return(
            <div {...this.props} className={'tabs ' + (this.props.className ? this.props.className : '')}>
                {children}
            </div>
        );
    }
});

var nav = React.createClass({
    render() {
        let _props = this.props,
            children = React.Children.map(this.props.children,
                    (child) => React.cloneElement(child, {
                        activeCurrent: _props.activeCurrent ,
                        handleActive: this.props.handleActive
                    })
                );
                //debugger
        return(
            <ul {...this.props} className={'nav nav-tabs ' + (this.props.className ? this.props.className : '')}>
                {children}
            </ul>
        );
    }
});

var tab = React.createClass({
    handleOnClick: function(event) {
        event.preventDefault();
        this.props.onClick &&
            this.props.onClick(event);
    },

    render() {
        let { title } = this.props;
        return(
            <li {...this.props} className={this.props.className ? this.props.className : ''}>
                <a href="#" data-toggle="tab" onClick={this.handleOnClick} aria-expanded="true">
                    {title}
                    {this.props.children}
                </a>
            </li>
        );
    }
});

var content = React.createClass({
    render() {
        return(
            <div {...this.props} className={'tab-content ' + (this.props.className ? this.props.className : '')}>
                {this.props.children}
            </div>
        );
    }
});

var pane = React.createClass({
    render() {
        return(
            <div {...this.props} className={'tab-pane ' + (this.props.className ? this.props.className : '')}>
                {this.props.children}
            </div>
        );
    }
});

module.exports = {
    custom: tabs,
    tab: tab,
    nav: nav,
    content: content,
    pane: pane
}