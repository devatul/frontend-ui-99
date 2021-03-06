import React, {Component} from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {forEach, upperFirst, isEqual, cloneDeep, findIndex, maxBy} from 'lodash';
import template from './GroupReview.rt';
import update from 'react/lib/update';
import {makeRequest} from '../utils/http';
import Constant, {status, fetching} from '../App/Constant.js';
import Demo from '../Demo.js';
import {getGroups, getCategories, getDocuments, getConfidentialities, getStatistics, getCentroids, getCloudwords, setGroupDocuments} from '../utils/function.js';

var GroupReview = React.createClass({
  displayName: 'GroupReview',

  getInitialState() {
    return {
      listGroup: [],
      groups: [],
      groups_by_name: [],
      group_parent: [],
      groupCurrent: {
        id: 0,
        name: 'group name',
        index: 0,
        lastGroup: false,
      },
      statistics: {},
      cloudwords: [],
      centroids: [],
      reviewStatus: 0,
      documents: [],
      loadingdocuments: true,
      categories: [],
      confidentialities: [],
      categoryInfo: [],
      documentPreview: -1,
      shouldUpdate: false,
      checkedNumber: 0,
      validateNumber: 0,
      checkBoxAll: false,
      stackChange: [],
      showLoading: "none",

      dataChart: {
        pieChart: [],
        documentType: {
          categories: [],
          series: []
        },
        centroidChart: [],
        cloudWords: []
      },

      openPreview: false,

      xhr: {
        status: "Report is loading",
        message: "Please wait!",
        timer: 20,
        loading: 0,
        isFetching: fetching.STARTED
      }
    };
  },

  componentDidMount() {
    this.getGroups();
    this.getCategories();
    this.getConfidentialities();
    this.drawCloud();
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shouldUpdate;
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldUpdate === true) {
      this.setState({shouldUpdate: false});
    }

    if (!isEqual(this.state.groupCurrent, prevState.groupCurrent)) {
      this.getDocuments();
      this.getStatistics();
      this.getCategoryInfo();
      this.getCentroids();
      this.getCloudwords();
    }

    if (!isEqual(this.state.documents, prevState.documents)) {
      let validNumber = this.validateNumber(),
          checkNumber = this.checkedNumber(),
          editNumber = this.editNumber(),
          docNumber = this.state.documents.length;

      this.setState({
        validateNumber: validNumber,
        checkedNumber: checkNumber,
        checkBoxAll: (checkNumber === docNumber),
        reviewStatus: Math.round(( (validNumber + editNumber) * 100) / docNumber),
        shouldUpdate: true
      });
    }

    // if(store.centroids != prevState.store.centroids) {
    //     this.drawCentroid();
    // }
    // if(categoriesInfo != prevState.categoriesInfo) {
    //     this.drawChart();
    // }
  },

  ucwords(str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function (a) {
      return a.toUpperCase();
    });
  },

  closePreview() {
    this.setState({openPreview: false, shouldUpdate: true});
  },

  handleClickRefineButton(event) {
    this.setState({showLoading: 'block', shouldUpdate: true});
  },

  handleOnChangeSelectGroup(event) {
    let {groups} = this.state,
        index = event.target.value,
        group = Object.assign({}, groups[index], {index: parseInt(index)});

    let updateStack = update(this.state.stackChange, {
        $push: [{
          index: this.state.groupCurrent.index,
          documents: this.state.documents
        }]
    });

    this.setState({
      stackChange: updateStack,
      groupCurrent: group,
      shouldUpdate: true,
      loadingdocuments: true,
      lastGroup: index == (this.state.groups.length - 1)
    });
  },

  handleNextGroup() {
    let {index} = this.state.groupCurrent,
        group = Object.assign({}, this.state.groups[index + 1], {index: index + 1});
    let updateStack = update(this.state.stackChange, {
        $push: [{
          index: index,
          documents:this.state.documents
        }]
    });
    this.updateOnchange(this.state.documents);
    if (index < (this.state.groups.length - 1)) {
      this.setState({
        stackChange: updateStack,
        groupCurrent: group,
        shouldUpdate: true,
        loadingdocuments: true,
        lastGroup: index == (this.state.groups.length - 1),
      });
    }
  },
  handleNextDocument(index) {
      if(index <= (this.state.documents.length - 1)) {
        let updateStack = update(this.state.stackChange, {
            $push: [{
                id: this.state.documentPreview,
                data: Object.assign({}, this.state.documents[this.state.documentPreview])
            }]
        });
          this.setState({
              documentPreview: index,
              stackChange: updateStack,
              shouldUpdate: true
          });
      }
    },
  handleTableRowOnClick(event, index) {
    switch (event.currentTarget.id) {
      case 'documentName':
        this.onClickDocumentName(index);
        break;
      case 'documentStatus':
        this.onClickButtonStatus(index);
    }
  },

  onClickDocumentName(index) {
    if (index <= (this.state.documents.length - 1)) {
      this.setState({
        openPreview: true,
        documentPreview: index,
        shouldUpdate: true
      });
    }
  },

  onClickButtonStatus(index) {
    let document = this.state.documents[index];

    if (document.status !== status.ACCEPTED.name) {
      let updateDocuments = update(this.state.documents, {
            [index]: {
              $merge: {
                status: status.ACCEPTED.name
              }
            }
          }),
          updateStack = update(this.state.stackChange, {
            $push: [{
              id: index,
              data: Object.assign({}, this.state.documents[index])
            }]
          });
          this.updateOnchange(updateDocuments);

      this.setState({documents: updateDocuments, stackChange: updateStack, shouldUpdate: true});
    }
  },
  updateOnchange(updateDocuments){
    let docs = [];

    for (let i = 0, len = updateDocuments.length; i < len; ++i) {
      docs.push({
        "name": updateDocuments[i].name,
        "path": updateDocuments[i].path,
        "category": updateDocuments[i].category.name,
        "confidentiality": updateDocuments[i].confidentiality.name,
      });
    }

      let { id } = this.state.groupCurrent;
            setGroupDocuments({
                id: id,
                dataType: "text",
                params: JSON.stringify({ "group_id": id, "docs": docs}),
                success: (res) => {
                },
                error: (err) =>{
                  console.log('error',err)
                }
            });
  },
  handleTableRowOnChange(event, index) {
    switch (event.target.id) {
      case 'checkbox':
        this.onChangeCheckBox(event, index);
        break;
      case 'selectCategory':
        this.onChangeCategory(event, index);
        break;
      case 'selectConfidentiality':
        this.onChangeConfidentiality(event, index);
    }
  },

  onChangeCheckBox(event, index) {
    let {documents} = this.state,
        updateDocuments = update(this.state.documents, {
          [index]: {
            $merge: {
              checked: event.target.checked
            }
          }
        }),
        updateStack = update(this.state.stackChange, {
          $push: [{
            id: index,
            data: Object.assign({}, documents[index])
          }]
        });

    this.setState({documents: updateDocuments, stackChange: updateStack, shouldUpdate: true});
  },

  onChangeCategory(event, index) {
    let categoryIndex = event.target.value,
        {categories, documents} = this.state,
        updateDocuments = update(documents, {
          [index]: {
            category: {
              $set: categories[categoryIndex]
            },
            $merge: {
              status: status.EDITING.name
            }
          }
        }),
        updateStack = update(this.state.stackChange, {
          $push: [{
            id: index,
            data: Object.assign({}, documents[index])
          }]
        });

    this.setState({documents: updateDocuments, stackChange: updateStack, shouldUpdate: true});
  },

  onChangeConfidentiality(event, index) {
    let confidentialityIndex = event.target.value,
        {confidentialities, documents} = this.state,
        updateDocuments = update(documents, {
          [index]: {
            confidentiality: {
              $set: confidentialities[confidentialityIndex]
            },
            $merge: {
              status: status.EDITING.name
            }
          }
        }),
        updateStack = update(this.state.stackChange, {
          $push: [{
            id: index,
            data: Object.assign({}, documents[index])
          }]
        });

    this.setState({documents: updateDocuments, stackChange: updateStack, shouldUpdate: true});
  },

  handleSelectAll(event) {
    let updateDocuments = update(this.state.documents, {
      $apply: (data) => {
        data = cloneDeep(data);

        for (let i = data.length - 1; i >= 0; i--) {
          data[i].checked = event.target.checked
        }

        return data;
      }
    });

    this.setState({documents: updateDocuments, checkBoxAll: event.target.checked, shouldUpdate: true});
  },

  handleChangeNumberDocument(event) {
    let {
      value
    } = event.target;

    // return makeRequest({
    //     path: "api/group/orphan/samples",
    //     params: {"id": id, "numbers": value},
    //     success: (res) => {
    //       this.setState({
    //         documents: res,
    //         shouldUpdate: true,
    //         loadingdocuments: false,
    //         getdocumenterror: false
    //       });
    //     },
    //     error: (err) => {
    //       this.setState({
    //         documents: [],
    //         loadingdocuments: false,
    //         getdocumenterror: err
    //       })
    //     }
    //   });
  },

  handleUndo() {
    if (this.state.stackChange.length > 0) {
      let {documents, stackChange, documentPreview } = this.state,
          item = stackChange[stackChange.length - 1];
      if(item.documents){
        let updateDocuments = item.documents,
        updateStack = update(stackChange, {
          $splice: [[stackChange.length - 1, 1]]
        });
        this.setState({
          groupCurrent: Object.assign({}, this.state.groups[item.index], {index: item.index}),
          documents: updateDocuments,
          stackChange: updateStack,
          loadingdocuments: false,
          shouldUpdate: true
        });
      }else{
        let updateDocuments = update(documents, {
          [item.id]: {
            $set: item.data
          }
        }),
        updateStack = update(stackChange, {
          $splice: [[stackChange.length - 1, 1]]
        });

        if(item.id !== documentPreview ){
          documentPreview = item.id;
        }

        this.setState({
          documents: updateDocuments,
          stackChange: updateStack,
          documentPreview: documentPreview,
          shouldUpdate: true
        });
      }
    }
  },

  getGroups() {
    let data = [];

    getGroups({
      success: (res) => {
        let group = Object.assign({}, res[0], {index: 0}),
            groups_by_name = [],
            group_parent = [];

        forEach(res, (group, i) => {
          let group_id = group.name.split(',')[0];
          let name = group.name.split(',')[1];
          if (!groups_by_name[group_id]) {
            groups_by_name[group_id] = [];
            group_parent.push(group_id)
          }
          groups_by_name[group_id].push({
            name: "ID:" + group.id + " - " + name,
            realname: group.name,
            index: i,
            id: group.id
          })
        });

        group_parent.sort(function (a, b) {
          if (a > b) return 1;
          if (a < b) return -1;
        });

        forEach(group_parent, (i) => {
          groups_by_name[i].sort(function (a, b) {
            if (parseInt(a.id) > parseInt(b.id)) return 1;
            if (parseInt(a.id) < parseInt(b.id)) return -1;
          })
        });

        let elt_index = 0,
            res_groups = [];

        forEach(group_parent, (i) => {
          forEach(groups_by_name[i], elt => {
            elt.index = elt_index++;
            res_groups.push(elt);
          })
        });

        this.setState({
          groups: res_groups,
          group_parent: group_parent,
          groups_by_name: groups_by_name,
          groupCurrent: Object.assign({}, res_groups[0], {index: 0}),
          shouldUpdate: true
        });
      }
    });
  },

  fileDistribution() {
    let data = [
          {name: 'Word', color: 'yellow', total: 5015},
          {name: 'Excel', color: 'red', total: 3299},
          {name: 'Power Point', color: 'purple', total: 3991},
          {name: 'PDF', color: 'green', total: 3842},
          {name: 'Other', color: 'blue', total: 1067}
        ],
        total = 0,
        children = [];
    let colors = [
          {color: 'yellow'},
          {color: 'red'},
          {color: 'purple'},
          {color: 'green'},
          {color: 'blue'}
        ];
    makeRequest({
      path: "api/group/file-distributions",
      params: {
        "id": this.state.groupCurrent.id
      },
      success: (res) => {
             res.map(function (e) {
               total += e["number of docs"];
             });
            let max = 100;

             for (let i = res.length - 1; i >= 0; i--) {
               let data_width = ((res[i]["number of docs"] / total) * 100).toFixed(2);
               if (max < data_width)
                 data_width = max;
               max -= data_width;
               children[i] =
                   <div key={'file_' + i} className={'item ' + colors[i].color} style={{ width: data_width + "%" }}>
                     {res[i].name}
                     <span className="item-legend">{res[i]["number of docs"] * Demo.MULTIPLIER}</span>
                   </div>;
             }
             this.ch = <div className="file-distribution clearfix">{children}</div>;
      },
      error: (err) => {
      }
    });

    return this.ch;
  },

  getStatistics() {
    getStatistics({
      params: {
        "id": this.state.groupCurrent.id
      },
      success: (res) => {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          res.completed_number_documents *= Demo.MULTIPLIER;
          res.total_number_documents *= Demo.MULTIPLIER;
        }

        this.setState({statistics: res, shouldUpdate: true});
      }
    });
  },

  getCloudwords() {
    return getCloudwords({
      params: {
        "id": this.state.groupCurrent.id
      },
      success: (res) => {
        let arr = [];

        for (let i = res.length - 1; i >= 0; i--) {
          arr[i] = {
            text: res[i].name,
            weight: res[i].count
          }
        }

        this.setState({cloudwords: arr, shouldUpdate: true});
      }
    });
  },

  getCentroids() {
    getCentroids({
      params: {
        "id": this.state.groupCurrent.id
      },
      success: (centroids) => {
        // FIXME: Demo fix
        if (Demo.MULTIPLIER != 1) {
          for (let i = 0, len = centroids.length; i < len; ++i) {
            centroids[i].number_docs *= Demo.MULTIPLIER;
          }
        }

        var series = [], total = centroids.length;

        let max = maxBy(centroids, doc => doc.number_docs),
            max_circle_size = 6,
            angle_multiplier = 360 / (total);

        for (var i = 0; i < total; i++) {
          if (centroids[i]) {
            series[i] = {
              type: 'scatter',
              lineWidth: 2,
              marker: {
                symbol: 'circle'
              },
              data: [
                [angle_multiplier * (i + 0.5), centroids[i].end],
                {
                  x: angle_multiplier * (i + 0.5),
                  y: 0,
                  document: centroids[i].number_docs,
                  weight: Math.ceil(centroids[i].number_docs / max.number_docs * max_circle_size),
                  marker: {
                    enabled: false,
                    states: {
                      hover: {
                        enabled: false
                      }
                    }
                  }
                },
                null
              ]
            };
          }
        }

        this.setState({centroids: series, shouldUpdate: true});
      }
    });
  },

  getDocuments() {
    let data = [{
          confidence_level: 87,
          confidentiality_label: "yes/no",
          creation_date: "2012-04-23",
          image_url: "http://54.254.145.121/static/group/01/IonaTechnologiesPlcG07.doc",
          legal_retention_until: "2012-04-23",
          modification_date: "2012-04-23",
          name: "IonaTechnologiesPlcG07.doc",
          number_of_classification_challenge: 1,
          owner: "owner_name",
          path: "assets/group/01/IonaTechnologiesPlcG07.doc",
          category: {
            id: 1,
            name: "Accounting/Tax"
          },
          confidentiality: {
            id: 1,
            name: "Confidential"
          }
        }, {
          confidence_level: 87,
          confidentiality_label: "yes/no",
          creation_date: "2012-04-23",
          image_url: "http://54.254.145.121/static/group/01/IonaTechnologiesPlcG07.doc",
          legal_retention_until: "2012-04-23",
          modification_date: "2012-04-23",
          name: "IonaTechnologiesPlcG07.doc",
          number_of_classification_challenge: 1,
          owner: "owner_name",
          path: "assets/group/01/IonaTechnologiesPlcG07.doc",
          category: {
            id: 1,
            name: "Accounting/Tax"
          },
          confidentiality: {
            id: 1,
            name: "Confidential"
          }
        }, {
          confidence_level: 87,
          confidentiality_label: "yes/no",
          creation_date: "2012-04-23",
          image_url: "http://54.254.145.121/static/group/01/IonaTechnologiesPlcG07.doc",
          legal_retention_until: "2012-04-23",
          modification_date: "2012-04-23",
          name: "IonaTechnologiesPlcG07.doc",
          number_of_classification_challenge: 1,
          owner: "owner_name",
          path: "assets/group/01/IonaTechnologiesPlcG07.doc",
          category: {
            id: 1,
            name: "Accounting/Tax"
          },
          confidentiality: {
            id: 1,
            name: "Confidential"
          }
        }, {
          confidence_level: 87,
          confidentiality_label: "yes/no",
          creation_date: "2012-04-23",
          image_url: "http://54.254.145.121/static/group/01/IonaTechnologiesPlcG07.doc",
          legal_retention_until: "2012-04-23",
          modification_date: "2012-04-23",
          name: "IonaTechnologiesPlcG07.doc",
          number_of_classification_challenge: 1,
          owner: "owner_name",
          path: "assets/group/01/IonaTechnologiesPlcG07.doc",
          category: {
            id: 1,
            name: "Accounting/Tax"
          },
          confidentiality: {
            id: 1,
            name: "Confidential"
          }
        }],
        {id} = this.state.groupCurrent;

    if (this.state.loadingdocuments)
      return getDocuments({
        params: {"id": id},
        success: (res) => {
          //data = res;
          this.setState({
            documents: res,
            loadingdocuments: false,
            shouldUpdate: true
          });
        }
      });
  },

  getCategories() {
    let arr = [];

    getCategories({
      success: (data) => {
        data.sort(function (a, b) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
        });

        this.setState({categories: data, shouldUpdate: true});
      }
    });
  },

  getConfidentialities() {
    let arr = [];

    getConfidentialities({
      success: (data) => {
        this.setState({confidentialities: data, shouldUpdate: true});
      }
    });
  },

  getCategoryInfo () {
    getCategories({
      params: {
        "id": this.state.groupCurrent.id
      },
      success: (res) => {
        this.setState({categoryInfo: res})
      }
    });
  },

  progressbar(value) {
    var {avg_centroid_distance, max_centroid_distance, min_centroid_distance} = this.state.statistics;

    switch (true) {
      case value < avg_centroid_distance:
        return "progress-bar-success";
      case value > avg_centroid_distance && value < (2 / 3) * (max_centroid_distance - min_centroid_distance):
        return "progress-bar-warning";
      case value > (2 / 3) * (max_centroid_distance - min_centroid_distance):
        return "progress-bar-danger";
    }
  },

  checkedNumber() {
    let num = 0,
        {documents} = this.state;

    for (let i = documents.length - 1; i >= 0; i--) {
      if (documents[i].checked === true) {
        num++;
      }
    }

    return num;
  },

  editNumber() {
    let num = 0,
        {documents} = this.state;

    for (let i = documents.length - 1; i >= 0; i--) {
      if (documents[i].status === status.EDITING.name) {
        num++;
      }
    }

    return num;
  },

  validateNumber() {
    let num = 0,
        {documents} = this.state;

    for (let i = documents.length - 1; i >= 0; i--) {
      if (documents[i].status === status.ACCEPTED.name) {
        num++;
      }
    }

    return num;
  },

  handleClickApproveButton() {
    let documents = cloneDeep(this.state.documents);

    for (let i = documents.length - 1; i >= 0; i--) {
      if (documents[i].checked) {
        documents[i].status = status.ACCEPTED.name;
        documents[i].checked = false;
      }
    }

    this.setState({documents: documents, shouldUpdate: true});
  },

  drawCloud() {
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
      cloudWords: {$set: word_list}
    });

    this.setState({dataChart: updateChart});
  },

  drawCentroid() {
    var centroids = [];

    forEach(this.state.store.centroids, (val, index) => {
      centroids.push([index + 1, val.number_docs]);
    });

    var updateChart = update(this.state.dataChart, {
      centroidChart: {$set: centroids}
    });

    this.setState({dataChart: updateChart});
  },

  drawChart() {
    var category = this.state.categoriesInfo,
        pieChart = [],
        documentType = {
          categories: ['Word', 'Excel', 'PDF', 'Power Point', 'Other'],
          series: []
        };

    for (let i = 0, total = category.length; i < total; i++) {
      pieChart[i] = {
        name: upperFirst(category[i].name),
        y: category[i].percentage
      };

      documentType.series[i] = {
        name: category[i].name,
        data: []
      };

      for (let j = 0, data = category[i].doc_types, total = data.length; j < total; j++) {
        documentType.series[i].data[j] = data[j].total;
      }
    }

    var updateChart = update(this.state.dataChart, {
      pieChart: {$set: pieChart},
      documentType: {$set: documentType}
    });

    this.setState({dataChart: updateChart});
  },

  render: template
});

module.exports = GroupReview;
