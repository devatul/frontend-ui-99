import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { forEach } from 'lodash'
import template from './GroupReview.rt'
import update from 'react-addons-update'
import Constant, { status } from '../Constant.js'
import loadScript from '../script/load.scripts.js'

var GroupReview = React.createClass({
    displayName: 'GroupReview',
    getInitialState: function() {
    	return {
    		listGroup:[],
    		groupCurrent: null,
    		statistics: {},
    		cloudwords: [],
    		centroids: [],
            data: {},
            status: 0,
    		samplesDocument: [],
            samplesDefault: [],
    		categoriesInfo: [],
            documentPreview: null,
            shouldUpdate: null,
            checkedNumber: 0,
            validateNumber: 0,
            checkBoxAll: false,
            stackChange: [],
            store: {
                centroids: []
            },
            dataChart: {
                pieChart: [],
                columnChart: [],
                centroidChart: [],
                cloudWords: []
            }
    	};
    },
    componentWillMount() {
        //this.getGroup();
        
    },
    componentDidMount() {
        this.getListGroup(); 
        $('.btn-refine').on('click', function(e){
            e.preventDefault();
            $(this).removeClass('btn-green').addClass('btn-disabled');
            $(this).parent().find('.refine-progress').show();
        });
        $('#choose_cluster').select2();
        $('#choose_cluster').on('change', function(event) {
            this.changeGroup(event);
        }.bind(this));

        $("#select2-choose_cluster-container").attr({
            title: 'Group 1',
        });
        $("#select2-choose_cluster-container").text("Group 1");

    },
    // shouldComponentUpdate: function(nextProps, nextState) {
    //     if(this.state.groupCurrent != nextState.groupCurrent) {
    //         return true;
    //     }
    //     if(this.state.samplesDocument != nextState.samplesDocument) {
    //         return true;
    //     }
    //     if(this.state.stackChange != nextState.stackChange) {
    //         return true;
    //     }
    //     if(this.state.shouldUpdate != nextState.shouldUpdate) {
    //         return true;
    //     }
    //     if(this.state.checkedNumber != nextState.checkedNumber) {
    //         return true;
    //     }
    //     if(this.state.validateNumber != nextState.validateNumber) {
    //         return true;
    //     }
    //     if(this.state.documentPreview != nextState.documentPreview) {
    //         return true;
    //     }
    //     if(this.state.categoriesInfo != nextState.categoriesInfo) {
    //         return true;
    //     }
    //     if(this.state.centroids != nextState.centroids) {
    //         return true;
    //     }
    //     if(this.state.cloudwords != nextState.cloudwords) {
    //         return true;
    //     }
    //     if(this.state.status != nextState.status) {
    //         return true;
    //     }
    //     return false;
    // },
    componentDidUpdate: function(prevProps, prevState) {
        var { store, categoriesInfo } = this.state;
        if(this.state.groupCurrent != prevState.groupCurrent){
            this.getStatistics();
            this.getSamplesDocument();
            this.getcategoriesInfo();
            this.getCentroids();
        }
        if(this.state.samplesDocument != prevState.samplesDocument) {
            //javascript_todo();
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
            $('[data-toggle="tooltip"]').tooltip({
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large" style="max-width: 500px; width: auto;"></div></div>'
            });
            console.log("dddddd", this.state.samplesDocument, 'ssssssss', prevState.samplesDocument);
        }
        if(this.state.shouldUpdate != prevState.shouldUpdate) {
            this.validateNumber();   
        }
        if(store.centroids != prevState.store.centroids) {
            this.drawCentroid();
        }
        if(categoriesInfo != prevState.categoriesInfo) {
            this.drawChart();
        }
    },
    ucwords:function(str){
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function (a) {
            return a.toUpperCase();
        });
    },
    getListGroup: function() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/",
            dataType: 'json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log(data);
                var category = [0,
                                2,
                                0,
                                5,
                                5,
                                1,
                                5,
                                5,
                                5,
                                1,
                                5,
                                1,
                                5,
                                1,
                                5,
                                5,
                                1,
                                1,
                                1,
                                1];

                for(var i = 0; i < data.length; i++) {
                    data[i].category = category[i];
                }
                var updateState = update(this.state, {
                    listGroup: {$set: data},
                    groupCurrent: {$set: data[0]},
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    parseInt: function(num) {
        return Math.round(num);
    },
    getStatistics: function() {
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
            url: Constant.SERVER_API + "api/group/statistics/",
            dataType: 'json',
            data: { "id":this.state.groupCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                data.total_number_documents = totalDocument[this.state.groupCurrent.id - 1];
                var updateState = update(this.state, {
                    statistics: {$set: data}
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    selectGroup: function(event) {
        debugger;
        $('option#defaultSelect').css('display', 'none');
    },
    getCloudwords: function() {
        /*
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/cloudwords/",
            dataType: 'json',
            data: { "id":this.state.groupCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                this.setState({ cloudwords: [] });
                for (var i = 0; i < data.length; i++) {
                    var updateState = update(this.state, {
                        cloudwords: {$push: [{text: data[i].name, weight: data[i].count, html: { "data-tooltip": "1"} }]}
                    });
                    this.setState(updateState);
                }
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
        */
    },
    getCentroids: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/centroids/",
            dataType: 'json',
            data: { "id":this.state.groupCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                var updateStore = update(this.state.store, {
                    centroids: {$set: data }
                });
                this.setState({ store: updateStore });
            }.bind(this),
            error: function(xhr,error) {
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
            url: Constant.SERVER_API + "api/group/samples/",
            dataType: 'json',
            data: { "id":this.state.groupCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                for(var i = 0; i < data.documents.length; i++) {
                    data.documents[i].confidence_level = (data.documents[i].confidence_level - 10)
                    data.documents[i].confidentiality_confidence_level = (data.documents[i].confidentiality_confidence_level-10)
                    data.documents[i].current = {
                        checked: false,
                        category: this.state.groupCurrent.category,
                        confidential: Math.floor((Math.random() * 4)),
                        status: "normal"
                    };
                }
                var documentPreview = data.documents[0];
                documentPreview.index = 0;
                var updateState = update(this.state, {
                    data: {$set: data },
                    samplesDocument: {$set: data.documents},
                    samplesDefault: {$set: $.extend(true, {}, data.documents) },
                    documentPreview: {$set: data.documents[0]}
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getcategoriesInfo: function() {
        debugger
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/categories/",
            dataType: 'json',
            data: { "id":this.state.groupCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                var updateState = update(this.state, {
                    categoriesInfo: {$set: data} 
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    changeGroup: function(event) {
        var val = event.target.value;
        var updateState = update(this.state, {
            groupCurrent: {$set: this.state.listGroup[val]},
            status: {$set: 0 },
            validateNumber: { $set: 0 }     
        });
        this.setState(updateState);
    },
    setDocumentPreview: function(index) {
        var document = this.state.samplesDocument[index];
        if(document != null) {
            document.index = index;
            this.setState(update(this.state, {
                documentPreview: {$set: document},
                shouldUpdate: {$set: "PreviewDocument_" + index}
            }));
            $('#previewModal .file-preview').html('<a href="'+ document.image_url +'" id="embedURL"></a>');
            $('#embedURL').gdocsViewer();
        }
    },
    
    progressbar: function(value) {
        if(value <= Constant.progressValue.level1) {
            return Constant.progressBar.level1;
        } else if(value > Constant.progressValue.level1 && value <= Constant.progressValue.level2) {
            return Constant.progressBar.level2;
        }
        return Constant.progressBar.level3;
    },
    saveStack: function() {

    },
    onChangeCategory: function(event, sampleIndex) {
        var categoryIndex = event.target.value;
        var samplesDefault = this.state.samplesDefault;
        var listDocument = this.state.samplesDocument;
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
        var samplesDefault = this.state.samplesDefault;
        var listDocument = this.state.samplesDocument;
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
        this.checkedNumber();
        this.setState({shouldUpdate: 'updateCheckBox_' + sampleIndex  + '_' + checked});
    },
    validateNumber: function() {
        var samplesDocument = this.state.samplesDocument;
        var num = 0;
        for(var i = 0; i < samplesDocument.length; i++) {
            if(samplesDocument[i].current.status === "editing" || samplesDocument[i].current.status === "accept") {
                num++;
            }
        }
        var status = this.parseInt((num * 100) / this.state.samplesDocument.length);
        this.setState(update(this.state, { validateNumber: {$set: num }, status: {$set: status } } ));
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
        this.checkedNumber();
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
        this.checkedNumber();
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
            return str.substring(0,str.lastIndexOf('/') + 1);
        }
    },
    drawCloud: function() {
        //var word_list = this.state.cloudwords;
        var word_list = [
    {text: "Entity", weight: 13},
    {text: "matter", weight: 10.5},
    {text: "science", weight: 9.4},
    {text: "properties", weight: 8},
    {text: "speed", weight: 6.2},
    {text: "Accounting", weight: 5},
    {text: "interactions", weight: 5},
    {text: "nature", weight: 5},
    {text: "branch", weight: 5},
    {text: "concerned", weight: 4},
    {text: "Sapien", weight: 4},
    {text: "Pellentesque", weight: 3},
    {text: "habitant", weight: 3},
    {text: "morbi", weight: 3},
    {text: "tristisque", weight: 3},
    {text: "senectus", weight: 3},
    {text: "et netus", weight: 3},
    {text: "et malesuada", weight: 3},
    {text: "fames", weight: 2},
    {text: "ac turpis", weight: 2},
    {text: "egestas", weight: 2},
    {text: "Aenean", weight: 2},
    {text: "vestibulum", weight: 2},
    {text: "elit", weight: 2},
    {text: "sit amet", weight: 2},
    {text: "metus", weight: 2},
    {text: "adipiscing", weight: 2},
    {text: "ut ultrices", weight: 2},
    {text: "justo", weight: 1},
    {text: "dictum", weight: 1},
    {text: "Ut et leo", weight: 1},
    {text: "metus", weight: 1},
    {text: "at molestie", weight: 1},
    {text: "purus", weight: 1},
    {text: "Curabitur", weight: 1},
    {text: "diam", weight: 1},
    {text: "dui", weight: 1},
    {text: "ullamcorper", weight: 1},
    {text: "id vuluptate ut", weight: 1},
    {text: "mattis", weight: 1},
    {text: "et nulla", weight: 1},
    {text: "Sed", weight: 1}
  ];

        var updateChart = update(this.state.dataChart, {
            cloudWords: {$set: word_list }
        });
        this.setState({ dataChart: updateChart });
    },
    drawCentroid() {
        var centroids = []
        forEach(this.state.store.centroids, (val, index) => {
            centroids.push([index + 1, val.number_docs]);
        });
        var updateChart = update(this.state.dataChart, {
            centroidChart: {$set: centroids }
        });
        this.setState({ dataChart: updateChart });
    },
    
    drawChart() {
        var categoriesInfo = this.state.categoriesInfo;
		var flotPieData = [];
		var highchart = [];
		var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];
			for(var i = 0; i < categoriesInfo.length; i++) {
                var name = this.ucwords(categoriesInfo[i].name);
				flotPieData.push({
					label: name,
		            data: [
		                [6, categoriesInfo[i].percentage]
		            ],
		            color: colors[i]
				});
				highchart.push({
					name: name,
		            data: [categoriesInfo[i].doc_types[0].total,categoriesInfo[i].doc_types[1].total,categoriesInfo[i].doc_types[2].total,categoriesInfo[i].doc_types[3].total,categoriesInfo[i].doc_types[4].total]
				});
			}
        var updateChart = update(this.state.dataChart, {
            pieChart: {$set: flotPieData },
            columnChart: {$set: highchart }
        });
        this.setState({ dataChart: updateChart });
    },
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    render:template
});

module.exports = GroupReview;