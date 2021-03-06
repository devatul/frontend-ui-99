import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';
import Constant from '../../App/Constant.js';

var Input = React.createClass({
  getInitialState() {
    return {
      check: this.props.check,
      error: ''
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.disabled != nextProps.disabled) {
      return true;
    }
    if (this.props.value != nextProps.value) {
      return true;
    }
    if (this.state.error != nextState.error) {
      return true;
    }
    if (this.props.check != nextProps.check) {
      return true;
    }
    if (this.props.data != nextProps.data) {
      return true;
    }

    return false;
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.check) {
      this.validate(this.props.data, this.props.name)
    }
  },

  validate(event, name, value) {
    if (event == undefined) {
      this.setState({error: 'Please enter your ' + this.props.name});
      return;
    } else {
      let value = event.target == undefined ? event : event.target.value,
          {validate, name, minlength} = this.props,
          message = '',
          listValidate = _.split(validate, ',');

      if (!_.isNull(validate)) {
        for (let i = 0; i < listValidate.length; i++) {
          switch (listValidate[i].trim()) {
            case 'required':
              message = this.checkedNull(value, name);
              break;
            case 'email':
              message = this.checkEmail(value, name);
              break;
            case 'number':
              message = this.checkNumber(value, name);
              break;
          }
        }

        if (minlength != undefined || minlength != null) {
          message = minlength > value.length ? this.getMessage(name).minlength : '';
          this.setState({error: message});
        }

        this.props.onChange(event, name, value);
      }
    }
  },

  getMessage(name) {
    let listMess = Constant.VALIDATION;

    for (let i = 0; i < _.size(listMess); i++) {
      if (Object.keys(listMess)[i] == name) {
        return Object.values(listMess)[i];
      }
    }
  },

  checkedNull(value, name) {
    let message = value == "" ? this.getMessage(name).required : '';
    this.setState({error: message});
    return message;
  },

  checkNumber(value, name) {
    let message = isNaN(value) ? this.getMessage(name).number : '';
    this.setState({error: message});
    return message;
  },

  checkEmail(value, name) {
    let filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/,
        message = !filter.test(value) ? this.getMessage(name).required : '';
    this.setState({error: message});
    return message;
  },

  onChange(event) {
    let value = event.target.value;
    this.validate(event, this.props.name, value);
  },

  render() {
    let disabled = this.props.disabled;
    let className = this.state.error != '' ? this.props.className + ' has-error' : this.props.className;

    return (
      <div key={ this.props.key }>
        <input
          type={ this.props.type }
          className={className}
          id={ this.props.id }
          placeholder={ this.props.placeholder }
          name={ this.props.name }
          value={ this.props.value }
          checked={ this.props.checked }
          disabled={ this.props.disabled }
          onChange={ this.onChange }
          onBlur={ this.validate } />
        <span className="error">{this.state.error}</span>
      </div>
    )
  }
});

module.exports = Input;
