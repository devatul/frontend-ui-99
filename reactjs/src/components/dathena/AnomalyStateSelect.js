import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import _ from 'lodash';
import $ from 'jquery';

var StateSelect = React.createClass({
  propTypes: {
    change: PropTypes.func
  },

  getInitialState() {
    return {
      display: 'none',
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.show != prevProps.show) {
      let value = this.props.show == null ? 'none' : this.props.show;
      this.setState({display: value});
    }
  },

  handleClick(value) {
    this.setState({display: 'none'});
    this.props.onChange(this.props.data, value, this.props.number);
  },

  componentDidMount() {
    $('body')
      .on('mouseover', '.anomaly-state-select .anomaly-state', function () {
        var parent = $(this).parents('.anomaly-state-select');

        parent.find('.anomaly-state').removeClass('active');

        $(this).addClass('active');

        parent.find('.current-state').html($(this).attr('data-label'));

        $('[data-label]').css('font-weight', 'normal')
      })
      .on('mouseleave', '.anomaly-state-select .anomaly-state', function () {
        $(this).removeClass('active');
        $(this).parents('.anomaly-state-select').find('.current-state').html('');
      });
  },

  render(){
    return (
      <div className="anomaly-state-select" style={{'display': this.state.display, 'left': '90%'}}>
        <div className="states">
          <span className="anomaly-state not-reviewed" data-state="not-reviewed" data-label="Not Reviewed" onClick={()=>this.handleClick('not_reviewed')}></span>
          <span className="anomaly-state investigation" data-state="investigation" data-label="Under Investigation" onClick={()=>this.handleClick('under_investigation')}></span>
          <span className="anomaly-state true" data-state="true" data-label="True Positive" onClick={()=>this.handleClick('true_positive')}></span>
          <span className="anomaly-state false" data-state="false" data-label="False Positive" onClick={()=>this.handleClick('false_positive')}></span>
        </div>
        <span className="current-state" style={{'fontWeight': 'normal'}}></span>
      </div>
    )
  }
});

module.exports = StateSelect;
