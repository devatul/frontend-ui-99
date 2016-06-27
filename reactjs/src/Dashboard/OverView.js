import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './OverView.rt'
import $ from 'jquery'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
var OverView = React.createClass
({
    mixins: [LinkedStateMixin],
	getInitialState() {
	    return {
	    	generalDetails: {}, 
            scanResult:{},
            todo:{},
            noti:{},
            scanStatus:'beforeScan',
            detailLastScan:{}
		};
	},
    componentWillMount() {
    },
	componentDidMount() {

        console.log("overView");
        $.ajax({
            url:'http://54.169.106.24/notification/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({noti:data});
                console.log(this.state.noti);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        $.ajax({
            url:'http://54.169.106.24/todo/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({todo:data});
                console.log(this.state.todo);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        /*
        $(function () {
            $('.navbar-nav > li').on('click',function(){
               $('.navbar-nav > li').removeClass('active');
              $(this).addClass('active');
            });
        });*/
                      
  	},
    scan(){
        $("#startScan").hide();
        $("#pauseScan").show();
        this.setState({scanStatus: 'scanning'});
        
        $.ajax({
            url:'http://54.251.148.133/api/scan/',
            dataType: 'json',
            type: 'GET',
            /*data: JSON.stringify({
                "country":"all",
                "business_unit":"all",
                "department":"all",
                "team":"all",
                "data_owner":"all"
            }),*/
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                //this.setState({todo:data});
                this.setState({
                    scanResult: {
                        'total_documents':data.total_documents,
                        'percentage_documents_scanned': data.percentage_documents_scanned,
                        'total_duplicates': data.total_duplicates,
                        'percentage_duplicates': data.percentage_duplicates,
                        'percentage_accuracy': data.percentage_accuracy,
                }});
                this.setState({scanStatus: 'finishScan'});
                    var confidentialities = data.confidentialities;
                        
                    var flotPieData = [];
                    var colorArr = ['#0088cc', '#349da2', '#7986cb','#ec407a'];
                    for (var i = 0; i < confidentialities.length ; i++) 
                    {
                        flotPieData.push({
                            label: confidentialities[i].name,
                            data: [
                                    [1, confidentialities[i].percentage]
                                ],
                            color: colorArr[i]
                        });
                    }
                    
                    // PIE CHART
                    /*
                    flotPieData.push({
                        label: "Confidential",
                        data: [
                            [1, 90]
                        ],
                        color: '#349da2'
                    });
                   */
                    var plot = jQuery.plot('#flotPie', flotPieData, {
                        series: {
                            pie: {
                                show: true,
                                label: {
                                    show: true,
                                    radius: 1/2,
                                    formatter: function (label, series) {
                                        return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                                    },
                                    threshold: 0.1
                                }
                            }
                        },
                        legend: {
                            show: true,
                            position: 'sw',
                            noColumns: 4,
                            container:$("#legendContainer"),       
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        }
                    });

                    // BAR CHART
                    var categories = data.categories;
                    var flotBarData = [];
                    /*
                    var flotBarData = [
                        {data: [[0,10]], color: "#0088cc", label: "Legal"}, 
                        {data: [[1,20]], color: "#349da2", label: "Transaction"},
                        {data: [[2,40]], color: "#7986cb", label: "Example"},
                        {data: [[3,30]], color: "#ec407a", label: "Example"}
                    ];
                    */
                    for (var i = 0; i < categories.length ; i++) 
                    {
                        flotBarData.push({
                            label: categories[i].name,
                            data: [[i, categories[i].percentage]],
                            color: colorArr[i]
                        });
                    }
                    var plot2 = jQuery.plot("#flotBar",flotBarData, {
                        series: {
                            bars: {
                                show: true,
                                barWidth: 0.5,
                                align: "center",
                                lineWidth: 0,
                                fill:1,
                            }
                        },
                        grid: {
                            margin: {top: 30, left: 0, bottom: 20, right: 0},
                            labelMargin: 10,
                            borderWidth: {top: 0, right: 0, bottom: 1, left: 1},
                        },
                        xaxis: {
                            tickLength: 0,
                            show: false,
                            min: -0.5,
                            max: flotBarData.length - 0.5
                        },
                        yaxis: {
                            tickLength: 0,           
                            show: false
                        },
                        legend: {
                            show: true,
                            position: 'sw',
                            noColumns: 4,        
                            container:$("#legendContainer2"), 
                        },
                    });

                    for (var int=0; int<flotBarData.length; int++){
                        $.each(plot2.getData()[int].data, function(i, el){
                          var o = plot2.pointOffset({x: el[0], y: el[1]});
                          $('<div class="data-point-label">' + el[1] + '%</div>').css( {
                            position: 'absolute',
                            left: o.left - 10,
                            top: o.top - 20,
                            display: 'none'
                          }).appendTo(plot2.getPlaceholder()).fadeIn('slow');
                        });
                    }


                    // PIE CHART 2
                    var doctypes = data.doctypes;
                    var flotPieData2 = [];
                    for (var i = 0; i < doctypes.length ; i++) 
                    {
                        flotPieData2.push({
                            label: doctypes[i].name,
                            data: [[1, doctypes[i].percentage]],
                            color: colorArr[i]
                        });
                    }
                    /*var flotPieData2 = [{
                        label: "Excel",
                        data: [
                            [1, 80]
                        ],
                        color: '#0088cc'
                    }, {
                        label: "PDF",
                        data: [
                            [1, 20]
                        ],
                        color: '#349da2'
                    }];*/

                    var plot = jQuery.plot('#flotPie2', flotPieData2, {
                        series: {
                            pie: {
                                show: true,
                                label: {
                                    show: true,
                                    radius: 1/2,
                                    formatter: function (label, series) {
                                        return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                                    },
                                    threshold: 0.1
                                }
                            }
                        },
                        legend: {
                            show: true,
                            position: 'sw',
                            noColumns: 4,
                            container:$("#legendContainer3"), 
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        }
                    });
                   
                    $(document).on('click', '.dropdown-menu.has-arrow', function (e) {
                        e.stopPropagation();
                    });        

                    // hold onto the drop down menu                                             
                    var dropdownMenu;

                    // and when you show it, move it to the body                                     
                    $(window).on('show.bs.dropdown', function (e) {

                        var windowWidth = $(window).innerWidth();

                        if (windowWidth <=996 ){
                            // grab the menu        
                            dropdownMenu = $(e.target).find('.dropdown-menu');

                            // detach it and append it to the body
                            $('body').append(dropdownMenu.detach());

                            // grab the new offset position
                            var eOffset = $(e.target).offset();

                            // make sure to place it where it would normally go (this could be improved)
                            dropdownMenu.css({
                                'display': 'block',
                                'top': eOffset.top + $(e.target).outerHeight(),
                                'left': eOffset.left
                            });
                        }
                    });

                    // and when you hide it, reattach the drop down, and hide it normally                                                   
                    $(window).on('hide.bs.dropdown', function (e) {
                        var windowWidth = $(window).innerWidth();

                        if (windowWidth <=996 ){
                            $(e.target).append(dropdownMenu.detach());
                            dropdownMenu.hide();
                        }
                    });            

                $("#startScan").show();
                $("#pauseScan").hide();
                   
                
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    $("#pauseScan").hide();
                    browserHistory.push('/Account/SignIn');
                }
                $("#startScan").show();
                $("#pauseScan").hide();
                this.setState({scanStatus: 'beforeScan'});
            }.bind(this)
        });
       
    },
    showLastScan(){
        $.ajax({
            url:'http://54.169.106.24/hadoop/last/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) 
            {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) 
            {
                this.setState({detailLastScan: data});
                console.log(this.state.detailLastScan);
            }.bind(this),
            error: function(xhr, status, err) 
            {
            }.bind(this)
        }); 
    },
	render:template
});
module.exports = OverView;
