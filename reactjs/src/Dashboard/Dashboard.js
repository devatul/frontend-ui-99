import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Dashboard.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react/lib/update'
import _ from 'lodash'
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
            total_pending : 0,
            total_notification : 0 ,
            pending_list: [],
            role: '',
            typeAlert: 'none',
            checkAlert : 'none'
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


    logOut() {
        //console.log(sessionStorage.getItem('token'));
        sessionStorage.removeItem('token');
        debugger
        browserHistory.push('/Account/SignIn');
    },
    componentDidUpdate(prevProps, prevState) {
        let pending_list = JSON.parse(localStorage.getItem('pending_list') || '{}');
        console.log(pending_list)
        if (this.state.typeAlert != prevState.typeAlert) {
            debugger
            this.setState({
                pending_action: pending_list
            })
            let alert = this.state.typeAlert
            if(this.state.typeAlert != 'none'){
                this.filter(pending_list, alert);
            }

        }
        /*if(this.state.checkAlert != prevState.checkAlert ){
             this.setState({
                pending_action: pending_list
            })
        }*/
    },
    componentDidMount() {
        console.log("Didcmoit");
        $.ajax({
            url: Constant.SERVER_API + 'api/account/role/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                debugger
                this.setState({ role: data.role });
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
                        total: { $set: data.length },
                        list: { $set: data }
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
            debugger
            var completed = [];
            var pending = [] ;
            var warning = 0 ;
            var danger = 0 ;
            var total_pending = 0 ;
            var total_notification = 0;
            $.ajax({
                url: Constant.SERVER_API + 'api/notification/?period=completed',
                dataType: 'json',
                type: 'GET',
                async: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                },
                success: function(data) {
                    debugger
                    total_notification += data.length
                    completed = data.slice(0, 3);
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
            $.ajax({
                url: Constant.SERVER_API + 'api/notification/?period=pending',
                dataType: 'json',
                type: 'GET',
                async: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                },
                success: function(data) {
                    debugger
                    total_pending =  data.length
                    total_notification += data.length
                    pending =  data.slice(0, 3);
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
            $.ajax({
                url: Constant.SERVER_API + 'api/notification/?urgency=high',
                dataType: 'json',
                type: 'GET',
                async: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                },
                success: function(data) {
                    warning = data.length
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
            $.ajax({
                url: Constant.SERVER_API + 'api/notification/?urgency=very_high',
                dataType: 'json',
                type: 'GET',
                async: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
                },
                success: function(data) {
                    danger = data.length
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });


            var update_notification = update(this.state, {
                notification: {
                    list: {
                        $set: completed
                    },

                },
                pending_action: {
                    list: {
                        $set: pending
                    },
                    warning: { $set: warning },
                    danger: { $set: danger }
                },
                total_pending : {
                    $set: total_pending
                },
                total_notification : {
                    $set : total_notification
                }
            });

        this.setState(update_notification);
        localStorage.setItem('pending_list', JSON.stringify(update_notification.pending_action))

        /*this.setState({pending_list : update_notification})
        console.log(this.state.pending_list)*/
    },

    hideMenu() {
        // close notification-menu when changes route
        $('.dropdown-backdrop').click()
    },
    notificationHandle() {
        $("#total_notification").hide();
    },
    changeToggle(event) {

        $("#" + event).find("b").removeClass('fa-caret-down').addClass('fa-caret-up');
        $('body').click(function() {

            $("#" + event).find("b").removeClass('fa-caret-up').addClass('fa-caret-down');

        })
    },

    getActive: function() {
        let path = window.location.pathname,
            review = /^\/Review\//,
            insight = /^\/Insight\//;

        switch (true) {
            case review.test(path) === true:
                return 'Review';
            case insight.test(path) === true:
                return 'Insight';
        }
    },

    getfilterAlert(type) {
        if(this.state.typeAlert == 'none'){
             this.setState({ typeAlert: type })
        } else {
              let pending_list = JSON.parse(localStorage.getItem('pending_list') || '{}');
                this.setState({
                pending_action: pending_list

            })
                this.setState({
                    typeAlert : 'none'
                })
        }




    },
    filter(data, alert) {
        debugger
        let pending = _.cloneDeep(data.list);
        let arr = []

        _.forEach(pending, function(object, index) {
            if (object.urgency != alert) {
                arr.push(index)
            }
        })
        _.pullAt(pending, arr);
        arr = [];
        console.log('pending_list', pending)
        this.setState(update(this.state, {
            pending_action: {
                list: { $set: pending }
            },

        }))
        console.log(this.state.pending_action)
    },

    render: template
});
