import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import InfoButton from '../dathena/InfoButton'
import SelectBox from '../dathena/SelectBox'
import ProgressBar from 'react-bootstrap/lib/ProgressBar'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
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
        let { document, numberChecked, noConfidence } = this.props;
        return (
            <tr className={(numberChecked > 0) && !document.current.checked && 'inactive'}  onClick={this.handleOnclick}>
                <td>
                    <div className="checkbox-custom checkbox-default">
                        <input id="checkbox" onChange={this.handleCheckboxChange} type="checkbox" className="checkbox-item-1"/>
                        <label></label>
                    </div>
                </td>
                <td className="text-center">
                    {this.renderType(document.name)}
                </td>
                <td className="text-left">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="tooltip">{document.name}</Tooltip>
                    }>
                        <span id="documentName" onClick={this.handleOnclick} className="text-italic file-name doc-path">{document.name}</span>
                    </OverlayTrigger>

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
                        { !noConfidence &&
                            <div className="selected-info">
                                <ProgressBar className="progress-striped light">
                                    <ProgressBar
                                        bsStyle="warning"
                                        min={0}
                                        max={100}
                                        now={50}
                                        active
                                        label={<span className="progress-percentage">(50%)</span>} />
                                </ProgressBar>
                            </div>
                        }
                        <SelectBox id="selectCategory" className="form-control" data={document.categories} onChange={this.handleSelectBoxOnchange}/>
                    </div>
                </td>
                <td>
                    <div className="select-group">
                        <div className="selected-info">
                            { !noConfidence &&
                                <div className="selected-info">
                                    <ProgressBar className="progress-striped light">
                                        <ProgressBar
                                            bsStyle="warning"
                                            min={0}
                                            max={100}
                                            now={50}
                                            active
                                            label={<span className="progress-percentage">(50%)</span>} />
                                    </ProgressBar>
                                </div>
                            }
                        </div>
                        <SelectBox id="selectConfidentialities" className="form-control" data={document.confidentialities} />
                    </div>
                </td>
                <td>
                    <a id="documentStatus" className="doc-check">
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