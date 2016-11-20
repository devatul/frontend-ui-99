'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var Keywords = React.createClass({
    getInitialState() {
        return {
            id: this.props.id,
            name: 'more keywords',
            style: {
                display: 'inline',

            },
            data_exports : null,
            className: 'more',
            charClass: 'pie-wrapper pie-progress-' + this.props.percent + ' style-1 pie-sm'

        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data != nextProps.data) {
            return true
        }
        return false
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

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    },

    downloadCSV(value, datas) {

        var data, filename, link;

        var csv = this.convertArrayOfObjectsToCSV({
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
    configData_exports(data) {

        let dataExports = []
        let confidentiality = ''
         let keywords = ''
          _.forEach(data, function(object, index) {

            let key= ''
            confidentiality= object.name
            for (let i = 0; i < object.keywords.length; i++) {

                if(i != object.keywords.length - 1 ){

                    key = key+object.keywords[i]+' ; '
                }
                else {
                    key += object.keywords[i]
                }


            }
            keywords = key
             dataExports.push({
                confidentiality : confidentiality,
                keywords : keywords
            })
        })

           /* confidentiality = data.name
            keywords = keywords*/
              /*  if (i != object.keywords.length - 1) {
                    keywords = _.concat(keywords, object.keywords[i], ' , ')
                } else {
                    keywords = _.concat(keywords, object.keywords[i])
                }
*/
        return dataExports


       /* */
    },

    click() {
        if (this.state.name == "more keywords") {
            this.setState({ className: 'more1' })
            this.setState({
                name: 'less keywords'

            })
            this.setState({
                charClass: 'pie-wrapper pie-progress-' + this.props.percent + ' style-1 pie-md'

            })
            this.setState({
                style: {
                    display: 'none'
                }
            })
        }
        if (this.state.name == "less keywords") {

            this.setState({ className: 'more' })
            this.setState({
                name: 'more keywords'
            })
            this.setState({
                style: {
                    display: 'inline'
                }
            })
            this.setState({
                charClass: 'pie-wrapper pie-progress-' + this.props.percent + ' style-1 pie-sm'

            })
        }

    },
    render() {

        let dataTable = this.props.data

        let data_exports = this.configData_exports(this.props.data)

        let child = [];
        _.forEach(dataTable, function(object, index) {

            let keywords = null
            let className = "pie-wrapper pie-progress-" + object['predicted efficiency'] + " style-1 pie-sm"
            for (let i = 0; i < object.keywords.length; i++) {
                if (i != object.keywords.length - 1) {
                    keywords = _.concat(keywords, object.keywords[i], ', ')
                } else {
                    keywords = _.concat(keywords, object.keywords[i])
                }

            }

            child[index] = <tr key={index}>
                <td className = "text-left"> { object.name } </td>
                <td className = "text-left kw-list"><span>{keywords}</span></td>
                <td>
                    <div className = { className }>
                        <span className = "label"> {object['predicted efficiency']} % </span>
                        <div className = "pie">
                            <div className = "left-side half-circle">< /div>
                            <div className = "right-side half-circle"></div>
                        </div>
                        <div className = "shadow"></div>
                    </div>
                </td>
            </tr>
        })
        return (
        <div>
            <table className = "table table-striped mb-none table-suggestion" >
                <thead>
                    <tr>
                    <th> Confidentiality Level </th>
                    <th style = {{ width: '50vw'}}> Keywords </th>
                    <th className = "text-center" style = {{ textAlign: 'center' }}> Predicted Efficiency </th>
                    </tr>
                </thead>
                <tbody>{child}</tbody>
            </table>
            <a href="javascript:;" className ="btn btn-green btn-extract" onClick = {this.downloadCSV.bind(this , this.props.name, data_exports)}>Extract</a>
        </div>
        )
    },
});


module.exports = Keywords
