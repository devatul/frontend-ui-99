'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import HelpButton from './HelpButton'

var TabName = React.createClass({
	render(){
		return(
			 <ul className="my-profile-header nav nav-tabs" style={{'marginLeft':'5px;'}}>
	                <li className="active">
	                  <a href="#toggle" data-toggle="tab" aria-expanded="false">English</a>
	                </li>
	                <li className="">
	                  <a href="#" data-toggle="tab" aria-expanded="true"><span style={{"color":"#ACACAC"}}>French</span></a>
	                </li>
	                <li className="">
	                  <a href="#" data-toggle="tab" aria-expanded="true">German</a>
	                </li>
              </ul>
		)
	}
});

module.exports = TabName
