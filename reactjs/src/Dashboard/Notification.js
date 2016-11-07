import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Notification.rt'
import update from 'react/lib/update'
import javascriptTodo from '../script/javascript.todo.js';
import Constant from '../Constant.js'
import _ from 'lodash'
import $ from 'jquery'

var Notification = React.createClass({
    getInitialState() {
        return {

            content: '',
            notification: {
                today: [],
                yesterday: [],
                last_7_days: [],
                last_30_days: [],
                older: [],
                total: 0
            },
            styleList: {
                today: '',
                yesterday: '',
                last_7_days: '',
                last_30_days: '',
                older: '',
            },
            noti_Select: {},
            notiType: '',
            warningNoti: 0,
            dangerNoti: 0,
            selected: 'update',

            filterUpdate: 'update-default',
            filtersAlert: 'none',
            filter: {
                selectbox: '',
                alert: ''
            },
            default: ''

        };
    },
    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.notification != nextState.notification) {
            return true;
        }
        if (this.state.styleList != nextState.styleList) {
            return true;
        }
        if (this.state.selected != nextState.selected) {
            return true;
        }
        if (this.state.filterUpdate != nextState.filterUpdate) {
            return true;
        }
        if (this.state.filtersAlert != nextState.filterAlert) {
            return true;
        }
        if (this.state.filter != nextState.filter) {
            return true;
        }


    },
    componentDidUpdate(prevProps, prevState) {

        var notification1 = JSON.parse(localStorage.getItem('notification') || '{}').notification;
        console.log('notification_local', notification1);

        if (this.state.filter != prevState.filter) {
            if (this.state.filter.alert == 'high') {

                this.setState({ filtersAlert: 'none' })
                this.filterHight(notification1);
            }
            if (this.state.filter.alert == 'veryhigh') {
                this.setState({ filtersAlert: 'none' })
                this.filtersVeryHight(notification1);
                console.log('content', this.state.content)
            }
        }

        if (this.state.filtersAlert != prevState.filtersAlert) {

            if (this.state.filtersAlert == 'none') {
                this.setState({
                        notification: notification1

                    })
                    /* this.setState({
                         filterUpdate: 'update-default'
                     })*/
                this.setState({
                    filtersAlert: 'none',
                })
                this.setState({
                        filter: {
                            selectbox: '',
                            alert: ''
                        },
                    })
                    /* this.setState({
                           styleList: {
                             today: 'block',
                             yesterday: 'block',
                             last_7_days: 'block',
                             last_30_days: 'block',
                             older: 'block'
                         },
                     })*/
                this.setState({ content: 'Number of actions pending for you to complete. ' + this.state.dangerNoti + (this.state.dangerNoti > 1 ? " actions are" : " action is") + ' required with high priority and ' + this.state.warningNoti + (this.state.warningNoti > 1 ? " actions are" : " action is") + ' required with medium priority', })
            }
        }
        if (this.state.selected != prevState.selected) {

            this.setState({
                notification: notification1

            })
            this.setState({ filtersAlert: 'none' })
            console.log('noti_didUpdate', this.state.notification)
            if (this.state.filterUpdate == 'update-pending') {

                this.setState({ filterUpdate: 'update-default' })
                this.pendingAction(notification1);
            }
            if (this.state.filterUpdate == 'update-completed') {

                this.setState({ filterUpdate: 'update-default' })
                this.completedAction(notification1);
            }
        }
    },

    componentDidMount() {
        javascriptTodo();
        this.getNotification();
        //this.getNotification();
    },

    filterAlert(value) {

        let alert = this.state.filtersAlert
        let alertUpdate = update(this.state, {
            filter: {
                alert: { $set: value }
            }
        })
        this.setState(alertUpdate);


        if (value == 'high') {
            this.setState({ content: 'Number of actions pending for you to complete. ' + this.state.warningNoti + (this.state.warningNoti > 1 ? ' actions are' : ' action is') + ' required with medium priority.' })
            if (alert == 'none') {
                this.setState({ filtersAlert: 'high' })
            } else {
                this.setState({ filtersAlert: 'none' })

            }

        }
        if (value == 'veryhigh') {
            this.setState({ content: 'Number of actions pending for you to complete.  ' + this.state.dangerNoti + (this.state.dangerNoti > 1 ? ' actions are' : ' action is') + ' required with hight priority.' })
            if (alert == 'none') {
                this.setState({ filtersAlert: 'veryhigh' })
            } else {
                this.setState({ filtersAlert: 'none' })
            }

        }
    },
    filterNotification(event) {

        let value = event.target.value;
        if (this.state.filter.alert != '') {

            let alert = this.state.filter.alert
            this.filter(alert, value);
        } else {
            if (value == 'update-today') {
                let updateStyle = update(this.state, {

                    styleList: {
                        today: { $set: 'block' },
                        yesterday: { $set: 'none' },
                        last_7_days: { $set: 'none' },
                        last_30_days: { $set: 'none' },
                        older: { $set: 'none' }
                    },
                    filter: {
                        selectbox: { $set: value }
                    },

                    selected: { $set: value }
                })

                this.setState(updateStyle)
                this.setState({ filterUpdate: value })
            }
            if (value == 'update-week') {
                let updateStyle = update(
                    this.state, {
                        styleList: {
                            today: { $set: 'block' },
                            yesterday: { $set: 'block' },
                            last_7_days: { $set: 'block' },
                            last_30_days: { $set: 'none' },
                            older: { $set: 'none' }
                        },
                        filter: {
                            selectbox: { $set: value }
                        },
                        selected: { $set: value }

                    }

                )
                this.setState({ selected: value })
                this.setState(updateStyle)
                this.setState({ filterUpdate: 'update-week' })
            }
            if (value == 'update-default') {
                let updateStyle = update(
                    this.state, {
                        styleList: {
                            today: { $set: 'block' },
                            yesterday: { $set: 'block' },
                            last_7_days: { $set: 'block' },
                            last_30_days: { $set: 'block' },
                            older: { $set: 'block' }
                        },
                        filter: {
                            selectbox: { $set: value }
                        },
                        selected: { $set: value }

                    }
                )
                this.setState({ selected: value })
                this.setState(updateStyle)
                this.setState({ filterUpdate: value })
            }
            if (value == 'update-pending') {

                let updateStyle = update(
                    this.state, {
                        styleList: {
                            today: { $set: 'block' },
                            yesterday: { $set: 'block' },
                            last_7_days: { $set: 'block' },
                            last_30_days: { $set: 'block' },
                            older: { $set: 'block' }
                        },
                        filter: {
                            selectbox: { $set: value }
                        },
                        selected: { $set: value }

                    }
                )
                this.setState({ selected: value })
                this.setState(updateStyle)

                /*this.pendingAction();*/
                this.setState({ filterUpdate: value })
            }
            if (value == 'update-completed') {
                let updateStyle = update(
                    this.state, {
                        styleList: {
                            today: { $set: 'block' },
                            yesterday: { $set: 'block' },
                            last_7_days: { $set: 'block' },
                            last_30_days: { $set: 'block' },
                            older: { $set: 'block' }
                        },
                        filter: {
                            selectbox: { $set: value }
                        },
                        selected: { $set: value }

                    }
                )
                this.setState({ selected: value })
                this.setState(updateStyle)


                /*this.completedAction();*/
                this.setState({ filterUpdate: value })

            }
        }
        console.log('value', this.state.selected)

    },
    pendingAction(noti) {
        let notification = _.cloneDeep(noti);
        let arr = []

        _.forEach(notification, function(object, index) {

            if (_.isObject(object)) {
                for (let i = 0; i < object.length; i++) {
                    if (object[i].urgency == 'done') {
                        arr.push(i)
                    }
                }
                _.pullAt(object, arr);
                arr = [];
            }

        })
        this.setState(update(this.state, {
            notification: { $set: notification }
        }))

    },
    filter(alert, value) {
        if (value == 'update-today') {
            let updateStyle = update(this.state, {

                styleList: {
                    today: { $set: 'block' },
                    yesterday: { $set: 'none' },
                    last_7_days: { $set: 'none' },
                    last_30_days: { $set: 'none' },
                    older: { $set: 'none' }
                },

            })

            this.setState(updateStyle)
            this.setState({ filterUpdate: value })
        }
        if (value == 'update-week') {
            let updateStyle = update(
                this.state, {
                    styleList: {
                        today: { $set: 'block' },
                        yesterday: { $set: 'block' },
                        last_7_days: { $set: 'block' },
                        last_30_days: { $set: 'none' },
                        older: { $set: 'none' }
                    },
                }
            )
            this.setState(updateStyle)
            this.setState({ filterUpdate: 'update-week' })
        }
        if (value == 'update-default') {
            let updateStyle = update(
                this.state, {
                    styleList: {
                        today: { $set: 'block' },
                        yesterday: { $set: 'block' },
                        last_7_days: { $set: 'block' },
                        last_30_days: { $set: 'block' },
                        older: { $set: 'block' }
                    },
                }
            )
            this.setState(updateStyle)
            this.setState({ filterUpdate: value })
        }
        if (value == 'update-pending' && alert == 'veryhigh') {

            let updateStyle = update(
                this.state, {
                    styleList: {
                        today: { $set: 'none' },
                        yesterday: { $set: 'none' },
                        last_7_days: { $set: 'none' },
                        last_30_days: { $set: 'none' },
                        older: { $set: 'none' }
                    },
                }
            )
            this.setState(updateStyle)
            this.setState({ filterUpdate: value })

        }
        if (value == 'update-pending' && alert == 'high') {

            this.setState({ filterUpdate: value })

        }
        if (value == 'update-completed' && alert == 'high') {
            let updateStyle = update(
                this.state, {
                    styleList: {
                        today: { $set: 'none' },
                        yesterday: { $set: 'none' },
                        last_7_days: { $set: 'none' },
                        last_30_days: { $set: 'none' },
                        older: { $set: 'none' }
                    },
                }
            )
            this.setState(updateStyle)


            /*this.completedAction();*/
            this.setState({ filterUpdate: value })

        }
    },
    completedAction(noti) {
        let notification = _.cloneDeep(noti);
        let arr = []
        _.forEach(notification, function(object, index) {

            if (_.isObject(object)) {
                for (let i = 0; i < object.length; i++) {
                    if (object[i].urgency != 'done') {
                        arr.push(i)
                    }
                }
                _.pullAt(object, arr);
                arr = [];
            }

        })
        this.setState(update(this.state, {
            notification: { $set: notification }
        }))


    },
    filterHight(noti) {
        let notification = _.cloneDeep(noti);
        let arr = []

        _.forEach(notification, function(object, index) {

            if (_.isObject(object)) {
                for (let i = 0; i < object.length; i++) {
                    if (object[i].urgency != 'high') {
                        arr.push(i)
                    }
                }
                _.pullAt(object, arr);
                arr = [];
            }

        })
        this.setState(update(this.state, {
            notification: { $set: notification }
        }))
    },

    filtersVeryHight(noti) {
        let notification = _.cloneDeep(noti);
        let arr = []

        _.forEach(notification, function(object, index) {

            if (_.isObject(object)) {
                for (let i = 0; i < object.length; i++) {
                    if (object[i].urgency != 'very high') {
                        arr.push(i)
                    }
                }
                _.pullAt(object, arr);
                arr = [];
            }

        })
        this.setState(update(this.state, {
            notification: { $set: notification }
        }))
    },
    configDay(day){
        debugger
        let day_cf = _.split(day , '-' , 3)
        switch(day_cf[1]){
            case '1' : day_cf[1] = 'JAN ' ; break ;
            case '2' : day_cf[1] = 'Feb ' ; break ;
            case '3' : day_cf[1] = 'Mar ' ; break ;
            case '4' : day_cf[1] = 'Apr ' ; break ;
            case '5' : day_cf[1] = 'May ' ; break ;
            case '6' : day_cf[1] = 'June ' ; break ;
            case '7' : day_cf[1] = 'July ' ; break ;
            case '8' : day_cf[1] = 'Aug ' ; break ;
            case '9' : day_cf[1] = 'Sept ' ; break ;
            case '10': day_cf[1] = 'Oct ' ; break ;
            case '11' : day_cf[1] = 'Nov ' ; break ;
            case '12' : day_cf[1] = 'Dec ' ; break ;
        }
        return day_cf[2] + ' ' + day_cf[1] + day_cf[0]
    /*    for(let i = 0 ; i < time.length ; i++){
            time.created = _.split(time.created , 'T' , 2)
        }*/
    },
    getTime(times){
        debugger
        let time_cf = _.split(times , 'T' , 2),
            day = this.configDay(time_cf[0]) ,
            time = _.split(time_cf[1] , '.' , 2)[0];
        return time + " - " + day
    },
  /*  getNewTime(data){
        debugger
        for(let i = 0 ; i< data.length ;  i++){
            data[i].created = this.getTime(data[i].created)
        }
        return data
    },*/
    getNotification() {
        //temproary for dummy data
        var last_thirty_days = [];
        var today = [];
        var last_seven_days = [];
        var yesterday = [];
        var older = [];
        var pending = 0;
        var high = 0;
        var veryhigh = 0
        $.ajax({
            url: Constant.SERVER_API + 'api/notification/?period=last_thirty_days',
            dataType: 'json',
            type: 'GET',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log(data)

                last_thirty_days = data


            },
            error: function(xhr, status, err) {
                console.log(err);
            }
        });
        $.ajax({
            url: Constant.SERVER_API + 'api/notification/?period=last_seven_days',
            dataType: 'json',
            type: 'GET',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                last_seven_days = data;
            },
            error: function(xhr, status, err) {
                console.log(err);
            }
        });
        $.ajax({
            url: Constant.SERVER_API + 'api/notification/?period=today',
            dataType: 'json',
            type: 'GET',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                today = data;
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
                pending = data.length
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
                high = data.length;
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
                veryhigh = data.length;
            },
            error: function(xhr, status, err) {
                console.log(err);
            }
        });

        var update_notification = update(this.state, {
            notification: {
                today: {
                    $set: today
                },
                yesterday: {
                    $set: yesterday
                },
                last_7_days: {
                    $set: last_seven_days
                },
                last_30_days: { $set: last_thirty_days },
                older: {
                    $set: older
                }
            },
            warningNoti: { $set: high },
            dangerNoti: { $set: veryhigh },
            total: { $set: pending },
            content: { $set: 'Number of actions pending for you to complete. ' + veryhigh + (veryhigh > 1 ? " actions are" : " action is") + ' required with high priority and ' + high + (high > 1 ? " actions are" : " action is") + ' required with medium priority' }
        });

        this.setState(update_notification);
        localStorage.setItem('notification', JSON.stringify(update_notification))
    },


    render: template
});

module.exports = Notification;
