'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var NumberUser = React.createClass({
	 getInitialState: function() {
        return {
            open : true,
            checkList: [],
            checked: 0,
            selected :0,
            newIdArr:[],
            data : this.props.data,

        };
    },


    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.data != nextProps.data) {

            return true;
        }
        if(this.state.open != nextState.open){
            return true;
        }
        return false;
    },

    componentDidMount() {

    },
    handleOnChange: function(event, index, size) {
        var field = {
            id: this.props.data[index].id,
            name: this.props.data[index].name,
            selectId: this.props.id,
            index: index,
            checked: event.target.checked,
            value: event.target.value
        }
        this.setState({selected  : index})
        this.props.onChange(field, index);
    },
	isActive(value){
        return ((value===this.state.selected) ?'active':'default');
    },

    onClick(value){
        debugger
        var updateOpen = update(this.state , {
            open : {$set : ! value}
        })
        this.setState(updateOpen)
        var dropdown = this.refs.dropdown
        var dropdownmenu = this.refs.dropdownmenu
        $('#menudr').toggle(0 , function(){
            if(value){
                $('#dropdownFilter').css({
                display: 'block',
                height: $(dropdownmenu).height() + 90 + 'px'
            });
            } else {
                $('#dropdownFilter').css({
                display: 'block',
                height: ''
            });
            }

        })
    },

	render(){

		var children = [];
        var newIdArr = [];
        var className = this.state.clicked ? 'active' : 'no-active';
        console.log('data',this.props.data)
        debugger
            _.forEach(this.props.data, function(obj, index) {

            var newID = 'radio' + index;
            var size =_.size(this.props.data)
            children[index] =  <li className={obj.checked && 'active'} key ={index}>
                                <a tabIndex={index}>
                                    <label className="radio">
                                    <input id={'radio_filter_' + index} type="radio"
                                        name="radio_filter"
                                        onClick={(event)=>this.handleOnChange(event,index,size)}
                                        value={index}
                                        checked = {obj.checked}
                                    /> {obj.name}
                                    </label>
                                </a>
                            </li> ;
            }.bind(this));

		return(
			<div ref="dropdown" className="btn-group dropdown">
				<button type="button" id="button"
					key={this.props.key + '_'}
                    onClick = {this.onClick.bind(this , this.state.open)}
					className="multiselect dropdown-toggle btn btn-default"

					title={this.props.title}
					aria-expanded="false">
					<span className="multiselect-selected-text">{this.props.title} </span>
					<b className="caret"></b>
				</button>
                <ul ref="dropdownmenu" className="multiselect-container dropdown-menu fix_ulFilter_insight" id="menudr">
					{children}

				</ul>

            </div>
		)
	},

});
module.exports= NumberUser;