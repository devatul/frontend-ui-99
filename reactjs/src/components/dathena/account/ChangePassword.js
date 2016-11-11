'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from "../HelpButton"
import makeRequest from '../../../utils/http'
import Constant from '../../../Constant.js';

var ChangePass = React.createClass({

    getInitialState() {
        return {
           data : {},
           err_curr : '',
           err_new : '',
           err_conf : ''
        }
    },

    PropTypes: {
        setDefault: PropTypes.string,
        setTarget: PropTypes.string
    },
    getValueInput(event) {
        let datas = _.cloneDeep(this.state.data),
            value = event.target.type == 'checkbox' ? event.target.checked : event.target.value.trim();

        datas = _.assignIn(datas, {[event.target.name]: value});
        this.setState({data: datas})
    },
    getConfirmPass(event){

    },
    submitForm(){
        $.ajax({
            url: Constant.SERVER_API + 'api/account/change_password/',
            dataType: 'json',
            type: 'PUT',
            data: JSON.stringify(this.state.data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {}.bind(this),
            error: function(xhr, status, error) {
                let jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                this.setState({err_curr : jsonResponse.current_password[0], err_new : jsonResponse.new_password[0] , err_conf : jsonResponse.confirm_password[0]})

            }.bind(this)
        });
    },
    componentDidMount() {

    },

    render() {
        let className_curr = this.state.err_curr ? 'form-control input-md has-error ' : 'form-control input-md ',
            className_new = this.state.err_new ? 'form-control input-md has-error ' : 'form-control input-md ',
            className_conf = this.state.err_conf ? 'form-control input-md has-error ' : 'form-control input-md '
        return(
            <div className="change-email-address" id= "submitForm">
                <div className="form-group mb-lg">
                    <div className="clearfix">
                        <label className="pull-left">Current Password</label>
                    </div>
                    <div className="input-group input-group-icon">
                        <input name="current_password" id="currentPass1" type="password" className={className_curr} onChange={this.getValueInput} />
                        <span className="input-group-addon">
                            <span className="icon icon-md">
                                <i className="fa fa-lock"></i>
                            </span>
                        </span>
                    </div>
                     <span className="error">{this.state.err_curr}</span>
                </div>
                <div className="form-group mb-lg">
                    <div className="clearfix">
                        <label className="pull-left">New Password</label>
                    </div>
                    <div className="input-group input-group-icon">
                        <input name="new_password" type="password" id="newPass" className={className_new} onChange={this.getValueInput} />
                        <span className="input-group-addon">
                            <span className="icon icon-md">
                                <i className="fa fa-lock"></i>
                            </span>
                        </span>
                     </div>
                      <span className="error">{this.state.err_new}</span>
                </div>
                <div className="form-group mb-lg">
                    <div className="clearfix">
                        <label className="pull-left">Confirm New Password</label>
                    </div>
                    <div className="input-group input-group-icon">
                        <input name="confirm_password" type="password" id="ConfirmPass" className={className_conf} onChange={this.getConfirmPass} />
                        <span className="input-group-addon">
                            <span className="icon icon-md">
                                <i className="fa fa-lock"></i>
                            </span>
                        </span>
                    </div>
                     <span className="error">{this.state.err_conf}</span>
                </div>
                <div className="change-email-bottom my-profile-bottom col-xs-12">
                    <a onClick={this.submitForm} className="btn btn-primary btn-ok">Change my Password</a>
                </div>
            </div>
        )
    }
});

module.exports = ChangePass;
