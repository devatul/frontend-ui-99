
'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var Keywords = React.createClass({
	getInitialState() {
		return {
			id: this.props.id,
			name : 'more keywords',
			style : {
				display:'inline',
				
			},
			className : 'more',
			charClass : 'pie-wrapper pie-progress-'+this.props.percent+' style-1 pie-sm'
			
		};
	},
	click() {
		if(this.state.name =="more keywords"){
			this.setState({className : 'more1'})
			this.setState({
				name : 'less keywords'
				
			})
			this.setState({
				charClass : 'pie-wrapper pie-progress-'+this.props.percent+' style-1 pie-md'
				
			})
			this.setState({
				style:{
					display:'none'
				}
			})
		}
		if(this.state.name == "less keywords"){
			
			this.setState({className : 'more'})
			this.setState({
				name : 'more keywords'
			})
			this.setState({
				style:{
					display:'inline'
				}
			})
				this.setState({
				charClass : 'pie-wrapper pie-progress-'+this.props.percent+' style-1 pie-sm'
				
			})
		}
		
	},
	render(){

		return(
			<tr>
			<td className="text-left">{this.props.level}</td>
			<td className="text-left kw-list"><span>Keyword 1, 
			Keyword 2, Keyword 3, Keyword 4 <span className={this.state.className} id={this.state.id}>, Keyword 5, Keyword 6, Keyword 7, Keyword 8, Keyword 9, Keyword 10, Keyword 11, Keyword 12, Keyword 13, 
			Keyword 14, Keyword 15, Keyword 16, Keyword 17, Keyword 18, Keyword 19, Keyword 20, Keyword 21</span><span style={this.state.style}>...  </span>
			<a href="javascript:;" className="morelink" onClick={this.click} style={{marginLeft:'3px'}}>{this.state.name}</a></span></td>
			<td>
				<div className={this.state.charClass}>
					<span className="label">{this.props.percent}%</span>
					<div className="pie">
					<div className="left-side half-circle"></div>
					<div className="right-side half-circle"></div>
					</div>
					<div className="shadow"></div>
					</div>
				</td>
			</tr>

		)
	},
});


module.exports = Keywords