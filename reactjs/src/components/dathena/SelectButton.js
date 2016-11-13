import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import {isEqual} from 'lodash';

var SelectButton = React.createClass({
  displayName: 'selectButton',

  getInitialState() {
    return {
      setSelected: this.props.setSelected
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.setSelected, nextProps.setSelected) || !isEqual(this.state.setSelected, nextState.setSelected) || !isEqual(this.props.title, nextProps.title);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.setSelected != prevProps.setSelected) {
      this.setState({setSelected: (this.props.setSelected == 'on') ? 'on' : 'off'});
    }
  },

  PropTypes: {
    setSelected: PropTypes.bool,
    onChange: PropTypes.func
  },

  handleOnclick() {
    var checked = null;

    checked = this.state.setSelected == '' || this.state.setSelected == 'off' ? 'on' : 'off';

    this.setState({setSelected: checked});
    this.props.onChange && this.props.onChange(checked);
  },

  render() {
    return (
      <div>
        <div className="switch switch-sm switch-success">
          <span className="switch-label" style={{minWidth: '125px'}}>{this.props.title && ' ' + this.props.title}</span>
          <div className={'ios-switch ' + this.state.setSelected} onClick={this.handleOnclick}>
            <div className="on-background background-fill"></div>
            <div className="state-background background-fill"></div>
            <div className="handle"></div>
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

module.exports = SelectButton;
