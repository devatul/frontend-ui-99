import React, { Component } from 'react'
import { render } from 'react-dom'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import template from './BarMenu.rt'
import javascriptOverview from '../script/javascript-overview.js'
import 'jquery'
var InfoOn = React.createClass
({
	getInitialState() {
	    return {
            category: [
                  {
                    "id": 1,
                    "name": "accounting/tax"
                  },
                  {
                    "id": 2,
                    "name": "corporate entity"
                  },
                  {
                    "id": 3,
                    "name": "client/customer"
                  },
                  {
                    "id": 4,
                    "name": "employee"
                  },
                  {
                    "id": 5,
                    "name": "legal/regulatory"
                  }
                ],
            confidentiality: [
                  {
                    "id": 1,
                    "name": "public"
                  },
                  {
                    "id": 2,
                    "name": "internal only"
                  },
                  {
                    "id": 3,
                    "name": "confidential"
                  },
                  {
                    "id": 4,
                    "name": "secret"
                  },
                  {
                    "id": 5,
                    "name": "banking secrecy"
                  }
                ],
            doctype: [
                  {
                    "id": 1,
                    "name": "excel"
                  },
                  {
                    "id": 2,
                    "name": "doc"
                  },
                  {
                    "id": 3,
                    "name": "pdf"
                  },
                  {
                    "id": 4,
                    "name": "power point"
                  }
                ],
            language: [
                  {
                    "id": 1,
                    "short_name": "EN",
                    "name": "english"
                  },
                  {
                    "id": 2,
                    "short_name": "FR",
                    "name": "french"
                  },
                  {
                    "id": 3,
                    "short_name": "DE",
                    "name": "german"
                  }
                ],
            filter: {
                "categories":[],
                "confidentialities":[],
                "doc-types":[],
                "languages":[]
            },
            scan_result: {}
	    };
	},
    getDefaultProps() {
        return {
            title: "title",
            datainfo: {
                      "confidentialities": [
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "public",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "confidential",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "secret",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "internal only",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "banking secrecy",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        }
                      ],
                      "total_twins": 2,
                      "percentage_accuracy": 5,
                      "percentage_duplicates": 1,
                      "country": "Switzerland",
                      "percentage_twins": 1,
                      "file_extensions_processed": "pdf, doc",
                      "encrypted_documents": 1234,
                      "documents_skipped": 123,
                      "doc-types": [
                        {
                          "total_docs": 10,
                          "name": "pdf"
                        },
                        {
                          "total_docs": 90,
                          "name": "doc"
                        }
                      ],
                      "languages": [
                        {
                          "total_docs": 5,
                          "name": "EN"
                        },
                        {
                          "total_docs": 5,
                          "name": "FR"
                        },
                        {
                          "total_docs": 5,
                          "name": "DE"
                        }
                      ],
                      "total_documents_scanned": 10,
                      "business_unit": "private bank",
                      "total_duplicates": 2,
                      "number_orphan_clusters": 2,
                      "categories": [
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "accounting/tax",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "corporate entity",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "transaction",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "legal",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        },
                        {
                          "percentage_owner_accuracy_docs": 10,
                          "name": "employee",
                          "percentage_reviewed_docs": 10,
                          "total_validated_docs": 100,
                          "percentage_validated_docs": 10,
                          "total_owner_accuracy_docs": 100,
                          "percentage_prediction_accuracy_docs": 10,
                          "total_prediction_accuracy_docs": 100,
                          "total_reviewed_docs": 100
                        }
                      ],
                      "is_clusters_reviewed": false,
                      "document_analyzed": 10000,
                      "scan_status": "in progress",
                      "percentage_documents_scanned": 10,
                      "last_data_scan": "20-07-2016 14:00:00"
            },
            handleFilter: function() {},
            isShowFilter: true,
            isShowInfo: true
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
	    //this.getCategory();
	    //this.getConfidentiality();
	    //this.getDoctypes();
	    //this.getLanguages();
        console.log("will mout bar");   
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
	/*getCategory: function() {
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
            async: true,
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
            async: true,
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
    },*/
    openFilterPopup: function() {
       javascriptOverview();
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