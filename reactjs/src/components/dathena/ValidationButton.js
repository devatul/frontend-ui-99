'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'

var ValidationButton = React.createClass({
    displayName: 'selectButton',
    mixins: [PureRenderMixin],

    static: {
        status: {
            normal: {name: 'normal', className: ''},
            warning: {name: 'warning', className: 'icon-warning'},
            danger: {name: 'danger', className: 'icon-danger'},
            success: {name: 'success', className: 'icon-success'}
        }
    },

    getInitialState: function() {
        return {
            style: {
                cursor: 'pointer'
            },
            statusClass: ''
        };
    },
    
    PropTypes: {
        status: PropTypes.string,
        onClick: PropTypes.func,
        id: PropTypes.string
    },

    componentWillReceiveProps(nextProps) {
        debugger
        if(nextProps.status) {
            var status = this.static.status[nextProps.status];
            debugger
            this.setState({ statusClass: status.className });
        }
    },
    

    // componentDidUpdate: function(prevProps, prevState) {
    //     if(this.props.status != prevProps.status) {
    //         var status = this.static.status[this.props.status];
    //         this.setState({ statusClass: status.className });
    //     }
    // },
    
    handleOnClick: function() {
        this.props.onClick &&
            this.props.onClick(this.props.id);
    },
    render: function() {
        return (
            <a style={this.state.style} onClick={this.handleOnClick} className={'validation-btn btn btn-default ' + this.state.statusClass}>
                <i className={'fa fa-check ' + this.state.statusClass}></i>
            </a>
        );
    }
});
module.exports = ValidationButton;