'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'

var SelectBox = React.createClass({
    displayName: 'selectButton',

    mixins: [PureRenderMixin],

    getInitialState: function() {
        return {
            checked: this.props.checked
        };
    },

    PropTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        data: PropTypes.array,
        className: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.string
    },

    handleOnChange: function(event) {
        var data = this.props.data[event.target.value];
        this.props.onChange &&
            this.props.onChange(data, event.target);
    },

    render: function() {
        let children = [];
        _.forEach(this.props.data, function(object, index) {
            children[index] = <option
                                    key={object.name + '_' + index}
                                    className="lt"
                                    value={index}
                                    disabled={index == this.props.defaultValue && true}>
                                    {object.name}
                                </option>;
        }.bind(this));
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