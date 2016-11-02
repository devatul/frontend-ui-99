'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {times, each} from 'lodash'

var CentroidChart = React.createClass({
    displayName: 'CentroidChart',

    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array
    },

    getDefaultProps() {
        return {
            title: "title",
            help: "help content"
        };
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.series != prevProps.series) {
            this.draw();
        }
    },

    componentDidMount() {
        this.draw();
    },

    draw() {
        var colorsCentroid = [ '#45A446', '#98A33A', '#DAA525', '#EC892B', '#E15E29', '#D0352D', '#D0352D'],
            {
                series
            } = this.props;

        $('#centroidChart').highcharts({
            chart: {
            polar: true,
            events: {
                load: function () {
                var chart = this;
                $(chart.series).each(function (i, serie) {
                    var documentNum = serie.data[1].weight;
                    var distance = parseInt((Math.abs(serie.data[0].y)+5)/5);
                    var points = serie.points;
                    serie.color = colorsCentroid[distance-1];
                    serie.graph.attr({
                        stroke: colorsCentroid[distance-1]
                    });
                    serie.options.marker.radius = documentNum*3+1;
                    serie.options.marker.states.hover.radius = documentNum*3+2;
                    $.each(points, function (i, e) {
                        var pt = e;
                        pt.color = colorsCentroid[distance-1];
                        pt.fillColor = colorsCentroid[distance-1];
                    });
                    serie.redraw();
                });
                }
            }
            },

            credits: {
            enabled: false
            },

            title: {
            text: null
            },

            pane: {
            startAngle: -90,
            endAngle: 90
            },

            xAxis: {
            tickInterval: 90,
            min: 0,
            max: 360,
            labels: {
                enabled: false
            },
            plotLines: [{
                color: '#BFDDF7',
                width: 2,
                value: [0, 2],
                zIndex: 1
            }]
            },

            yAxis: {
            min: -5,
            tickInterval: 5,
            plotBands: [{
                from: 0,
                to: 5,
                color: '#EDEDED'
            },{
                from: 5,
                to: 10,
                color: '#F2F2F2'
            },{
                from: 10,
                to: 15,
                color: '#F7F7F7'
            },{
                from: 15,
                to: 20,
                color: '#FCFCFC'
            }],
            labels: {
                formatter: function() {
                return this.value >= 0 ? this.value : null;
                },
            }
            },

            plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            },
            line: {
                //lineWidth: 0
            }
            },

            legend:{
            enabled: false
            },
            tooltip: {
            formatter: function() {
                return 'Documents:'+ this.series.data[1].document + '<br>' +'Distance:' + this.y;
            },
            useHTML: true
            },

            series: series

        });
    },

    render() {
        let max = 0;
        let max_circle_size = 6;
        each(this.props.series, (row) => {
            if(row.data[1].document > max){
                max = row.data[1].document
            }
        })
        let legends = times(max_circle_size, (i) => {
            i++;
            let document_no = Math.ceil(((i - 1) * max / max_circle_size) + 1);
            let document_no_next = Math.ceil(((i) * max / max_circle_size));
            return (
                <span className="document-symbol"><i className={'size-' + i}></i> <span>{document_no} to {document_no_next}</span></span>
            )
        })
        return (
            <div id="centroid" className="cendroid-frame">
                <h4 className="chart-title">
                    Centroid Distance Histogram
                    <HelpButton classMenu="fix-overview-help-button-table" setValue={this.props.help} />
                </h4>
                <Row>
                    <Col md={9} sm={9}>
                        <div id="centroidChartWrapper">
                            <div id="centroidChart"></div>
                            <div className="cendroid-chart-label"><strong>Group</strong><span className="number">1</span></div>
                        </div>
                    </Col>
                    <Col md={3} sm={3}>
                        <Row>
                            <div className="cendroid-chart-legend new">
                                <h5>Distance</h5>
                                <span className="symbol" style={{ backgroundColor: '#45A446' }}>0</span>
                                <span className="symbol" style={{ backgroundColor: '#98A33A' }}>5</span>
                                <span className="symbol" style={{ backgroundColor: '#DAA525' }}>10</span>
                                <span className="symbol" style={{ backgroundColor: '#EC892B' }}>15</span>
                                <span className="symbol" style={{ backgroundColor: '#E15E29' }}>20</span>
                                <span className="symbol" style={{ backgroundColor: '#D0352D' }}>25</span>
                                <span className="more-legend">more</span>
                            </div>
                        </Row>
                        <Row>
                            <div className="cendroid-chart-legend new">
                                <h5>Number of documents</h5>
                                {legends}
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
            );
    }

});
module.exports = CentroidChart;
