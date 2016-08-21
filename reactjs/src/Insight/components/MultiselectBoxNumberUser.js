'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var NumberUser = React.createClass({
	 getInitialState: function() {
        return {
            checkList: [],
        };
    },
  

    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.data != nextProps.data) {
            return true;
        }
        return false;
    },
    handleOnClick(){
              $("#radio_filter_0").prop("checked", true); 
    },
    componentDidMount() {
        var dropdown = this.refs.dropdown
        var dropdownmenu = this.refs.dropdownmenu
      
        $(dropdown).on('show.bs.dropdown', function() {
            $('#dropdownFilter').css({
                display: 'block',
                height: $(dropdownmenu).height() + 120 + 'px'
            });
        }.bind(this));

        $(dropdown).on('hide.bs.dropdown', function() {
            $('#dropdownFilter').css({
                display: 'block',
                height: ''
            });
        }.bind(this));
    },
     handleOnChange: function(event,index,size) {
        var field = {
            id: this.props.data[index].id,
            name: this.props.data[index].name,
            selectId: this.props.id,
            index: index,
           
            value: event.target.value
        }
        for(var i= 0; i<size ; i++){
            if(i==index){
                $('#radio'+index).removeClass().addClass('active');   
                    
            }else{
               $('#radio'+i).removeClass('active')
               
            }
           
        }
        this.props.onChange(field, index);
    },
	
	render(){
		var children = [];
            _.forEach(this.props.data, function(obj, index) {
                console.log('obj', obj);
                var size =_.size(this.props.data)
                children[index] =  <li className={obj.checked && 'active'} id={'radio'+index}>
                                    <a tabIndex={index}>
                                        <label className="radio">
                                        <input id={'radio_filter_' + index} type="radio"
                                            name="radio_filter"
                                            onClick={(event)=>this.handleOnChange(event,index,size)}
                                            value={index}
                                            key={'selectBox_' + index}
                                            
                                            /> Top {obj.name}

                                        </label>
                                    </a>
                                </li>;
            }.bind(this));
		return(
			<div ref="dropdown" className="btn-group dropdown">
				<button type="button"
					key={this.props.key + '_'}
					onClick={this.handleOnClick}
					className="multiselect dropdown-toggle btn btn-default"
					data-toggle="dropdown"
					title={this.props.title}
					aria-expanded="false">
					<span className="multiselect-selected-text">{this.props.title}</span>
					<b className="caret"></b>
				</button>
				<ul ref="dropdownmenu" className="multiselect-container dropdown-menu">
					
					{children}
				</ul>
			</div>
		)
	},

});
module.exports= NumberUser;