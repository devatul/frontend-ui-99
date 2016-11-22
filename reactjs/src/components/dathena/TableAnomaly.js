import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import {makeRequest} from '../../utils/http';
import HelpButton from "./HelpButton";
import _ from 'lodash';
import Anomaly from '../../components/dathena/AnomalyStateSelect';
import Constant from '../../Constant.js';
import Demo from '../../Demo.js';

var TableAnomaly = React.createClass({
  getInitialState() {
    return {
      datas: [],
      style: 0,
      filterValue: 0,
      show: false
    }
  },

  filterTable(data, value) {
    let dataNew = [];

    _.forEach(data, function (object, index) {
      if (object['Review Status'] == value) {
        dataNew.push({
          'id': index,
          'data': object
        })
      }
    });

    return dataNew;
  },

  show(value, path) {
    this.getDataAPI(path);
    this.setState({show: value});

    $(this.detailsBlock).collapse('toggle');
  },

  getDataAPI(path) {
    if (path != undefined) {
      return makeRequest({
        path: 'api/anomaly/iam/' + path + '?filter=all',
        success: (data) => {
          if (Demo.MULTIPLIER != 1) {
            for (let i = 0, len = data.length; i < len; ++i) {
              data[i]["Document at Risk"] *= Demo.MULTIPLIER;
              data[i]["Folder at Risk"] *= Demo.MULTIPLIER;
            }
          }

          this.setState({datas: data});
        }
      });
    }
  },

  getDataFilter(datas) {
    let data = [];

    _.forEach(datas, function (object, index) {
      data.push(object.data);
    });

    return data
  },

  changeAnomaly(datas, value, number) {
    let updateAnomaly = update(this.state, {
      datas: {
        [number]: {
          ['Review Status']: {$set: value},
          selected: {$set: 'none'}
        }
      },
    });

    this.setState(updateAnomaly);

    switch (value) {
      case 'not_reviewed':
        value = 'Not Reviewed ';
        break;
      case 'under_investigation':
        value = 'Under Investigation';
        break;
      case 'true_positive':
        value = 'True Positive';
        break;
      case 'false_positive':
        value = 'False Positive';
        break;
    }

    datas[number]['Review Status'] = value;

    return makeRequest({
      path: 'api/anomaly/iam/' + this.props.path,
      method: 'PUT',
      params: JSON.stringify(_.omit(datas[number], ['selected'])),
      success: (data) => {}
    });
  },

  showSelect(datas, number) {
    let style = datas[number].selected == null || datas[number].selected == 'none' ? 'block' : 'none';

    for (let i = 0; i < datas.length; i++) {
      datas[i].selected = ( i == number ? style : 'none')
    }

    let updateStyle = update(this.state, {
      datas: {$set: datas}
    });

    this.setState(updateStyle)
  },

  getfilterValue(value) {
    this.setState({filterValue: value});
  },

  convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;

    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;

      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;
        result += item[key];
        ctr++;
      });

      result += lineDelimiter;
    });

    return result;
  },

  downloadCSV(value, datas) {
    var data, filename, link,
        csv = this.convertArrayOfObjectsToCSV({
          data: datas
        });

    if (csv == null) return;

    filename = value + '.csv' || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }

    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  },

  configDataCVS(data) {
    let data_export = [];

    _.forEach(data, function (object, index) {
      data_export.push(_.omit(object, ["selected", "status"]));
    });

    return data_export;
  },

  configClassName(className) {
    switch (className) {
      case  'not_reviewed' :
        return 'not-reviewed';
      case  'under_investigation' :
        return 'investigation';
      case  'true_positive' :
        return 'true';
      case  'false_positive' :
        return 'false';
    }
  },

  getDetailsBlock(element) {
    this.detailsBlock = element;
  },

  render() {
    let {filterValue} = this.state,
        data = _.cloneDeep(this.state.datas),
        newData = filterValue == 0 ? data : this.getDataFilter(this.filterTable(data, filterValue)),
        child = [],
        style = !this.state.show ? {display: 'block'} : {display: 'none'},
        data_export = this.configDataCVS(newData),
        child1 = null;

    if (this.props.type == 'table1') {

      child1 =
        <tr>
          <th>ID</th>
          <th className="text-left">Windows User Account</th>
          <th className="text-left">Document at Risk</th>
          <th className="text-left">Confidentiality</th>
          <th className="text-left">Folder at Risk</th>
          <th className="text-left">Security in Fault</th>
          <th>Review Status</th>
        </tr>;

      for (let i = 1; i <= newData.length; i++) {
        let key = i - 1,
            key_filter = filterValue == 0 ? key : this.filterTable(data, filterValue)[key].id,
            className = "anomaly-state selected " + this.configClassName(newData[i - 1]['Review Status']);

        child[i] =
          <tr key={i}>
            <td><span>{newData[key]['id']}</span></td>
            <td className="text-left"><span>{newData[key]['Windows User Account']}</span></td>
            <td className="text-left"><span>{newData[key]['Document at Risk']}</span></td>
            <td className="text-left"><span>{newData[key]['Confidentiality']}</span></td>
            <td className="text-left"><span>{newData[key]['Folder at Risk']}</span></td>
            <td className="text-left"><span>{newData[key]['Security in Fault']}</span></td>
            <td className="relative">
              <span className={className} data-state="true" onClick={this.showSelect.bind(this, data, key_filter)}></span>
              <div className="anomaly-showhide">
                <Anomaly onChange={this.changeAnomaly} number={key_filter} show={newData[i - 1].selected} data={data}/>
              </div>
            </td>
          </tr>
      }
    } else {
      child1 =
          <tr>
            <th>ID</th>
            <th className="text-left">Active Directory Group</th>
            <th className="text-left">Document at Risk</th>
            <th className="text-left">Folder at Risk</th>
            <th className="text-left">User at Risk</th>
            <th className="text-left">Confidentiality at Risk</th>
            <th>Review Status</th>
          </tr>;

      for (let i = 1; i <= newData.length; i++) {
        let key = i - 1,
            key_filter = filterValue == 0 ? key : this.filterTable(data, filterValue)[key].id,
            className = "anomaly-state selected " + this.configClassName(newData[i - 1]['Review Status']);

        child[i] =
          <tr key={i}>
            <td><span>{newData[key]['id']}</span></td>
            <td className="text-left"><span>{newData[key]['Active Directory Group']}</span></td>
            <td className="text-left"><span>{newData[key]['Document at Risk']}</span></td>
            <td className="text-left"><span>{newData[key]['Folder at Risk']}</span></td>
            <td className="text-left"></td>
            <td className="text-left"><span>{newData[key]['Confidentiality at Risk']}</span></td>
            <td className="relative">
              <span className={className} data-state="true" onClick={this.showSelect.bind(this, data, key_filter)}></span>
              <div className="anomaly-showhide">
                <Anomaly onChange={this.changeAnomaly} number={key_filter} show={newData[i - 1].selected} data={data}/>
              </div>
            </td>
          </tr>
      }
    }

    return (
      <div>
        <div className="extra-block" style={style}>
          <a href=" javascript:;" className="details-toggle" data-toggle="collapse" data-target="#demo" onClick={this.show.bind(this, true, this.props.path)}>
            <i className="fa fa-caret-right mr-xs"></i>Show details
          </a>
        </div>

        <div className="collapse" ref={this.getDetailsBlock}>
          <div className="block-header row">
            <div className="col-md-4">
              <h4 className="anomaly-title">
                Anomaly Details - List of Users at Risk
                <div className="fix_whitespace">
                  <HelpButton
                    classMenu="fix-overview-help-button-table"
                    classIcon="overview_question_a help_question_a"
                    setValue="This details the list of users at risk having the most access to client document at risk." />
                </div>
              </h4>
            </div>

            <div className="col-md-8 filter-state">
              Display:
              <a href="javascript:;" onClick={this.getfilterValue.bind(this, 0)}>All</a> -
              <a href="javascript:;" onClick={this.getfilterValue.bind(this, 'not_reviewed')}><span className="anomaly-state not-reviewed"></span> Not Reviewed </a> -
              <a href="javascript:;" onClick={this.getfilterValue.bind(this, 'under_investigation')}><span className="anomaly-state investigation"></span> Under Investigation </a> -
              <a href="javascript:;" onClick={this.getfilterValue.bind(this, 'true_positive')}><span className="anomaly-state true"></span> True Positive </a> -
              <a href="javascript:;" onClick={this.getfilterValue.bind(this, 'false_positive')}><span className="anomaly-state false"></span> False Positive </a>
            </div>

            <div className="table-responsive-fix-anomaly">
              <table className="table anomaly-table">
                <thead>
                  {child1}
                </thead>
                <tbody>
                  {child}
                </tbody>
              </table>
            </div>
          </div>

          <div className="extra-block">
            <a href="javascript:;" className="details-toggle" data-toggle="collapse" data-target="#demo" onClick={this.show.bind(this, false)}>
              <i className="fa fa-caret-right mr-xs"></i> Show less
            </a>

            <span className="inline-block-item ml-md">*100 anomalies are being displayed, full report available through extraction only</span>

            <a href="javascript:;" className="pull-right btn btn-green" onClick={this.downloadCSV.bind(this, 'data', data_export)}>
              Extract
            </a>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = TableAnomaly;
