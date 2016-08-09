import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Notification.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import javascript from '../script/javascript.js'
import Constant from '../Constant.js'

var Notification = React.createClass
({
    getInitialState() {
        return {
            notification: {
                today: [],
                yesterday: [],
                last_7_days: [],
                last_30_days: [],
                older: [],
                total: 0
            },
            notiType: '',
            warningNoti: 0,
            dangerNoti: 0,
            filterUpdate: 'update-default'
        };
    },
    componentDidMount() {
        this.getDummyNotification();
        //this.getNotification();
    },

    //TODO: rewrite filters to react components
    removeFilter() {
        if (this.state.filterUpdate == 'update-pending') {
            $('[data-update-status=update-pending]').show();
        } else {
            $('[data-noti-type]').show();
        };
        
        $('.filter-noti-icon').parents('span').show();
        var notiType = '';
        this.setState({"notiType": notiType });
    },

    checkPanelVisibility() {
        $('.panel-body').each(function(){
            var current = $(this);
            if (!current.children().is(':visible')) {
                current.parent().hide();
            }
        })
    },
    checkEmptyData() {

        if(!$(".panel-noti").is(':visible')) {
            $("#emptyData").show();
        } else {
            $("#emptyData").hide();
        }
    },

    filterAlert(event) {
        if (this.state.filterUpdate == 'update-completed') {

        } else {
            var selected = event.target.getAttribute('data-type');
            console.log(selected);
            this.filterNotification()

            if (this.state.notiType == selected){
                this.removeFilter();
            }
            else{
                var notiType = event.target.getAttribute('data-type');
                $('.filter-noti-icon').parents('span').hide();
                $(".filter-noti-icon[data-type='" + notiType + "']").parents('span').show();
                $('[data-noti-type]').each(function(){
                    // console.log($(this).attr('data-noti-type'));
                    if ($(this).attr('data-noti-type') == notiType){
                        $(this).show();
                    }
                    else{
                        $(this).hide();   
                    }
                });
                this.setState({"notiType": notiType });
                this.checkPanelVisibility();
            };
            this.checkEmptyData();
        };
    },

    filterNotification() {
        var filterType = $( '.filter-noti option:selected' ).attr('value');
        this.setState({"filterUpdate": filterType });
        console.log(filterType);
        this.removeFilter();
        if (filterType == 'update-default'){
            $('[data-update-status]').show();
            $('[data-last-update]').show();
        }
        else if (filterType == 'update-pending' || filterType == 'update-completed'){
            $('[data-last-update]').show();
            $('[data-update-status]').hide();
            $('[data-update-status='+filterType+']').show();
            this.checkPanelVisibility();
        }
        else if (filterType == 'update-week'){
            $('[data-update-status]').show();
            $('[data-last-update]').hide();
            $('[data-last-update='+filterType+']').show();
            $('[data-last-update="update-yesterday"]').show();
            $('[data-last-update="update-today"]').show();
        }
        else{
            $('[data-update-status]').show();
            $('[data-last-update]').hide();
            $('[data-last-update='+filterType+']').show();
        }
        this.checkEmptyData();
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
                    xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
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
                    today: {$set: [{
                                    "created": "today", 
                                    "id": 1, 
                                    "message": "Your original challenge has been passed back to you - You are required to review the document cyber_security_healthcheck_-_cs149981.xls by the latest 5th September.", 
                                    "urgency": "low"
                                }]},
                    yesterday: {$set: [{
                                    "created": "yesterday", 
                                    "id": 2, 
                                    "message": "Your original challenge has been passed back to you - You are required to review the document 02-Suspicious-Activity-Reporting-RIS.doc by the latest 29th August.", 
                                    "urgency": "low"
                                }] },
                    last_7_days: {$set: [{
                                    "created": "7_days_ago", 
                                    "id": 3, 
                                    "message": "You have challenged the classification of the document 02-Suspicious-Activity-Reporting-RIS.doc.", 
                                    "urgency": "done"
                                },{
                                    "created": "7_days_ago", 
                                    "id": 4, 
                                    "message": "You have challenged the classification of the document cyber_security_healthcheck_-_cs149981.xls", 
                                    "urgency": "done"
                                },{
                                    "created": "7_days_ago", 
                                    "id": 5, 
                                    "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 25th August.", 
                                    "urgency": "hight"
                                }
                                ]},
                    last_30_days: {$set: [] },
                    older: {$set: [{
                                    "created": "older", 
                                    "id": 6, 
                                    "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 15th August.", 
                                    "urgency": "very hight"
                                },{
                                    "created": "older", 
                                    "id": 7, 
                                    "message": "You have completed the review of 10 document in Legal/Compliance category.", 
                                    "urgency": "done"
                                }] }
                },
                warningNoti: {$set: 1 },
                dangerNoti: {$set: 1 },
                total: {$set: 4 }
            });
        } else if (role === Constant.role.IS_2ND) {
            var update_notification = update(this.state, {
                notification: {
                    last_7_days: {$set: [
                                {
                                    "created": "7_days_ago", 
                                    "id": 8, 
                                    "message": "Scan Finished- You are required to review the classification and to assign a reviewer.", 
                                    "urgency": "hight"
                                },{
                                    "created": "7_days_ago", 
                                    "id": 9, 
                                    "message": "Scan in Progress - You are responsible of the classification of the data repository demo. You will be informed shortly what the next required steps will be.", 
                                    "urgency": "done"
                                }
                                ]}
                },
                warningNoti: {$set: 1 },
                dangerNoti: {$set: 0 },
                total: {$set: 1 }
            });
        }
        this.setState(update_notification);
        console.log("test: ", this.state.notification);
    },

    getNotification() {
        $.ajax({
            url: Constant.SERVER_API + 'api/notification/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var today = [];
                var yesterday = [];
                var last_7_days = [];
                var last_30_days = [];
                var older = [];
                for (var i = 0; i < data.length; i++) {
                    var date1 = new Date();
                    var date2 = new Date();
                    var date3 = new Date();
                    var date4 = new Date();
                    var created = new Date(data[i].created);
                    date2.setDate(date2.getDate()-1);
                    date3.setDate(date3.getDate()-7);
                    date4.setMonth(date4.getMonth()-1);
                    if(date1.getDate() == created.getDate() && date1.getMonth() == created.getMonth() && date1.getFullYear() == created.getFullYear()  ) {
                        //today
                        today.push(data[i]);
                    } else if(date2.getDate() == created.getDate() && date2.getMonth() == created.getMonth() && date2.getFullYear() == created.getFullYear()  ) {
                        //yesterday
                        yesterday.push(data[i]);
                    } else if(created >= date3) {
                        //7 days
                        last_7_days.push(data[i]);
                    } else if(created >= date4) {
                        //30 days
                        last_30_days.push(data[i]);
                    } else {
                        //older

                        older.push(data[i]);
                    }
                    
                }
                var update_notification = update(this.state, {
                    notification: {
                        today: {$set: today},
                        yesterday: {$set: yesterday },
                        last_7_days: {$set: last_7_days },
                        last_30_days: {$set: last_30_days },
                        older: {$set: older }
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
    render:template
});

module.exports = Notification;
