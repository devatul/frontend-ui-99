import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import InfoButton from '../dathena/InfoButton'
import SelectBox from '../dathena/SelectBox'
import ProgressBar from 'react-bootstrap/lib/ProgressBar'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import { renderClassType } from '../../utils/function'
import makeRequest from '../../utils/http'
import { findIndex, isEqual } from 'lodash'

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

var Row3 = React.createClass({

    getInitialState() {
        return {
            showText: this.props.showText,
            numberText: this.props.numberText
        };
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.showText != nextProps.showText) {
            this.setState({ showText: nextProps.showText });
        }

        if(this.props.numberText != nextProps.numberText) {
            this.setState({ numberText: nextProps.numberText });
        }
    },

    getDefaultProps() {
        return {
            showText: false,
            numberText: 18
        };
    },

    renderComment(comment) {
        if(!this.state.showText) {
            comment = comment.substring(0, this.state.numberText) + '...';
        }
        return(
            <span className="doc-path my-doc-path">
                {comment}
            </span>
        );
    },

    renderStatus(status) {
        switch(true) {
            case status && (status > 66 && status < 100):
                return (<i className="fa fa-clock-o icon-danger"></i>);
            case status && (status > 33 && status < 66): 
                return (<i className="fa fa-clock-o icon-warning"></i>);
            case status && (status > 0 && status < 33):
                return (<i className="fa fa-clock-o icon-success"></i>);
        }
    },

    renderValidation(valid) {
        switch(valid) {
            case 'editing':
                return "icon-danger";
            case 'accepted':
                return "icon-success";
            default: 
                return "";
        }
    },

    onClickMoreLess() {
        this.setState({ showText: !this.state.showText });
    },

    handleOnChange: function(event) {
        this.props.onChange &&
            this.props.onChange(event, this.props.index);
    },

    handleOnclick: function(event) {
        this.props.onClick &&
            this.props.onClick(event, this.props.index);
    },

    render() {
        let { document, categories, confidentialities } = this.props,
            changedCategory = !isEqual(document.current_category, document.previous_category),
            changedConfidentiality = !isEqual(document.current_confidentiality, document.previous_confidentiality);

        return(
            <tr className="opa" onChange={this.handleOnChange}>
                <td>
                    {this.renderStatus(document.sla_percent)}
                </td>
                <td>
                    <i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i>
                </td>
                <td className="text-left my_file-name">
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
                <td className="vertical-top text-left">
                    <SelectBox
                        id="SelectCategory"
                        className={'form-control challenge-category' + (changedCategory && ' changed')}
                        data={categories}
                        value={findIndex(categories, document.current_category)} />
                    { changedCategory &&
                        <span className="text-italic previous-status">
                            Previous: {document.previous_category && document.previous_category.name}
                        </span>
                    }
                </td>
                <td className="vertical-top text-left">
                    <SelectBox
                        id="SelectConfidentiality"
                        className={'form-control challenge-confidentiality' + (changedConfidentiality && ' changed')}
                        data={confidentialities}
                        value={findIndex(confidentialities, document.current_confidentiality)} />

                    { changedConfidentiality &&
                        <span className="text-italic previous-status">
                            Previous: {document.current_confidentiality && document.previous_confidentiality.name}
                        </span>
                    }
                </td>
                <td className="vertical-top document_2nd first-ch max-witdh-coordinator-comment">
                    {this.renderComment('The classification should be Confidential because. The classification should be Confidential because')}
                    <a className="more" onClick={this.onClickMoreLess} style={{ display: 'initial', cursor: 'pointer' }}>
                        { !this.state.showText &&
                            <span className="more1">more</span>
                        }
                        { this.state.showText &&
                            <span className="zoom-out" style={{ display: 'initial' }}>less</span>
                        }
                    </a>
                </td>
                <td>
                    <a style={{cursor: 'pointer'}}
                        id="validationButton"
                        onClick={this.handleOnclick}
                        className="challenge-btn validation-btn btn btn-default">
                        <i className={'fa fa-check ' + this.renderValidation(document['2nd_line_validation'])}></i>
                    </a>
                </td>
            </tr>
        );
    }
});

var Row2 = React.createClass({

    renderStatus(status) {
        switch(true) {
            case status && (status > 66 && status < 100):
                return (<i className="fa fa-clock-o icon-danger"></i>);
            case status && (status > 33 && status < 66): 
                return (<i className="fa fa-clock-o icon-warning"></i>);
            case status && (status > 0 && status < 33):
                return (<i className="fa fa-clock-o icon-success"></i>);
        }
    },

    renderValidation(valid) {
        switch(valid) {
            case 'editing':
                return (<i className="fa fa-check icon-danger"></i>);
            case 'accepted':
                return (<i className="fa fa-check icon-success"></i>);
            default: 
                return (<i className="fa fa-check"></i>);
        }
    },

    handleOnChange: function(event) {
        this.props.onChange &&
            this.props.onChange(event, this.props.index);
    },

    handleOnclick: function(event) {
        this.props.onClick &&
            this.props.onClick(event, this.props.index);
    },

    render() {
        let { document, categories, confidentialities } = this.props,
            changedCategory = !isEqual(document.current_category, document.previous_category),
            changedConfidentiality = !isEqual(document.current_confidentiality, document.previous_confidentiality);
        return(
            <tr className="opa" onChange={this.handleOnChange}>
                <td>
                    {this.renderStatus(document.sla_percent)}
                </td>

                <td>
                    <i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i>
                </td>
                <td className="text-left my_file-name">
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
                <td className="vertical-top text-left">
                    <SelectBox
                        id="SelectCategory"
                        className={'form-control challenge-category' + (changedCategory && ' changed')}
                        data={categories}
                        value={findIndex(categories, document.current_category)} />
                    { changedCategory &&
                        <span className="text-italic previous-status">
                            Previous: {document.previous_category && document.previous_category.name}
                        </span>
                    }
                </td>
                <td className="vertical-top text-left">
                    <SelectBox
                        id="SelectConfidentiality"
                        className={'form-control challenge-confidentiality' + (changedConfidentiality && ' changed')}
                        data={confidentialities}
                        value={findIndex(confidentialities, document.current_confidentiality)} />

                    { changedConfidentiality &&
                        <span className="text-italic previous-status">
                            Previous: {document.current_confidentiality && document.previous_confidentiality.name}
                        </span>
                    }
                </td>
                <td className="fix-1st-pading-comment-table">
                    <textarea id="CommentBox" className="form-control" placeholder="Challenge's rationale details">
                    </textarea>
                </td>
                <td>
                    <a style={{cursor: 'pointer'}}
                        id="validationButton"
                        onClick={this.handleOnclick}
                        className="challenge-btn validation-btn btn btn-default">
                        {this.renderValidation(document["2nd_line_validation"])}
                    </a>
                </td>
            </tr>
        );
    }
});


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

    handleSelectBoxOnchange: function(valSelect, event) {
        this.props.onChange &&
            this.props.onChange(event, this.props.index);
    },

    handleOnChange: function(event) {
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
            <tr className={(numberChecked > 0) && !document.checked && 'inactive'} onChange={this.handleOnChange}>
                <td>
                    <div className="checkbox-custom checkbox-default">
                        <input id="checkbox" type="checkbox" checked={document.checked} className="checkbox-item-1"/>
                        <label></label>
                    </div>
                </td>
                <td className="text-center">
                    <i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i>
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
                        <SelectBox
                            id="selectCategory"
                            className="form-control"
                            data={this.props.categories}
                            value={findIndex(this.props.categories, document.category)}/>
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
                        <SelectBox
                            id="selectConfidentiality"
                            className="form-control"
                            data={this.props.confidentialities}
                            value={findIndex(this.props.confidentialities, document.confidentiality)} />
                    </div>
                </td>
                <td>
                    <a id="documentStatus" style={{cursor: 'pointer'}} onClick={this.handleOnclick} className={'doc-check ' + (document.status == 'valid' ? 'validated' : '')}>
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
    row: Row,
    row2: Row2,
    row3: Row3
};