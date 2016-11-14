import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink, browserHistory } from 'react-router'
import template from './Profile.rt'
import { makeRequest } from '../utils/http'
import Constant from '../Constant.js';
import $, { JQuery } from 'jquery';
module.exports = React.createClass({
    getInitialState() {
        return {
            profile: {},
            isChecked: false
        };
    },
    componentWillMount() {
        this.getProfile();
        this.getPhoto();
    },
    /*  shouldComponentUpdate(nextProps , nextState){
          if(this.state.profile != nextState.profile){
              return true
          }
          return false
      },*/
    changeActive() {
        let _profile = _.cloneDeep(this.state.profile);
        _profile.use_active_directory = _profile.use_active_directory ? false : true,
            this.setState({ profile: _profile })
    },
    changeEnable() {
        this.setState({isChecked: !this.state.isChecked })
    },
    getProfile() {
        return makeRequest({
            path: 'api/account/profile/',
            success: (data) => {
                this.setState({ profile: data, isChecked: data.enable_sso })
            }
        });
    },
    getPhoto() {
        return makeRequest({
            path: 'api/account/change_photo/',
            success: (data) => {
                this.setState({ photo: data })
            }
        });
    },
    componentDidMount() {},
    render: template
});
