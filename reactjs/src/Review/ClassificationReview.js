import React, { Component } from 'react'
import { render } from 'react-dom'
import template from './ClassificationReview.rt'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import { makeRequest } from '../utils/http'

var ClassificationReview = React.createClass({
    render:template
});

module.exports = ClassificationReview;