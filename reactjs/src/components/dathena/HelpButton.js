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
        var eOffset = $(this.refs.dropdown).offset();
        var { setOpen, expanded } = this.state,
            { className, classIcon, classMenu } = this.props,
            value = this.props.setValue.replace(/(?:\r\n|\r|\n)/g, '<br/>'),

            _window = $(window),
            _outWidth = _window.outerWidth(),
            _inWidth = _window.innerWidth(),
            _wWidth = _window.width(),
            marginLeft = 0,
            width = 330,
            left = eOffset.left;
            
        if(_wWidth > 550) {
            if((left + 300) > _wWidth) {
                marginLeft = -260;
            } else {
                marginLeft = -20;
            }
        } else if(_wWidth > 375 && _wWidth < 550) {
            if((left + 300) > _wWidth) {
                marginLeft = 'auto';
            } else {
                marginLeft = -50;
            }
        } else {
            marginLeft = 15;
            width = '90%';
            left = 'auto';
        }
        
        let menu = React.createElement('div', {
            style: { 
                display: 'block',
                top: eOffset.top,
                left: left,
                marginLeft: marginLeft,
                width: width,
                marginTop: 25
            },
            className: (classMenu ? classMenu : 'overview_timeframe help_timeframe') + ' dropdown-menu fix-z-index-info-button has-arrow dd-md full-mobile'
        }, <p dangerouslySetInnerHTML={{ __html: value }} style={this.state.styleContent}/>)

            
        render(menu, document.getElementById('help-render-position'))

        // if ($(window).width() <= 996 && $('div[id^="overview-panel"]').hasClass('panel-body')) {

        //     if (eOffset.left + $(dropdownMenu).outerWidth() + $(dropdown).outerWidth() > $('.container').innerWidth()) {
        //         right = eOffset.left + $(dropdown).outerWidth() - $('.container').innerWidth() + 60;
        //         $(dropdownMenu).not('none-right').addClass('none-right');
        //     }
        //     else if (eOffset.left - $(dropdownMenu).outerWidth() < 0){
        //         left = -1 * eOffset.left;
        //         $(dropdownMenu).not('none-left').addClass('none-left');
        //     }
        //     $(dropdownMenu).css({
        //             'display': 'block',
        //             'margin-left' : left + 'px',
        //             'margin-right' : right + 'px'
        //         });
        // }

        // else {
        //     $(dropdownMenu).css({
        //             'display': 'block'
        //         });
        // }

        this.setState({ setOpen: 'open', expanded: true });
    },

    handleOnMouseOut: function() {
        var dropdown = this.refs.dropdown
        var dropdownMenu = this.refs.dropdownMenu
        // var eOffset = $(dropdown).offset();
        // // $(dropdown).append($(dropdownMenu).detach());
        // if ($(dropdownMenu).hasClass('none-left')) {
        //     $(dropdownMenu).removeClass('none-left');
        // }
        // if ($(dropdownMenu).hasClass('none-right')) {
        //     $(dropdownMenu).removeClass('none-right');
        // }
        // $(dropdownMenu).css({
        //         'display': 'none'
        //     });
        render(<div></div>, document.getElementById('help-render-position'))
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
            </div>

        );
    }

});

module.exports = HelpButton;

