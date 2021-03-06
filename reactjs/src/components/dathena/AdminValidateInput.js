import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

var Input = React.createClass({
  /*PropsType :{
   type : PropsType.string,
   },*/

  getInitialState() {
    return {
      check: this.props.check,
      error: ''
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.disabled != nextProps.disabled;
  },

  onChange(event) {
    let value = _.trim(event.target.value);

    if (value == "") {
      console.log("value_null :", "yes")
    }

    switch (this.state.check) {
      case 'number':
        this.checkNumber(value);
        break;
      case "email":
        this.checkEmail(value);
        break;
    }
  },

  checkNumber(value) {
    if (isNaN(value)) {
      this.setState({error: 'Your enter invalid'});
      return;
    } else {
      this.setState({error: ''});
    }
  },

  checkEmail(value) {
    var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;

    if (!filter.test(value)) {
      this.setState({error: 'Email is invalid'});
      return
    } else {
      this.setState({error: ''});
    }
  },

  onChange(event){
    let value = event.target.value;
    this.props.onChange(this.props.block, this.props.fieldId, value)
  },

  render() {
    var disabled = this.props.disabled;
    return (
        <div key={this.props.key}>
          <input type={this.props.type} className={this.props.className} id={this.props.id} checked={this.props.checked} disabled={disabled} placeholder={this.props.placeholder} onChange={this.onChange} />
        </div>
    )
  }
});

module.exports = Input;
