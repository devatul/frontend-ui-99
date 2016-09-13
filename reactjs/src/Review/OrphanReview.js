import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './OrphanReview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react/lib/update'
import 'jquery'
import chart from '../script/chart-orphan-review.js'
import javascript_todo from '../script/javascript.todo.js'
import loadScript from '../script/load.scripts.js'
import Constant from '../Constant.js'
import { forEach, upperFirst, replace, isEqual } from 'lodash'
import { makeRequest } from '../utils/http'

var OrphanReview = React.createClass({
    mixins: [LinkedStateMixin],
    displayName: 'OrphanReview',
    getInitialState() {
        return {
            stackChange: [],
            shouldUpdate: null,
            checkBoxAll: false,

            orphan: {
                list: [],
                current: {}
            },

            orphanData: {
                categories: [],
                statistics: [],
                cloudWords: [],
                centroids: [],
                listDocument: [],
                docPreview: -1,
                statusReview: 0,
                checkNum: 0,
                validNum: 0
            },

            dataChart: {
                confidentiality: [],
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
        var { store, categories, orphan, orphanData } = this.state;
        if(orphan.current != prevState.orphan.current) {

            let { orphanData } = this.state,

                listDocument = this.getlistDocument(),

                updateOrphanData = update(orphanData, {
                    categories: {
                        $set: this.getCategoryDistribution()
                    },

                    cloudWords: {
                        $set: this.getCloudwords()
                    },

                    centroids: { 
                        $set: this.getCentroids()
                    },

                    listDocument: {
                        $set: listDocument
                    },

                    docPreview: {
                        $set: 0
                    }
                });
            
            this.setState({ orphanData: updateOrphanData });
        }
        debugger
        if(!isEqual(orphanData.listDocument, prevState.orphanData.listDocument)) {

            this.checkedNumber();
            // $('.select-group select').focus(function(){
            // var selectedRow = $(this).parents('tr');
            //     $('.table-my-actions tr').each(function(){
            //         if(!$(this).find('.checkbox-item').prop('checked')){
            //             $(this).addClass('inactive');
            //         }
            //     });
            //     selectedRow.removeClass('inactive');
            // });

            // $('.select-group select').blur(function(){
            //     $('.table-my-actions tr').removeClass('inactive');
            // });

            // $('[data-toggle="tooltip"]').tooltip({
            //     template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="max-width: 500px; width: auto;"></div></div>'
            // });
        }
        if(!isEqual(orphanData, prevState.orphanData)) {
            let prevOrphanData = prevState.orphanData,
                categoryChart = [],
                centroidChart = [],
                documentType = [],
                wordList = [];
                
            debugger
            if(!isEqual(orphanData.categories, prevOrphanData.categories)) {
                //this.drawChart();

                
                //categoryChart = chart.categories;
                //documentType = chart.doctype;

                debugger
            }

            // if(!isEqual(orphanData.centroids, prevOrphanData.centroids)) {
            //     centroidChart = this.drawCentroid();
            //     debugger
            // }

            if(!isEqual(orphanData.cloudWords, prevOrphanData.cloudWords)) {
                this.drawCloud();
                debugger
            }

        }
    },
    endReviewHandle: function() {
        browserHistory.push('/Dashboard/OverView');
    },
    parse: function(num) {
        return Math.round(num);
    },

    getListOrphan: function() {
        makeRequest({
            path: "api/group/orphan/",
            success: (res) => {

               let updateOrphan = update(this.state.orphan, {
                   list: {
                       $set: res
                    },
                   current: {
                       $set: res[0]
                    }
               });

               this.setState({ orphan: updateOrphan });
            }
        });
    },

    changeOrphan: function(event) {
        var val = event.target.value,
            updateCurrent = update(this.state.orphan, {
                current: {  $set: this.state.orphan.list[val] },
            });
        this.setState({ orphan: updateCurrent });
    },

    getCategoryDistribution: function() {
        let result = [],
            orphanId = this.state.orphan.current.id;

        makeRequest({
            path: 'api/group/orphan/categories/',
            params: { 'id': orphanId },
            success: (data) => {
                result = data;
            }
        });
        return result;
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
        let data = [],
            orphanId = this.state.orphan.current.id;

        makeRequest({
            path: 'api/group/orphan/cloudwords/',
            params: { 'id': orphanId },
            success: (res) => {
                data = res;
            }
        });

        return data;
    },

    getCentroids() {
        let data = [],
            orphanId = this.state.orphan.current.id;

        makeRequest({
            path: 'api/group/orphan/centroids/',
            params: { 'id': orphanId },
            success: (res) => {
                data = res;
            }
        });

        return data;
    },

    getlistDocument: function() {
        let data = [],
            orphanId = this.state.orphan.current.id;

        makeRequest({
            path: 'api/group/orphan/samples/',
            params: { 'id' : orphanId },
            success: (res) => {
                let { documents } = res;
                for(let i = documents.length - 1; i >= 0; i--) {
                    documents[i].current = {
                        checked: false,
                        category: -1,
                        confidentialy: -1,
                        status: 'normal'
                    }
                }

                data = documents;
            }
        });

        return data;
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

    handleTableRowOnChange: function(event, index) {
        let element = event.target, that = this;
        //debugger
        switch(element.id) {
            case 'selectCategory': {
                let index = element.value, that = this;
                debugger
                this.onChangeCategory(event, index);
            }
            break;
            case 'selectConfidentialities': {
                this.onChangeConfidential(event, index);
            }
            break;
            case 'checkbox': {
                this.onClickCheckbox(event, index);
            }
        }
    },

    handleTableRowOnClick: function(event, index) {
        debugger
    },

    handleOnChangeSelectOrphan: function(event) {
        debugger
    },

    fileDistribution: function() {
        let data = [
            { name: 'Word', color: 'yellow', total: 5015 },
            { name: 'Excel', color: 'red', total: 3299 },
            { name: 'Power Point', color: 'purple', total: 3991 },
            { name: 'PDF', color: 'green', total: 3842 },
            { name: 'Other', color: 'blue', total: 1067 }
        ],
        total = 0,
        children = [];

        data.map(function(e) {
            total += e.total;
        });

        for(let i = data.length - 1; i >= 0; i--) {
            children[i] = <div className={'item ' + data[i].color} style={{ width: ((data[i].total / total) * 100).toFixed(2) + '%' }}>
                            {data[i].name}
                            <span className="item-legend">{data[i].total}</span>
                        </div>;
        }

        return(
            <div className="file-distribution clearfix">
                {children}
            </div>
        );
    },

    onChangeCategory: function(event, docIndex) {
        let element = event.target,
            index = element.value,
            { stackChange } = this.state,
            { listDocument } = this.state.orphanData;

        var categoryIndex = event.target.value;
        var samplesDefault = this.state.samplesDefault;
        var saveDocument = $.extend(true, {}, listDocument[docIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: docIndex,
            contents: saveDocument
        });
            listDocument[docIndex].current.category = categoryIndex;
        if(categoryIndex == samplesDefault[docIndex].current.category || listDocument[docIndex].current.confidential > -1 ) {
            listDocument[docIndex].current.status = "accept";
        }
        this.setState(update(this.state,{
            stackChange: {$set: stackList },
            orphanData: {
                listDocument: { $set: listDocument }
            }
        }));
        this.setState({shouldUpdate: 'updateCategory_' + categoryIndex + '_' + docIndex});
    },
    onChangeConfidential: function(event, sampleIndex) {
        var confidentialIndex = event.target.value;
        var listDocument = this.state.orphanData.listDocument;
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
            orphanData: {
                listDocument: { $set: listDocument}
            }
        });
        this.setState(setUpdate);
        this.setState({shouldUpdate: 'updateConfidential_' + confidentialIndex + '_' + sampleIndex}); 
    },
    checkedNumber: function() {
        var listDocument = this.state.orphanData.listDocument;
        var numb = 0;
        for(var i = 0; i < listDocument.length; i++) {
            if(listDocument[i].current.checked == true) {
                numb++;
            }
        }
        let updateOrphanData = update(this.state.orphanData, {
            checkNum: { $set: numb }
        });
        debugger
        this.setState({ orphanData: updateOrphanData});
    },
    onClickCheckbox: function(event, sampleIndex) {
        var checked = event.target.checked;
        var listDocument = this.state.orphanData.listDocument;
        var saveDocument = $.extend(true, {}, listDocument[sampleIndex]);
        var stackList = this.state.stackChange;
        stackList.push({
            index: sampleIndex,
            contents: saveDocument
        });
        listDocument[sampleIndex].current.checked = checked;
        var setUpdate = update(this.state,{
            stackChange: {$set: stackList },
            orphanData: {
                listDocument: {$set: listDocument}
            }
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
            orphanData: {
                listDocument: {$set: listDocument}
            }
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

    handleOnSelectTab: function(eventKey, event) {
        switch(eventKey) {
            case 'first': {
                this.drawChart();
                debugger
            }
            break;
        }
    },

    drawCloud: function() {
        let { cloudWords } = this.state.orphanData,
            wordList = [];

            for(let i = cloudWords.length - 1; i >= 0; i--) {
                wordList[i] = {
                    text: cloudWords[i].name, weight: Math.floor((Math.random() * 15))
                }
            }

        let updateData = update(this.state.dataChart, {
                cloudWords: { $set: wordList }
            });
        this.setState({ dataChart: updateData });
    },

    drawCentroid() {
        var data = [],
            { centroids } = this.state.orphanData;

        for(let i = centroids.length - 1; i >= 0; i--) {
            data[i] = [i + 1, centroids[i].number_docs];
        }

        var updateChart = update(this.state.dataChart, {
            centroidChart: { $set: data }
        });

        this.setState({ dataChart: updateChart });
    },
    
    drawChart() {
        var category = this.state.orphanData.categories;
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
            confidentiality: { $set: pieChart },
            documentType: { $set: documentType }
        });
        this.setState({ dataChart: updateChart });
    },
    render:template
});

module.exports = OrphanReview;