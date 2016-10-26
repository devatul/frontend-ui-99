import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './App.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import $ from 'jquery'
import validate from 'jquery-validation';
import Constant, { fetching } from './Constant.js';
import update from 'react-addons-update'
module.exports = React.createClass({
    mixins: [LinkedStateMixin],

	getInitialState() {
		return {
			xhr: {
				status: "Report is loading",
				message: "Please wait!",
				timer: 40,
				counting: 0,
				loading: 100,
				isFetching: fetching.SUCCESS,
				error: {}
			}
		};
	},
    componentWillMount() 
    {
    	if(sessionStorage.getItem('token'))
		{
			setInterval(function()
    		{
    			var token = sessionStorage.getItem('token');
    			if(sessionStorage.getItem('token')){
    				$.ajax({
			            url: Constant.SERVER_API + 'api/token/api-token-refresh/',
			            dataType: 'json',
			            type: 'POST',
			            data:{
			            	token:token
			            },
			            success: function(data) 
			            {
			            	sessionStorage.setItem('token', data.token);
			            }.bind(this),
			            error: function(xhr, status, err) 
			            {
			            	browserHistory.push('/Account/Signin');
			            }.bind(this)
		        	});
    			}
    			
	    	}, Constant.TIMEVALIDTOKEN);
	    	
			browserHistory.push('/Dashboard/OverView');	
		}else
		{
			console.log("noToken");
			browserHistory.push('/Account/Signin');	
		}
    },
    componentDidMount() {
    },

	componentWillUnmount() {
		sessionStorage.removeItem('token')
	},
	

	componentDidUpdate(prevProps, prevState) {
		let {
			xhr
		} = this.state;
		if(xhr.isFetching != prevState.xhr.isFetching) {
			switch(xhr.isFetching) {
				case fetching.START:
					this.setState({
						xhr: update(this.state.xhr, {
							loading:
							{
								$set: 0
							},
							isFetching:
							{
								$set: fetching.STARTED
							},
							timer:
							{
								$set: 50
							},
							status:
							{
								$set: "Report is loading"
							},
							message:
							{
								$set: "Please wait!"
							},
							error: {
								$set: {}
							}
						})
					});
					break;
				case fetching.STARTED:
					
					break;
				case fetching.SUCCESS:
				debugger
					this.setState({
						xhr: update(this.state.xhr, {
							loading:
							{
								$set: 90
							},
							timer:
							{
								$set: 0
							}
						})
					});
					break;
				case fetching.ERROR:
					let { xhr } = this.state
					debugger
					break;
			}
		}

		if(xhr.loading < 100)
		{
			this.setLoading()	
		}
    },

	setLoading() {
        let delay = 0, { xhr } = this.state;
        if( xhr.loading < 100 && xhr.error.status == null ) {
            delay = setInterval(() => {
                let { loading } = this.state.xhr;
                this.setState({
					xhr: update(this.state.xhr, {
						loading:
						{
							$set:  ++loading
						}
					})
				})
                clearInterval(delay)
            }, xhr.timer * (xhr.loading/2));
        }
    },
	renderMessage() {
        let { message, status } = this.state.xhr;
        return <p className="loading-label-2">
        			{status}<br/><span className="pls">{message}</span>
        		</p>
    },


	updateStore(state) {
		let { xhr } = this.state;
		if(xhr.loading < 100 && xhr.isFetching === fetching.SUCCESS)
		{
			let delay = 0;

			delay = setInterval(() => {
				this.updateStore(state)
				clearInterval(delay)
			}, 100)

		} else {
			this.setState(state);
		}
	},

	mapStateToProps(children, states = []) {
		let stateMap = {},
			total = 0;
		//select store in array name store
		if((total = states.length) > 0) {
			for(let i = total - 1; i >= 0; i--) {
				stateMap[states[i]] = this.state[states[i]];
			}
		}

		//function send to all children
		stateMap['mapStateToProps'] = this.mapStateToProps;
		stateMap['updateStore'] = this.updateStore;
		stateMap['handleError'] = this.handleError

        return React.Children.map(children,
            (child) => {
            	return React.cloneElement(child, stateMap)
            });
    },
    render:template

});
