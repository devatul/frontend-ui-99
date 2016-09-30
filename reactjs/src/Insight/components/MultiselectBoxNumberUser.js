'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var NumberUser = React.createClass({
	 getInitialState: function() {
        return {
            checkList: [],
            checked: 0,
            selected :0,
            newIdArr:[],
            data : this.props.data,
            class: 'dropdown-backdrop-custom'
        };
    },


    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.data != nextProps.data) {

            return true;
        }
        return false;
    },
   /* componentDidUpdate(prevProps , prevState){
        this.state.data = this.props.data
    }*/
    /*handleOnClick(){

              $("#radio_filter_"+this.props.checked).prop("checked", true);
    },*/
    componentDidMount() {
        this.changeHeight()
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
    changeHeight(){

        var dropdown = this.refs.dropdown
        var dropdownmenu = this.refs.dropdownmenu
        console.log('dropdown', dropdown)

        $(dropdown).on('show.bs.dropdown', function() {
            $('#dropdownFilter').css({
                display: 'block',
                height: $(dropdownmenu).height() + 90 + 'px'
            });
            /*$('.dropdown-backdrop-custom').css({
                display: 'none'
            })*/

        }.bind(this));

        $(dropdown).on('hide.bs.dropdown', function() {
            $('#dropdownFilter').css({
                display: 'block',
                height: ''
            });
            $('body').click(function(){
                $("#dropdownFilter").hide()
            })

        }.bind(this));
    },
    onClick(){
        this.changeHeight()
    },
   /* handleOnClick(){
         $('.dropdown-backdrop-custom').css({
                display: 'block'
            })
         $('body').click(function(){
            $('.dropdown-backdrop-custom').css({
                display: 'none'
            })
        });
    },*/

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
                    onClick = {this.onClick}
					className="multiselect dropdown-toggle btn btn-default"
					data-toggle="dropdown"
					title={this.props.title}
					aria-expanded="false">
					<span className="multiselect-selected-text">{this.props.title} </span>
					<b className="caret"></b>
				</button>

				<ul ref="dropdownmenu" className="multiselect-container dropdown-menu fix_ulFilter_insight">
					{children}

				</ul>

            </div>
		)
	},

});
module.exports= NumberUser;