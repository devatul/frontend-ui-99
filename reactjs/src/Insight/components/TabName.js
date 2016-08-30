'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import HelpButton from './HelpButton'

var TabName = React.createClass({
	getInitialState(){
		return {
			color : {
				'color': '#ACACAC',
			},
	   		
	    };
	},
	onMouseOver(){
		this.setState({color :
			{
				'color' : '#4fca9d'
			}
		})
	},
	onMouseOut(color){
		this.setState({color :
			{
				'color' : color
			}
		})
		console.log(color)
	},
	oncLick(){
		this.setState({color :
			{
				'color' : '#4fca9d'
			}
		})
	},
	render(){
		return(
			<li className={this.props.className} onMouseOver = {this.onMouseOver} onMouseOut = {this.onMouseOut.bind(this,'#ACACAC')} onClick={this.oncLick}>
	                  <a href="#" data-toggle="tab" aria-expanded="true"><span style={this.state.color}>{this.props.name}</span></a>
	          </li>
	     )
	}
});

module.exports = TabName
