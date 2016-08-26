'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import { browserHistory } from 'react-router'
import Constant from '../Constant.js'
import template from './MenuBar.rt'
import { assignIn, isEqual, forEach, concat, find, remove } from 'lodash'
import { makeRequest } from '../utils/http'

var MenuBar = React.createClass
({
  static: {
    categoryId: 'categories',
    confidentialId: 'confidentialities',
    doctypeId: 'doc-types',
    languageId: 'languages',
    selectAll: 'select_all'
  },
	getInitialState() {
	    return {
            listLabel: {
                categories: [],
                confidentialities: [],
                doctypes: [],
                languages: []
            },
            filter: {
                params: {},
                labels: []
            },
            dataSelectBox: {},
            scan_result: {},
            filterLabel: [],
            eventContext: ''
	    };
	},
	propTypes: {
		title: React.PropTypes.string,
	    handleFilter: React.PropTypes.func,
	    showFilter: React.PropTypes.bool,
	    showInfo: React.PropTypes.bool
	},

    componentDidMount() {
        if(this.props.showFilter) {
            this.getConfidentiality(true);
            //this.getCategory(true);
            //this.getDoctypes(true);
            //this.getLanguages(true);
        }
        if(this.props.showInfo) {
            this.getScanResult();
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        var { filter, scan_result, listLabel } = this.state;
        return !isEqual( scan_result, nextState.scan_result )
            || !isEqual( listLabel, nextState.listLabel )
            || !isEqual( filter.labels, nextState.filter.labels );
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.state.filter != prevState.filter) {
            var filter = this.state.filter;
            if(filter.languages != null) {
            filter.languages.length === 0 && delete this.state.filter.languages;
            }
            if(filter["doc-types"] != null) {
            filter["doc-types"].length === 0 && delete this.state.filter["doc-types"];
            }
            if(filter.confidentialities != null) {
            filter.confidentialities.length === 0 && delete this.state.filter.confidentialities;
            }
            if(filter.categories != null) {
            filter.categories.length === 0 && delete this.state.filter.categories;
            }
            this.props.handleFilter(this.state.filter);
        }
        if(this.state.dataSelectBox != prevState.dataSelectBox) {
            this.state.eventContext.length > 1 &&
                this.updateFilterList(this.state.eventContext);
        }
    },
    configListLabel: function(data) {
        for(let i = data.length - 1; i >= 0; i--) {
            data[i].checked = false;
        }
    },
	getCategory: function(async) {
        makeRequest({
            path: 'api/label/category/',
            success: (data) => {
                this.configListLabel(data);

                let updateList = update(this.state.listLabel, {
                    categories: { $set: data }
                });
                this.setState({ listLabel: updateList });
            }
        });
    },
    getConfidentiality: function(async) {
        makeRequest({
            path: 'api/label/confidentiality/',
            success: (data) => {
                this.configListLabel(data);
                debugger
                let updateList = update(this.state.listLabel, {
                    confidentialities: { $set: data }
                });
                this.setState({ listLabel: updateList });
            }
        });
    },
    getDoctypes: function(async) {
        makeRequest({
            path: 'api/label/doctypes/',
            success: (data) => {
                this.configListLabel(data);

                let updateList = update(this.state.listLabel, {
                    doctypes: { $set: data }
                });
                this.setState({ listLabel: updateList });
            }
        });
    },
    getLanguages: function(async) {
        makeRequest({
            path: 'api/label/languages/',
            success: (data) => {
                this.configListLabel(data);

                let updateList = update(this.state.listLabel, {
                    languages: { $set: data }
                });
                this.setState({ listLabel: updateList });
            }
        });
    },
    clearFilter: function() {
        var data = this.state.dataSelectBox;
        forEach(this.state.filterLabel, function(object, index) {
            var updateData = update(data,{
                [object.selectId]: {
                    [object.index]: { $merge: { checked: false } }
                }
            });
            data = updateData;
        }.bind(this));
        this.setState({ dataSelectBox: data, filterLabel: [] });
    },

    onClickLabel: function(label, index) {
        let { labels } = this.state.filter;
        var updateLabel = update(this.state.filter, {
            labels: { $splice: [[index, 1]] }
        });
        this.setState({ filter: updateLabel });
    },

    updateFilterList: function(selectId) {
        var filter = assignIn({}, this.state.filter);
        var arr = [];
        forEach(this.state.dataSelectBox[selectId], function(object, index) {
            if(object.checked) {
                arr.push({
                    id: object.id,
                    name: object.name
                });
            }
        });
        filter[selectId] = arr;
        this.setState({ filter: filter });
    },

    addLabel: function(label) {
        let updateLabel = update(this.state.filter, {
            labels: { $push: [label] }
        });

        this.setState({ filter: updateLabel });
    },

    deleteLabel(id) {
        let indexLabel = 0, { labels } = this.state.filter;

        for( let i = labels.length - 1; i >= 0; i-- ) {
            if(labels[i].id === id) {
                indexLabel = i;
            }
        }

        let updateLabel = update(this.state.filter, {
            labels: { $splice: [[indexLabel, 1]] }
        });
        
        this.setState({ filter: updateLabel });
    },

    renderLabel() {
        var child = [], { labels } = this.state.filter, total = labels.length;
			if(total > 0) {
				for(let i = total - 1; i >= 0; i-- ) {
					child[i] = <span
									key={labels[i].id}
									className="filter-label label label-info">
									<a className="filter-remove"
										onClick={()=>this.onClickLabel(labels[i], i)}>
										<i className="fa fa-times"></i>
									</a>
									<span className="option-name">{labels[i].name}</span>
								</span>;
				}
			}
		return (
			<div>
				{child}
				{ total > 0 &&
				<a onClick={this.clearFilter} className={'filter-label label label-info'} style={{backgroundColor: '#747474'}}>
					Clear all
				</a>
				}
			</div>
		);
    },

    deleteLabelByIdName: function(field, id, name) {
        var arr = concat(this.state.filterLabel);
        remove(arr, {id: id, name: name});
        this.setState({ filterLabel: arr });
    },

    handleSelectBoxChange: function(field) {
        let listName = '', { listLabel } = this.state, { index, checked } = field.contextChange;
        switch (field.id) {
            case 'confidentialities': {
                    listName = 'confidentialities';
                }
                break;
            case 'categories': {
                    listName = 'categories';
                }
                break;
            case 'languages': {
                    listName = 'languages';    
                }
                break;
            case 'doctypes': {
                    listName = 'doctypes';
                }
                break;
        }
        if(listName) {
            let updateList = update(this.state.listLabel, {
                [listName]: {
                    [index]: {
                        checked: { $set: checked }
                    }
                }
            }),
            label = {
                id: field.id + '_' + index,
                name: listLabel[listName][index].name
            };

            this.setState({ listLabel: updateList });

            if( checked ) {
                this.addLabel(label);
            } else {
                this.deleteLabel(label.id);
            }
        }
    },

    handleSelectAll: function(field) {
        var arr = concat(this.state.dataSelectBox[field.selectId]);
        forEach(arr, function(object, index) {
            object.checked = field.checked;
        }.bind(this));
        var updateData = update(this.state.dataSelectBox, {
            [field.selectId]: {$set: arr }
        });
        this.setState({ dataSelectBox: updateData, eventContext: field.selectId });
    },
    
    getScanResult(){
      $.ajax({
          url: Constant.SERVER_API + 'api/scan/',
          dataType: 'json',
          type: 'GET',
          beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
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