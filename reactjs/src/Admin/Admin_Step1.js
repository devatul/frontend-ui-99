import React, {Component, propTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
import _ from 'lodash';
import {getOrganization, setOrganization, getSla, checkConfidentiality} from '../utils/function';
import template from './Admin_Step1.rt';

var Admin_Step1 = React.createClass({
  getInitialState() {
    return {
      complete: 0,
      cycleProgress: 'progress-radial progress-0',
      readOnly: false,
      readOnly1: false,
      readOnly2: false,
      SLA: [],
      SLA1: [],
      SLA2: [],
      count: 0,
      data_block: {
        block1: [],
        block2: [],
        block3: []
      },
      organisation: {
        name: '',
        region: '',
        country: ''
      },
      confidentialities: [],
      sla: []
    }
  },

  changeCheckbox(event) {
    let data = _.cloneDeep(this.state.confidentialities);

    _.forEach(data, function (object, index) {
      if (event.target.name == object.level) {
        object.is_active = object.is_active ? false : true
      }
    });

    this.setState({confidentialities: data});
  },

  getOrganisation() {
    return getOrganization({
      success: (data) => {
        this.setState({organisation: data});
      }
    });
  },

  getSLAs() {
    return getSla({
      success: (data) => {
        this.setState({sla: this.configSLA(data)});
      }
    });
  },

  configSLA(sla) {
    let document_owner = [],
        class_review = [],
        security_review = [];

    _.forEach(sla, function (object, index) {
      object.class_type == 'document_owner' ? document_owner.push(object) : (object.class_type == 'class_review' ? class_review.push(object) : security_review.push(object));
    });

    return {
      'document_owner': document_owner,
      'class_review': class_review,
      'security_review': security_review,
    }
  },

  getConfidentialities() {
    return checkConfidentiality({
      success: (results) => {
        let data = [{
          "level": "unrestricted",
          "level_name": "Unrestricted",
          "is_active": true,
          "custom_name": ''
        }, {
          "level": "internal_only",
          "level_name": "Internal Only",
          "is_active": true,
          "custom_name": ''
        }, {
          "level": "confidential",
          "level_name": "Confidential",
          "is_active": true,
          "custom_name": ''
        }, {
          "level": "secret",
          "level_name": "Secret",
          "is_active": true,
          "custom_name": ''
        }, {
          "level": "banking_secrecy",
          "level_name": "Banking Secrecy",
          "is_active": true,
          "custom_name": ''
        }];

        console.log(results);

        this.setState({confidentialities: data});
      }
    });
  },

  componentDidMount() {
    this.getOrganisation();
    this.getConfidentialities();
    this.getSLAs();
  },

  getValueInputOrganisation(event, name) {
    let data_submit = _.omit(_.cloneDeep(this.state.organisation), ['phone', 'mobile', 'state']),
        value = typeof event === 'string' ? event : event.target.value;

    data_submit = _.assignIn(data_submit, {
      [name]: value,
    });

    this.setState({organisation: data_submit});
  },

  putOrganisation() {
    let data_submit = _.omit(_.cloneDeep(this.state.organisation), ['phone', 'mobile', 'state']);

    return setOrganization({
      method: 'PUT',
      params: JSON.stringify(data_submit),
      success: (data) => {
      }
    });
  },

  onChangeInput(event, name, value) {
    let data = this.state.data_block,
        fieldId = event.target.id,
        block_change = data.block2,
        check = false;

    if (_.isEmpty(block_change)) {
      block_change.push({
        id: fieldId,
        value: value
      });
    } else {
      for (let i = 0, length = block_change.length; i < length; i++) {
        if (block_change[i].id == fieldId) {
          block_change[i].value = value;
          check = true;
          break
        }
      }

      if (!check) {
        block_change.push({
          id: fieldId,
          value: value
        })
      }
    }

    let updateBlock = update(this.state, {
      data_block: {
        ['block2']: {$set: block_change}
      }
    });

    this.setState(updateBlock);
    this.props.changeDatapage(this.state.data_block);
  },

  clickConfirm() {
    this.setState({complete: 1, readOnly: true});
    this.putOrganisation();
  },

  clickValidate1() {
    this.setState({complete: 2, readOnly1: true});
  },

  editButton(value, readOnly) {
    switch (value) {
      case 1:
        this.setState({readOnly: false});
        if (readOnly == false) {
          this.putOrganisation();
          this.setState({readOnly: true})
        }
        break;
      case 2:
        this.setState({readOnly1: false});
        if (readOnly == false) {
          this.setState({readOnly1: true})
        }
        break;
      case 3:
        $("#block1_step1").find("input").prop('disabled', false);
        $("#block1_step1").find("select").attr("disabled", false);
        $("#block1_step1").find("a").css('pointer-events', 'auto');

        this.setState({readOnly2: false});

        if (readOnly == false) {
          $("#block1_step1").find("input").prop('disabled', true);
          $("#block1_step1").find("a").css('pointer-events', 'none');
          $("#block1_step1").find("select").attr("disabled", true);
          this.setState({readOnly2: true})
        }
        break;
    }
  },

  addSLA(value) {
    if (value == 1) {
      let newSLA = {key: this.state.SLA.length};
      this.setState({SLA: _.concat(newSLA, this.state.SLA)});
    }
    if (value == 2) {
      let newSLA = {key: this.state.SLA1.length};
      this.setState({SLA1: _.concat(newSLA, this.state.SLA1)});
    }
    if (value == 3) {
      let newSLA = {key: this.state.SLA2.length};
      this.setState({SLA2: _.concat(newSLA, this.state.SLA2)});
    }
  },

  nextStep() {
    this.setState({complete: 3, readOnly: true});

    $(window).scrollTop(0);

    $("#block1_step1").find("input").prop('disabled', true);
    $("#block1_step1").find("select").attr("disabled", true);
    $("#block1_step1").find("a").css('pointer-events', 'none');

    this.props.nextStep(2);
  },

  render: template
});

module.exports = Admin_Step1;
