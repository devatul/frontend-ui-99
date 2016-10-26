import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink, browserHistory } from 'react-router'
import template from './Profile.rt'
import Constant from '../Constant.js';
import $, { JQuery } from 'jquery';
module.exports = React.createClass({
  	getInitialState() {
	    return {
	   		 profile:{},
	    };
	},
	componentWillMount(){
		this.getProfile();
		this.getPhoto();	
	},
	getProfile(){
		$.ajax({
            url: Constant.SERVER_API + 'api/account/profile/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
            	
                this.setState( {profile: data});
                console.log("scan result: ", data);
            }.bind(this),
            error: function(xhr, status, error) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
	},
	getPhoto(){
		$.ajax({
			url: Constant.SERVER_API + 'api/account/change_photo/',
			dataType: 'json',
			type: 'GET',
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
			},
			success: function(data) {

				this.setState( {photo: data});

				console.log("photo: ", this.state.photo);
			}.bind(this),
			error: function(xhr, status, error) {
				console.log(xhr);
				var jsonResponse = JSON.parse(xhr.responseText);
				console.log(jsonResponse);
				if(xhr.status === 401)
				{
					browserHistory.push('/Account/SignIn');
				}
			}.bind(this)
		});
	},
	componentDidMount() {
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
