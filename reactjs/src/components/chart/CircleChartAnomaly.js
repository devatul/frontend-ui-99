'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'

var CircleChart = React.createClass({
    displayName: 'LiquidMeter',

    PropTypes: {
        title: PropTypes.string,
        setValue: PropTypes.number
    },

   /* shouldComponentUpdate(nextProps, nextState) {

    },
*/
    componentDidUpdate(prevProps, prevState) {
       /* this.draw()*/
         /* this.draw()*/

    },
    componentDidMount(){
         this.draw()
      /*   alert(this.props.id)*/
         /*this.draw()*/
     },


    draw() {
            debugger
            var innerChart = $('#' + this.props.id).find('.anomaly-radial-inner');
           /* var innerChartValue = parseInt(innerChart.attr('data-value'));*/
            var outerChart = $('#' + this.props.id).find('.anomaly-radial-outer');
           /* var outerChartValue = parseInt(outerChart.attr('data-value'));*/
            innerChart.radialIndicator({
                initValue: this.props.value_inner,
                radius: 50,
                barWidth: 12,
                percentage: false,
                barColor: ({ 0: '#e46159', 25: '#ef7716', 50: '#49c89b', 100: '#49c89b' }),
                roundCorner: true,
                displayNumber: false
            });
            outerChart.radialIndicator({
                initValue: this.props.value_outer,
                radius: 65,
                barWidth: 12,
                percentage: false,
                barColor: ({ 0: '#49c89b', 33: '#ef7716', 67: '#e46159', 100: '#e46159' }),
                roundCorner: true,
                displayNumber: false
            });


    },

    render() {
        let id= this.props.id
        return (
            <div className="anomaly-radial" id= {id}>
                <div className="anomaly-radial-inner" data-value={this.props.value_inner}></div>
                <div className="anomaly-radial-outer" data-value={this.props.value_outer}></div>
                <span className= {this.props.className}></span>
                <div className="anomaly-legend outer-legend">
                  <span className=" legend orange legend fix">Medium Risk</span>
                  <span className="outer-indicator orange"></span>
                </div>
                <div className="anomaly-legend inner-legend">
                  <span className="legend green">Prediction Quality: High</span>
                  <span className="inner-indicator green"></span>
                </div>
              </div>
            );
    }

});
module.exports = CircleChart;