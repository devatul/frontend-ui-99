import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import template from './App.rt'
import Constant, { fetching } from './Constant.js';
import update from 'react-addons-update'
import { makeRequest } from './utils/http'


module.exports = React.createClass({
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
			},
			tokenAuth: ""
		};
	},
    componentWillMount()
    {
		let { pathname } = this.props.location
    	var token = sessionStorage.getItem('token');
    	if(token)
		{
			switch(true)
			{
				case pathname == '/':
					browserHistory.push('/Dashboard/OverView');
					break;
				case pathname != '/':
					browserHistory.push(pathname);
					break;
			}

			setInterval(() => {
    			if(token)
				{
					makeRequest({
						path: 'api/token/api-token-refresh/',
                        method : 'POST',
						params: {
							token: token
						},
						success: (data) => {
							sessionStorage.setItem('token', data.token);
						}
					});
				}
	    	}, Constant.TIMEVALIDTOKEN);

		} else {
			console.log("noToken");
			browserHistory.push('/Account/Signin');
		}
    },

	componentWillUnmount() {

		sessionStorage.removeItem('token')
	},


	componentDidUpdate(prevProps, prevState) {
		let {
			xhr
		} = this.state;
		if(xhr.isFetching != prevState.xhr.isFetching) {
			var { isFetching } = xhr;
			switch(isFetching) {
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
