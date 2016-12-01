import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link, IndexLink, browserHistory} from 'react-router';
import template from './Profile.rt';
import {makeRequest} from '../utils/http';
import Constant from '../App/Constant.js';
import $, {JQuery} from 'jquery';
import {getProfile, getPhoto, getRole} from '../utils/function';

module.exports = React.createClass({
  getInitialState() {
    return {
      profile: {},
      isChecked: false,
      role: "",
    };
  },

  componentWillMount() {
    this.getProfile();
    this.getPhoto();

    getRole({
      success: function(data) {
        this.setState({ role: data.role });
      }.bind(this)
    });
  },

  /*  shouldComponentUpdate(nextProps , nextState){
   if(this.state.profile != nextState.profile){
   return true
   }
   return false
   },*/

  changeActive() {
    let _profile = _.cloneDeep(this.state.profile);
    _profile.use_active_directory = _profile.use_active_directory ? false : true;
    this.setState({profile: _profile});
  },

  changeEnable() {
    this.setState({isChecked: !this.state.isChecked});
  },

  getProfile() {
    return getProfile({
      success: (data) => {
        this.setState({profile: data, isChecked: data.enable_sso});
      }
    });
  },

  getPhoto() {
    return getPhoto({
      success: (data) => {
        this.setState({photo: data});
      }
    });
  },

  componentDidMount() {
  },

  render: template
});
