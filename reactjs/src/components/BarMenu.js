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
            language: []
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
	render:template
});
module.exports = InfoOn;