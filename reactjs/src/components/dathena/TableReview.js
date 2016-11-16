import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import InfoButton from '../dathena/InfoButton';
import SelectBox from '../dathena/SelectBox';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import {renderClassType, orderByIndex} from '../../utils/function';
import {status} from '../../Constant';
import makeRequest from '../../utils/http';
import {findIndex, isEqual} from 'lodash';

var Table = React.createClass({
  render() {
    return (
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

var RowChallenged = React.createClass({
  getInitialState() {
    return {
      showText: this.props.showText,
      numberText: this.props.numberText
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.showText != nextProps.showText) {
      this.setState({showText: nextProps.showText});
    }

    if (this.props.numberText != nextProps.numberText) {
      this.setState({numberText: nextProps.numberText});
    }
  },

  getDefaultProps() {
    return {
      showText: false,
      numberText: 18
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  },


  renderComment(comment) {
    if (!this.state.showText) {
      comment = comment.substring(0, this.state.numberText) + '...';
    }

    return (<span className="doc-path my-doc-path">{comment}</span>);
  },

  renderStatus(status) {
    switch (true) {
      case status && (status > 66 && status <= 100):
        return (<i className="fa fa-clock-o icon-danger"></i>);
      case status && (status > 33 && status < 66):
        return (<i className="fa fa-clock-o icon-warning"></i>);
      case status && (status > 0 && status < 33):
        return (<i className="fa fa-clock-o icon-success"></i>);
    }
  },

  renderValidation(valid) {
    switch (valid) {
      case status.EDITING.name:
        return "icon-danger";
      case status.ACCEPTED.name:
        return "icon-success";
      default:
        return "";
    }
  },

  onClickMoreLess() {
    this.setState({showText: !this.state.showText});
  },

  handleOnChange(event) {
    this.props.onChange && this.props.onChange(event, this.props.index);
  },

  handleOnclick(event) {
    this.props.onClick && this.props.onClick(event, this.props.index);
  },

  render() {
    let {document, categories, numberCheck, confidentialities, hide} = this.props,
        changedCategory = !isEqual(document.current_category, document.previous_category),
        changedConfidentiality = !isEqual(document.current_confidentiality, document.previous_confidentiality);

    return (
      <tr className={"opa " + ((numberCheck > 0 && !document.checked) ? 'inactive' : '')} onChange={this.handleOnChange}>
        { (hide && hide.checkbox) ? null :
          <td>
            <div className="checkbox-custom checkbox-default">
              <input
                type="checkbox"
                id="checkbox"
                className="checkbox-item-1"
                checked={document.checked} />
              <label></label>
            </div>
          </td> }
        <td><i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i></td>
        <td className="text-left my_file-name">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{document.name}</Tooltip>}>
            <span id="documentName" onClick={this.handleOnclick} className="text-italic file-name fix-max-width-row2 doc-path">{document.name}</span>
          </OverlayTrigger>

          <InfoButton>
            <li>Name: <b>{document.name}</b></li>
            <li>Path: <span><a href="#">{document.path}</a></span></li>
            <li>Owner: <b>{document.owner}</b></li>
            <li>Creation Date: <b>{document.creation_date}</b></li>
            <li>Modification Date: <b>{document.modification_date}</b></li>
            <li>Required Legal Retention until: <b>{document.legal_retention_until}</b></li>
            <li>Number of Classification Challenge: <b>{document.number_of_classification_challenge}</b></li>
          </InfoButton>
        </td>
        <td className="vertical-top text-left opa-child fix-1st-pading-comment-table">
          <SelectBox
            id="selectCategory"
            className={'form-control challenge-category' + (document.previous_category && ' changed')}
            data={categories}
            value={findIndex(categories, (c) => {return c.id == document.current_category.id})} />
          <span className="text-italic previous-status">Previous: {document.previous_category && document.previous_category.name}</span>
        </td>
        <td className="vertical-top text-left opa-child fix-1st-pading-comment-table">
          <SelectBox
            id="selectConfidentiality"
            className={'form-control challenge-confidentiality' + (document.current_confidentiality && ' changed')}
            data={confidentialities}
            value={findIndex(confidentialities, (c) => {return c.id == document.current_confidentiality.id})} />
          <span className="text-italic previous-status">Previous: {document.current_confidentiality && document.previous_confidentiality.name}</span>
        </td>
        <td className="vertical-top document_2nd first-ch max-witdh-coordinator-comment">
          {document.comment && this.renderComment(document.comment)}
          <span className="extra-block show-less-comment">
            <a className="details-toggle" onClick={this.onClickMoreLess} style={{cursor: 'pointer'}}>
              <i className="fa fa-caret-right mr-xs"></i>
              { !this.state.showText && <span>Show details</span>}
              { this.state.showText && <span>Show less</span>}
            </a>
          </span>
        </td>
        <td className="opa-child fix-1st-pading-comment-table">
          <div className="select-group">
            <textarea
              style={{minWidth: '160px'}}
              id="CommentBox"
              value={(document.reviewer_comment ? document.reviewer_comment : '')}
              className="form-control"
              placeholder="Challenge’s rationale details"></textarea>
          </div>
        </td>
        <td>
          <a
            style={{cursor: 'pointer'}}
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

var Row3 = React.createClass({
  getInitialState() {
    return {
      showText: this.props.showText,
      numberText: this.props.numberText
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.showText != nextProps.showText) {
      this.setState({showText: nextProps.showText});
    }

    if (this.props.numberText != nextProps.numberText) {
      this.setState({numberText: nextProps.numberText});
    }
  },

  getDefaultProps() {
    return {
      showText: false,
      numberText: 18
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  },


  renderComment(comment) {
    if (!this.state.showText) {
      comment = comment.substring(0, this.state.numberText) + '...';
    }

    return (<span className="doc-path my-doc-path">{comment}</span>);
  },

  renderStatus(status) {
    switch (true) {
      case status && (status > 66 && status <= 100):
        return (<i className="fa fa-clock-o icon-danger"></i>);
      case status && (status > 33 && status < 66):
        return (<i className="fa fa-clock-o icon-warning"></i>);
      case status && (status > 0 && status < 33):
        return (<i className="fa fa-clock-o icon-success"></i>);
    }
  },

  renderValidation(valid) {
    switch (valid) {
      case status.EDITING.name:
        return "icon-danger";
      case status.ACCEPTED.name:
        return "icon-success";
      default:
        return "";
    }
  },

  onClickMoreLess() {
    this.setState({showText: !this.state.showText});
  },

  handleOnChange(event) {
    this.props.onChange && this.props.onChange(event, this.props.index);
  },

  handleOnclick(event) {
    this.props.onClick && this.props.onClick(event, this.props.index);
  },

  render() {
    let {document, categories, confidentialities} = this.props;

    return (
      <tr className="opa" onChange={this.handleOnChange}>
        <td>{this.renderStatus(document.sla_percent)}</td>
        <td><i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i></td>
        <td className="text-left my_file-name">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{document.name}</Tooltip>}>
            <span id="documentName" onClick={this.handleOnclick} className="text-italic file-name fix-max-width-row2 doc-path">{document.name}</span>
          </OverlayTrigger>

          <InfoButton>
            <li>Name: <b>{document.name}</b></li>
            <li>Path: <span><a href="#">{document.path}</a></span></li>
            <li>Owner: <b>{document.owner}</b></li>
            <li>Creation Date: <b>{document.creation_date}</b></li>
            <li>Modification Date: <b>{document.modification_date}</b></li>
            <li>Required Legal Retention until: <b>{document.legal_retention_until}</b></li>
            <li>Number of Classification Challenge: <b>{document.number_of_classification_challenge}</b></li>
          </InfoButton>
        </td>
        <td className="vertical-top text-left">
          <SelectBox
            id="SelectCategory"
            className={'form-control challenge-category' + (document.previous_category && ' changed')}
            data={categories}
            value={findIndex(categories, (c) => {return (c.id == document.current_category.id)})}/>
          <span className="text-italic previous-status">Previous: {document.previous_category && document.previous_category.name}</span>
        </td>
        <td className="vertical-top text-left">
          <SelectBox
            id="SelectConfidentiality"
            className={'form-control challenge-confidentiality' + (document.current_confidentiality && ' changed')}
            data={confidentialities}
            value={findIndex(confidentialities, (c) => {return (c.id == document.current_confidentiality.id)})}/>
          <span className="text-italic previous-status">Previous: {document.current_confidentiality && document.previous_confidentiality.name}</span>
        </td>
        <td className="vertical-top document_2nd first-ch max-witdh-coordinator-comment">
          {document.reviewer_comment && this.renderComment(document.reviewer_comment)}
          <span className="extra-block show-less-comment">
            <a className="details-toggle" onClick={this.onClickMoreLess} style={{cursor: 'pointer'}}>
              <i className="fa fa-caret-right mr-xs"></i>
              { !this.state.showText && <span>Show details</span>}
              { this.state.showText && <span>Show less</span>}
            </a>
          </span>
        </td>
        <td>
          <a
            style={{cursor: 'pointer'}}
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
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  renderStatus(status) {
    switch (true) {
      case status && (status > 66 && status <= 100):
        return (<i className="fa fa-clock-o icon-danger"></i>);
      case status && (status > 33 && status < 66):
        return (<i className="fa fa-clock-o icon-warning"></i>);
      case status && (status > 0 && status < 33):
        return (<i className="fa fa-clock-o icon-success"></i>);
    }
  },

  renderValidation(valid) {
    switch (valid) {
      case status.EDITING.name:
        return (<i className="fa fa-check icon-danger"></i>);
      case status.ACCEPTED.name:
        return (<i className="fa fa-check icon-success"></i>);
      default:
        return (<i className="fa fa-check"></i>);
    }
  },

  handleOnChange: function (event) {
    this.props.onChange && this.props.onChange(event, this.props.index);
  },

  handleOnclick: function (event) {
    this.props.onClick && this.props.onClick(event, this.props.index);
  },

  render() {
    let {document, categories, confidentialities} = this.props,
        changedCategory = !isEqual(document.current_category, document.previous_category),
        changedConfidentiality = !isEqual(document.current_confidentiality, document.previous_confidentiality);

    return (
      <tr className="opa" onChange={this.handleOnChange}>
        <td>{this.renderStatus(document.sla_percent)}</td>

        <td><i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i></td>
        <td className="text-left my_file-name">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{document.name}</Tooltip>}>
            <span id="documentName" onClick={this.handleOnclick} className="text-italic fix-max-width-row2 file-name doc-path">{document.name}</span>
          </OverlayTrigger>

          <InfoButton>
            <li>Name: <b>{document.name}</b></li>
            <li>Path: <span><a href="#">{document.path}</a></span></li>
            <li>Owner: <b>{document.owner}</b></li>
            <li>Creation Date: <b>{document.creation_date}</b></li>
            <li>Modification Date: <b>{document.modification_date}</b></li>
            <li>Required Legal Retention until: <b>{document.legal_retention_until}</b></li>
            <li>Number of Classification Challenge: <b>{document.number_of_classification_challenge}</b></li>
          </InfoButton>
        </td>
        <td className="vertical-top text-left">
          <SelectBox
            id="SelectCategory"
            className={'form-control challenge-category' + (document.previous_category && ' changed')}
            data={categories}
            value={findIndex(categories, (c) => {return (c.id == document.current_category.id)})}/>
          <span className="text-italic previous-status">Previous: {document.previous_category && document.previous_category.name}</span>
        </td>
        <td className="vertical-top text-left">
          <SelectBox
            id="SelectConfidentiality"
            className={'form-control challenge-confidentiality' + (document.current_confidentiality && ' changed')}
            data={confidentialities}
            value={findIndex(confidentialities, (c) => {return (c.id == document.current_confidentiality.id)})}/>
          <span className="text-italic previous-status">Previous: {document.current_confidentiality && document.previous_confidentiality.name}</span>
        </td>
        <td className="fix-1st-pading-comment-table">
          <textarea id="CommentBox" value={(document.comments ? document.comments : '')} className="form-control" placeholder="Challenge's rationale details"></textarea>
        </td>
        <td>
          <a
            style={{cursor: 'pointer'}}
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

var RowPreview = React.createClass({
  propTypes: {
    document: PropTypes.object,
  },

  componentWillMount() {
  },

  componentDidMount() {
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  componentDidUpdate(prevProps, prevState) {
    let {confidentialities} = this.props;

    if (confidentialities != prevProps.confidentialities) {
      orderByIndex(confidentialities, [4, 3, 2, 1, 0])
    }
  },

  handleSelectBoxOnchange(valSelect, event) {
    let {index} = this.props;
    this.props.onChange && this.props.onChange(event, index);
  },

  handleOnChange(e) {
    let {index} = this.props;
    this.props.onChange && this.props.onChange(e, index);
  },

  handleOnclick: function (e) {
    let {index} = this.props;
    this.props.onClick && this.props.onClick(e, index);
  },

  renderColorConfidence(doc) {
    let {confidence_level, group_avg_centroid_distance, group_max_centroid_distance, group_min_centroid_distance} = doc;

    if (doc != null) {
      switch (true) {
        case confidence_level > 66:
          return "success";
        case confidence_level > 33 && confidence_level < 66:
          return "warning"
        case confidence_level < 33:
          return "danger"
      }
    }
  },

  replace(str, s, e) {
    var i = 0, len = str.length;

    while (i < len) {
      str = str.replace(s, e);
      i++;
    }

    return str;
  },

  getIndex(array, name) {
    let index = -1;

    name = name.toLowerCase();

    for (let i = array.lenth - 1; i >= 0; i--) {
      if (array[i] && array[i].toLowerCase().indexOf(name)) {
        index = i;
        break;
      }
    }

    return index;
  },

  renderStatus(_status) {
    let color = "";

    switch (_status) {
      case status.EDITING.name:
        color = status.EDITING.color;
        break;
    }

    return <i className="fa fa-check" style={{color: color}} aria-hidden="true"></i>;
  },

  render() {
    let {action, document, numberChecked, noConfidence, categories, confidentialities, hide} = this.props;

    let confidentiality;
    if(typeof document.reviewedconfidentiality !== 'undefined' && document.reviewedconfidentiality.id !== 'undefined' ){
      confidentiality = findIndex(confidentialities, (con) => { return con.id == document.reviewedconfidentiality.id })
    }else{
      confidentiality = findIndex(confidentialities, (con) => { return con.id == document.confidentiality.id })
    }
    return (
      document.path ?
        <tr className={(numberChecked > 0) && !document.checked && 'inactive'} onChange={this.handleOnChange}>
          <td className="text-center"><i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i></td>
          <td className="text-left" ref="documentNameContainer">
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{document.name}</Tooltip>}>
              <span id="documentName" style={{maxWidth: 100 + '%'}} onClick={this.handleOnclick} className="text-italic file-name fix-max-width-row doc-path">{document.name}</span>
            </OverlayTrigger>

            <InfoButton>
              <li>Name: <b>{document.name}</b></li>
              <li>Path: <span><a href="#">{document.path}</a></span></li>
              <li>Owner: <b>{document.owner}</b></li>
              <li>Creation Date: <b>{document.creation_date}</b></li>
              <li>Modification Date: <b>{document.modification_date}</b></li>
              {document.legal_retention_until ? <li>Required Legal Retention until: <b>{document.legal_retention_until}</b></li> : ''}
              <li>Number of Classification Challenge: <b>{document.number_of_classification_challenge}</b></li>
            </InfoButton>
          </td>
          <td className="text-center">
            <a href={document.image_url}>{document.path}</a>
          </td>
          <td className="select-category">
            <div className="select-group">
              { !noConfidence &&
                <div className="selected-info">
                  <ProgressBar className="progress-striped light">
                    <ProgressBar
                      bsStyle={this.renderColorConfidence(document)}
                      min={0}
                      max={100}
                      now={document.confidence_level}
                      active
                      label={document.confidence_level && <span className="progress-percentage">{'(' + document.confidence_level.toFixed(2) + '%)'}</span>} />
                  </ProgressBar>
                </div>
              }

              <SelectBox
                id="selectCategory"
                className="form-control"
                data={categories}
                value={ findIndex(categories, (cat) => {return cat.id == document.category.id}) } />
            </div>
          </td>
          <td className="select-confidentiality">
            <div className="select-group">
              <div className="selected-info">
                { !noConfidence &&
                  <div className="selected-info">
                    <ProgressBar className="progress-striped light">
                      <ProgressBar
                        bsStyle={this.renderColorConfidence(document)}
                        min={0}
                        max={100}
                        now={document.confidence_level}
                        active
                        label={document.confidence_level && <span
                        className="progress-percentage">{'(' + document.confidence_level.toFixed(2) + '%)'}</span>} />
                    </ProgressBar>
                  </div>
                }
              </div>
              <SelectBox
                id="selectConfidentiality"
                className="form-control"
                data={confidentialities}
                value={ confidentiality } />
            </div>
          </td>
          <td>
            <a id="documentStatus" style={{cursor: 'pointer'}} onClick={this.handleOnclick} className={'doc-check fix-size ' + (document.status ? 'validated' : '')}>
              <i className="fa fa-clock-o" aria-hidden="true"></i> {this.renderStatus(document.status)}
            </a>
          </td>
        </tr>: <div></div>
    );
  }
});

var Row = React.createClass({
  propTypes: {
    document: PropTypes.object,
  },

  componentWillMount() {
  },

  componentDidMount() {
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  componentDidUpdate(prevProps, prevState) {
    let {confidentialities} = this.props;
    
    if (this.props.confidentialities != prevProps.confidentialities) {
      orderByIndex(confidentialities, [4, 3, 2, 1, 0])
    }
  },

  handleSelectBoxOnchange(valSelect, event) {
    let {index} = this.props;
    this.props.onChange && this.props.onChange(event, index);
  },

  handleOnChange(e) {
    let {index} = this.props;
    this.props.onChange && this.props.onChange(e, index);
  },

  handleOnclick(e) {
    let {index} = this.props;
    this.props.onClick && this.props.onClick(e, index);
  },

  renderColorConfidence(doc) {
    let {confidence_level, group_avg_centroid_distance, group_max_centroid_distance, group_min_centroid_distance} = doc;

    if (doc != null) {
      switch (true) {
        case confidence_level > 66:
          return "success";
        case confidence_level > 33 && confidence_level < 66:
          return "warning"
        case confidence_level < 33:
          return "danger"
      }
    }
  },

  replace(str, s, e) {
    var i = 0, len = str.length;

    while (i < len) {
      str = str.replace(s, e);
      i++;
    }

    return str;
  },

  getIndex(array, name) {
    let index = -1;

    name = name.toLowerCase();

    for (let i = array.lenth - 1; i >= 0; i--) {
      if (array[i] && array[i].toLowerCase().indexOf(name)) {
        index = i;
        break;
      }
    }

    return index;
  },

  renderStatus(_status) {
    let color = "";

    switch (_status) {
      case status.EDITING.name:
        color = status.EDITING.color;
        break;
    }

    return <i className="fa fa-check" style={{color: color}} aria-hidden="true"></i>;
  },

  render() {
    let {action, document, numberChecked, noConfidence, categories, confidentialities, hide} = this.props;
    let confidentiality;
    if(typeof document.reviewedconfidentiality !== 'undefined' && document.reviewedconfidentiality.id !== 'undefined' ){
      confidentiality = findIndex(confidentialities, (con) => { return con.id == document.reviewedconfidentiality.id })
    }else{
      confidentiality = findIndex(confidentialities, (con) => { return con.id == document.confidentiality.id })
    }
    return (
      document.path ?
        <tr className={(numberChecked > 0) && !document.checked && 'inactive'} onChange={this.handleOnChange}>
          <td>
            <div className="checkbox-custom checkbox-default">
              <input id="checkbox" type="checkbox" checked={document.checked} className="checkbox-item-1"/>
              <label></label>
            </div>
          </td>
          <td className="text-center"><i className={'fa ' + (renderClassType(document.name)) + ' action-file-icon'}></i></td>
          <td className="text-left">
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{document.name}</Tooltip>}>
              <span id="documentName" onClick={this.handleOnclick} className="text-italic file-name fix-max-width-row doc-path">{document.name}</span>
            </OverlayTrigger>

            <InfoButton>
              <li>Name: <b>{document.name}</b></li>
              <li>Path: <span><a href="#">{document.path}</a></span></li>
              <li>Owner: <b>{document.owner}</b></li>
              <li>Creation Date: <b>{document.creation_date}</b></li>
              <li>Modification Date: <b>{document.modification_date}</b></li>
              {document.legal_retention_until ? <li>Required Legal Retention until: <b>{document.legal_retention_until}</b></li> : ''}
              <li>Number of Classification Challenge: <b>{document.number_of_classification_challenge}</b></li>
            </InfoButton>
          </td>
          <td className="select-category">
            <div className="select-group">
              { !noConfidence &&
                <div className="selected-info">
                  <ProgressBar className="progress-striped light">
                    <ProgressBar
                      bsStyle={this.renderColorConfidence(document)}
                      min={0}
                      max={100}
                      now={document.confidence_level}
                      active
                      label={document.confidence_level && <span
                      className="progress-percentage">{'(' + document.confidence_level.toFixed(2) + '%)'}</span>} />
                  </ProgressBar>
                </div>
              }
              <SelectBox
                id="selectCategory"
                className="form-control"
                data={categories}
                value={ findIndex(categories, (cat) => {return cat.id == document.category.id}) }/>
            </div>
          </td>
          <td className="select-confidentiality">
            <div className="select-group">
              <div className="selected-info">
                { !noConfidence &&
                  <div className="selected-info">
                    <ProgressBar className="progress-striped light">
                      <ProgressBar
                        bsStyle={this.renderColorConfidence(document)}
                        min={0}
                        max={100}
                        now={document.confidence_level}
                        active
                        label={document.confidence_level && <span className="progress-percentage">{'(' + document.confidence_level.toFixed(2) + '%)'}</span>}/>
                    </ProgressBar>
                  </div>
                }
              </div>
              <SelectBox
                id="selectConfidentiality"
                className="form-control"
                data={confidentialities}
                value={confidentiality}/>
            </div>
          </td>
          <td>
            <a id="documentStatus" style={{cursor: 'pointer'}} onClick={this.handleOnclick} className={'doc-check fix-size ' + (document.status ? 'validated' : '')}>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              {this.renderStatus(document.status)}
            </a>
          </td>
        </tr> : <div></div>
    );
  }
});

module.exports = {
  table: Table,
  RowPreview: RowPreview,
  RowChallenged: RowChallenged,
  row: Row,
  row2: Row2,
  row3: Row3
};
