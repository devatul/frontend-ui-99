import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import template from './App.rt'
import Constant, { fetching } from './Constant.js';
import update from 'react-addons-update'
import { orderByIndex, getCategories, getConfidentialities, setRefreshToken } from '../utils/function'
import { orderBy } from 'lodash'
import { git_version } from '../commit'

module.exports = React.createClass({
	getInitialState() {
		return {
			categories: [],
			confidentialities: [],
			scanResult: {},
			tokenAuth: ""
		};
	},

	componentWillMount() {
    let {pathname} = this.props.location;

    var token = sessionStorage.getItem('token');

    if (token) {
      switch (true) {
				case pathname == '/':
					browserHistory.push('/Dashboard/OverView');
					break;
				case pathname != '/':
					browserHistory.push(pathname);
					break;
			}

			setInterval(() => {
				if (token) {
					setRefreshToken({
						params: JSON.stringify({
							token: token
						}),
						success: (data) => {
							sessionStorage.setItem('token', data.token);
						},
						error: (data) => {
							console.log(JSON.parse(data.responseText).detail)
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

	// componentDidMount() {
	// 	this.getCategories();
	// 	this.getConfidentialities();
	// },
	
	componentWillUpdate(nextProps, nextState) {
		let {categories} = this.state;

		// if( !categories.length ) {
		// 	this.getCategories()
		// }
	},

	getCategories: function () {
    return getCategories({
				success: (data) => {
					data = orderBy(data, ['name'], ['asc']);
					this.setState({categories: data});
				}
		});
  },

	getConfidentialities: function(async) {
		return getConfidentialities({
				success: (data) => {
						data = orderByIndex(data, [4, 3, 2, 1, 0]);
						this.setState({confidentialities: data});
				}
		});
	},

	mapStateToProps(children, states = []) {
		let stateMap = {},
		total = 0;

		// select store in array name store
		if ((total = states.length) > 0) {
			for (let i = total - 1; i >= 0; i--) {
				stateMap[states[i]] = this.state[states[i]];
			}
		}

		// function send to all children
		stateMap['mapStateToProps'] = this.mapStateToProps;
		
		return React.Children.map(children, (child) => React.cloneElement(child, stateMap));
  },
		
	commit() {
		return git_version;
	},

  render: template
});