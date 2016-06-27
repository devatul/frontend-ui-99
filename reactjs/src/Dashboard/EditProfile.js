import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './EditProfile.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'

//const ACTIVE = {background-color: '#0088cc'}
module.exports = React.createClass({
  	mixins: [LinkedStateMixin],
  	getInitialState() {
	    return {
	    	
	    };
	},
	componentDidMount() 
	{
		$(document).ready(function(){
			$("p.on_off").click(function() {
				$(this).toggleClass("on_off_b");
			});
			/*$("p.on_off_click").click(function() {
				$(this).toggleClass("on_off");
			});*/
			$("li.pro_header_li>div.profile_header_submit").click(function(){
				$("li.pro_ul_header_li>ul.pro_ul_header").toggleClass("pro_ul_header_b");
			});
			$("div.ios-switch").click(function(){
				$("div.my-profile-check-none").toggleClass("my-profile-check");
			});
			
			
			$("div.off").click(function(){
				$(this).toggleClass("on");
			});
			$("div.btn_edit").click(function(){
				$(this).toggleClass("btn_edit_b");
			});
			$("input.my-note-input").click(function(){
				$(this).next().toggleClass("checkbox-inline_b");
			});
		});

	},
    render:template
});
