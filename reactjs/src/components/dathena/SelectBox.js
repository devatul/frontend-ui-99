import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import {forEach, isEqual} from 'lodash';

var SelectBox = React.createClass({
  displayName: 'selectBox',

  getInitialState() {
    return {
      checked: this.props.checked
    };
  },

  PropTypes: {
    id: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.array,
    binding: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.value, nextProps.value) || !isEqual(this.props.data, nextProps.data);
  },

  handleOnChange(event, index) {
    var valueSelect = this.props.data[event.target.value];
    this.props.onChange && this.props.onChange(valueSelect, event, index);
  },

  render: function () {
    let children = [],
        {binding, defaultValue, data, emptyOptions} = this.props,
        _props = Object.assign({}, this.props),
        name = binding ? binding.name : 'name',
        value = binding ? binding.value : 'index';

    _props.data && delete _props.data;
    _props.binding && delete _props.binding;
    _props.emptyOptions && delete _props.emptyOptions;
    (_props.defaultValue >= 0 || defaultValue != "") && delete _props.defaultValue;

    for (let i = data.length - 1; i >= 0; i--) {
      children[i] =
        <option key={data[i][name] + '_' + i} className="lt" value={value == 'index' ? i : data[i][value]} disabled={i === defaultValue && true}>
          {data[i][name]}
        </option>
    }

    if (emptyOptions) {
      children.unshift(<option key="empty" className="lt" disabled="disabled" value={-1}></option>);
    }

    return (
      <select {..._props} onChange={this.handleOnChange}>
        {children}
      </select>
    );
  }
});

module.exports = SelectBox;
