'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var SelectButton = React.createClass({
    displayName: 'selectButton',

    getInitialState: function() {
        return {
            setSelected: this.props.setSelected
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.setSelected != nextProps.setSelected) {
            return true;
        }
        if(this.state.setSelected != nextState.setSelected) {
            return true;
        }
        return false;
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.props.setSelected != prevProps.setSelected) {
            this.setState({ setSelected: (this.props.setSelected == 'on') ? 'on' : 'off' });
        }
    },
    PropTypes: {
        setSelected: PropTypes.bool,
        onChange: PropTypes.func
    },
    handleOnclick: function() {
        var checked = null;
        if(this.state.setSelected == '' || this.state.setSelected == 'off') 
            checked = 'on';
        else
            checked = 'off';
        this.setState({ setSelected: checked });
        this.props.onChange &&
            this.props.onChange(checked);
    },

    render: function() {
        return(
            <div>
                <div className="switch switch-sm switch-success">
                    <span className="switch-label">{this.props.title && ' ' + this.props.title}</span>
                    <div className={'ios-switch ' + this.state.setSelected} onClick={this.handleOnclick}>
                        <div className="on-background background-fill"></div>
                        <div className="state-background background-fill"></div>
                        <div className="handle"></div>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = SelectButton;