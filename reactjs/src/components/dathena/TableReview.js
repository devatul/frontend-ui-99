import React,  { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { Dropdown } from 'react-bootstrap'
import { Toggle } from '../bootstrap/DropdownCustom'
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



    render() {
        let { document } = this.props;
        debugger
        return (
            <tr className="">
                <td>
                    <div className="checkbox-custom checkbox-default">
                        <input type="checkbox" className="checkbox-item-1" data-target="#table-my-actions-1" />
                        <label></label>
                    </div>
                </td>
                <td className="text-center">
                    <i className="fa fa-file-word-o action-file-icon"></i>
                </td>
                <td className="text-left">
                    <span class="text-italic file-name doc-path" data-toggle="modal" data-target="#previewModal">
                        {document.name}
                    </span>

                    <Dropdown className="dropdown-file-info-holder inline-block-item">
                        <Toggle bsRole="toggle" className="btn-file-info fa fa-info-circle"/>
                        <Dropdown.Menu className="has-arrow dropdown-file-info append-to-body">
                            <li>Name: <b>Contract</b></li>
                            <li>Path: <a href="#">/assets/group_1/documents/pdf/Contract.doc</a></li>
                            <li>Owner: <b>Todd_Smith</b></li>
                            <li>Creation Date: <b>2015-01-01</b></li>
                            <li>Modification Date: <b>2015-05-28</b></li>
                            <li>Required Legal Retention until: <b>2025-03-03</b></li>
                            <li>Confidentiality Label: <b>Yes/No</b></li>
                            <li>Number of Classification Challenge: <b>1</b></li>
                        </Dropdown.Menu>
                    </Dropdown>
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
                        <select className="form-control">
                            <option>Accounting/ Tax</option>
                            <option>Corporate Entity</option>
                            <option>Client/Customer</option>
                            <option>Employee</option>
                            <option selected="">Legal/Compliance</option>
                            <option>Transaction</option>
                        </select>
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
                        <select className="form-control">
                            <option selected="">Banking Secrecy</option>
                            <option>Secret</option>
                            <option>Confidential</option>
                            <option>Internal</option>
                            <option>Public</option>
                        </select>
                    </div>
                </td>
                <td>
                    <a href="#" className="doc-check">
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