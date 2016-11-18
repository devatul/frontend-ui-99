import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './ReviewStatus.rt'
import _ from 'lodash'
import update from 'react/lib/update'
import { makeRequest } from '../utils/http'
import $ from 'jquery'

module.exports = React.createClass({
  	getInitialState() {
	    return {
            default_title : 'Accounting / Tax' ,
            categories : {},
            default_tab : 'content_review'
	    };
	},
    changeTitle(value){

        let categories_1 = _.cloneDeep(this.state.categories)
        this.setState({default_title : value})
        _.forEach(categories_1 , function(object , index){
            if(object.name == value){
                    object.active = 'active'
            } else {
                object.active = "#"
            }

        })
        if(value == 'Summary'){
             this.setState({categories : categories_1 , default_title :value, default_tab: 'summary'})
        }else {
             this.setState({categories : categories_1 , default_title :value, default_tab: 'content_review'})
        }

    },
    nextCategory(value){
        let categories_1 = _.cloneDeep(this.state.categories)
        let id = 0
        _.forEach(categories_1 , function(object , index){
            if(object.name == value){
                    id = index + 1
            }
            object.active = '#'
        })
        categories_1[id].active = 'active'
        if(categories_1[id].name == 'Summary'){
             this.setState({categories : categories_1 , default_title :categories_1[id].nam, default_tab: 'summary'})
        }else {
             this.setState({categories : categories_1 , default_title :categories_1[id].name, default_tab: 'content_review'})
        }
    },
    getCategories() {
        let arr = [];
        return makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                data = _.orderBy(data, ['name'], ['asc']);

                for(let i = 0 ;  i < data.length ; i++){
                    if(i != 0 ){
                        data[i].active = '#'
                    } else {
                        data[i].active = 'active'
                    }
                }
                data.push({
                    'id' : data.length +1 ,
                    'active' : '#' ,
                    'name' : 'Summary'
                })
                this.setState({ categories: data});
            }
        });
    },
	componentDidMount()
	{
        this.getCategories()
	},



    render:template
});
