$(function () {

  var previousPoint = null;

  $('#choose_cluster').select2({
    minimumResultsForSearch: Infinity,
    containerCssClass: "dathena-select",
    adaptDropdownCssClass: function(){
      return "dathena-select-dropdown";
    }
  });
  $('#choose_cluster').on("change", function(e) {
    $('.cluster-block').hide();
    $('[id="'+$(this).val()+'"]').show();
  });

  if ($('#meter').length){
    $('#meter').liquidMeter({
      shape: 'circle',
      color: '#0088CC',
      background: '#F9F9F9',
      fontSize: '24px',
      fontWeight: '600',
      stroke: '#F2F2F2',
      textColor: '#333',
      liquidOpacity: 0.9,
      liquidPalette: ['#333'],
      speed: 3000,
      animate: !$.browser.mobile
    });
  }

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") // activated tab
    if (target == '#cloud'){
      $(window).resize();
    }
    if (target == '#centroid'){
      drawCentroid();
    }
  });

  var word_list = new Array(
    {text: "Entity", weight: 13, html: {"data-tooltip": "1300 Documents"}},
    {text: "matter", weight: 10.5, html: {"data-tooltip": "1134 Documents"}},
    {text: "science", weight: 9.4, html: {"data-tooltip": "999 Documents"}},
    {text: "properties", weight: 8, html: {"data-tooltip": "676 Documents"}},
    {text: "speed", weight: 6.2, html: {"data-tooltip": "444 Documents"}},
    {text: "Accounting", weight: 5, html: {"data-tooltip": "777 Documents"}},
    {text: "interactions", weight: 5, html: {"data-tooltip": "35 Documents"}},
    {text: "nature", weight: 5, html: {"data-tooltip": "535 Documents"}},
    {text: "branch", weight: 5, html: {"data-tooltip": "535 Documents"}},
    {text: "concerned", weight: 4, html: {"data-tooltip": "334 Documents"}},
    {text: "Sapien", weight: 4, html: {"data-tooltip": "200 Documents"}},
    {text: "Pellentesque", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "habitant", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "morbi", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "tristisque", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "senectus", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "et netus", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "et malesuada", weight: 3, html: {"data-tooltip": "13 Documents"}},
    {text: "fames", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "ac turpis", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "egestas", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "Aenean", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "vestibulum", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "elit", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "sit amet", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "metus", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "adipiscing", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "ut ultrices", weight: 2, html: {"data-tooltip": "13 Documents"}},
    {text: "justo", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "dictum", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "Ut et leo", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "metus", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "at molestie", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "purus", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "Curabitur", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "diam", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "dui", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "ullamcorper", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "id vuluptate ut", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "mattis", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "et nulla", weight: 1, html: {"data-tooltip": "13 Documents"}},
    {text: "Sed", weight: 1, html: {"data-tooltip": "13 Documents"}}
  );

  var cloudRendered = false;
  var drawCloud = function(){
    if (!cloudRendered && $("#words-cloud").length){
      $("#words-cloud").jQCloud(word_list,{
        afterCloudRender: function(){
          cloudRendered = true;

          $("[data='tooltip']").tooltip();
        }
      });
    }
  };

  drawCloud();

  var timeout;
  $(window).resize(function(){
    //$('#words-cloud').jQCloud('update', word_list);
    clearTimeout(timeout);
    timeout = setTimeout(function(){
      $('#words-cloud').css("width", "100%");
      $('#words-cloud').html('').jQCloud(word_list);


    }, 100);
  });

  var colorsCentroid = [ '#45A446', '#98A33A', '#DAA525', '#EC892B', '#E15E29', '#D0352D', '#D0352D'];
  var drawCentroid = function(){
    if ($('#centroidChart').length){
      $('#centroidChart').highcharts({
        chart: {
          polar: true,
          events: {
            load: function () {
              var chart = this;
              $(chart.series).each(function (i, serie) {
                var documentNum = serie.data[1].document;
                var distance = parseInt((Math.abs(serie.data[0].y)+5)/5);
                var points = serie.points;
                serie.color = colorsCentroid[distance-1];
                serie.graph.attr({ 
                    stroke: colorsCentroid[distance-1]
                });
                serie.options.marker.radius = documentNum*3+1;
                serie.options.marker.states.hover.radius = documentNum*3+2;
                $.each(points, function (i, e) {
                    var pt = e;
                    pt.color = colorsCentroid[distance-1];
                    pt.fillColor = colorsCentroid[distance-1];
                });
                serie.redraw();
              });
            }
          }
        },

        credits: {
          enabled: false
        },

        title: {
          text: null
        },

        pane: {
          startAngle: -90,
          endAngle: 90
        },

        xAxis: {
          tickInterval: 90,
          min: 0,
          max: 360,
          labels: {
            enabled: false
          },
          plotLines: [{
            color: '#BFDDF7',
            width: 2,
            value: [0, 2],
            zIndex: 1
          }]
        },

        yAxis: {
          min: -5,
          tickInterval: 5,
          plotBands: [{
            from: 0,
            to: 5,
            color: '#EDEDED'
          },{
            from: 5,
            to: 10,
            color: '#F2F2F2'
          },{
            from: 10,
            to: 15,
            color: '#F7F7F7'
          },{
            from: 15,
            to: 20,
            color: '#FCFCFC'
          }],
          labels: {
            formatter: function() {
              return this.value >= 0 ? this.value : null;
            },
          }
        },

        plotOptions: {
          series: {
            pointStart: 0,
            pointInterval: 45
          },
          column: {
            pointPadding: 0,
            groupPadding: 0
          },
          line: {
            //lineWidth: 0
          }
        },

        legend:{
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return 'Documents:'+ this.series.data[1].document + '<br>' +'Distance:' + this.y;
          },
          useHTML: true
        },

        series: [{
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [
            [10, 3], 
            {
              x: 10,
              y: 0,
              document: 1,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [   
            [90, 3], 
            {
              x: 90,
              y: 0,
              document: 1,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [   
            [120, 5], 
            {
              x: 120,
              y: 0,
              document: 3,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          }, 
          data: [  
            [180, 8], 
            {
              x: 180,
              y: 0,
              document: 1,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [   
            [210, 10], 
            {
              x: 210,
              y: 0,
              document: 2,
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
        },{
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [   
            [270, 12], 
            {
              x: 270,
              y: 0,
              document: 2,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [   
            [290, 15], 
            {
              x: 290,
              y: 0,
              document: 4,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [ 
            [310, 18], 
            {
              x: 310,
              y: 0,
              document: 1,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [  
            [330, 19], 
            {
              x: 330,
              y: 0,
              document: 5,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }, {
          type: 'scatter',
          lineWidth: 2,
          marker: {
            symbol: 'circle'
          },
          data: [  
            [350, 22], 
            {
              x: 350,
              y: 0,
              document: 1,
              marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
              }
            },
            null]
          }]

      });
    }
  };

  drawCentroid();

  var colors = [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'];
  var colorsHover  = [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];
  var confidentialityChartData = [{
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
  }];

  var div = $('#confidentialityChart');
  var parentDiv = div.hasClass('legend-under') ? div.closest('[class^="col-"') : div.closest('.tab-pane');
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
                  var serieDiv = $('<ul class="list-unstyled chart-legend" id="confidentialityChartLegend"></ul>').appendTo(parentDiv);
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
        useHTML: true,
        formatter: function() {
          return '<div class="custom-tooltip">' + this.point.name + ' :'+ this.point.percentage + '% / ' + this.y + ' Documents</div>';
        },
      },
      plotOptions: {
        pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            colors: colors,
            dataLabels: {
                enabled: true,
                connectorWidth: 0,
                distance: 5,
                formatter: function () {
                  return '<span style="color:' + this.point.color + '">' + this.point.name + '</span>';
                }
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

                  var series = this.series;
                  $.each(series.data, function(i, e){
                    e.graphic.attr({
                        fill: colorsHover[i]
                    });
                  });

                  this.graphic.attr({
                    fill: colors[this.index]
                  });
                }
              }
            },
            events: {
              mouseOver: function(){
                var serie = this.points;
                $.each(serie, function (i, e) {
                    this.graphic.attr({
                        fill: colorsHover[i]
                    });
                });
              },
              mouseOut: function(){
                var serie = this.points;
                $.each(serie, function (i, e) {
                    this.graphic.attr({
                        fill: colors[i]
                    });
                });
              }
            }
        },
      },
      
      legend: {
        enabled: false
      },
      series: [{
        colorByPoint: true,
        data: confidentialityChartData
      }]
    });
  }

  if ($('#confidentialityLevelChart').length){
    $('#confidentialityLevelChart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        credits: {
          enabled: false
        },
        colors: colors,
        xAxis: {
            categories: ['Word', 'Excel', 'PDF', 'Power Point', 'Other'],
            labels:{
              autoRotation: false,
              style: {
                color: '#272727',
                'font-size': '10px'
              },
            },
            tickInterval: 1,
            tickWidth: 0,
            lineWidth: 0,
            minPadding: 0,
            maxPadding: 0,
            gridLineWidth: 0,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            },
            stackLabels: {
                enabled: false
            }
        },
        legend: {
          enabled: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            decimalPoints: 2,
            pointFormat: '{series.name}: {point.percentage:.1f}% / {point.y} Documents<br/>Total: {point.stackTotal} Documents'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                },
                point: {
                  events: {
                    mouseOver: function(){
                      console.log(this);
                      var columnIndex = this.index;
                    }
                  }
                },
                events: {
                  mouseOver: function(){
                    console.log(this);
                    // var serie = this.points;
                    // $.each(serie, function (i, e) {
                    //     this.graphic.attr({
                    //         fill: colorsHover[i]
                    //     });
                    // });
                  },
                  mouseOut: function(){
                    var serie = this.points;
                    // $.each(serie, function (i, e) {
                    //     this.graphic.attr({
                    //         fill: colors[i]
                    //     });
                    // });
                  }
                }
            }
        },
        series: [{
            name: 'Public',
            data: [400,420,390,410, 414]
        }, {
            name: 'Internal',
            data: [80,100,123,90, 300]
        }, {
            name: 'Confidential',
            data: [200,210,180,188, 310]
        },{
            name: 'Secret',
            data: [400,420,390,410, 404]
        }, {
            name: 'Banking Secrecy',
            data: [80,100,123,90, 111]
        }]
    });
  }

  $('.btn-refine').on('click', function(e){
    e.preventDefault();
    $(this).removeClass('btn-green').addClass('btn-disabled');
    $(this).parent().find('.refine-progress').show();
  });


  //FIle distribution chart
  var totalFileNumber = 0;
  $('.file-distribution .item').each(function(){
    totalFileNumber += parseInt($(this).attr('data-value'));
  });
  $('.file-distribution .item').each(function(){
    var thisValue = parseInt($(this).attr('data-value'));
    var thisPercent = ( thisValue / totalFileNumber )*100;
    $(this).css('width', thisPercent.toFixed(2)+ '%');
  });
  $('.file-distribution').show();
});