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
        function getRole() {
            var result = "";
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
                    list: {
                        $set: [{
                            "created": "today",
                            "id": 1,
                            "message": "You have completed the review of 10 document in Legal/Compliance category.",
                            "urgency": "done"
                        }, {
                            "created": "today",
                            "id": 2,
                            "message": "You have challenged the classification of the document 02-Suspicious-Activity-Reporting-RIS.doc.",
                            "urgency": "adone"
                        }, {
                            "created": "today",
                            "id": 3,
                            "message": "You have completed the review of 10 document in Legal/Compliance category.",
                            "urgency": "done"
                        }]
                    },
                    total: { $set: 4 }
                },
                pending_action: {
                    list: {
                        $set: [{
                            "created": "today",
                            "id": 4,
                            "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 15th August.",
                            "urgency": "very hight"
                        }, {
                            "created": "today",
                            "id": 5,
                            "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 25th August.",
                            "urgency": "hight"
                        }, {
                            "created": "today",
                            "id": 6,
                            "message": "Your original challenge has been passed back to you - You are required to review the document 02-Suspicious-Activity-Reporting-RIS.doc by the latest 29th August.",
                            "urgency": "low"
                        }, {
                            "created": "today",
                            "id": 6,
                            "message": "Your original challenge has been passed back to you - You are required to review the document cyber_security_healthcheck_-_cs149981.xls by the latest 5th September.",
                            "urgency": "low"
                        }]
                    },
                    warning: { $set: 1 },
                    danger: { $set: 1 }
                },
            });
        } else if (role === Constant.role.IS_2ND) {
            var update_notification = update(this.state, {
                notification: {
                    list: {
                        $set: [{
                            "created": "today",
                            "id": 1,
                            "message": "Scan in Progress - You are responsible of the classification of the data repository demo. You will be informed shortly what the next required steps will be.",
                            "urgency": "done"
                        }]
                    },
                    total: { $set: 40 }
                },
                pending_action: {
                    list: {
                        $set: [{
                            "created": "today",
                            "id": 2,
                            "message": "Scan Finished- You are required to review the classification and to assign a reviewer.",
                            "urgency": "hight"
                        }]
                    },
                    warning: { $set: 1 },
                    danger: { $set: 0 }
                }
            });
        }
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
            default:
                ''
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
