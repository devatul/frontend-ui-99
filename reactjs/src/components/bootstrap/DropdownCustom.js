import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { Dropdown } from 'react-bootstrap'

var DropdownCustom = React.createClass({
    render() {
        return(
            <Dropdown {...this.props}>
                {this.props.children}
            </Dropdown>
        );
    }
});

var Toggle = React.createClass({

    handleClick: function(e) {
        e.preventDefault();
        this.props.onClick(e);
    },

    render() {
        return(
            <span onClick={this.handleClick} {...this.props}>
                {this.props.children}
            </span>
        );
    }
});

module.exports = {
    Custom: DropdownCustom,
    Toggle: Toggle
};