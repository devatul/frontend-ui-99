'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import HelpButton from './HelpButton'

var TabName = React.createClass({
	getInitialState(){
		return {
			color : ['#4fca9d' , '#ACACAC' , '#ACACAC' ],
			click : ['true' , 'false' , 'false']

		};
	},
    shouldComponentUpdate(nextProps , nextState){
        if(this.props.language != nextState.language){
            return true;
        }
        return false
    },
	onMouseOver(value){

		let color = this.state.color
		for( let i = 0 ; i < this.state.color.length ; i++) {
			if( i == value) {
				color[i] = '#4fca9d'
			}
		}
		let colorUpdate = update(this.state , {
			color : {$set : color}
		})
		this.setState(colorUpdate)
	},
	onMouseOut(value){

			let color = this.state.color
			let click = this.state.click
			for( let i = 0 ; i < this.state.color.length ; i++) {
				if( i == value && click[i] == "false") {
					color[i] = '#ACACAC'

				}
			}
			let colorUpdate = update(this.state , {
				color : {$set : color}
			})
			this.setState(colorUpdate)




	},
    clickHandle(language){
        this.props.click(language)
    },
	onClick(value){
		/*let color = this.state.color
		let click = this.state.click
		console.log('color', color)
		for( let i = 0 ; i < color.length ; i++){
			if( i!= value ){
				color[i] = '#ACACAC'
				click[i] = 'false'
			}else {
				color[i] = '#4fca9d'
				click[i] = 'true'
			}
		}*/
		/*let update = update(this.state , {
			color : {$set : color},
			click : {$set : click}
		})
		this.setState(update)*/

	},
	render(){

		let children = [];
		let active = []
        active[0] = 'active'

		let language = this.props.language
        for(let i = 1 ;  i <language.length ; i++){
            active[i] = '#'
        }

		for( let i=0 ; i<language.length; i++){
			children[i] = <li className={active[i]} key={i}
			onMouseOver = {this.onMouseOver.bind(this, i)} onMouseOut = {this.onMouseOut.bind(this, i)} onClick={this.onClick.bind(this,i)}>
			<a href="#" data-toggle="tab" aria-expanded="true" onClick={this.clickHandle.bind(this , language[i])}><span style={{}} >{language[i]}</span></a>
			</li>
		}

		return(
			<ul className="my-profile-header nav nav-tabs" style={{'marginLeft':'4px'}}>
				{children}
			</ul>
		)
	}
});

module.exports = TabName
