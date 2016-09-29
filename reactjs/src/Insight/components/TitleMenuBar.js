'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import HelpButton from '../../components/dathena/HelpButton'

var Title = React.createClass({
	render(){
		return(
			<h2 className="panel-title">
			      {this.props.title} <span style={{'marginLeft':'3px'}}></span>
                    <HelpButton
                            classMenu="fix-overview-help-button-table"
                            classIcon="overview_question_a help_question_a" setValue={this.props.helpInfo}/>

			</h2>
		)
	}
});

module.exports = Title
