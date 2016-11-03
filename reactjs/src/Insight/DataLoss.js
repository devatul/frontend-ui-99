import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './DataLoss.rt'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import 'jquery'

var DataLost = React.createClass({
    getInitialState() {
        return {
            dataLoss: {},
            language: [],
            default_data: []
        };
    },
    changeDefaul(language) {
        let dataLoss = _.cloneDeep(this.state.dataLoss);
        for (let i = 0; i < dataLoss.length; i++) {
            if (dataLoss[i].language == language) {
                this.setState({ default_data: dataLoss[i] })
            }
        }
    },
    getDataLoss() {

        $.ajax({

            url: Constant.SERVER_API + 'api/insight/data-loss/',
            dataType: 'json',
            type: 'GET',

            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {

                console.log('data', data);
                let arr = [];
                    /* this.setState({ dataLoss: data })
                     this.setState({ default_data: data[0] })*/
              let other = null;
                for (let i = 0; i < data.length; i++) {
                    switch(data[i].language){
                        case 'OTHER' :
                            other = (data[i].language);
                            break;
                        case 'de' :
                            arr.unshift(data[i].language);
                            break;
                        case 'en' :
                            arr.unshift(data[i].language);
                            if (arr[1] && arr[1].language == 'fr') {
                              arr[0] = arr[1];
                              arr[1] = data[i].language;
                            }
                            break;
                        case 'fr' :
                            arr.unshift(data[i].language);
                            break;
                        default : arr.push(data[i].language);
                    }
                }

              let order = ['fr', 'en', 'de'];
              for (let i = 0; i < arr.length - 1; ++i) {
                for (let j = 0; j < order.length; ++j) {
                  if (arr[i] == order[j])
                    break;
                  if (arr[i+1] == order[j]) {
                    let tmp = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = tmp;
                    i = Math.max(i - 2, -1);
                    break;
                  }
                }
              }
              if (other)
                arr.push(other);


                /*  this.setState({language : arr})*/
                data.forEach(lang => {
                    let keywordsArr = [];
                    lang['most efficient keywords'].forEach(keyword => {
                        if(keyword.category_name !== 'Undefined') {keywordsArr.push(keyword)}
                    });
                    lang['most efficient keywords'] = keywordsArr;
                });


                let updateDataLoss = update(this.state, {
                    dataLoss: { $set: data },
                    default_data: { $set: data[0] },
                    language: { $set: arr }
                });
                this.setState(updateDataLoss)
                console.log('data', this.state.dataLoss);
                console.log('default_data', this.state.default_data)

            }.bind(this),
            error: function(xhr, error) {
                if (xhr.status === 401) {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },

    componentDidMount() {
        this.getDataLoss()
    },
    render: template
});
module.exports = DataLost;
