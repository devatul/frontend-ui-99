import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink, browserHistory } from 'react-router'
import template from './Dashboard.rt'
import update from 'react/lib/update'
import _ from 'lodash'
//import $ from 'jquery'
import { makeRequest } from '../utils/http'
import Constant from '../Constant.js';

module.exports = React.createClass({
    getInitialState() {
        return {
            newsfeed: {},
            unseen_notiData: {},
            total_pending: 0,
            total_notification: 0,
            review_notification:{total: 0, classification_review: 0, user_assignment: 0},
            number_pending : {},
            pending_list: [],
            save_list: [],
            role: '',
            typeAlert: 'none',
            checkAlert: 'none',
            interval :  null
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
        sessionStorage.removeItem('token');

        browserHistory.push('/Account/SignIn');
    },
    componentWillUnmount() {

         clearInterval(this.state.interval);
    },
    componentDidUpdate(prevProps, prevState) {
        let default_list = _.cloneDeep(this.state.save_list)
        if (this.state.typeAlert != prevState.typeAlert) {
            let updateDefault = update(this.state , {
                unseen_notiData : {
                    actions : {$set : default_list}
                }
            })
            this.setState(updateDefault)
            let alert = this.state.typeAlert
            if (this.state.typeAlert != 'none') {
                this.filter(default_list, alert);
            }

        }
    },
    componentWillMount() {
        let token = sessionStorage.getItem('token');
        if (token != null) {
           this.setState({interval : setInterval(() => {
                if (token) {
                    makeRequest({
                        path: 'api/notification/bubble',
                        success: (data) => {
                            this.setState({ total_notification: data.notifications })
                        }
                    });
                    makeRequest({
                        path: 'api/notification/bubble/review/classification_review',
                        success: (data) => {
                            let notifications = this.state.review_notification
                            notifications.classification_review = data.notifications
                            this.setState({ review_notification: notifications })
                        }
                    });
                    makeRequest({
                        path: 'api/notification/bubble/review/user_assignment',
                        success: (data) => {
                            let notifications = this.state.review_notification
                            notifications.user_assignment = data.notifications
                            this.setState({ review_notification: notifications })
                        }
                    });
                    makeRequest({
                        path: 'api/notification/bubble/review/all',
                        success: (data) => {
                            let notifications = this.state.review_notification
                            notifications.total = data.notifications
                            this.setState({ review_notification: notifications })
                        }
                    });
                }
            }, 5000)})
        } else {
            console.log("noToken");
            browserHistory.push('/Account/Signin');
        }
    },
    componentDidMount() {
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
    },
    hideMenu() {
        // close notification-menu when changes route
        $('.dropdown-backdrop').click()
    },

    // Show notification popup
    notificationHandle() {
        makeRequest({
            path: 'api/notification/popup',
            success: (data) => {
                let newData = {}
                newData.actions = _.slice(data.actions,0,3)
                newData.notifications = _.slice(data.notifications,0,3)
                this.setState({ unseen_notiData: newData, save_list: newData.actions, total_pending : data.actions.length})
                this.countNumber(data.actions)
            }
        })
    },
    countNumber(data){
        let total = 0 ;
        let high = 0 ;
        let veryHight = 0 ;
        _.forEach(data , function(object , index){
           switch(object.urgency){
                case 'high' : high++ ; break ;
                case 'very high' : veryHight++ ; break ;
           }
        })
        this.setState({number_pending : {
            'high' : high ,
            'very_high' : veryHight
        }})
    },
    changeToggle(event) {

        $("#" + event).find("b").removeClass('fa-caret-down').addClass('fa-caret-up');
        $('body').click(function() {

            $("#" + event).find("b").removeClass('fa-caret-up').addClass('fa-caret-down');

        })
    },

  getActive: function () {
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
        if (this.state.typeAlert == 'none') {
            this.setState({ typeAlert: type })
        } else {
            let pending_list = _.cloneDeep(this.state.save_list)
            this.setState({
                pending_action: pending_list

            })
            this.setState({
                typeAlert: 'none'
            })
        }
    },
    filter(data, alert) {
        let arr = []

        _.forEach(data, function(object, index) {
            if (object.urgency != alert) {
                arr.push(index)
            }
        })
        _.pullAt(data, arr);
        arr = [];
        if (this.state.unseen_notiData.actions != null) {
            this.setState(update(this.state, {
                unseen_notiData: {
                    actions: { $set: data }
                },

            }))
        }
    },
    hideDropdownMenu(element) {
        if(element) {
            element.addEventListener('click', (event)=>{
                if(!$(event.target).closest(this.dropdownMenuElement).length) {
                    if($(this.dropdownMenuElement).is(":visible")) {
                        $(this.dropdownMenuElement).collapse('hide')
                    }
                }
            });
        }
    },
    findDropdownMenu(element) {
        this.dropdownMenuElement = element;
    },

  render: template
});
