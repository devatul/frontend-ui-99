'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import HelpButton from '../dathena/HelpButton'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

var CentroidChart = React.createClass({
    displayName: 'CentroidChart',
    mixins: [PureRenderMixin],
    
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

    // componentDidUpdate(prevProps, prevState) {
    //     if(this.props.data != prevProps.data) {
    //         this.draw();
    //     }
    // },

    componentDidMount() {
        this.draw();
    },

    draw() {
        var colorsCentroid = [ '#45A446', '#98A33A', '#DAA525', '#EC892B', '#E15E29', '#D0352D', '#D0352D'];
        $('#centroidChart').highcharts({
            chart: {
            polar: true,
            events: {
                load: function () {
                var chart = this;
                $(chart.series).each(function (i, serie) {
                    var documentNum = serie.data[1].document;
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

            series: [{
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [
                [10, 3], 
                {
                x: 10,
                y: 0,
                document: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [   
                [90, 3], 
                {
                x: 90,
                y: 0,
                document: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [   
                [120, 5], 
                {
                x: 120,
                y: 0,
                document: 3,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            }, 
            data: [  
                [180, 8], 
                {
                x: 180,
                y: 0,
                document: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [   
                [210, 10], 
                {
                x: 210,
                y: 0,
                document: 2,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null
            ]
            },{
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [   
                [270, 12], 
                {
                x: 270,
                y: 0,
                document: 2,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [   
                [290, 25], 
                {
                x: 290,
                y: 0,
                document: 4,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [ 
                [310, 18], 
                {
                x: 310,
                y: 0,
                document: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [  
                [330, 19], 
                {
                x: 330,
                y: 0,
                document: 5,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }, {
            type: 'scatter',
            lineWidth: 2,
            marker: {
                symbol: 'circle'
            },
            data: [  
                [350, 22], 
                {
                x: 350,
                y: 0,
                document: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
                },
                null]
            }]

        });
    },

    render() {
        return (
            <div id="centroid" className="cendroid-frame">
                <h4 className="chart-title">
                    Centroid Distance Histogram
                    <HelpButton setValue={this.props.help} />
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
                                <span className="symbol" style={{ 'background-color': '#45A446' }}>0</span>
                                <span className="symbol" style={{ 'background-color': '#98A33A' }}>5</span>
                                <span className="symbol" style={{ 'background-color': '#DAA525' }}>10</span>
                                <span className="symbol" style={{ 'background-color': '#EC892B' }}>15</span>
                                <span className="symbol" style={{ 'background-color': '#E15E29' }}>20</span>
                                <span className="symbol" style={{ 'background-color': '#D0352D' }}>25</span>
                                <span className="more-legend">more</span>
                            </div>
                        </Row>
                        <Row>
                            <div className="cendroid-chart-legend new">
                                <h5>Number of the Documents</h5>
                                <span className="document-symbol">1<i className="size-1"></i></span>
                                <span className="document-symbol">2<i className="size-2"></i></span>
                                <span className="document-symbol">3<i className="size-3"></i></span>
                                <span className="document-symbol">4<i className="size-4"></i></span>
                                <span className="document-symbol">5<i className="size-5"></i></span>
                                <span className="document-symbol">6<i className="size-6"></i></span>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
            );
    }

});
module.exports = CentroidChart;