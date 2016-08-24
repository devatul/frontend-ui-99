import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './MyTeam.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import Constant from '../Constant.js';
import $, { JQuery } from 'jquery';
import update from 'react-addons-update';

module.exports = React.createClass({


	getInitialState() {
	    return {
	    		role:'',
	    		content :''
	    };
	},
	componentDidMount(){
		$.ajax({
            url: Constant.SERVER_API + 'api/account/role/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
               if(data.role == Constant.role.IS_2ND){
				this.setState({content:'Your team is comprised of all the reviewers which you have currently assigned.'})
			}else{
				this.setState({content:'Your team is comprised of all the reviewers which you have currently the same category assigned.'})
			}
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        })

	},		
      render:template
});