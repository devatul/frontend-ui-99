'use strict';

import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'
import 'jquery'

var Chart = React.createClass({
    displayName: 'Chart',

    getInitialState() {
        return {
            chart_data: this.props.chart_data,
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.dataChart != nextProps.dataChart) {
            return true
        }
        if (this.props.id != nextProps.id) {
            return true
        }

        return false
    },

    componentDidUpdate() {
        let categories = this.props.dataChart.categories,
            data = this.props.dataChart.data,
            colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240', '#8cc1d1', '#b0d6e1', '#349da1', '#8ababc', '#aecccc', '#7986cc', '#a5aaca', '#c0c4df', '#e46159'],
            colorsHover = ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];

        $('#' + this.props.id).highcharts({
            chart: {
                type: 'bar',
                height: data.length * 40
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                },
                tickInterval: 1,
                tickWidth: 0,
                lineWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 0,
                tickmarkPlacement: 'on',
                labels: {
                    style: {
                        font: '11px Roboto, Helvetica, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            brightness: 0,
                        }
                    },
                    point: {
                        events: {
                            mouseOver: function(event) {
                                this.graphic.attr({
                                    fill: colors[this.index]
                                });
                            },
                        }
                    },
                    events: {
                        mouseOver: function(e) {
                            var serie = this.points;
                            $.each(serie, function(i, e) {
                                this.graphic.attr({
                                    fill: colorsHover[i]
                                });
                            });
                        },
                        mouseOut: function() {
                            var serie = this.points;
                            $.each(serie, function(i, e) {
                                this.graphic.attr({
                                    fill: colors[i]
                                });
                            });
                        }
                    }
                },
                 series: {
                    pointWidth: 18,
                    pointPadding: 0,
                    groupPadding: 0
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.x + '</b><br>' + this.series.name + ': ' + this.y;
                }
            },
            series: [{
                name: 'Documents',
                data: data,
            }]
        });

        // CONTENT TOGGLE
        // Configure/customize these variables.
        let showChar = 42, // How many characters are shown by default
            ellipsestext = "...",
            moretext = "more keywords",
            lesstext = "less keywords";

        $('.more').each(function() {
            let content = $(this).html();

            if (content.length > showChar) {
                let c = content.substr(0, showChar),
                    h = content.substr(showChar, content.length - showChar),
                    html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

                $(this).html(html);
            }
        });

        $(".morelink").click(function() {
            if ($(this).hasClass("less")) {
                $(this).removeClass("less");
                $(this).html(moretext);
                $(this).parents('tr').find('.pie-wrapper').removeClass('pie-md').addClass('pie-sm');
            } else {
                $(this).addClass("less");
                $(this).html(lesstext);
                $(this).parents('tr').find('.pie-wrapper').removeClass('pie-sm').addClass('pie-md');
            }

            $(this).parent().prev().toggle();
            $(this).prev().toggle();

            return false;
        });
    },

    exports(){
        this.props.exports();
    },

    render() {
        let height = '';

        if (this.props.height != null) {
            height = this.props.height +'px'
        } else {
            if (this.props.numberUser == 5) {
                height = '200px'
            }
            if (this.props.numberUser == 15) {
                height = '450px'
            }
            if (this.props.numberUser == 25) {
                height = '450px'
            }
            if (this.props.numberUser == 50) {
                height = '450px'
            }
        }

        let style = {
            'height': height,
        };

        return (
            <div>
                <div id={ this.props.id } className="identity-chart" style={ style }></div>
                <a href="javascript:;" className="btn btn-green btn-extract" onClick={ this.exports }>Extract</a>
            </div>
        );
    },
});

module.exports = Chart;
