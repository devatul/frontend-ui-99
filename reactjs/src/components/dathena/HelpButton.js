'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import PureRenderMixin from 'react-addons-pure-render-mixin'
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
        var body = document.body;
        debugger

        body.appendChild(dropdownMenu);

        var style = dropdownMenu.style;
            style.display = 'block';
            style.top = eOffset.top + $(dropdown).outerHeight();
            style.left = eOffset.left;

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
    render: function() {
        var { setOpen, expanded } = this.state;
        return(
            <div ref="dropdown" className={'r dropdown inline-block-item ' + this.props.className + ' ' + setOpen}>
                <a data-toggle="dropdown"
                    onMouseOver={this.handleOnMouseOver}
                    onMouseOut={this.handleOnMouseOut}
                    className="review_question_a help_question_a"
                    aria-expanded={expanded}>
                    <i className={this.props.classIcon == null ? 'fa fa-question-circle' : 'fa ' + this.props.classIcon} aria-hidden="true"></i>
                </a>
                <div ref="dropdownMenu" className={this.props.classNote + ' dropdown-menu fix-z-index-info-button has-arrow dd-md full-mobile'}>
                    {this.props.setValue && 
                        <p>{this.props.setValue}</p>}
                </div>
                <span class="dropdown-backdrop"></span>
            </div>
        );
    }

});

module.exports = HelpButton;