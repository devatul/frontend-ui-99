'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'

var ToggleButton = React.createClass({
    
    getInitialState() {
        return {
            default: this.props.setDefault,
            style: 'collapse'
        }
    },

    PropTypes: {
        setDefault: PropTypes.string,
        setTarget: PropTypes.string
    },

    // componentDidUpdate(prevProps, prevState) {
    //     if(this.state.default != prevState.default) {
    //         debugger
    //         this.handleToggleButton()
    //     }
    // },

    componentDidMount() {
        this.handleToggleButton()
    },
    

    handleToggleButton() {
        debugger
        if(this.state.default === 'open') {
            $(this.props.setTarget).css('display', 'block');
            this.setState({ default: 'close', style: 'collapse' });
        } else {
            $(this.props.setTarget).css('display', 'none');
            this.setState({ default: 'open', style: 'collapsed' });
        }
    },

    render() {
        return(
        <span>
            <a onClick={this.handleToggleButton}
                className={'panel-action panel-action-toggle fix-arrow-panel-action-toggle ' + this.state.style }></a>
        </span>
        )
    }
});

module.exports = ToggleButton;