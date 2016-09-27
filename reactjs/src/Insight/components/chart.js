'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import _ from 'lodash'

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

        console.log('new_data', this.props.dataChart)
        console.log('new_data', this.props.id)
        var categories = [];
        var data = [];
        var categories = this.props.dataChart.categories;
        var data = this.props.dataChart.data;


        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#edc240', '#8cc1d1', '#b0d6e1', '#349da1', '#8ababc', '#aecccc', '#7986cc', '#a5aaca', '#c0c4df', '#e46159'];
        var colorsHover = ['#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE', '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];

        $('#' + this.props.id).highcharts({
            chart: {
                type: 'bar'
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
        var showChar = 42; // How many characters are shown by default
        var ellipsestext = "...";
        var moretext = "more keywords";
        var lesstext = "less keywords";

        $('.more').each(function() {
            var content = $(this).html();

            if (content.length > showChar) {

                var c = content.substr(0, showChar);
                var h = content.substr(showChar, content.length - showChar);

                var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

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
        let height = ''
        if (_.size(this.props.dataChart.categories) == 5) {
            height = '200px'
        } else {
            height = '450px'
        }

        var style = {
            'height': height,
        }
        return ( < div >
            < div id = { this.props.id }
            className = "identity-chart"
            style = { style } > < /div> < a href = "javascript:;"
            className = "btn btn-green btn-extract"
            onClick = { this.exports } > Extract < /a> < /div>

        );
    },
});

module.exports = Chart;
