import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink, browserHistory } from 'react-router'
import template from './EditProfile.rt'
import { getProfile, getPhoto } from '../utils/function'
import { forEach } from 'lodash'
import { makeRequest } from '../utils/http'

module.exports = React.createClass({
    propTypes: {
        changeImage: PropTypes.func,
    },
    getInitialState() {
        return {
            photo: {},
            profile: null,

        };
    },
    getProfile() {
        return getProfile({
            success: (data) => {
                this.setState({ profile: this.config(data) })
            }
        });
    },
    getPhoto() {
        return getPhoto({
            success: (data) => {
                this.setState({ photo: data })
            }
        });
    },
    config(data) {
        _.forEach(data, function(value, key) {
            if (value == null) {
                data[key] = ''
            }
        })
        return data
    },
    componentDidMount() {
        this.getProfile(),
        this.getPhoto()
    },
    render: template
});
