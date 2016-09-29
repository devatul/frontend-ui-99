import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DataLoss.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
//import javascript from '../script/script.insights.js'
import Constant from '../Constant.js'
import $ from 'jquery'

 var DataLost = React.createClass({
  	mixins: [LinkedStateMixin],
  	getInitialState() {
	    return {
            dataLoss : {},
            language : [],
            default_data: []
	    };
	},
    /*shouldComponentUpdate(nextProps , nextState){
        if(this.state.default_data != nextState.default_data){
            return true
        }
        return false
    },*/
    changeDefaul(language){
        debugger
        let dataLoss = _.cloneDeep(this.state.dataLoss) ;
        for(let i = 0 ; i<dataLoss.length ; i++){
            if(dataLoss[i].language == language){
                this.setState({default_data : dataLoss[i]})
            }
        }
    },
    getDataLoss(){

        $.ajax({

            url: Constant.SERVER_API + 'api/insight/data-loss/',
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {

                console.log('data', data)
                let arr = []
                this.setState({ dataLoss: data })
                this.setState({ default_data: data[0] })
                for(let i = 0 ; i< data.length ; i++){

                    arr.push(data[i].language)
                }
                this.setState({language : arr})
                console.log('data' , data)
                console.log('default_data' , this.state.default_data)

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    componentWillMount(){
        this.getDataLoss()
    },
	componentDidMount()
	{

		//javascript();
	},
    render:template
});
 module.exports = DataLost;