import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from "../HelpButton";
import Constant from '../../../App/Constant.js';

var ChangeEmail = React.createClass({
  getInitialState() {
         return {
             data: {},
             err_email: '',
             err_pass: ''
         }
     },

     PropTypes: {},

     getValueInput(event) {
         let datas = _.cloneDeep(this.state.data),
             value = event.target.type == 'checkbox' ? event.target.checked : event.target.value.trim();

         datas = _.assignIn(datas, {
             [event.target.name]: value });
         this.setState({ data: datas })
     },

     submitForm() {
         $.ajax({
             url: Constant.SERVER_API + 'api/account/change_email/',
             dataType: 'json',
             type: 'PUT',
             data: JSON.stringify(this.state.data),
             beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
             },
             success: function(data) {
                 this.setState({ err_email: '', err_pass: '' })
             }.bind(this),
             error: function(xhr, status, error) {
                 let jsonResponse = JSON.parse(xhr.responseText);

                 this.setState({ err_email: jsonResponse.email[0], err_pass: jsonResponse.current_password[0] });
             }.bind(this)
         });
     },


  componentDidMount() {
  },

  render() {
    let className_pass = this.state.err_pass ? 'form-control input-md has-error ' : 'form-control input-md ',
        className_email = this.state.err_email ? 'form-control input-md has-error ' : 'form-control input-md '

    return (
      <form id="submitForm">
        <div className="change-email-address">
          <div className="form-group mb-lg">
            <div className="clearfix">
              <label className="pull-left">Current Password</label>
            </div>
            <div className="input-group input-group-icon">
              <input name="currentPass" id="currentPass" type="password" className={className_pass} onChange={this.getValueInput} />
              <span className="input-group-addon">
                <span className="icon icon-md">
                 <i className="fa fa-lock"></i>
                </span>
              </span>
            </div>
            <span className="error">{this.state.err_email}</span>
          </div>
          <div className="form-group mb-lg">
            <div className="clearfix">
              <label className="pull-left">New Email</label>
            </div>
            <div className="input-group input-group-icon">
              <input type="email" name="newEmail" id="newEmail" className={className_email} onChange={this.getValueInput} />
              <span className="input-group-addon">
                <span className="icon icon-md">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </span>
            </div>
            <span className="error">{this.state.err_pass}</span>
          </div>
          <div className="change-email-bottom my-profile-bottom col-xs-12">
            <a className="btn btn-primary btn-ok" onClick={this.submitForm}>Change my Email</a>
          </div>
        </div>
      </form>
    )
  }
});

module.exports = ChangeEmail;
