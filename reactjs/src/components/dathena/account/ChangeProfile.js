import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import HelpButton from "../HelpButton";
import makeRequest from '../../../utils/http';
import Constant from '../../../Constant.js';

var ChangeProfile = React.createClass({
  getInitialState() {
    return {
      data: {}
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(this.state.data, nextState.data) && _.isEqual(this.props.profile, nextProps.profile)) {
      return false
    }
    return true;
  },

  getValueInput(event) {
    let datas = _.cloneDeep(this.state.data),
        value = event.target.type == 'checkbox' ? event.target.checked : event.target.value.trim();

    datas = _.assignIn(datas, {[event.target.name]: value});
    this.setState({data: datas})
  },

  submitForm(){
    $.ajax({
      url: Constant.SERVER_API + 'api/account/profile/',
      dataType: 'json',
      type: 'PUT',
      data: JSON.stringify(this.state.data),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
      },
      success: function (data) {}.bind(this),
      error: function (xhr, status, error) {}.bind(this)
    });
  },

  componentDidMount() {
  },

  render() {
    let {profile} = this.props,
        child =
          <div className="row">
            <div className="profile-details-left col-md-6 col-sm-6 col-xs-12">
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Windows ID</label>
                <div className="mpe_input">
                  <input type="text" name="windows_id" value={profile.windows_id} className="form-control" id="WindowID" onChange={this.getValueInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Department</label>
                <div className="mpe_input">
                  <input type="text" name="department" value={profile.department} className="form-control" id="Department" onChange={this.getValueInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Company Name</label>
                <div className="mpe_input">
                  <input type="text" name="company_name" value={profile.company_name} className="form-control" id="CompanyName" onChange={this.getValueInput} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Location</label>
                <div className="mpe_input">
                  <input type="text" name="location" value={profile.location} className="form-control" id="Location" onChange={this.getValueInput} />
                </div>
              </div>
            </div>
            <div className="profile-details-right col-md-6 col-sm-6 col-xs-12">
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Corporate Email</label>
                <div className="mpe_input">
                  <input type="text" name="corporate_email" value={profile.corporate_email} className="form-control" id="Email" onChange={this.getValueInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Corporate Phone (Landline)</label>
                <div className="mpe_input">
                  <input type="text" name="corporate_phone" value={profile.corporate_phone} className="form-control" id="Corporate_phone" onChange={this.getValueInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor="inputDefault">Corporate Phone (Mobile)</label>
                <div className="mpe_input">
                  <input type="text" name="corporate_mobile" value={profile.corporate_mobile} className="form-control" id="Corporate_mobile" onChange={this.getValueInput} />
                </div>
              </div>

              <div className="profile_details_bottom_right">
                <ul className="my-profile-ul">
                  <li className="left3">System User</li>
                  <li>
                    <HelpButton
                      classMenu="fix-overview-help-button-table"
                      classIcon="overview_question_a help_question_a"
                      setValue="Use your user name and password provided by Dathena to connect into Dathena99." />
                  </li>
                  <li className="left1">
                    <div className="switch switch-sm switch-primary">
                      <div className="ios-switch off">
                        <div className="on-background background-fill"></div>
                        <div className="state-background background-fill"></div>
                        <div className="handle"></div>
                      </div>
                    </div>
                  </li>
                  <li className="left2">
                    <ul className="content_profile_note_ul">
                      <li>
                        <p className="content_profile_note">Active Directory</p>
                      </li>
                      <li className="left4">
                        <HelpButton
                          classMenu="fix-overview-help-button-table"
                          classIcon="overview_question_a help_question_a"
                          setValue="Use your Microsoft user name and password to connect into Dathena 99. Enable Dathena 99 to connect automatically using your Microsoft credentials." />
                      </li>
                    </ul>
                    <div className="my-profile-check-none checkbox-custom checkbox-default">
                      <input className="x" id="z" name="agreeterms" type="checkbox" />
                      <label htmlFor="AgreeTerms">Enable SSO</label>
                    </div>
                  </li>
                </ul>
                <div className="change-email-bottom my-profile-bottom col-xs-12">
                  <a className="btn btn-primary btn-ok" onClick={this.submitForm}>
                    Change Profile
                  </a>
                </div>
              </div>
            </div>
          </div>;

    return (<div>{child}</div>);
  }
});

module.exports = ChangeProfile;
