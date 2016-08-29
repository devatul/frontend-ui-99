import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Dashboard.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import $ from 'jquery'
import Constant from '../Constant.js';
//const ACTIVE = {background-color: '#0088cc'}
module.exports = React.createClass({
 mixins: [LinkedStateMixin],
 getInitialState() {
   return {
      newsfeed: {},
      notification: {
        total: 0,
        list: []
    },
    pending_action: {
        warning: 0,
        danger: 0,
        list: []
    },
    role:''
};
},
propTypes: {
    noti: React.PropTypes.shape({
        total: React.PropTypes.number.isRequired,
        list: React.PropTypes.array
    })
},
getDefaultProps() {
    return {
      noti: {
        total: 0,
        list: []
    }
};
},
logOut(){
		//console.log(sessionStorage.getItem('token'));
		sessionStorage.removeItem('token');
		browserHistory.push('/Account/SignIn');
	},
	componentDidMount() 
	{
        console.log("Didcmoit");
        $.ajax({
            url: Constant.SERVER_API + 'api/account/role/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({role: data.role});
                console.log("role: ", this.state.role);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        this.getDummyNotification();

    },
    getNotification() {
        $.ajax({
            url: Constant.SERVER_API + 'api/notification/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                var update_notification = update(this.state, {
                    notification: {
                        total: {$set: data.length},
                        list: {$set: data}
                    } 
                });
                this.setState(update_notification);
                console.log("notification: ", this.state.notification);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
    },

    getDummyNotification() {
        //temproary for dummy data 
        function getRole () {
            var result="";
            $.ajax({
                url: Constant.SERVER_API + 'api/account/role/',
                dataType: 'json',
                type: 'GET',
                async: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                },
                success: function(data) {
                    result = data; 
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
            return result.role
        }
        var role = getRole();
        if (role === Constant.role.IS_1ST) {
            var update_notification = update(this.state, {
                notification: {
                    list: {$set: [{
                        "created": "today", 
                        "id": 1, 
                        "message": "You have completed the review of 10 document in Legal/Compliance category.", 
                        "urgency": "done"
                    },
                    {
                        "created": "today", 
                        "id": 2, 
                        "message": "You have challenged the classification of the document 02-Suspicious-Activity-Reporting-RIS.doc.", 
                        "urgency": "adone"
                    },
                    {
                        "created": "today", 
                        "id": 3, 
                        "message": "You have completed the review of 10 document in Legal/Compliance category.", 
                        "urgency": "done"
                    }]},
                    total: {$set: 4}
                },
                pending_action: {
                    list: {$set: [{
                        "created": "today", 
                        "id": 4, 
                        "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 15th August.", 
                        "urgency": "very hight"
                    },
                    {
                        "created": "today", 
                        "id": 5, 
                        "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 25th August.", 
                        "urgency": "hight"
                    },
                    {
                        "created": "today", 
                        "id": 6, 
                        "message": "Your original challenge has been passed back to you - You are required to review the document 02-Suspicious-Activity-Reporting-RIS.doc by the latest 29th August.", 
                        "urgency": "low"
                    },
                    {
                        "created": "today", 
                        "id": 6, 
                        "message": "Your original challenge has been passed back to you - You are required to review the document cyber_security_healthcheck_-_cs149981.xls by the latest 5th September.", 
                        "urgency": "low"
                    }
                    ]},
                    warning: {$set: 1},
                    danger: {$set: 1}
                } 
            });
        } else if (role === Constant.role.IS_2ND){            
            var update_notification = update(this.state, {
                notification: {
                    list: {$set: [{
                        "created": "today", 
                        "id": 1, 
                        "message": "Scan in Progress - You are responsible of the classification of the data repository demo. You will be informed shortly what the next required steps will be.", 
                        "urgency": "done"
                    }]},
                    total: {$set: 40}
                },
                pending_action: {
                    list: {$set: [{
                        "created": "today", 
                        "id": 2, 
                        "message": "Scan Finished- You are required to review the classification and to assign a reviewer.", 
                        "urgency": "hight"
                    }]},
                    warning: {$set: 1},
                    danger: {$set: 0}
                } 
            });
        }
        this.setState(update_notification);
        console.log("dummy notification: ", this.state.notification);
    },

    hideMenu() {
        // close notification-menu when changes route
        $('.dropdown-backdrop').click()
    },
    notificationHandle() {
        $("#total_notification").hide();
    },
    changeToggle(event){
       
        $("#"+event).find("b").removeClass('fa-caret-down').addClass('fa-caret-up');
        $('body').click(function() {

            $("#"+event).find("b").removeClass('fa-caret-up').addClass('fa-caret-down');

        })
    },

    filterAlert(event) {
        var selected = event.target.getAttribute('data-type');
        console.log(selected);

        if (this.state.notiType == selected){
            $('[data-noti-type-popup]').show();
            $('.filter-noti-icon-popup').parents('span').css("visibility","visible");
            var notiType = '';
            this.setState({"notiType": notiType });
        }
        else{
            var notiType = event.target.getAttribute('data-type');
            $('.filter-noti-icon-popup').parents('span').css("visibility","hidden");
            $(".filter-noti-icon-popup[data-type='" + notiType + "']").parents('span').css("visibility","visible");
            $('[data-noti-type-popup]').each(function(){
                // console.log($(this).attr('data-noti-type'));
                if ($(this).attr('data-noti-type-popup') == notiType){
                    $(this).show();
                }
                else{
                    $(this).hide();   
                }
            });
            this.setState({"notiType": notiType });
        };
    },

    render:template
});
