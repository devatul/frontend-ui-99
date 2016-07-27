import React, { Component } from 'react'
import { render } from 'react-dom'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import template from './BarMenu.rt'
import javascriptOverview from '../script/javascript-overview.js'
import 'jquery'

var MenuBar = React.createClass
({
	getInitialState() {
	    return {
            listCategory: [],
            listConfidentiality: [],
            listDoctype: [],
            listLanguage: [],

            categories: [],
            confidentialities: [],
            doctypes: [],
            languages: [],

            scan_result: {},

            filter: {}
	    };
	},
	propTypes: {
		  title: React.PropTypes.string,
	    handleFilter: React.PropTypes.func,
	    showFilter: React.PropTypes.bool,
	    showInfo: React.PropTypes.bool
	},
  addCommas(nStr)
    {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
  componentDidMount() {
    if(this.props.showFilter) {
      this.getCategory(true);
      this.getConfidentiality(true);
      this.getDoctypes(true);
      this.getLanguages(true);
    }
    if(this.props.showInfo) {
      this.getScanResult();
    }
    this.handleOnChange();
    $('body').on('click', '.filter-remove', function(){
      var filterCriteria = $(this).parents('.filter-label').attr('data-crit');
      var value = $(this).parents('.filter-label').attr('data-value');
      $(this).parents('.filter-label').remove();
      var a = $('.select-multiple[id="'+filterCriteria+'"]').multiselect('deselect', [value]).change();
      console.log("ddddddddddds", a);
    });
  },
  shouldComponentUpdate(nextProps, nextState) {
      if(this.state.listCategory != nextState.listCategory) {
        return true;
      }
      if(this.state.listConfidentiality != nextState.listConfidentiality) {
        return true;
      }
      if(this.state.listDoctype != nextState.listDoctype) {
        return true;
      }
      if(this.state.listLanguage != nextState.listLanguage) {
        return true;
      }
      if(this.state.categories != nextState.categories) {
          return true;
      }
      if(this.state.confidentialities != nextState.confidentialities) {
          return true;
      }
      if(this.state.doctypes != nextState.doctypes) {
          return true;
      }
      if(this.state.languages != nextState.languages) {
          return true;
      }
      if(this.state.filter != nextState.filter) {
          return true;
      }
      if(this.state.scan_result != nextState.scan_result) {
          return true;
      }
      return false;
  },
  componentDidUpdate(prevProps, prevState) {
      if(this.state.categories != prevState.categories) {
          this.setState(update(this.state, {
            filter: { "categories": {$set: this.state.categories} }
          }));
      }
      if(this.state.confidentialities != prevState.confidentialities) {
          this.setState(update(this.state, {
            filter: { "confidentialities": {$set: this.state.confidentialities} }
          }));
      }
      if(this.state.doctypes != prevState.doctypes) {
          this.setState(update(this.state, {
            filter: { "doc-types": {$set: this.state.doctypes} }
          }));
      }
      if(this.state.languages != prevState.languages) {
          this.setState(update(this.state, {
            filter: { "languages": {$set: this.state.languages} }
          }));
      }
      if(this.state.filter != prevState.filter) {
          if(this.state.languages.length == 0) {
            delete this.state.filter.languages;
          }
          if(this.state.doctypes.length == 0) {
            delete this.state.filter["doc-types"];
          }
          if(this.state.confidentialities.length == 0) {
            delete this.state.filter.confidentialities;
          }
          if(this.state.categories.length == 0) {
            delete this.state.filter.categories;
          }
          console.log("aaaaaaaaaaa", this.state.filter);
          this.props.handleFilter(this.state.filter);
          console.log("filll: ", this.state.filter);
      }
  },
  componentWillUnmount: function() {
      console.log("a", this.state.listCategory);
      console.log("b", this.state.listConfidentiality);
      console.log("c", this.state.listDoctype);
      console.log("d", this.state.listLanguage);
  },
	getCategory: function(async) {
        $.ajax({
            url: Constant.SERVER_API + 'api/label/category/',
            dataType: 'json',
            method: 'GET',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState(update(this.state, {
                    listCategory: {$set: data}
                }));
            }.bind(this),
            error: function(xhr, error) {
                if(xhr.status == 401) {
                  browserHistory.push('/Account/SignIn');
                }
            }.bind(this)
        });
    },
    getConfidentiality: function(async) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/confidentiality/",
            dataType: 'json',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                data.reverse();
                this.setState(update(this.state, {
                    listConfidentiality: {$set: data}
                }));
            }.bind(this),
            error: function(xhr, error) {
              if(xhr.status == 401) {
                browserHistory.push('/Account/SignIn');
              }
            }.bind(this)
        });
    },
    getDoctypes: function(async) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/doctypes/",
            dataType: 'json',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState(update(this.state, {
                    listDoctype: {$set: data}
                }));
            }.bind(this),
            error: function(xhr, error) {
              if(xhr.status == 401) {
                browserHistory.push('/Account/SignIn');
              }
            }.bind(this)
        });
    },
    getLanguages: function(async) {
        $.ajax({
            method: 'GET',
            url: Constant.SERVER_API + "api/label/languages/",
            dataType: 'json',
            async: async,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) {
                this.setState(update(this.state, {
                  listLanguage: {$set: data}
                }));
            }.bind(this),
            error: function(xhr, error) {
              if(xhr.status == 401) {
                browserHistory.push('/Account/SignIn');
              }
            }.bind(this)
        });
    },
    openFilterPopup: function() {
      console.log("a", this.state.listCategory);
      console.log("b", this.state.listConfidentiality);
      console.log("c", this.state.listDoctype);
      console.log("d", this.state.listLanguage);
       javascriptOverview();
    },
    
    handleOnChange: function() {
      $('#filter_category').change(function(e) {
          var categories = [];
          $('#filter_category :selected').each(function(i, selected){ 
            categories[i] = {
              "id": $(selected).data('value'),
              "name": $(selected).val()
            };
          });
          //if(categories.length > 0) {
            var setCategories = update(this.state, {
              categories: {$set: categories }
            });
            this.setState(setCategories);
          //}
          console.log("categories", categories);
      }.bind(this));
    
      $('#filter_confidentiality').change(function(e) {
          var confidentiality = [];
          $('#filter_confidentiality :selected').each(function(i, selected){ 
            confidentiality[i] = {
              "id": $(selected).data('value'),
              "name": $(selected).val()
            };
          });
          //if(confidentiality.length > 0) {
            var setConfidentiality = update(this.state, {
              confidentialities: {$set: confidentiality }
            });
            this.setState(setConfidentiality);
          //}
          console.log("confidentiality", confidentiality);
      }.bind(this));
    
      $('#filter_doctype').change(function(e) {
        var doctype = [];
        $('#filter_doctype :selected').each(function(i, selected){ 
          doctype[i] = {
            "id": $(selected).data('value'),
            "name": $(selected).val()
          };
        });
        //if(doctype.length > 0) {
          var setDoctype = update(this.state, {
            doctypes: {$set: doctype }
          });
          this.setState(setDoctype);
        //}
        console.log("doctype", doctype);
      }.bind(this));
      
      $('#filter_language').change(function(e) {
        var languages = [];
        $('#filter_language :selected').each(function(i, selected){ 
          languages[i] = {
            "id": $(selected).data('value'),
            "name": $(selected).val()
          };
        });
        //if(languages.length > 0) {
          var setLanguages = update(this.state, {
            languages: {$set: languages }
          });
          this.setState(setLanguages);
        //}
        console.log("languages", languages);
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
              var update_scan_result = update(this.state, {
                  scan_result: {$set: data}
              });
              this.setState(update_scan_result);
          }.bind(this),
          error: function(xhr, status, error) {
              if(xhr.status === 401)
              {
                  browserHistory.push('/Account/SignIn');
              }
          }.bind(this)
      });  
    },
	 render:template
});
module.exports = MenuBar;