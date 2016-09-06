import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import InfoButton from '../dathena/InfoButton'
import SelectBox from '../dathena/SelectBox'
import makeRequest from '../../utils/http'
import _ from 'lodash'

var Table = React.createClass({
    render() {
        return(
            <table
                className="review_table table table-bordered table-striped mb-none no-footer table-my-actions"
                id="table-my-actions-1"
                role="grid"
                aria-describedby="datatable-default_info">

                {this.props.children}
            
            </table>
        );
    }
});

// var Head = React.createClass({
//     return (

//     );
// });

var Row = React.createClass({

    propTypes: {
        document: PropTypes.object.isRequired,
    },
    
    componentWillMount() {

    },

    getCategories: function() {
        let arr = [];
        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                this.configListLabel(data);
                arr = data;
            }
        });
        return arr;
    },

    getConfidentiality: function(async) {
        let arr = [];
        makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                this.configListLabel(data);
                arr = data;
            }
        });
        return arr;
    },

    renderType(documentName) {
        let word = /(.doc|.docx)$/gi,
            excel = /(.xlsx|.xlsm|.xlsb|.xls)$/gi,
            powerPoint = /(.pptx|.pptm|.ppt)$/gi,
            pdf = /.pdf$/gi,
            text = /.txt$/gi;
        switch(true) {
            case word.test(documentName) === true:
                return (<i className="fa fa-file-word-o action-file-icon"></i>);
            case excel.test(documentName) === true:
                return (<i className="fa fa-file-excel-o action-file-icon"></i>);
            case powerPoint.test(documentName) === true:
                return (<i className="fa fa-file-powerpoint-o action-file-icon"></i>);
            case pdf.test(documentName) === true:
                return (<i className="fa fa-file-pdf-o action-file-icon"></i>);
            case text.test(documentName) === true:
                return(<i className="fa fa-file-text-o action-file-icon"></i>);
        }
    },

    handleSelectBoxOnchange: function(valSelect, event) {
        this.props.onChange &&
            this.props.onChange(event, this.props.index);
    },

    handleCheckboxChange: function(event) {
        this.props.onChange &&
            this.props.onChange(event, this.props.index);
    },

    handleOnclick: function(event) {
        this.props.onClick &&
            this.props.onClick(event, this.props.index);
    },

    render() {
        let { document } = this.props;
        return (
            <tr className="">
                <td>
                    <div className="checkbox-custom checkbox-default">
                        <input ref="checkbox" type="checkbox" className="checkbox-item-1"/>
                        <label></label>
                    </div>
                </td>
                <td className="text-center">
                    {this.renderType(document.name)}
                </td>
                <td className="text-left">
                    <span className="text-italic file-name doc-path" data-toggle="modal" data-target="#previewModal">
                        <span id="documentName" data-toggle="tooltip" onClick={this.handleOnclick}>{document.name}</span>
                    </span>

                    <InfoButton>
                        <li>Name: <b>{document.name}</b></li>
                        <li>Path: <a href="#">{document.path}</a></li>
                        <li>Owner: <b>{document.owner}</b></li>
                        <li>Creation Date: <b>{document.creation_date}</b></li>
                        <li>Modification Date: <b>{document.modification_date}</b></li>
                        <li>Required Legal Retention until: <b>{document.legal_retention_until}</b></li>
                        <li>Confidentiality Label: <b>{document.confidentiality_label}</b></li>
                        <li>Number of Classification Challenge: <b>{document.number_of_classification_challenge}</b></li>
                    </InfoButton>
                </td>
                <td>
                    <div className="select-group">
                        <div className="selected-info">
                            <div className="progress progress-striped light">
                                <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width: '50%'}}>
                                </div>
                                <span className="progress-percentage">(50%)</span>
                            </div>
                        </div>
                        <SelectBox id="selectCategory" className="form-control" data={document.categories} onChange={this.handleSelectBoxOnchange}/>
                    </div>
                </td>
                <td>
                    <div className="select-group">
                        <div className="selected-info">
                            <div className="progress progress-striped light">
                                <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style={{width: '50%'}}>
                                </div>
                                <span className="progress-percentage">(50%)</span>
                            </div>
                        </div>
                        <SelectBox id="selectConfidentialities" className="form-control" data={document.confidentialities} />
                    </div>
                </td>
                <td>
                    <a id="documentStatus" href="#" className="doc-check" onClick={this.handleOnclick}>
                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                        <i className="fa fa-check" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        );
    }
});

module.exports = {
    table: Table,
    //head: Head,
    row: Row
};