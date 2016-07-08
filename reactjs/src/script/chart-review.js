module.exports = function() {

	  $('#choose_cluster').select2();
	  /*$('#choose_cluster').on("change", function(e) {
	    $('.cluster-block').hide();
	    $('[id="'+$(this).val()+'"]').show();
	  });*/

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

	  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	    var target = $(e.target).attr("href") // activated tab
	    if (target == '#cloud'){
	      drawCloud();
	    }
	    if (target == '#centroid'){
	      drawCentroid();
	    }
	  });

	  var word_list = new Array(
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
	  );

	  var cloudRendered = false;
	  var drawCloud = function(){
	    if (!cloudRendered){
	      $("#words-cloud").jQCloud(word_list,{
	        afterCloudRender: function(){
	          cloudRendered = true;
	        }
	      });
	    }
	  };

	  $(window).resize(function(){
	    //$('#words-cloud').jQCloud('update', word_list);
	    $('#words-cloud').css("width", "100%");
	    $('#words-cloud').html('').jQCloud(word_list) 
	  });

	  var drawCentroid = function(){
	    $('#centroidChart').highcharts({
	        chart: {
	            type:'column'
	        },
	        xAxis: {
	            startOnTick: true,
	            min: 0,
	            step: 2,
	            max: 10,
	            startOnTick: true,
	            endOnTick: true,
	            tickInterval: 1,
	        },
	        yAxis: {
	          title: {
	              text: 'Number of Documents'
	          },
	        },
	        credits: {
	          enabled: false
	        },
	        title: {
	          text: ''
	        },

	        legend: {
	          enabled: false
	        },
	        
	        plotOptions: {
	          column: {
	            stacking: 'normal',
	            dataLabels: {
	                enabled: true,
	                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                style: {
	                  textShadow: '0 0 3px black'
	                }
	            },
	            pointPadding: 0,
	            borderWidth: 1,              
	            groupPadding: 0,
	            pointPlacement: -0.5
	          }
	        },
	        
	        series: [{
	            data: [[1,1], [2,0], [3,0], [4,0], [5,3], [6,2], [7,1], [8,1], [9,0], [10,0]]
	        }]
	    });
	  };

	  if( $('#confidentialityChart').length){
	        // PIE CHART
	        var flotPieData = [{
	            label: "Public",
	            data: [
	                [1, 10]
	            ],
	            color: '#5bc0de'
	        }, {
	            label: "Internal",
	            data: [
	                [1, 20]
	            ],
	            color: '#349da2'
	        }, {
	            label: "Confidential",
	            data: [
	                [1, 10]
	            ],
	            color: '#7986cb'
	        }, {
	            label: "Secret",
	            data: [
	                [1, 10]
	            ],
	            color: '#ed9c28'
	        }, {
	            label: "Banking Secrecy",
	            data: [
	                [1, 50]
	            ],
	            color: '#E36159'
	        }];

	        var plot = $.plot('#confidentialityChart', flotPieData, {
	            series: {
	                pie: {
	                    show: true,
	                    label:{
	                      show: true,
	                      formatter: function labelFormatter(label, series) {
	                          return "<div style='font-size:8pt; max-width:60px; line-height: 12pt; text-align:center; padding:2px; color:"+series.color+"'>" + label + "</div>";
	                      }
	                    }
	                }
	            },
	            legend: {
	                show: true,
	                position: 'nw',
	                noColumns: 1, 
	                backgroundOpacity: 0 ,
	                container: $('#confidentialityChartLegend')
	            },
	            grid: {
	                hoverable: true,
	                clickable: true,
	            }
	        });
	  }

	  // if ($('#confidentialityLevelChart').length){
	  //   new Chartist.Bar('#confidentialityLevelChart', {
	  //     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
	  //     series: [
	  //       [400,420,390,410,440,400,395],
	  //       [80,100,123,90,111,85,140],
	  //       [200,210,180,188,240,250,230],
	  //       [100,99,98,130,120,140,110],
	  //       [640,700,600,800,1000,1200,1250]
	  //     ]
	  //   }, {
	  //     height: 350,
	  //     stackBars: true,
	  //     axisY: {
	  //       labelInterpolationFnc: function(value) {
	  //         return (value);
	  //       }
	  //     }
	  //   }).on('draw', function(data) {
	  //     if (data.type === 'bar') {
	  //       data.element.attr({
	  //         style: 'stroke-width: 20px'
	  //       });
	  //     }
	  //   });
	  // }

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
	        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
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
	            verticalAlign: 'bottom',
	            shadow: false,
	            useHTML: true
	        },
	        tooltip: {
	            headerFormat: '<b>{point.x}</b><br/>',
	            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: false,
	                }
	            }
	        },
	        series: [{
	            name: 'Public',
	            data: [400,420,390,410,440]
	        }, {
	            name: 'Internal',
	            data: [80,100,123,90,111]
	        }, {
	            name: 'Confidential',
	            data: [200,210,180,188,240]
	        },{
	            name: 'Secret',
	            data: [400,420,390,410,440]
	        }, {
	            name: 'Banking Secrecy',
	            data: [80,100,123,90,111]
	        }]
	    });
	  }
}