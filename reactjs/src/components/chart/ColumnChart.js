'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'

var ColumnChart = React.createClass({
    displayName: 'selectButton',
    
    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array,
        help: PropTypes.string
    },

    // shouldComponentUpdate(nextProps, nextState) {
    //     return  this.props.data != nextProps.data;
    // },

    // componentDidUpdate(prevProps, prevState) {
    //     if(this.props.data != prevProps.data) {
    //         this.draw();
    //     }  
    // },

    componentDidMount() {
        this.draw()
    },
    

    draw() {
        var chartframe = $(this.refs.chartframe);
        var data = this.props.data;
        var colors = [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'];
        var colorsHover  = [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];
        $('#confidentialityLevelChart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            credits: {
            enabled: false
            },
            colors: colors,
            xAxis: {
                categories: ['Word', 'Excel', 'PDF', 'Power Point', 'Other'],
                labels:{
                autoRotation: false,
                style: {
                    color: '#272727',
                    'font-size': '10px'
                },
                },
                tickInterval: 1,
                tickWidth: 0,
                lineWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 0,
                tickmarkPlacement: 'on'
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: false
                }
            },
            legend: {
            enabled: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y} Documents<br/>Total: {point.stackTotal} Documents'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                    },
                    point: {
                    events: {
                        mouseOver: function(){
                        console.log(this);
                        var columnIndex = this.index;
                        }
                    }
                    },
                    events: {
                    mouseOver: function(){
                        console.log(this);
                        // var serie = this.points;
                        // $.each(serie, function (i, e) {
                        //     this.graphic.attr({
                        //         fill: colorsHover[i]
                        //     });
                        // });
                    },
                    mouseOut: function(){
                        var serie = this.points;
                        // $.each(serie, function (i, e) {
                        //     this.graphic.attr({
                        //         fill: colors[i]
                        //     });
                        // });
                    }
                    }
                }
            },
            series: [{
                name: 'Public',
                data: [400,420,390,410, 414]
            }, {
                name: 'Internal',
                data: [80,100,123,90, 300]
            }, {
                name: 'Confidential',
                data: [200,210,180,188, 310]
            },{
                name: 'Secret',
                data: [400,420,390,410, 404]
            }, {
                name: 'Banking Secrecy',
                data: [80,100,123,90, 111]
            }]
        });
    },

    render() {
        return (
            <div>
                <h4 className="chart-title">{this.props.title}
                    <HelpButton classNote="note_chart_content_review"
                        classIcon="fa-question-circle"
                        setValue={this.props.help} />
                </h4>
                <div id="confidentialityLevelChart"></div>
            </div>
            );
    }

});
module.exports = ColumnChart;