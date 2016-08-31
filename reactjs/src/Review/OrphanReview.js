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
import { forEach, upperFirst, replace } from 'lodash'

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
            status: 0,
            listDocument: [],
            samplesDefault: [],
            documentPreview: null,
            stackChange: [],
            checkedNumber: 0,
            validateNumber: 0,
            shouldUpdate: null,
            checkBoxAll: false,
            store: {
                centroids: []
            },
            dataChart: {
                pieChart: [],
                documentType: {
                    categories: [],
                    series: []
                },
                centroidChart: [],
                cloudWords: []
            }
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

          $("#select2-choose_cluster-container").attr({
            title: 'Group 1',
        });
        $("#select2-choose_cluster-container").text("Group 1");
    },
    ucwords:function(str){
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function (a) {
            return a.toUpperCase();
        });
    },
    // shouldComponentUpdate(nextProps, nextState) {
    //     if(this.state.orphanCurrent != nextState.orphanCurrent) {
    //         return true;
    //     }
    //     if(this.state.listDocument != nextState.listDocument) {
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
    //     if(this.state.status != nextState.status) {
    //         return true;
    //     }
    //     if(this.state.categories != nextState.categories) {
    //         return true;
    //     }
    //     if(this.state.centroids != nextState.centroids) {
    //         return true;
    //     }
    //     if(this.state.cloudwords != nextState.cloudwords) {
    //         return true;
    //     }
    //     return false;
    // },
    componentDidUpdate(prevProps, prevState) {
        var { store, categories } = this.state;
        if(this.state.orphanCurrent != prevState.orphanCurrent) {
            this.getStatistics();
            this.getlistDocument();
            this.getCategoryDistribution();
            this.getCentroids()
        }
        if(this.state.listDocument != prevState.listDocument) {
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
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 500px; width: auto;"></div></div>'
            });
        }
        if(this.state.shouldUpdate != prevState.shouldUpdate) {
            this.validateNumber();   
        }
        if(store.centroids != prevState.store.centroids) {
            this.drawCentroid();
        }
        if(categories != prevState.categories) {
            this.drawChart();
        }
    },
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    parse: function(num) {
        return Math.round(num);
    },
    getListOrphan: function() {
    	$.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/",
            dataType: 'json',
            async: false,
            //data: JSON.stringify(bodyRequest),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
            orphanCurrent: {$set: this.state.listOrphan[val]},
            status: { $set: 0 },
            validateNumber: { $set: 0 }
        });
        this.setState(updateState);
    },
    getCategoryDistribution: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/categories/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
        /*
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/cloudwords/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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
        });*/
    },
    getCentroids() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/centroids/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                var updateStore = update(this.state.store, {
                    centroids: {$set: data }
                });
                this.setState({ store: updateStore });
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
    getlistDocument: function() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/group/orphan/samples/",
            dataType: 'json',
            data: { "id":this.state.orphanCurrent.id },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
            },
            success: function(data) {
                console.log('ddddddddddddddd',data);
                for(var i = 0; i < data.documents.length; i++) {
                    data.documents[i].current = {
                        checked: false,
                        category: -1,
                        confidential: -1,
                        status: "normal"
                    };
                }
                var documentPreview = data.documents[0];
                documentPreview.index = 0;
                var updateState = update(this.state, {
                    listDocument: {$set: data.documents},
                    samplesDefault: {$set: $.extend(true, {}, data.documents) },
                    documentPreview: {$set: data.documents[0]}
                });
                this.setState(updateState);
            }.bind(this),
            error: function(xhr,error) {
                console.log("listDocument " + error);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    setDocumentPreview: function(index) {
        var document = this.state.listDocument[index];
        if(document != null) {
            document.index = index;
            this.setState(update(this.state, {
                documentPreview: {$set: document},
            }));
            $('#previewModal .file-preview').html('<a href="'+ document.image_url +'" id="embedURL"></a>');
            $('#embedURL').gdocsViewer();
            console.log("afasdccccc: ", this.state.listDocument[index], index);
        }
    },
    onChangeCategory: function(event, sampleIndex) {
        var categoryIndex = event.target.value;
        var listDocument = this.state.listDocument;
        var samplesDefault = this.state.samplesDefault;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
            listDocument[sampleIndex].current.category = categoryIndex;
        if(categoryIndex == samplesDefault[sampleIndex].current.category || listDocument[sampleIndex].current.confidential > -1 ) {
            listDocument[sampleIndex].current.status = "accept";
        }
        //  else {
        //     listDocument[sampleIndex].current.status = "accept";
        // }
        this.setState(update(this.state,{
            stackChange: {$set: stackList },
            listDocument: {$set: listDocument }
        }));
        this.setState({shouldUpdate: 'updateCategory_' + categoryIndex + '_' + sampleIndex});
    },
    onChangeConfidential: function(event, sampleIndex) {
        var confidentialIndex = event.target.value;
        var listDocument = this.state.listDocument;
        var samplesDefault = this.state.samplesDefault;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        listDocument[sampleIndex].current.confidential = confidentialIndex;
        if(confidentialIndex == samplesDefault[sampleIndex].current.confidential || listDocument[sampleIndex].current.category > -1)
            listDocument[sampleIndex].current.status = "accept";
        // else
        //     listDocument[sampleIndex].current.status = "accept";
        var setUpdate = update(this.state,{
            stackChange: {$set:  stackList },
            listDocument: {$set: listDocument}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: 'updateConfidential_' + confidentialIndex + '_' + sampleIndex}); 
    },
    checkedNumber: function() {
        var listDocument = this.state.listDocument;
        var numb = 0;
        for(var i = 0; i < listDocument.length; i++) {
            if(listDocument[i].current.checked == true) {
                numb++;
            }
        }
        this.setState({ checkedNumber: numb});
    },
    onClickCheckbox: function(event, sampleIndex) {
        var checked = event.target.checked;
        var listDocument = this.state.listDocument;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        listDocument[sampleIndex].current.checked = checked;
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            listDocument: {$set: listDocument}
        });
        this.setState(setUpdate);
        this.checkedNumber();
        this.setState({shouldUpdate: 'updateCheckBox_' + sampleIndex  + '_' + checked});
    },
    validateNumber: function() {
        var listDocument = this.state.listDocument;
        var num = 0;
        for(var i = 0; i < listDocument.length; i++) {
            if(listDocument[i].current.status === "editing" || listDocument[i].current.status === "accept") {
                num++;
            }
        }
        var status = this.parse((num * 100) / this.state.listDocument.length);
        this.setState(update(this.state, { validateNumber: {$set: num }, status: {$set: status } } ));
    },
    onClickValidationButton: function(event, sampleIndex) {
        var listDocument = this.state.listDocument;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        if(samplesDefault[sampleIndex].current.confidential > -1 && listDocument[sampleIndex].current.category > -1) {
            listDocument[sampleIndex].current.status = "accept";            
        }
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            listDocument: {$set: listDocument}
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: 'updateValidate' + '_' + 'accept' + '_' + sampleIndex});
    },
    approveButon: function(event) {
        var documents = this.state.listDocument;
        var approveIndex = '';
        for(var i = 0; i < documents.length; i++) {
            if(documents[i].current.checked === true) {
                documents[i].current.status = "accept";
                documents[i].current.checked = false;
                approveIndex += "_" + i;
            }
        }
        var setUpdate = update(this.state,{
            listDocument: {$set: documents},
            checkBoxAll: {$set: false }
        });
        this.setState(setUpdate);
        this.checkedNumber();
        this.setState({ shouldUpdate: 'approveButon_' + approveIndex });
    },
    checkAllButton: function(event) {
        var checked = event.target.checked;
        console.log(checked);
        var documents = this.state.listDocument;
        for (var i = 0; i < documents.length; i++) {
            documents[i].current.checked = checked;
        }
        var setUpdate = update(this.state,{
            listDocument: {$set: documents},
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
            var newlistDocument = this.state.listDocument;
            var documentOld = newStackChange[this.state.stackChange.length - 1];
            newlistDocument[documentOld.index] = documentOld.contents;
            newStackChange.pop();
            var setUpdate = update(this.state, {
                listDocument: {$set: newlistDocument },
                stackChange: {$set: newStackChange },
                documentPreview: {$set: newlistDocument[documentOld.index] }
            });
            this.setState(setUpdate);
            this.setState({shouldUpdate: 'undoAction_' + newStackChange.length })
        }
    },
    alertClose: function() {
        $(".alert-close[data-hide]").closest(".alert-success").hide();
    },
    cutString: function(str) {
        if(str != null && str.length > 0) {
            return replace(str, 'Group', '');
        }
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
        var category = this.state.categories;
		var pieChart = [],
            documentType = {
                categories: ['Word', 'Excel', 'PDF', 'Power Point', 'Other'],
                series: []
            };
        for(let i = 0, total = category.length; i < total; i++) {
            pieChart[i] = {
                name: upperFirst( category[i].name ),
                y: category[i].percentage
            };

            documentType.series[i] = {
                name: category[i].name,
                data: []
            };

            for(let j = 0, data = category[i].doc_types, total = data.length; j < total; j++) {
                documentType.series[i].data[j] = data[j].total;
            }
        }
        
        var updateChart = update(this.state.dataChart, {
            pieChart: { $set: pieChart },
            documentType: { $set: documentType }
        });
        this.setState({ dataChart: updateChart });
    },
    render:template
});

module.exports = OrphanReview;