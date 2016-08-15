'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import HelpButton from '../dathena/HelpButton'

var PieChart = React.createClass({
    displayName: 'selectButton',
    mixins: [PureRenderMixin],
    
    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array,
        help: PropTypes.string,
        style: PropTypes.object
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.data != prevProps.data) {
            this.draw()
        }  
    },
    

    draw() {
        var chartframe = $(this.refs.chartframe);
        var chartlegend = $(this.refs.chartlegend);
        $.plot(chartframe, this.props.data, {
            series: {
                pie: {
                    show: true,
                    label:{
                        show: true,
                        formatter: function labelFormatter(label, series) {
                            return "<div style='font-size:8pt; max-width:60px; line-height: 12pt; text-align:center; padding:2px; color:"+series.color+"'>" + label + "</div>";
                        }
                    }
                }
            },
            legend: {
                show: true,
                position: 'nw',
                noColumns: 1, 
                backgroundOpacity: 0 ,
                container: chartlegend
            },
            grid: {
                hoverable: true,
                clickable: true,
            },
            tooltip: {
                show: true,
                content: function(label,x,y){
                return label + ': %p.0% /' +y + ' Documents';
                }
            }
        });
    },

    render() {
        return (
            <div>
                <h4 className="chart-title">{this.props.title}
                    <HelpButton classNote="review_question_chart" classIcon="fa-question-circle"
                        setValue={this.props.help} />
                </h4>
                <div className="chart-container">
                    <div ref="chartlegend" style={{ position: 'absolute', top: 0, left: 0 }}></div>
                    <div ref="chartframe" style={ this.props.style == null ? { width: '100%', height: '350px', top: -10, right: -35, position: 'relative' } : this.props.style }></div>
                </div>
            </div>
            );
    }

});
module.exports = PieChart;