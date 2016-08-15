import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './EditProfile.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import Constant from '../Constant.js';
import $, { JQuery } from 'jquery';
import update from 'react-addons-update';

//const ACTIVE = {background-color: '#0088cc'}
module.exports = React.createClass({
	mixins: [LinkedStateMixin],
	getInitialState() {
		return {
			photo :{},
			profile: {},
			Department: '', Location: '',  Corporate_phone:'', 
			Corporate_mobile:'' ,Use_active_directory: false, 	
			Enable_sso: false,
			NewEmail:'',
			CurrentPassforChangePass:'',
			NewPass:'',
			ConfirmPass:'',
			WindowID:'',
			CompanyName:'',
			Email:'',
			CurrentPass:'',
			user:{},
			changeEmail: {
				
			},
			
		};
	},
	getWindowID(event) {
		
		var update_scan_status = update(this.state, {
			profile: {
				windows_id: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	getCompanyName(event) {

		var update_scan_status = update(this.state, {
			profile: {
				company_name: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	getCorporateEmail(event) {
		var update_scan_status = update(this.state, {
			profile: {
				corporate_email: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	getdepartment(event) {
		var update_scan_status = update(this.state, {
			profile: {
				department: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	getLocation(event) {
		var update_scan_status = update(this.state, {
			profile: {
				location: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	getCorporatePhone(event) {
		var update_scan_status = update(this.state, {
			profile: {
				corporate_phone: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	getCorporatePhoneMobile(event) {
		var update_scan_status = update(this.state, {
			profile: {
				corporate_mobile: {$set: event.target.value}
			} 
		});
		this.setState(update_scan_status);
	},
	IsUseactivedirectory(event) {
		var update_scan_status = update(this.state, {
			profile: {
				use_active_directory: {$set: event.target.checked}
			} 
		});
		this.setState(update_scan_status);
	},
	IsEnablesso(event) {
		var update_scan_status = update(this.state, {
			profile: {
				enable_sso: {$set: event.target.checked}
			} 
		});
		this.setState(update_scan_status);
	},
	getCurrentPass(event) {
		this.setState({CurrentPass: event.target.value});
	},
	getNewEmail(event) {
		this.setState({NewEmail: event.target.value});
	},
	getCurrentPassforChangePass(event) {
		this.setState({CurrentPassforChangePass: event.target.value});
	},
	getNewPass(event) {
		this.setState({NewPass: event.target.value});
	},
	getConfirmPass(event) {
		this.setState({ConfirmPass: event.target.value});
	},
	/*linkState(component, key, path) {
	  if (path) {
	    return createHandler(component, key, path);
	  }
	 
	  const cache = component.__linkStateHandlers ||
	    (component.__linkStateHandlers = {});
	 
	  return cache[key] || (cache[key] = createHandler(component, key));
	},
	createHandler(component, key, path) {
	  return e => {
	    const el = e.target;
	    const value = el.type === 'checkbox' ? el.checked : el.value;
	    component.setState({
	      [key]: path ? component.state[key].setIn(path, value) : value,
	    });
	  };
	},*/

	editProfile(){
		
		
		var checkNull=0;
		if(this.state.profile.windows_id == ""|| this.state.profile.windows_id  == undefined){
			$('#WindowID').css('border', '1px solid #B94A48');
			$('#WindowIDErr').text("Please enter your WindowID")
			$('#WindowID').blur(function(){
				$('#WindowID').css('border', '1px solid #dde3ec');
				$('#WindowIDErr').text("")
			})
			checkNull++;
			
		}else {
			$('#WindowID').css('border', '1px solid #dde3ec');
		}

		if(this.state.profile.department == ""|| this.state.profile.department == undefined){
			$('#Department').css('border', '1px solid #B94A48');
			$('#DepartmentErr').text("Please enter your Department")
			$('#Department').blur(function(){
				$('#Department').css('border', '1px solid #dde3ec');
				$('#DepartmentErr').text("")
			})
			checkNull++;

		}else {
			$('#Department').css('border', '1px solid #dde3ec');
		}
		if(this.state.profile.company_name == ""|| this.state.profile.company_name == undefined){
			$('#CompanyName').css('border', '1px solid #B94A48');
			$('#CompanyNameErr').text("Please enter your Company Name")
			$('#CompanyName').blur(function(){
				$('#CompanyName').css('border', '1px solid #dde3ec');
				$('#CompanyNameErr').text("")
			})
			checkNull++;

		}else {
			$('#CompanyName').css('border', '1px solid #dde3ec');
		}
		if(this.state.profile.location == ""|| this.state.profile.location == undefined){
			$('#Location').css('border', '1px solid #B94A48');
			$('#LocationErr').text("Please enter your Location")
			$('#Location').blur(function(){
				$('#Location').css('border', '1px solid #dde3ec');
				$('#LocationErr').text("")
			})
			checkNull++;

		}else {
			$('#Location').css('border', '1px solid #dde3ec');
		}
		if(this.state.profile.corporate_email == ""|| this.state.profile.corporate_email == undefined){
			$('#Email').css('border', '1px solid #B94A48');
			$('#EmailErr').text("Please enter your Email")
			$('#Email').blur(function(){
				$('#Email').css('border', '1px solid #dde3ec');
				$('#EmailErr').text("")
			})
			checkNull++;

		}else {
			$('#Email').css('border', '1px solid #dde3ec');
		}
		if(this.state.profile.corporate_phone == ""|| this.state.profile.corporate_phone == undefined){
			$('#Corporate_phone').css('border', '1px solid #B94A48');
			$('#Corporate_phoneErr').text("Please enter your Corporate Phone (Landline)")
			$('#Corporate_phone').blur(function(){
				$('#Corporate_phone').css('border', '1px solid #dde3ec');
				$('#Corporate_phoneErr').text("")
			})
			checkNull++;

		}else {
			$('#Corporate_phone').css('border', '1px solid #dde3ec');
		}
		if(this.state.profile.corporate_mobile == ""|| this.state.profile.corporate_mobile == undefined){
			$('#Corporate_mobile').css('border', '1px solid #B94A48');
			$('#Corporate_mobileErr').text("Please enter your Corporate Phone (Mobile)")
			$('#Corporate_mobile').blur(function(){
				$('#Corporate_mobile').css('border', '1px solid #dde3ec');
				$('#Corporate_mobileErr').text("")
			})
			checkNull++;

		}else {
			$('#WindowID').css('border', '1px solid #dde3ec');
		}
		
		if(checkNull!=0){
			return;
		}
		var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (!filter.test(this.state.profile.corporate_email)) {
			$('#Email').css('border', '1px solid #B94A48');
			$('#EmailErr').text("Your email is invalid")
			$('#Email').blur(function(){
				$('#Email').css('border', '1px solid #dde3ec');
				$('#EmailErr').text("");      
			})
			return;
		}
		else {
			$('#Email').css('border', '1px solid #dde3ec');
		}
		
		if(isNaN(this.state.profile.corporate_phone)){
			$('#Corporate_phone').css('border', '1px solid #B94A48');
			$('#Corporate_phoneErr').text(" Corporate Phone is invalid")
			$('#Corporate_phone').blur(function(){
				$('#Corporate_phone').css('border', '1px solid #dde3ec');
				$('#Corporate_phoneErr').text("")
			})
			return;

		}else {
			$('#Corporate_phone').css('border', '1px solid #dde3ec');
			
		}
		if(isNaN(this.state.profile.corporate_mobile)){
			$('#Corporate_mobile').css('border', '1px solid #B94A48');
			$('#Corporate_mobileErr').text("Corporate Phone (Mobile) is invalid")
			$('#Corporate_mobile').blur(function(){
				$('#Corporate_mobile').css('border', '1px solid #dde3ec');
				$('#Corporate_mobileErr').text("")
			})
			return;

		}else {
			$('#Corporate_mobile').css('border', '1px solid #dde3ec');
			
		}
		
		
		$.ajax({
			url: Constant.SERVER_API + 'api/account/profile/',
			dataType: 'json',
			type: 'PUT',
			data: {
				"windows_id": this.state.profile.windows_id,
				"company_name":this.state.profile.company_name,
				"corporate_email": this.state.profile.corporate_email,
				"department": this.state.profile.department,
				"location": this.state.profile.location,
				"corporate_phone" :  this.state.profile.corporate_phone,
				"corporate_mobile" : this.state.profile.corporate_mobile,
				"use_active_directory" : this.state.profile.use_active_directory,
				"enable_sso" : this.state.profile.enable_sso,
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
			},
			success: function(data) {
				browserHistory.push('/Dashboard/Profile');
				console.log(data.token);

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


	changePhoto:function(){
		$.ajax({
			url: Constant.SERVER_API + 'api/account/change_photo/',
			dataType: 'json',
			type: 'PUT',
			data: {

			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
			},
			success: function(data) {
				console.log("ChangePass: ", data);
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

	ChangeEmail:function(){
		this.setState({success: ""});
		var i=0;	
		if(this.state.CurrentPass == ""|| this.state.CurrentPass == undefined){
			$('#currentPass').css('border', '1px solid #B94A48');
			$('#currentPassErr').text("Please enter your Current Password")
			$('#currentPass').blur(function(){
				$('#currentPass').css('border', '1px solid #dde3ec');
				$('#currentPassErr').text("")
			})
			i++;

		}else {
			$('#currentPass').css('border', '1px solid #dde3ec');
		}
		if(this.state.NewEmail == ""|| this.state.NewEmail == undefined){
			$('#newEmail').css('border', '1px solid #B94A48');
			$('#newEmailErr').text("Please enter new Email Address")
			$('#newEmail').blur(function(){
				$('#newEmail').css('border', '1px solid #dde3ec');
				$('#newEmailErr').text("")         
			})
			i++;

		}else {
			$('#newEmail').css('border', '1px solid #dde3ec');
		}
		var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if (!filter.test(this.state.NewEmail)) {
			$('#newEmail').css('border', '1px solid #B94A48');
			$('#newEmailErr').text("Email your enter is invalid");
			$('#newEmail').blur(function(){
				$('#newEmail').css('border', '1px solid #dde3ec');
				$('#newEmailErr').text("")         
			})
			return;
		}
		else {
			$('#newEmail').css('border', '1px solid #dde3ec');
		}
		if(i!=0){
			return;
		}



		$.ajax({
			url: Constant.SERVER_API + 'api/account/change_email/',
			dataType: 'json',
			type: 'PUT',
			data: {
				"current_password":this.state.CurrentPass,
				"email" :this.state.NewEmail,
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
			},
			success: function(data) {
				
			/*	this.setState({success: data.statusText});
			console.log("ChangeEmail: ", data);*/
		}.bind(this),
		error: function(xhr, status, error) {
			alert("error")
			console.log(xhr);
/*
				var jsonResponse = JSON.parse(xhr.responseText);
				this.setState( {errorEmail: jsonResponse});*/
				//console.log(jsonResponse);
				if(xhr.status === 401)
				{
					browserHistory.push('/Account/SignIn');
				}
			}.bind(this)
		});

	},
	

	changePassword:function(){
		var i=0;
		if(this.state.CurrentPassforChangePass == ""|| this.state.CurrentPassforChangePass == undefined){
			$('#currentPass1').css('border', '1px solid #B94A48');
			$('#currentPass1Err').text("Please enter your Current Password");
			$('#currentPass1').blur(function(){
				$('#currentPass1').css('border', '1px solid #dde3ec');
				$('#currentPass1Err').text("");
			})
			i++

		} else {
			$('#currentPass1').css('border', '1px solid #dde3ec');
		}
		if(this.state.NewPass == ""|| this.state.NewPass == undefined){
			$('#newPass').css('border', '1px solid #B94A48');
			$('#newPassErr').text("Please enter new Password");
			$('#newPass').blur(function(){
				$('#newPass').css('border', '1px solid #dde3ec');
				$('#newPassErr').text("");
			})
			i++
		} else {
			$('#newPass').css('border', '1px solid #dde3ec');
		}
		if(this.state.ConfirmPass == ""|| this.state.ConfirmPass == undefined){
			$('#ConfirmPass').css('border', '1px solid #B94A48');
			$('#ConfirmPassErr').text("Please enter Confirm Password");
			$('#ConfirmPass').blur(function(){
				$('#ConfirmPass').css('border', '1px solid #dde3ec');
				$('#ConfirmPassErr').text("");
			})
			i++

		}else {
			$('#ConfirmPass').css('border', '1px solid #dde3ec');
		}


		if(i!=0){
			return;
		}
		if(this.state.NewPass != this.state.ConfirmPass ){
			
			$('#errorPass').text('Please enter the same Password');
			return;
		}else{
			$('#errorPass').text('');
		}


		$.ajax({
			url: Constant.SERVER_API + 'api/account/change_password/',
			dataType: 'json',
			type: 'PUT',
			data: {
				"current_password":this.state.CurrentPassforChangePass,
				"new_password" :this.state.NewPass,
				"confirm_password" : this.state.ConfirmPass
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
			},
			success: function(data) {
				alert("success");
				console.log("ChangePass: ", data);
			}.bind(this),
			error: function(xhr, status, error) {

				console.log(xhr);
				var jsonResponse = JSON.parse(xhr.responseText);
				this.setState( {error: jsonResponse});
				console.log(jsonResponse);
				if(xhr.status === 401)
				{
					browserHistory.push('/Account/SignIn');
				}
			}.bind(this)
		});


	},

	uploadFile: function () {
		var fileInput = document.getElementById('myFile');
		var file = fileInput.files[0];

    // fd dung de luu gia tri goi len
	    var fd = new FormData();
	    fd.append('file', file);
	    var fd = document.getElementById("myFile").value;
	    $.ajax({
	    	url: Constant.SERVER_API + 'api/account/change_photo/',
	    	dataType: 'json',
	    	type: 'PUT',
	    	data: fd,
    	beforeSend: function(xhr) {
    		xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
    	},
    	success: function(data) {

    		browserHistory.push('/Dashboard/Profile');

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

componentWillMount(){
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
	$.ajax({
		url: Constant.SERVER_API + 'api/account/change_photo/',
		dataType: 'json',
		type: 'GET',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
		},
		success: function(data) {

			this.setState( {photo: data});

			console.log("photo: ", photo);
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

imgError(){
	this.image.onerror = "";
	this.image.src = "/assets/images/post-thumb-1.png";
	return true;
},
componentDidMount() 
{

       // this.ChangeEmail();

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
