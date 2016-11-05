'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import Dropdown from '../bootstrap/Dropdown'
import _ from 'lodash'

var HelpButton = React.createClass({
    displayName: 'selectButton',

    getInitialState: function() {
        return {
            setOpen: '',
            expanded: false,
            styleContent : {
                'fontSize' :'13px',
                'marginBottom': '0px',
                'whiteSpace' : 'normal' ,
                'fontWeight': 'initial'
            },
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
        var position = $(dropdown).position();
        var left = 0;
        var right = 0;
        //debugger

        // $('body').append($(dropdownMenu).detach());
        if ($(window).width() <= 996 && $(dropdownMenu).hasClass('overview-table-help')) {

            if (position.left + $(dropdownMenu).outerWidth() + $(dropdown).outerWidth() > $('.container').innerWidth()) {
                right = position.left + $(dropdown).outerWidth() - $('.container').innerWidth() + 50;
                $(dropdownMenu).not('none-right').addClass('none-right');
            }
            else if (position.left - $(dropdownMenu).outerWidth() < 0){
                left = -1 * position.left;
                if ($(dropdownMenu).hasClass('info-scan-submenu')) {
                    left += 15;
                }
                $(dropdownMenu).not('none-left').addClass('none-left');
            }
            $(dropdownMenu).css({
                    'display': 'block',
                    'margin-left' : left + 'px',
                    'margin-right' : right + 'px'
                });
        }

        else {
            $('body').append($(dropdownMenu).detach());
            $(dropdownMenu).css({
                    'display': 'block',
                    'top': eOffset.top + $(dropdown).outerHeight(),
                    'left': eOffset.left
                });

        }

        this.setState({ setOpen: 'open', expanded: true });
    },

    handleOnMouseOut: function() {
        var dropdown = this.refs.dropdown
        var dropdownMenu = this.refs.dropdownMenu
        var eOffset = $(dropdown).offset();
        // $(dropdown).append($(dropdownMenu).detach());
        if ($(dropdownMenu).hasClass('none-left')) {
            $(dropdownMenu).removeClass('none-left');
        }
        if ($(dropdownMenu).hasClass('none-right')) {
            $(dropdownMenu).removeClass('none-right');
        }
        if ($(window).width() <= 996 && $(dropdownMenu).hasClass('overview-table-help')) {
            $(dropdownMenu).css({
                    'display': 'none'
                });
        }
        else {
            $(dropdownMenu).css({
                    'display': 'none',
                    'top': eOffset.top + $(dropdown).outerHeight(),
                    'left': eOffset.left
                });
        }
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
        e.stopPropagation();
    },

    render: function() {
        var { setOpen, expanded } = this.state,
            { className, classIcon, classMenu } = this.props,
            value = this.props.setValue.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            //debugger
        return(

            <div ref="dropdown" className={className + ' inline-block-item dropdown ' + setOpen }>
                <a onMouseOver={this.handleOnMouseOver} onMouseOut={this.handleOnMouseOut} className={classIcon ? classIcon : 'review_question_a help_question_a'} aria-expanded={this.state.expanded}>
                    <i className="fa fa-question-circle" aria-hidden="true"></i>
                </a>
                <div ref="dropdownMenu" className={ (classMenu ? classMenu : 'overview_timeframe help_timeframe') + ' dropdown-menu fix-z-index-info-button has-arrow dd-md full-mobile'}>
                    <p dangerouslySetInnerHTML={{ __html: value }} style={this.state.styleContent}/>
                </div>

            </div>

        );
    }

});

module.exports = HelpButton;

