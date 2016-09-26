$(function () {


  var colors = [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'];
  var colorsHover  = [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];
  var colorsInner = [ '#2ecd71', '#9b58b5', '#33495e'];
  var colorsInnerHover  = [ '#94e5b7', '#ccaada', '#98a2ad'];
  var colorDisabled = ['#D7D8DA', '#CBCCCE', '#CFCED3', '#D8D7DC', '#CECFD1'];

  var fullCharts = [{
      id: 'confidentialityPieChart',
      innerSize: '60%',
      data: [{
        name: 'Public',
        y: 50
      }, {
          name: 'Internal',
          y: 25,
      }, {
          name: 'Confidential',
          y: 15
      }, {
          name: 'Secret',
          y: 6
      }, {
          name: 'Banking Secrecy',
          y: 4
      }],
    },{
      id: 'documentPieChart',
      innerSize: '60%',
      data: [{
        name: 'Word',
        y: 50
      }, {
          name: 'Excel',
          y: 25,
      }, {
          name: 'PDF',
          y: 15
      }, {
          name: 'Power Point',
          y: 6
      }, {
          name: 'Other',
          y: 4
      }],
    },{
      id: 'languagePieChart',
      innerSize: '60%',
      data: [{
          name: 'EN',
          y: 66
      }, {
          name: 'FR',
          y: 25
      }, {
          name: 'DE',
          y: 9
      }],
    }
  ];

  var stackedCharts =[{
    id: 'categoryLanguagePieChart',
    series: [{
      name: 'category',
      innerSize: '80%',
      colors: colors,
      data: [{
        name: 'Accounting/ Tax',
        y: 50
      }, {
          name: 'Corporate Entity',
          y: 25,
      }, {
          name: 'Transaction',
          y: 15
      }, {
          name: 'Legal/ Compliance',
          y: 6
      }, {
          name: 'Employee',
          y: 4
      }],
    }, {
      name: 'language',
      size: '80%',
      innerSize: '60%',
      colors: colorsInner,
      data: [{
        name: 'EN',
        y: 66
      }, {
        name: 'FR',
        y: 25,
      }, {
        name: 'DE',
        y: 9
      }],
    }],
  }];
  // Build the chart
  var renderFullPieChart = function(chart){
    var div = $('#'+chart.id);
    var parentDiv = div.parent();
    var colorsChart =  chart.id ==  'languagePieChart' ? colorsInner : colors;
    var colorsChartHover = chart.id ==  'languagePieChart' ? colorsInnerHover : colorsHover;
    if (div.length){
      div.highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: null,
          events: {
            load: function () {
              var chart = this;

              if (div.parents('.widget-panel').find('.chart-disabled-overlay').length){
                var serie = chart.series[0].points;
                $.each(serie, function (i, e) {
                    this.graphic.attr({
                        fill: colorDisabled[i]
                    });
                });
              }

              $(chart.series).each(function (i, serie) {
                var serieDiv = $('<ul class="list-unstyled chart-legend serie-'+i+'"></ul>').appendTo(parentDiv);
                if (div.parents('.widget-panel').find('.chart-disabled-overlay').length){
                  var points = serie.points;
                  $.each(points, function (i, e) {
                    console.log(e);
                      this.graphic.attr({
                          fill: colorDisabled[i]
                      });
                      $('<li><i class="legend-symbol" style="background-color: ' + colorDisabled[i] + '"></i>' + e.name + '</li>').appendTo(serieDiv);
                  });
                }
                else{
                  $.each(serie.data, function(i, point){
                    $('<li><i class="legend-symbol" style="background-color: ' + point.color + '"></i>' + point.name + '</li>').appendTo(serieDiv);
                  })
                }
              });
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
          pointFormat: 'Documents: {point.y}'
        },
        plotOptions: {
          pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              colors: colorsChart,
              dataLabels: {
                  enabled: false
              },
              states: {
                  hover: {
                      brightness: 0,
                  }
              },
              showInLegend: true,
              point:  {
                events: {
                  mouseOver: function(event){
                    this.graphic.attr({
                      fill: colorsChart[this.index]
                    });
                  },
                }
              },
              events: {
                mouseOver: function(e){
                  var serie = this.points;
                  $.each(serie, function (i, e) {
                      this.graphic.attr({
                          fill: colorsChartHover[i]
                      });
                  });
                },
                mouseOut: function(){
                  var serie = this.points;
                  $.each(serie, function (i, e) {
                      this.graphic.attr({
                          fill: colorsChart[i]
                      });
                  });
                }
              }
          },
        },
        legend: {
          enabled: false,
        },
        series: [{
          colorByPoint: true,
          innerSize: chart.innerSize,
          data: chart.data
        }]
      });
    }
  };
  var renderStackedPieChart = function(chart){
    var div = $('#'+chart.id);
    var parentDiv = div.parent();
    if (div.length){
      div.highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          backgroundColor: null,
          events: {
            load: function () {
                  var chart = this;
                  $(chart.series).each(function (i, serie) {
                    var serieDiv = $('<ul class="list-unstyled chart-legend serie-'+i+'"></ul>').appendTo(parentDiv);
                    $.each(serie.data, function(i, point){
                      $('<li><i class="legend-symbol" style="background-color: ' + point.color + '"></i>' + point.name + '</li>').appendTo(serieDiv);
                    })
                  });
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
          pointFormat: 'Documents: {point.y}'
        },
        plotOptions: {
          pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              colors: colorsInner,
              dataLabels: {
                  enabled: false
              },
              states: {
                  hover: {
                      brightness: 0,
                  }
              },
              showInLegend: true,
              point:  {
                events: {
                  mouseOver: function(event){
                    var thisColor = this.series.name == 'category' ?  colors : colorsInner;
                    this.graphic.attr({
                      fill: thisColor[this.index]
                    });
                  }
                }
              },
              events: {
                mouseOver: function(){
                  var serie = this.points;
                  console.log(serie);
                  $.each(serie, function (i, e) {
                    var thisColor = e.series.name == 'category' ?  colorsHover : colorsInnerHover;
                    console.log(thisColor);
                      this.graphic.attr({
                          fill: thisColor[i]
                      });
                  });
                },
                mouseOut: function(){
                  var serie = this.points;
                  $.each(serie, function (i, e) {
                      var thisColor = e.series.name == 'category' ?  colors : colorsInner;
                      this.graphic.attr({
                          fill: thisColor[i]
                      });
                  });
                }
              }
          },
        },
        
        legend: {
          enabled: false
        },
        series: chart.series
      });
    }
  };

  $.each(fullCharts,function(index){
    renderFullPieChart(fullCharts[index]);
  });
  $.each(stackedCharts,function(index){
    renderStackedPieChart(stackedCharts[index]);
  });

  // });
  var renderFilterBlock = function(){
    if ($('.filter-tags .filter-label').length){
      $('.filter-tags-block label').show();
      $('.filter-clear').show();
    }
    else{
      $('.filter-tags-block label').hide();
      $('.filter-clear').hide();
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
              onDropdownShow: function(event){
                var dropdown = $(event.target).find('.dropdown-menu');
                var dropdownHeight = dropdown.height();
                var parentDropdown = dropdown.parents('.dropdown-menu.has-child');
                var newHeight = parentDropdown.height() + dropdownHeight + 40;
                parentDropdown.css('height', newHeight);
              },
              onDropdownHide: function(event){
                var dropdown = $(event.target).find('.dropdown-menu');
                var parentDropdown = dropdown.parents('.dropdown-menu.has-child');
                parentDropdown.css('height', '');
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

  $('body').on('click', '.filter-clear', function(){
    $('.filter-label').not($(this)).remove();
    $('.select-multiple').multiselect('deselectAll', false);
    renderFilterBlock();
  });

});