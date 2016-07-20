import React, { Component } from 'react'
import { render } from 'react-dom'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import template from './BarMenu.rt'
import 'jquery'
var InfoOn = React.createClass
({
	getInitialState() {
	    return {
            category: [],
            confidentiality: [],
            doctype: [],
            language: [],
            filter: {
                "categories":[],
                "confidentialities":[],
                "doc-types":[],
                "languages":[]
            },
            scan_result: {}
	    };
	},
	propTypes: {
		title: React.PropTypes.string,
	    datainfo: React.PropTypes.object,
	    handleFilter: React.PropTypes.func,
	    isShowFilter: React.PropTypes.bool,
	    isShowInfo: React.PropTypes.bool
	},
	componentWillMount() {
	    this.getCategory();
	    this.getConfidentiality();
	    this.getDoctypes();
	    this.getLanguages();  
	},
    componentDidMount() {
        this.filterOnChange();  
    },
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.filter.categories != nextState.filter.categories) {
            return true;
        }
        if(this.state.filter.confidentialities != nextState.filter.confidentialities) {
            return true;
        }
        if(this.state.filter['doc-types'] != nextState.filter['doc-types']) {
            return true;
        }
        if(this.state.filter.languages != nextState.filter.languages) {
            return true;
        }
        if(this.state.scan_result != nextState.scan_result) {
            return true;
        }
        if(this.props.datainfo != nextProps.datainfo) {
            return true;
        }
        return false;
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.state.filter.categories != prevState.filter.categories) {
            this.filterScan(this.state.filter);
        }
        if(this.state.filter.confidentialities != prevState.filter.confidentialities) {
            this.filterScan(this.state.filter);
        }
        if(this.state.filter['doc-types'] != prevState.filter['doc-types']) {
           this.filterScan(this.state.filter);
        }
        if(this.state.filter.languages != prevState.filter.languages) {
            this.filterScan(this.state.filter);
        } 
        if(this.state.scan_result != prevState.scan_result) {
            this.props.handleFilter(this.state.scan_result);
        } 
    },
	getCategory: function() {
        $.ajax({
            url: Constant.SERVER_API + 'api/label/category/',
            dataType: 'json',
            method: 'GET',
            //async: true,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                //data = data.sort(function (a, b) {
                   // return a.name.localeCompare( b.name );
                //});
                var update_list_category = update(this.state, {
                        category: {$set: data}
                    });
                this.setState(update_list_category);

                console.log("category: ", data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
    },
    getConfidentiality: function() {
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
                        confidentiality: {$set: data}
                    });
                this.setState(update_list_confidentiality);
                console.log("list_confidentiality: ", data);
            }.bind(this),
            error: function(error) {
                console.log("error: listConfidentiality");
            }.bind(this)
        });
    },

    getDoctypes: function() {
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
                        doctype: {$set: data}
                    });
                this.setState(update_list_doctype);
                console.log("list_doctype: ", data);
            }.bind(this),
            error: function(error) {
                console.log("error: listDoctype");
            }.bind(this)
        });
    },

    getLanguages: function() {
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
                    	language: {$set: data}
                    });
                this.setState(update_list_language);
                console.log("list_language: ", data);
            }.bind(this),
            error: function(error) {
                console.log("error: listLanguage");
            }.bind(this)
        });
    },
    openFilterPopup: function() {
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
    filterOnChange: function() {
        $('#category').change(function(e) {
            var selected = $(e.target).val();
            var setEmpty = update(this.state,{
                filter: {
                    "categories": {$set: []}
                }
            });
            this.setState(setEmpty);
             
            if(selected != null){
                for(var i = 0; i < this.state.category.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.category[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "categories": {$push: [this.state.category[i]]}
                                }
                            });
                            this.setState(updateState);
                        }
                    }
                }
            }
        }.bind(this));
        //this.filterScan(this.state.filter);        
        $('#confidentiality').change(function(e) {
            var selected = $(e.target).val();
            var empty = update(this.state,{
                filter: {
                    "confidentialities": {$set: []}
                }
            });
            this.setState(empty);
            if(selected != null){
                for(var i = 0; i < this.state.confidentiality.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.confidentiality[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "confidentialities": {$push: [this.state.confidentiality[i]]}
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
                for(var i = 0; i < this.state.doctype.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.doctype[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "doc-types": {$push: [this.state.doctype[i]]}
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
                for(var i = 0; i < this.state.language.length; i++) {
                    for(var j = 0; j < selected.length; j++) {
                        if(this.state.language[i].name == selected[j]) {
                            var updateState = update(this.state,{
                                filter: {
                                    "languages": {$push: [this.state.language[i]]}
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
            this.props.handleFilter(false);
        }
    },
	render:template
});
module.exports = InfoOn;