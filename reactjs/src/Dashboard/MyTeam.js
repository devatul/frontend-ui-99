import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link, IndexLink, browserHistory } from 'react-router'
import template from './MyTeam.rt'
import Constant from '../App/Constant.js';
import $, { JQuery } from 'jquery';
import update from 'react-addons-update';
import { getRole } from '../utils/function'

module.exports = React.createClass({


	getInitialState() {
	    return {
	    		role:'',
	    		content :''
	    };
	},
	componentDidMount(){
		getRole({
            success: function(data) {
               if(data.role == Constant.role.IS_2ND){
				this.setState({content:'Your team is comprised of all the reviewers which you have currently assigned.'})
			}else{
				this.setState({content:'Your team is comprised of all the reviewers which you have currently the same category assigned.'})
			}
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        })

	},
      render:template
});