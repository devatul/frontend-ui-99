'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Dropdown from '../bootstrap/Dropdown'
import _ from 'lodash'

var HelpButton = React.createClass({
    displayName: 'selectButton',
    mixins: [PureRenderMixin],

    getInitialState: function() {
        return {
            setOpen: '',
            expanded: false,
        };
    },

    PropTypes: {
        setValue: PropTypes.string,
        onClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        classNote: PropTypes.string
    },

    handleOnMouseOver: function() {
        var dropdown = this.refs.dropdown
        var dropdownMenu = this.refs.dropdownMenu
        var eOffset = $(dropdown).offset();
        //debugger

        $('body').append($(dropdownMenu).detach());
        $(dropdownMenu).css({
                'display': 'block',
                'top': eOffset.top + $(dropdown).outerHeight(),
                'left': eOffset.left
            });

        this.setState({ setOpen: 'open', expanded: true });
    },

    handleOnMouseOut: function() {
        var dropdown = this.refs.dropdown
        var dropdownMenu = this.refs.dropdownMenu
        var eOffset = $(dropdown).offset();
        $(dropdown).append($(dropdownMenu).detach());
        $(dropdownMenu).css({
                'display': 'none',
                'top': eOffset.top + $(dropdown).outerHeight(),
                'left': eOffset.left
            });
        this.setState({ setOpen: '' });
    },

    handleMouseOver: function(e) {
        //debugger
        // e.preventDefault();
        // e.stopPropagation();
        this.setState({ setOpen: 'open' });
    },

    handleMouseOut: function(e) {
        //debugger
        // e.preventDefault();
        // e.stopPropagation();
        this.setState({ setOpen: '' })

    },

    handleClick: function(e) {
        debugger
        e.stopPropagation();
    },

    render: function() {
        var { setOpen, expanded } = this.state,
            { className, classIcon, classMenu } = this.props,
            value = this.props.setValue.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            //debugger
        return(

            <div className={className + ' inline-block-item dropdown ' + setOpen } 
                onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                <a className={classIcon ? classIcon : 'review_question_a help_question_a'} aria-expanded={this.state.expanded}>
                    <i className="fa fa-question-circle" aria-hidden="true"></i>
                </a>
                <div className={ (classMenu ? classMenu : 'overview_timeframe help_timeframe') + ' dropdown-menu fix-z-index-info-button has-arrow dd-md full-mobile'}>
                    <p dangerouslySetInnerHTML={{ __html: value }} />
                </div>
            
            </div>
            
        );
    }

});

module.exports = HelpButton;