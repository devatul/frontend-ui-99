'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import $ from 'jquery'
import { getLanguages } from '../../utils/function'

var TabName = React.createClass({
	getInitialState(){
		return {
			color : ['#4fca9d' , '#ACACAC' , '#ACACAC' ],
			click : ['true' , 'false' , 'false'],
			languages:[],
		};
	},
	componentDidMount() {
		this.getLanguages();
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
	getLanguages: function(async) {
		getLanguages({
			success: (data) => {
					let arr = [];
					for (let i = 0; i < data.length; i++) {
						arr.unshift(data[i]);
					}
					this.setState({ languages: arr });
			}
		});
	},

    configLanguage(language){
			let lang = this.state.languages
			for (let i = 0; i < lang.length; i++) {
				if(lang[i].short_name === language.toUpperCase()){
					return lang[i].name;
				}
			}
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

		let language = [];
        for(let i = 0 ; i< this.props.language.length ; i++){
             language[i] = this.configLanguage(this.props.language[i])
             if( i>=1 ){
                active[i] = '#'
             }
        }
		for( let i=0 ; i<language.length; i++){
			children[i] = <li className={active[i]} key={i}
			onMouseOver = {this.onMouseOver.bind(this, i)} onMouseOut = {this.onMouseOut.bind(this, i)} onClick={this.onClick.bind(this,i)}>
			<a href="#" data-toggle="tab" aria-expanded="true" onClick={this.clickHandle.bind(this , this.props.language[i])}><span style={{}} >{language[i]}</span></a>
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
