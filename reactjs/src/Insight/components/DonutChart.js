import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {isEqual, pull, indexOf, findIndex, pullAllBy} from 'lodash';
import HelpButton from '../../components/dathena/HelpButton';
import update from 'react/lib/update';
import Select2 from '../../components/dathena/Select2';
import FilterLabel from '../../components/dathena/FilterLabel';

var DonutChart = React.createClass({
  displayName: 'DonutChart',

  getInitialState() {
    return {
      colorDisabled: ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1'],
      config: this.props.config || {},
      filter: [-1],
      shouldUpdate:false,
    };
  },

  PropTypes: {
    id: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    help: PropTypes.string
  },
  componentWillReceiveProps(props){
    this.setState({config:props.config});
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.config, nextProps.config) || nextState.shouldUpdate;
  },
  componentDidMount(){
    this.draw();
  },
  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldUpdate === true) {
      this.setState({shouldUpdate: false});
    }
    this.draw();
  },

  draw() {
    var {id} = this.props, {colorDisabled, config} = this.state,

        div = $('#' + id);

    if (div.length) {
      div.highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: null,
          events: {
            load: function () {
              var chart = this,
                  series = chart.series;

              if (config.disabled) {
                for (let i = series.length - 1; i >= 0; i--) {
                  for (let j = series[i].points.length - 1; j >= 0; j--) {
                    series[i].points[j].graphic.attr({
                      fill: colorDisabled[j]
                    });
                  }
                }
              }
            }
          },
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          headerFormat: '',
          pointFormatter: function () {
            var percent = this.percentage.toFixed(1);
            return '<span style="color:' + this.color + '; font-weight: bold;">' + this.name + ': </span>' + percent + '% / ' + this.y + ' Documents';
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: -30,
              formatter: function () {
                var percent = this.percentage.toFixed(1);
                return percent >= 5.0 ? percent + '%' : '';
              },
              style: {
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0px 1px 2px black'
              }
            },
            states: {
              hover: {
                brightness: 0,
              }
            },
            showInLegend: true,
            point: {
              events: {
                mouseOver: function (event) {
                  var {series} = this, {points} = series;
                  div.css({'z-index':1,'transition': 'z-index 0s'})
                  this.graphic.attr({
                    fill: this.color
                  });

                  for (let i = points.length - 1; i >= 0; i--) {
                    points[i].graphic.attr({
                      fill: series.userOptions.colorsHover[i]
                    });
                  }
                },
                mouseOut: function (event) {
                  var {series} = this, {points} = series;

                  for (let i = points.length - 1; i >= 0; i--) {
                    points[i].graphic.attr({
                      fill: points[i].color
                    });
                  }
                  div.css({'z-index':0, 'transition': 'z-index 3s'})
                }
              }
            }
          },
        },
        legend: {
          enabled: false,
        },
        series: [config]
      });
    }
  },
  toggleDialog(back, front){
    $('#' + back).toggle()
    $('#' + front).toggle()
  },
  filter(data, checked){
    let {filter} = this.state, {config, id} = this.props,
    colors = [], colorsHover = [], configData = [], updateConfig,
     dataFilter = (filter[0] == -1) ? [] : filter;

    if(data !== -1){
      checked ? dataFilter.push(data) : pullAllBy(dataFilter, [data], 'id');
      if(dataFilter.length !== 0){
        $('#'+ id + '.clear').prop('checked', false);
        for(let i = 0; i < config.data.length; i++){
          if(findIndex(dataFilter, {name:config.data[i].name}) !== -1){
            configData.push(config.data[i]);
            colors.push(config.colors[i]);
            colorsHover.push(config.colorsHover[i]);
          }
        }
         updateConfig = update(config, {
          data:{$set:configData},
          colors:{$set:colors},
          colorsHover:{$set:colorsHover}
        });
      }else{
        $('#'+ id + '.clear').prop('checked', true);
        dataFilter=[-1];
        updateConfig = config;
      }
    }else{
      if(checked){
        $('#'+ id + '.check').prop('checked', false);
        dataFilter=[-1];
      }else{
        $('#'+ id + '.check').prop('checked', true);
        config.data.map((data,i)=>{
          dataFilter.push({id:id+"_"+i, name:data.name});
        })
      }
      updateConfig = config;
    }

    this.setState({config:updateConfig, filter: dataFilter, shouldUpdate: true});
  },
  onclearFilter: function() {
      let {config, id} = this.props;
      $('#'+ id + '.check').prop('checked', false);
      $('#'+ id + '.clear').prop('checked', true);

      this.setState({ filter: [-1], config:config, shouldUpdate: true});
  },
  onClickLabel: function(label, indexLabel) {
     let {id} = this.props;
     $('#'+ id + '.check.'+label.id).prop('checked', false);
     this.filter(label, false);
  },
  render() {
    var legendChart = [], {id, help, index, options} = this.props, {colorDisabled, config} = this.state, configProps = this.props.config;
    let listChartItems = [];

    if (config.data) {
      for (let i = config.data.length - 1; i >= 0; i--) {
        let color = ( config.disabled ) ? colorDisabled[i] : config.colors[i];
        legendChart[i] =
          <li key={'legend_' + i} style={config.data.length <= 3 ? {margin: '0 auto 5px', width: config.data[0].name.length * 8, float: 'left'} : {}}>
            <i className="fa fa-map-marker" aria-hidden="true" style={{color: color,paddingRight:'3px'}}></i>
            {config.data[i].name}
          </li>;
      }
    }

    configProps.data.map((data, i)=>{
      listChartItems.push(
      <li className="mb-sm" key={i}>
          <div className="form-group">
              <input type="checkbox" id={id} className={"check " + id+"_"+i } onChange={(e)=>this.filter({id:id+"_"+i, name: data.name}, e.target.checked)} /> {data.name}
          </div>
      </li>);
    });
    let configList;
    if(config.configList){
      configList = config.configList.map((listItem, i)=>{
          return <option value={listItem.value} key={i}> {listItem.label} </option>;
      });
    }

    let lineStyle = {color:config.colors && config.colors[0], backgroundColor:config.colors && config.colors[0], marginRight: (index == 2 || index == 5) ? '0px' : '-42px' };
    let top6 = config.top6 && <div><span>{config.top6}</span><i className="fa fa-cog" style={{color:config.colors[0]}} aria-hidden="true"></i></div>
    return (
      <section className="panel">
        <div className="panel-body chart-panel widget-panel">
          <h4 className="widget-title">
            {config.name && config.name + ' '}
          </h4>

              <div className="widget-chart analytics">

              <div className="chart chart-md" id={id} style={{width:'70%',margin:' 0 auto',zIndex: '0'}}></div>
                  <i className={"fa fa-"+config.centerIcon+" analytics center-graph"} aria-hidden="true"></i>

                  {options.filter ? <a className="toggle-button btn btn-default analytics filter" onClick={()=>this.toggleDialog(id + "FilterBack",id + "Filter")} ><i className="fa fa-filter" aria-hidden="true"></i></a> : ""}
                  {options.search ? <a className="toggle-button btn btn-default analytics search" onClick={()=>this.toggleDialog(id + "searchBack",id + "search")} ><i className="fa fa-search" aria-hidden="true"></i></a> : ""}
                  {options.config ? <a className="toggle-button btn btn-default analytics config" onClick={()=>this.toggleDialog(id + "configBack",id + "config")} ><i className="fa fa-cog" aria-hidden="true"></i></a> : ""}

                  {options.category ? <a className="toggle-button btn btn-default analytics category" onClick={()=>this.props.handleNextDiagram(0)}><i className="fa fa-tags" aria-hidden="true"></i></a> : ""}
                  {options.confidentiality ? <a className="toggle-button btn btn-default analytics confidentiality" onClick={()=>this.props.handleNextDiagram(1)}><i className="fa fa-shield" aria-hidden="true"></i></a> : ""}
                  {options.security ? <a className="toggle-button btn btn-default analytics security" onClick={()=>this.props.handleNextDiagram(2)}><i className="fa fa-users" aria-hidden="true"></i></a> : ""}
                  {options.folder ? <a className="toggle-button btn btn-default analytics folder" onClick={()=>this.props.handleNextDiagram(3)}><i className="fa fa-folder-open-o" aria-hidden="true"></i></a> : ""}
                  {options.user ? <a className="toggle-button btn btn-default analytics user" onClick={()=>this.props.handleNextDiagram(4)}><i className="fa fa-user" aria-hidden="true"></i></a> : ""}
                  {options.document ? <a className="toggle-button btn btn-default analytics document" onClick={()=>this.props.handleNextDiagram(5)}><i className="fa fa-file-archive-o" aria-hidden="true"></i></a> : ""}


            { legendChart &&
                <ul id={'legend' + id} className="list-unstyled chart-legend serie-0" style={{border:'none',height:'64px'}}>
                  {legendChart}
                </ul>
              }
            </div>

            { config.disabled && <div id={id} className="chart-disabled-overlay"></div>}
            <div style={{paddingLeft:'11px'}}>
              <div className="analytics bottom-line" style={lineStyle}>
                <i className="fa fa-caret-up" aria-hidden="true"></i>
              </div>
              <div className="filter-tags-block">
                  <label className="pull-left mr-md">{config.name && config.name + ' Filters: '}</label>
                    <div className="pull-left filter-tags" style={{textTransform: 'capitalize'}}>
                      {this.state.filter[0] != -1 ? <FilterLabel data={this.state.filter} onClick={this.onClickLabel} onClear={this.onclearFilter} /> : ""}
                    </div>
              </div>
              <div className="top6">
                {top6}
              </div>
            </div>
            <div className="dropdown">
                <div id={id + "FilterBack"} className="dropdown-backdrop-custom" style={{'display':'none','opacity':0}} onClick={()=>this.toggleDialog(id + "FilterBack",id + "Filter")}></div>
                <div id={id + "Filter"} className="dropdown-menu has-child has-arrow analyticsFilter">
                    <ul className="list-unstyled pt-xs">
                    <li className="mb-sm">
                        <div className="form-group">
                          <input type="checkbox" id={id} className="clear" onChange={(e)=>this.filter(-1, e.target.checked)} /> Clear all
                        </div>
                    </li>
                        {listChartItems}
                    </ul>
                </div>
            </div>
            <div className="dropdown">
                <div id={id + "configBack"} className="dropdown-backdrop-custom" style={{'display':'none','opacity':0}} onClick={()=>this.toggleDialog(id + "configBack",id + "config")}></div>
                <div id={id + "config"} className="dropdown-menu has-child has-arrow analyticsConfig">
                  <Select2 id="chosse_cluster" width={100+"%"} >
                    {configList}
                  </Select2>
                </div>
            </div>
            <div className="dropdown">
                <div id={id + "searchBack"} className="dropdown-backdrop-custom" style={{'display':'none','opacity':0}} onClick={()=>this.toggleDialog(id + "searchBack",id + "search")}></div>
                <div id={id + "search"} className="dropdown-menu has-child has-arrow analyticsSearch">
                    <input type="text" className="form-control" style={{border:'none'}} placeholder="search" />
                    <hr className="solid"/>
                </div>
            </div>
        </div>

      </section>
    );
  }
});

module.exports = DonutChart;
