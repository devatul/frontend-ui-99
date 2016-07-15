import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './OverView.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import dropdown from '../script/drop-down.js'
import Constant from '../Constant.js'
import chartOverview from '../script/chart-overview.js'
import multiselect from '../script/multiselect.js'
import 'jquery'
var OverView = React.createClass
({
    mixins: [LinkedStateMixin],
	getInitialState() {
	    return {
            label: {
                list_category: [],
                list_confidentiality: [],
                list_doctype: [],
                list_language: []
            },
            filter: {
                "categories":[],
                "confidentialities":[],
                "doc-types":[],
                "languages":[]
            },
            
            scan_result:{
                is_groups_reviewed: false,
                last_data_scan: "",
                country: "",
                business_unit: "",
                scan_status: Constant.scan.IS_NO_SCAN,
                document_analyzed: 0,
                file_extensions_processed: "",
                encrypted_documents: 0,
                documents_skipped: 0,
                number_orphan_groups: 0,
                total_documents_scanned: 0,
                percentage_documents_scanned: 0,
                total_duplicates: 0,
                percentage_duplicates: 0,
                total_twins: 0,
                percentage_twins: 0,
                percentage_accuracy: 0,
                confidentialities: [],
                categories: [],
                languages: [],
                doc_types: []
            },
            ChartData: {
                data_confidentiality: [],
                data_categories: [],
                data_languages: [],
                data_doctypes: []
            }
		};
	},
    componentWillMount() {
        if(this.state.scan_result.scan_status == Constant.scan.IS_NO_SCAN) {
           this.startScan();
        }

    },
	componentDidMount() {
        $('#bell').click();

        dropdown();

        this.getCategory();
        this.getConfidentiality();
        this.getDoctypes();
        this.getLanguages();
        
        
        if(this.state.scan_result.scan_status != Constant.scan.IS_NO_SCAN) {
            this.getScanResult();
        }
        
        this.filterOnChange();
                      
  	},
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.label != nextState.label) {
            return true;
        }
        if(this.state.filter != nextState.filter) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.filter != prevState.filter) {
            this.openFilterPopup();
        }
        if(this.state.filter != prevState.filter) {
            this.filterScan(this.state.filter);
        }
    },
    startScan() {
        $.ajax({
            method: 'POST',
            url: Constant.SERVER_API + 'api/scan/',
            dataType: 'application/json',
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            }
        })
        .done(function(data) {
                    console.log("Start Scan success", data);
        }.bind(this))
        .fail(function(error) {
            if(error.status == 201) {
                var update_scan_status = update(this.state, {
                    scan_result: {
                        scan_status: {$set: Constant.scan.IS_SCANING}
                    } 
                });
                this.setState(update_scan_status);
                console.log("asdfasdfasd fiale", this.state.scan_result.scan_status);
            }
        }.bind(this));
    },
    getScanResult(){
        $.ajax({
            url: Constant.SERVER_API + 'api/scan/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.updateChartData(data);
                var update_scan_result = update(this.state, {
                    scan_result: {$set: data}
                });
                this.setState(update_scan_result);
                console.log("scan result: ", data);
            }.bind(this),
            error: function(xhr, status, error) {
                console.log(xhr);
                var jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                if(xhr.status === 401)
                {
                    browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
       
    },
    openFilterPopup() {
        var renderFilterBlock = function(){
          if ($('.filter-tags .filter-label').length){
            $('.filter-tags-block label').show();
          }
          else{
            $('.filter-tags-block label').hide();
          }
        };

        if ($('.select-multiple').length){
            $('.select-multiple').each(function(){
                var buttonText = $(this).attr('data-title');
                $(this).multiselect({
                    includeSelectAllOption: true,
                    buttonText: function(options, select) {
                        return buttonText;
                    },
                    onChange: function(option, checked){
                        var selectedOption = $(option).val();
                        var filterCriteria = $(option).parents('.overview-filter').attr('name');
                        if(checked == true) {
                            $('<span class="filter-label label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags');
                            renderFilterBlock();
                        }
                        else{
                            $('.filter-label[data-value="'+selectedOption+'"]').remove();
                            renderFilterBlock();
                        }
                    }
                });
            });
        }

        $('body').on('click', '.filter-remove', function(){
          var filterCriteria = $(this).parents('.filter-label').attr('data-crit');
          var value = $(this).parents('.filter-label').attr('data-value');
          $(this).parents('.filter-label').remove();
          $('.select-multiple[name="'+filterCriteria+'"]').multiselect('deselect', [value]);
          renderFilterBlock();
        });
    },
    filterScan(bodyRequest) {
        if((bodyRequest.categories.length > 0) && (bodyRequest.confidentialities.length > 0) && (bodyRequest['doc-types'].length > 0) && (bodyRequest.languages.length > 0)) {
            $.ajax({
                method: 'POST',
                url: Constant.SERVER_API + "api/scan/filter/",
                dataType: 'json',
                data: JSON.stringify(bodyRequest),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
                },
                success: function(data) {
                    this.updateChartData(data);
                    var update_scan_result = update(this.state, {
                        scan_result: {$set: data}
                    });
                    this.setState(update_scan_result);
                    console.log("Filter Scan success");
                }.bind(this),
                error: function(xhr, status, error) {
                    console.log("Filter Scan error: " + error);
                    if(xhr.status === 401)
                    {
                        browserHistory.push('/Account/SignIn');
                    }
                }.bind(this)
            });
        } else {
            this.getScanResult();
        }
    },
    updateChartData(data) {
        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];
        var color_language = ['#2ecc71', '#9b59b6', '#34495e'];
        var data_confidentiality = [];
        var data_categories = [];
        var data_languages = [];
        var data_doctypes = [];
        //add data_confidentiality
            for(var i = 0; i < data.confidentialities.length; i++) {
                data_confidentiality.push({
                    label: data.confidentialities[i].name,
                    data: [
                        [1, data.confidentialities[i].percentage_owner_accuracy_docs]
                    ],
                    color: colors[i]
                });
            }
        //add data_categories
            for(var i = 0; i < data.categories.length; i++) {
                data_categories.push({
                    label: data.categories[i].name,
                    data: [
                        [1, data.categories[i].percentage_owner_accuracy_docs]
                    ],
                    color: colors[i]
                });
            }
        //add data_languages
            for(var i = 0; i < data.languages.length; i++) {
                data_languages.push({
                    label: (data.languages[i].short_name == null) ? data.languages[i].name : data.languages[i].short_name,
                    data: [
                        [1, data.languages[i].total_docs]
                    ],
                    color: color_language[i]
                });
            }
        //add data_doctypes
            for(var i = 0; i < data["doc-types"].length; i++) {
                data_doctypes.push({
                    label: data["doc-types"][i].name,
                    data: [
                        [1, data["doc-types"][i].total_docs]
                    ],
                    color: colors[i]
                });
            }
        //update into state
            var update_chart_data = update(this.state, {
                  ChartData: {
                    data_confidentiality: {$set: data_confidentiality},
                    data_categories: {$set: data_categories},
                    data_languages: {$set: data_languages},
                    data_doctypes: {$set: data_doctypes}
                  }
                });
            this.setState(update_chart_data);
            chartOverview(this.state.ChartData);
    },
    getCategory() {
        $.ajax({
            url: Constant.SERVER_API + 'api/label/category/',
            dataType: 'json',
            method: 'GET',
            //async: true,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                data = data.sort(function (a, b) {
                    return a.name.localeCompare( b.name );
                });
                var update_list_category = update(this.state, {
                      label: {
                        list_category: {$set: data}
                      }
                    });
                this.setState(update_list_category);

                console.log("category: ", data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
        console.log(this.state.listCategory);
    },
    getConfidentiality() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/confidentiality/",
            dataType: 'json',
            //async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                 var update_list_confidentiality = update(this.state, {
                      label: {
                        list_confidentiality: {$set: data}
                      }
                    });
                this.setState(update_list_confidentiality);
                console.log("list_confidentiality: ", data);
            }.bind(this),
            error: function(error) {
                console.log("error: listConfidentiality");
            }.bind(this)
        });
    },

    getDoctypes() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/doctypes/",
            dataType: 'json',
            //async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var update_list_doctype = update(this.state, {
                      label: {
                        list_doctype: {$set: data}
                      }
                    });
                this.setState(update_list_doctype);
                console.log("list_doctype: ", data);
            }.bind(this),
            error: function(error) {
                console.log("error: listDoctype");
            }.bind(this)
        });
    },

    getLanguages() {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/languages/",
            dataType: 'json',
            //async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                var update_list_language = update(this.state, {
                      label: {
                        list_language: {$set: data}
                      }
                    });
                this.setState(update_list_language);
                console.log("list_language: ", data);
            }.bind(this),
            error: function(error) {
                console.log("error: listLanguage");
            }.bind(this)
        });
    },

    filterOnChange() {
        $('#category').change(function(e) {
            var selected = $(e.target).val();
            var empty = update(this.state,{
                filter: {
                    "categories": {$set: []}
                }
            });
            this.setState(empty);
             
            if(selected != null){
                for(var i = 0; i < this.state.label.list_category.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.label.list_category[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "categories": {$push: [this.state.label.list_category[i]]}
                                }
                            });
                            this.setState(updateState);
                        }
                    }
                }
            }
            //this.filterScan(this.state.filter);
            console.log("category filter: ", this.state.filter.categories);
        }.bind(this));
        $('#confidentiality').change(function(e) {
            var selected = $(e.target).val();
            var empty = update(this.state,{
                filter: {
                    "confidentialities": {$set: []}
                }
            });
            this.setState(empty);
            if(selected != null){
                for(var i = 0; i < this.state.label.list_confidentiality.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.label.list_confidentiality[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "confidentialities": {$push: [this.state.label.list_confidentiality[i]]}
                                }
                            });
                            this.setState(updateState);
                        }
                    }
                }
            }
            //this.filterScan(this.state.filter);
            console.log("confidentiality filter: ", this.state.filter.confidentialities);
        }.bind(this));
        $('#doctype').change(function(e) {
            var selected = $(e.target).val();
            var empty = update(this.state,{
                filter: {
                    "doc-types": {$set: []}
                }
            });
            this.setState(empty);
            if(selected != null){
                for(var i = 0; i < this.state.label.list_doctype.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.label.list_doctype[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "doc-types": {$push: [this.state.label.list_doctype[i]]}
                                }
                            });
                            this.setState(updateState);
                        }
                    }
                }
            }
            //this.filterScan(this.state.filter);
            console.log("doctype filter: ", this.state.filter);
        }.bind(this));
        $('#language').change(function(e) {
            var selected = $(e.target).val();
            var empty = update(this.state,{
                filter: {
                    "languages": {$set: []}
                }
            });
            this.setState(empty);
            if(selected != null){
                for(var i = 0; i < this.state.label.list_language.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.label.list_language[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "languages": {$push: [this.state.label.list_language[i]]}
                                }
                            });
                            this.setState(updateState);
                        }
                    }
                }
            }
            //this.filterScan(this.state.filter);
            console.log("language filter: ", this.state.filter.languages);
        }.bind(this));
    },
	render:template
});
module.exports = OverView;
