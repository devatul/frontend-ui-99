'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { forEach, isEqual } from 'lodash'

var SelectBox = React.createClass({
    displayName: 'selectBox',

    getInitialState: function() {
        return {
            checked: this.props.checked,
            open: false
        };
    },

    PropTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        data: PropTypes.array,
        binding: PropTypes.object,
        className: PropTypes.string,
        onChange: PropTypes.func,
        onOpen: PropTypes.func,
        value: PropTypes.string
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.open != nextState.open || !isEqual( this.props.value, nextProps.value ) || !isEqual( this.props.data, nextProps.data );        
    },

    handleOnChange: function(event) {
        var valueSelect = this.props.data[event.target.value];
        this.props.onChange &&
            this.props.onChange(valueSelect, event);
    },

    handleOnClick: function(event) {
        let { open } = this.state,
            { id } = this.props,
            filed = {
                id: id,
                event: event
            };
        
        if(!open) {
            this.props.onOpen &&
                this.props.onOpen(filed);
            this.setState({ open: true });
        } else {
            this.setState({ open: false });
        }
    },

    render: function() {
        let children = [],
            { binding, defaultValue, data } = this.props,
            name = binding ? binding.name : 'name',
            value = binding ? binding.value : 'index';
        for(let i = data.length - 1; i >= 0; i--) {

            children[i] = <option
                                key={data[i][name] + '_' + i}
                                className="lt"
                                value={value == 'index' ? i : data[i][value]}
                                disabled={i === defaultValue && true}>
                                {data[i][name]}
                            </option>;
        }
        return(
            <select {...this.props}
                onChange={this.handleOnChange}
                key="Index">
                {children}
            </select>
            );
    }
});
module.exports = SelectBox;