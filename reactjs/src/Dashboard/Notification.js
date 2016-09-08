import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Notification.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react/lib/update'
import javascriptTodo from '../script/javascript.todo.js';
import Constant from '../Constant.js'
import _ from 'lodash'

var Notification = React.createClass({
    getInitialState() {
        return {
            content: 'Number of actions pending for you to complete. $nbredaction action(s) is(are) required with high priority and $nbamberaction action(s) is(are) required with medium priority',
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
            default : ''

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
            if (this.state.filter.alert == 'hight') {
                
                this.setState({ filtersAlert: 'none' })
                this.filterHight(notification1);
            }
            if (this.state.filter.alert == 'veryhight') {
                this.setState({ filtersAlert: 'none' })
                this.filtersVeryHight(notification1);
                console.log('content' , this.state.content)
            }
        }
         /*if (this.state.filtersAlert != prevState.filtersAlert) {
            this.setState({
                notification: notification1

            })
        
         }*/
       
        if (this.state.selected != prevState.selected) {
            debugger
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
        /*if (this.state.filtersAlert != prevState.filtersAlert) {
            if (this.state.filtersAlert == 'hight') {
                this.filterHight(notification1);
            }
            if (this.state.filtersAlert == 'veryhight') {
                this.filtersVeryHight(notification1);
            }
        }*/
    },

    componentDidMount() {
        javascriptTodo();
        this.getDummyNotification();
        //this.getNotification();
    },

    filterAlert(value) {
        debugger
        let alert = this.state.filtersAlert
        let alertUpdate = update(this.state, {
            filter : {
                 alert: { $set: value }
            }
        })
        this.setState(alertUpdate);


        if(value == 'hight'){
            this.setState({content : 'Number of actions pending for you to complete. $nbamberaction action(s) is(are) required with medium priority.'})
            if( alert == 'none'){
                 this.setState({ filtersAlert: 'hight' })
             }else{
                  this.setState({ filtersAlert: 'none' })
                
             }
           
        }
        if(value == 'veryhight'){
            this.setState({content : 'Number of actions pending for you to complete. $nbamberaction action(s) is(are) required with hight priority.'})
             if( alert == 'none'){
                this.setState({ filtersAlert : 'veryhight'})
             }else{
                  this.setState({ filtersAlert: 'none' })
             }
          
        }
    },
    filterNotification(event) {
        
        let value = event.target.value;
        if(this.state.filter.alert != ''){
            debugger
            /*this.setState(update(this.state, {
                filter : {
                    selectbox : {$set : value}
                }
            }))*/
            let filter = this.state.filter.alert
            this.filter(filter,value);
        } else{
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

                    selected : { $set : value}
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
                    selected : { $set : value}

                }

            )
             this.setState({selected : value})
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
                    selected : { $set : value}

                }
            )
             this.setState({selected : value})
            this.setState(updateStyle)
            this.setState({ filterUpdate: value })
        }
        if (value == 'update-pending') {
            debugger
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
                    selected : { $set : value}

                }
            )
             this.setState({selected : value})
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
                    selected : { $set : value}

                }
            )
             this.setState({selected : value})
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
    filter(filter , value){
        debugger
        
      /*  let arr = []
        let notification = _.cloneDeep(this.state.notification)
        console.log('notification', notification)
        _.forEach(notification, function(object, index) {

            if (_.isObject(object)) {
                for (let i = 0; i < object.length; i++) {
                    if (object[i].urgency != filter) {
                        arr.push(i)
                    }
                }
                _.pullAt(object, arr);
                arr = [];
            }

        })
        this.setState(update(this.state, {
            notification: { $set: notification }
        }))*/
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
                }
            )
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
                    if (object[i].urgency != 'hight') {
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
                    if (object[i].urgency != 'very hight') {
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
                    today: {
                        $set: [{
                            "created": "today",
                            "id": 1,
                            "message": "Your original challenge has been passed back to you - You are required to review the document cyber_security_healthcheck_-_cs149981.xls by the latest 5th September.",
                            "urgency": "low"
                        },
                        {
                            "created": "older",
                            "id": 8,
                            "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 25th August.",
                            "urgency": "hight"
                        }]
                    },
                    yesterday: {
                        $set: [{
                            "created": "yesterday",
                            "id": 2,
                            "message": "Your original challenge has been passed back to you - You are required to review the document 02-Suspicious-Activity-Reporting-RIS.doc by the latest 29th August.",
                            "urgency": "low"
                        },
                        {
                            "created": "older",
                            "id": 8,
                            "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 25th August.",
                            "urgency": "hight"
                        }]
                    },
                    last_7_days: {
                        $set: [{
                            "created": "7_days_ago",
                            "id": 3,
                            "message": "You have challenged the classification of the document 02-Suspicious-Activity-Reporting-RIS.doc.",
                            "urgency": "done"
                        }, {
                            "created": "7_days_ago",
                            "id": 4,
                            "message": "You have challenged the classification of the document cyber_security_healthcheck_-_cs149981.xls",
                            "urgency": "done"
                        }, {
                            "created": "7_days_ago",
                            "id": 5,
                            "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 25th August.",
                            "urgency": "hight"
                        },
                        ]
                    },
                    last_30_days: { $set: [] },
                    older: {
                        $set: [{
                            "created": "older",
                            "id": 6,
                            "message": "Review - You are required to review 10 document(s) in Legal/Compliance category by the  latest 15th August.",
                            "urgency": "very hight"
                        }, {
                            "created": "older",
                            "id": 7,
                            "message": "You have completed the review of 10 document in Legal/Compliance category.",
                            "urgency": "done"
                        },
                        
                        ]
                    }
                },
                warningNoti: { $set: 1 },
                dangerNoti: { $set: 1 },
                total: { $set: 4 }
            });
        } else if (role === Constant.role.IS_2ND) {
            var update_notification = update(this.state, {
                notification: {
                    last_7_days: {
                        $set: [{
                            "created": "7_days_ago",
                            "id": 8,
                            "message": "Scan Finished- You are required to review the classification and to assign a reviewer.",
                            "urgency": "hight"
                        }, {
                            "created": "7_days_ago",
                            "id": 9,
                            "message": "Scan in Progress - You are responsible of the classification of the data repository demo. You will be informed shortly what the next required steps will be.",
                            "urgency": "done"
                        }]
                    }
                },
                warningNoti: { $set: 1 },
                dangerNoti: { $set: 0 },
                total: { $set: 1 }
            });
        }
        this.setState(update_notification);
        localStorage.setItem('notification', JSON.stringify(update_notification))
    },

    render: template
});

module.exports = Notification;
