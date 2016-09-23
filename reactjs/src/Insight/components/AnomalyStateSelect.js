'Use Strict';
import React, { Component,PropTypes } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

var StateSelect = React.createClass({
    propTypes: {

        change: PropTypes.func
    },
     handleClick(value){
         this.props.onChange(value, this.props.number);
    },
    componentDidMount(){
      $('body').on('mouseover', '.anomaly-state-select .anomaly-state', function(){
                var parent = $(this).parents('.anomaly-state-select');
                parent.find('.anomaly-state').removeClass('active');
                $(this).addClass('active');

                parent.find('.current-state').html( $(this).attr('data-label') );
                 $('[data-label]').css('font-weight','normal')
            });

            $('body').on('mouseleave', '.anomaly-state-select .anomaly-state', function(){
                $(this).removeClass('active');
                $(this).parents('.anomaly-state-select').find('.current-state').html('');

            });
             /*$('body').on('click', '.anomaly-state-select .anomaly-state', function(){
                var parent = $(this).parents('td');
                $(this).addClass('selected');
                parent.html($(this));
            });*/


    },

    render(){
        return(
            <div className="anomaly-state-select"  style={{'display': 'block', 'left': '90%'}}>
                <div className="states">
                  <span className="anomaly-state not-reviewed" data-state="not-reviewed" data-label="Not Reviewed" onClick={()=>this.handleClick('not-reviewed')}></span>
                  <span className="anomaly-state investigation" data-state="investigation" data-label="Under Investigation" onClick={()=>this.handleClick('investigation')}></span>
                  <span className="anomaly-state true" data-state="true" data-label="True Positive" onClick={()=>this.handleClick('true')}></span>
                  <span className="anomaly-state false" data-state="false" data-label="False Positive" onClick={()=>this.handleClick('false')}></span>
                </div>
                <span className="current-state"  style={{'fontWeight' : 'normal'}}></span>
              </div>
        )
    }
})

module.exports = StateSelect