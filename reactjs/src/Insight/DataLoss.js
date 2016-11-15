import React, {Component} from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router'
import template from './DataLoss.rt'
import update from 'react-addons-update'
import Constant, {fetching} from '../Constant.js'
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
        let arr = [],
            other = null;

        for (let i = 0; i < data.length; i++) {
          switch (data[i].language) {
            case 'OTHER' :
              other = (data[i].language);
              break;
            case 'de' :
              arr.unshift(data[i].language);
              break;
            case 'en' :
              arr.unshift(data[i].language);
              break;
            case 'fr' :
              arr.unshift(data[i].language);
              break;
            default :
              arr.push(data[i].language);
          }
        }

        let order = ['fr', 'en', 'de'];

        for (let i = 0; i < arr.length - 1; ++i) {
          for (let j = 0; j < order.length; ++j) {
            if (arr[i] == order[j]) break;
            if (arr[i + 1] == order[j]) {
              let tmp = arr[i];

              arr[i] = arr[i + 1];
              arr[i + 1] = tmp;
              i = Math.max(i - 2, -1);

              break;
            }
          }
        }

        if (other) arr.push(other);

        data.forEach(lang => {
          let keywordsArr = [];

          lang['most efficient keywords'].forEach(keyword => {
            if (keyword.category_name !== 'Undefined') {
              keywordsArr.push(keyword)
            }
          });

          lang['most efficient keywords'] = keywordsArr;
        });

        let updateDataLoss = update(this.state, {
          dataLoss: {$set: data},
          default_data: {$set: data[0]},
          language: {$set: arr},

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
