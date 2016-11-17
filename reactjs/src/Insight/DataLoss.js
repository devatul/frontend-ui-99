import React, {Component} from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router'
import template from './DataLoss.rt'
import update from 'react-addons-update'
import Constant, {fetching} from '../App/Constant.js'
import {orderLanguages} from '../utils/function';
import 'jquery'
import { getDataLoss } from '../utils/function'

var DataLost = React.createClass({
  getInitialState() {
    return {
      dataLoss: {},
      language: [],
      default_data: [],

      xhr: {
        status: "Report is loading",
        message: "Please wait!",
        timer: 20,
        loading: 0,
        isFetching: fetching.STARTED
      }
    };
  },

  componentWillUnmount() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.SUCCESS
        }
      })
    });
  },

  changeDefault(language) {
    let dataLoss = _.cloneDeep(this.state.dataLoss);

    for (let i = 0; i < dataLoss.length; i++) {
      if (dataLoss[i].language == language) {
        this.setState({default_data: dataLoss[i]})
      }
    }
  },

  getDataLoss() {
    this.setState({
      xhr: update(this.state.xhr, {
        isFetching: {
          $set: fetching.START
        }
      })
    });

    getDataLoss({
      success: function (data) {
        let languages_arr = [];
        let languages = orderLanguages(data);
        for (let i = 0, len = languages.length; i < len; ++i)
              languages_arr.push(languages[i].language);

        data.forEach(lang => {
          let keywordsArr = [];

          lang['most efficient keywords'].forEach(keyword => {
            if (keyword.category_name !== 'Undefined') {
              for (let i = keyword['confidentiality levels'].length - 1; i >= 0; --i) {
                if (keyword['confidentiality levels'][i].keywords.length == 0)
                    keyword['confidentiality levels'].splice(i, 1);
              }
              if (keyword['confidentiality levels'].length !== 0)
                keywordsArr.push(keyword)
            }
          });

          lang['most efficient keywords'] = keywordsArr;
        });

        let updateDataLoss = update(this.state, {
          dataLoss: {$set: data},
          default_data: {$set: data[0]},
          language: {$set: languages_arr},

          xhr: {
            isFetching: {
              $set: fetching.SUCCESS
            }
          }
        });

        this.setState(updateDataLoss);
      }.bind(this),
      error: function (xhr, error) {
        this.setState({
          xhr: update(this.state.xhr, {
            isFetching: {
              $set: fetching.ERROR
            }
          })
        });
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
