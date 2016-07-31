import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './OrphanReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import 'jquery'
import chart from '../script/chart-orphan-review.js'
import javascript_todo from '../script/javascript.todo.js'
import loadScript from '../script/load.scripts.js'
import Constant from '../Constant.js'

var OrphanReview = React.createClass({
    mixins: [LinkedStateMixin],
    displayName: 'OrphanReview',
    getInitialState() {
        return {
            orphanCurrent: 0,
            listOrphan: [],
            categories: [],
            statistics: [],
            cloudwords: [],
            centroids: [],
            samplesDocument: [],
            samplesDefault: [],
            documentPreview: null,
            stackChange: [],
            checkedNumber: 0,
            validateNumber: 0,
            shouldUpdate: null,
            checkBoxAll: false
        };
    },
    componentWillMount() {
    },
    componentDidMount() {
        this.getListOrphan();
        chart();
        $('.btn-refine').on('click', function(e){
            e.preventDefault();
            $(this).removeClass('btn-green').addClass('btn-disabled');
            $(this).parent().find('.refine-progress').show();
        });
        $('#choose_cluster').on('change', function(event) {
            this.changeOrphan(event);
        }.bind(this));
    },
    ucwords:function(str){
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function (a) {
            return a.toUpperCase();
        });
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.orphanCurrent != nextState.orphanCurrent) {
            return true;
        }
        if(this.state.samplesDocument != nextState.samplesDocument) {
            return true;
        }
        if(this.state.stackChange != nextState.stackChange) {
            return true;
        }
        if(this.state.shouldUpdate != nextState.shouldUpdate) {
            return true;
        }
        if(this.state.checkedNumber != nextState.checkedNumber) {
            return true;
        }
        if(this.state.validateNumber != nextState.validateNumber) {
            return true;
        }
        if(this.state.documentPreview != nextState.documentPreview) {
            return true;
        }
        if(this.state.categories != nextState.categories) {
            return true;
        }
        if(this.state.centroids != nextState.centroids) {
            return true;
        }
        if(this.state.cloudwords != nextState.cloudwords) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.orphanCurrent != prevState.orphanCurrent) {
            this.getStatistics();
            this.getSamplesDocument();
            this.getCategoryDistribution();
        }
        if(this.state.samplesDocument != prevState.samplesDocument) {
            $('.select-group select').focus(function(){
            var selectedRow = $(this).parents('tr');
                $('.table-my-actions tr').each(function(){
                    if(!$(this).find('.checkbox-item').prop('checked')){
                        $(this).addClass('inactive');
                    }
                });
                selectedRow.removeClass('inactive');
            });

            $('.select-group select').blur(function(){
                $('.table-my-actions tr').removeClass('inactive');
            });

            $('.file-name-1[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 500px; width: auto;"></div></div>'
            });
        }
        if(this.state.categories != prevState.categories) {
            this.drawChart();
        }
        if(this.state.centroids != prevState.centroids) {
            this.drawCentroid();
        }
        if(this.state.cloudwords != prevState.cloudwords) {   
            this.drawCloud();
        }

        if(this.state.documentPreview != prevState.documentPreview) {
            loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js", function() {
                $('#previewModal').on('show.bs.modal', function(e) {

                    //get data-id attribute of the clicked element
                    var fileURL = $(e.relatedTarget).attr('data-file-url');

                    console.log(fileURL);
                    
                    $('#previewModal .file-preview').html('<a href="'+fileURL+'" id="embedURL"></a>');
                    $('#embedURL').gdocsViewer();
                });
            }.bind(this));
        }
        if(this.state.shouldUpdate != prevState.shouldUpdate) {
            this.checkedNumber();
            this.validateNumber();   
        }
    },
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },

    getListOrphan: function() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/",
            dataType: 'json',
            async: false,
            //data: JSON.stringify(bodyRequest),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    listOrphan: {$set: data},
                    orphanCurrent: {$set: data[0]}
                });
                this.setState(updateState);
                console.log("listOrphan ok: ", data[0]);
            }.bind(this),
            error: function(xhr,error) {
                console.log("listOrphan error: " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    changeOrphan: function(event) {
        var val = event.target.value;
        var updateState = update(this.state, {
            orphanCurrent: {$set: this.state.listOrphan[val]}
        });
        this.setState(updateState);
        this.setState({shouldUpdate: 'updateOrphan_' + val });
    },
    getCategoryDistribution: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/categories/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categories: {$set: data}
                });
                this.setState(updateState);
                console.log("categories ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("categories " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getStatistics() {
        var totalDocument = [880,768,743,
                            722,710,703,
                            694,693,688,
                            674,623,589,
                            587,499,455,
                            402,395,394,
                            333,288,285,
                            235,226,213,
                            193,170,150,
                            127,114,59];
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/statistics/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                data.total_number_documents = totalDocument[this.state.orphanCurrent.id - 1];
                var updateState = update(this.state, {
                    statistics: {$set: data}
                });
                this.setState(updateState);
                console.log("list_statistics ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("list_statistics " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCloudwords() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/cloudwords/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    cloudwords: {$set: []}
                });
                this.setState(updateState);
                for (var i = 0; i < data.length; i++) {
                    var updateState = update(this.state, {
                        cloudwords: {$push: [{text: data[i].name, weight: data[i].count, html: {"data-tooltip": data[i].count + " Documents"}}] }
                    });
                    this.setState(updateState);
                }
                console.log("cloudwords ok: ", this.state.cloudwords);
            }.bind(this),
            error: function(xhr,error) {
                console.log("cloudwords " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getCentroids() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/centroids/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({ centroids: [] });
                for(var i = 0; i < data.length; i++) {
                    var updateState = update(this.state, {
                        centroids: {$push: [[data[i].distance, data[i].number_docs]]}
                    });
                    this.setState(updateState);
                }
                console.log("centroids ok: ", data);
            }.bind(this),
            error: function(xhr,error) {
                console.log("centroids " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getSamplesDocument: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/samples/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                console.log('ddddddddddddddd',data);
                for(var i = 0; i < data.length; i++) {
                    data[i].current = {
                        checked: false,
                        category: Math.floor((Math.random() * data[i].categories.length)),
                        confidential: Math.floor((Math.random() * data[i].confidentialities.length)),
                        status: "normal"
                    };
                }
                var updateState = update(this.state, {
                    samplesDocument: {$set: data},
                    samplesDefault: {$set: $.extend(true, {}, data) },
                    documentPreview: {$set: data[0]}
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                console.log("samplesDocument " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    setDocumentPreview: function(index) {
        var document = this.state.samplesDocument[index];
        document.index = index;
        this.setState(update(this.state, {
            documentPreview: {$set: document},
        }));
        console.log("afasdccccc: ", this.state.samplesDocument[index], index);
    },
    cutPath: function(str) {
        return str.substring(0,str.lastIndexOf('/') + 1);
    },
    onChangeCategory: function(event, sampleIndex) {
        var categoryIndex = event.target.value;
        var listDocument = this.state.samplesDocument;
        var samplesDefault = this.state.samplesDefault;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
            listDocument[sampleIndex].current.category = categoryIndex;
        if(categoryIndex == samplesDefault[sampleIndex].current.category) {
            listDocument[sampleIndex].current.status = "accept";
        } else {
            listDocument[sampleIndex].current.status = "editing";
        }
        this.setState(update(this.state,{
            stackChange: {$set: stackList },
            samplesDocument: {$set: listDocument }
        }));
        this.setState({shouldUpdate: 'updateCategory_' + categoryIndex + '_' + sampleIndex});
    },
    onChangeConfidential: function(event, sampleIndex) {
        var confidentialIndex = event.target.value;
        var listDocument = this.state.samplesDocument;
        var samplesDefault = this.state.samplesDefault;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        listDocument[sampleIndex].current.confidential = confidentialIndex;
        if(confidentialIndex == samplesDefault[sampleIndex].current.confidential)
            listDocument[sampleIndex].current.status = "accept";
        else
            listDocument[sampleIndex].current.status = "editing";
        var setUpdate = update(this.state,{
            stackChange: {$set:  stackList },
            samplesDocument: {$set: listDocument}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: 'updateConfidential_' + confidentialIndex + '_' + sampleIndex}); 
    },
    checkedNumber: function() {
        var samplesDocument = this.state.samplesDocument;
        var num = 0;
        for(var i = 0; i < samplesDocument.length; i++) {
            if(samplesDocument[i].current.checked === true) {
                num++;
            }
        }
        this.setState({ checkedNumber: num });
    },
    onClickCheckbox: function(event, sampleIndex) {
        var checked = event.target.checked;
        var listDocument = this.state.samplesDocument;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        listDocument[sampleIndex].current.checked = checked;
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            samplesDocument: {$set: listDocument}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: 'updateCheckBox_' + sampleIndex  + '_' + checked});
    },
    validateNumber: function() {
        var samplesDocument = this.state.samplesDocument;
        var num = 0;
        for(var i = 0; i < samplesDocument.length; i++) {
            if(samplesDocument[i].current.status === "accept") {
                num++;
            }
        }
        this.setState({ validateNumber: num });
    },
    onClickValidationButton: function(event, sampleIndex) {
        var listDocument = this.state.samplesDocument;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        listDocument[sampleIndex].current.status = "accept";
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            samplesDocument: {$set: listDocument}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: 'updateValidate' + '_' + 'accept' + '_' + sampleIndex});
    },
    approveButon: function(event) {
        var documents = this.state.samplesDocument;
        var approveIndex = '';
        for(var i = 0; i < documents.length; i++) {
            if(documents[i].current.checked === true) {
                documents[i].current.status = "accept";
                documents[i].current.checked = false;
                approveIndex += "_" + i;
            }
        }
        var setUpdate = update(this.state,{
            samplesDocument: {$set: documents},
            checkBoxAll: {$set: false }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdate: 'approveButon_' + approveIndex });
    },
    checkAllButton: function(event) {
        var checked = event.target.checked;
        console.log(checked);
        var documents = this.state.samplesDocument;
        for (var i = 0; i < documents.length; i++) {
            documents[i].current.checked = checked;
        }
        var setUpdate = update(this.state,{
            samplesDocument: {$set: documents},
            checkBoxAll: {$set: checked }
        });
        this.setState(setUpdate);
        this.setState({ shouldUpdate: 'updateCheckAll_' + checked});
    },
    undoHandle: function() {
        console.log('stackChange' , this.state.stackChange);
        if(this.state.stackChange.length > 0) {
            var newStackChange = this.state.stackChange;
            var newSamplesDocument = this.state.samplesDocument;
            var documentOld = newStackChange[this.state.stackChange.length - 1];
            newSamplesDocument[documentOld.index] = documentOld.contents;
            newStackChange.pop();
            var setUpdate = update(this.state, {
                samplesDocument: {$set: newSamplesDocument },
                stackChange: {$set: newStackChange },
                documentPreview: {$set: newSamplesDocument[documentOld.index] }
            });
            this.setState(setUpdate);
            this.setState({shouldUpdate: 'undoAction_' + newStackChange.length })
        }
    },
    alertClose: function() {
        $(".alert-close[data-hide]").closest(".alert-success").hide();
    },
    cutPath: function(str) {
        if(str.length > 0) {
            str.substring(0,str.lastIndexOf('/') + 1);
        }
        return str;
    },
    drawCloud: function() {
        var word_list = this.state.cloudwords;
        var cloudRendered = false;
        var drawCloud = function(){
        if (!cloudRendered){
            $("#words-cloud").jQCloud(word_list,{
                afterCloudRender: function(){
                    cloudRendered = true;
                    $("[data='tooltip']").tooltip();
                    }
                });
            }
        };

        $(window).resize(function(){
            //$('#words-cloud').jQCloud('update', word_list);
            $('#words-cloud').css("width", "100%");
            $('#words-cloud').html('').jQCloud(word_list) 
        });
       $(window).resize();
    },
    drawCentroid() {
        $('#centroidChart').highcharts({
            chart: {
                type:'column'
            },
            xAxis: {
                startOnTick: true,
                min: 0,
                step: 2,
                max: 10,
                startOnTick: true,
                endOnTick: true,
                tickInterval: 1,
            },
            yAxis: {
              title: {
                  text: 'Number of Documents'
              },
            },
            credits: {
              enabled: false
            },
            title: {
              text: ''
            },

            legend: {
              enabled: false
            },
            
            plotOptions: {
              column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                      textShadow: '0 0 3px black'
                    }
                },
                pointPadding: 0,
                borderWidth: 1,              
                groupPadding: 0,
                pointPlacement: -0.5
              }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.y} Documents<br/>'
            },
            series: [{
                data: this.state.centroids
            }]
        });
    },
    drawChart() {
        var categories = this.state.categories;
        var fPieData = [];
        var series = [];
        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];

        for(var i = 0; i < categories.length; i++) {
            var name = this.ucwords(categories[i].name);
            fPieData[i] = {
                label: categories[i].name,
                data: [
                    [1, categories[i].percentage]
                ],
                color: colors[i]
            };
            series[i] = {
                name: categories[i].name,
                data: [categories[i].doc_types[0].total,categories[i].doc_types[1].total,categories[i].doc_types[2].total,categories[i].doc_types[3].total,categories[i].doc_types[4].total]
            };
        }
        
        if( $('#confidentialityChart').length){
            var plot = $.plot('#confidentialityChart', fPieData, {
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
                    container: $('#confidentialityChartLegend')
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                },
                tooltip: {
                  show: true,
                  content: function(label,x,y){
                    return label + ': ' +y + ' Documents';
                  }
                }
            });
        }
        if ($('#confidentialityLevelChart').length){
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
                colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
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
                    verticalAlign: 'bottom',
                    shadow: false,
                    useHTML: true
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
                        }
                    }
                },
                series: series
            });
         }
    },
    render:template
});

module.exports = OrphanReview;