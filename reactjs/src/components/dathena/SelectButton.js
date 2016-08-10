'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var SelectButton = React.createClass({
    displayName: 'selectButton',

    getInitialState: function() {
        return {
            checked: this.props.checked
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.checked != nextProps.checked) {
            return true;
        }
        if(this.state.checked != nextState.checked) {
            return true;
        }
        return false;
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.props.checked != prevProps.checked) {
            this.setState({ checked: (this.props.checked == 'on') ? 'on' : 'off' });
        }
    },
    PropTypes: {
        checked: PropTypes.bool,
        onChange: PropTypes.func
    },
    handleOnclick: function() {
        var checked = null;
        if(this.state.checked == '' || this.state.checked == 'off') 
            checked = 'on';
        else
            checked = 'off';
        this.setState({ checked: checked });
        this.props.onChange &&
            this.props.onChange(checked);
    },

    render: function() {
        return(
            <div style={{height: 37.5}}>
                <div className="switch switch-sm switch-success">
                    <div className={'ios-switch ' + this.state.checked} onClick={this.handleOnclick}>
                        <div className="on-background background-fill"></div>
                        <div className="state-background background-fill"></div>
                        <div className="handle"></div>
                    </div>
                        <input type="checkbox" name="switch" data-plugin-ios-switch="" checked="checked" style={{display: 'none'}}/>
                        {this.props.title && ' ' + this.props.title}
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = SelectButton;