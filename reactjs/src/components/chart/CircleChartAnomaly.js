'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'
import $ from 'jquery'
import ProgressLabel from '../dathena/progress-label'

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
         //this.draw()
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

    colorOuter(num) {
        switch(true) {
            case num > 0 && num <= 33:
                return '#49c89b';
            case num > 33 && num <= 67:
                return '#ef7716';
            case num > 67 && num <= 100:
                return '#e46159';
        }
    },

    colorInner(num) {
        switch(true) {
            case num >= 0 && num < 25:
                return '#e46159';
            case num >= 25 && num < 50:
                return '#ef7716';
            case num >= 50 && num <= 100:
                return '#49c89b';
        }
    },

    render() {
        let id= this.props.id
        return (
            <div className="anomaly-radial" id= {id}>
                    <div className="progress-example">
                        <ProgressLabel
                            className="anomaly-radial-outer"
                            progress={this.props.value_outer}
                            startDegree={0}
                            progressWidth={11.5}
                            trackWidth={12}
                            cornersWidth={6}
                            progressColor={this.colorOuter(this.props.value_outer)}
                            trackColor="#eee"
                            fillColor="transparent"
                            size={154}>
                        </ProgressLabel>
                        <ProgressLabel
                            className="anomaly-radial-inner"
                            progress={this.props.value_inner}
                            startDegree={0}
                            progressWidth={11.5}
                            trackWidth={12}
                            cornersWidth={6}
                            progressColor={this.colorInner(this.props.value_inner)}
                            trackColor="#eee"
                            fillColor="transparent"
                            size={124}>
                        </ProgressLabel>
                    </div>
                <span className={this.props.className}></span>
                <div className="anomaly-legend outer-legend">
                  <span className="legend orange legend fix" style={{ color: this.colorOuter(this.props.value_outer) }}>Medium Risk</span>
                  <span className="outer-indicator orange" style={{ backgroundColor: this.colorOuter(this.props.value_outer) }}></span>
                </div>
                <div className="anomaly-legend inner-legend">
                  <span className="legend green" style={{ color: this.colorInner(this.props.value_outer) }}>Prediction Quality: High</span>
                  <span className="inner-indicator green" style={{ backgroundColor: this.colorInner(this.props.value_outer) }}></span>
                </div>
              </div>
            );
    }

});
module.exports = CircleChart;