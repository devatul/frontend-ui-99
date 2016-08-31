'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import $ from 'jquery'
import _ from 'lodash'

var InfoButton = React.createClass({
    displayName: 'selectButton',
    mixins: [PureRenderMixin],

    getInitialState: function() {
        return {
            setOpen: '',
            expanded: false,
            maxlength: 0
        };
    },

    PropTypes: {
        setValue: PropTypes.string,
        onClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func
    },

    handleOnMouseOver: function() {
        var dropdown = this.refs.dropdown
        var dropdownMenu = this.refs.dropdownMenu
        var eOffset = $(dropdown).offset();
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
    render: function() {
        var { setOpen, expanded } = this.state;
        return(
            <div ref="dropdown" className={'dropdown dropdown-file-info-holder '+this.props.className+' inline-block-item ' + setOpen}>
                <span data-toggle="dropdown"
                    onMouseOver={this.handleOnMouseOver}
                    onMouseOut={this.handleOnMouseOut}
                    aria-expanded={expanded}
                    className="btn-file-info fa fa-info-circle" aria-hidden="false">
                </span>
                <div ref="dropdownMenu" className="dropdown-menu has-arrow dropdown-file-info append-to-body fix-z-index-info-button">
                    {this.props.children}
                </div>
                <span class="dropdown-backdrop"></span>
            </div>
        );
    }

});

module.exports = InfoButton;