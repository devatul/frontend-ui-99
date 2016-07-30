module.exports = function(categoryInfo) {

    function addCommas(nStr)
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
    }
    if( $('#confidentialityOverviewChart').length){

        // PIE CHART
        var flotPieData = [{
            label: "Public",
            data: [
                [1, 4680]
            ],
            color: '#5bc0de'
        }, {
            label: "Internal",
            data: [
                [1, 3000]
            ],
            color: '#349da2'
        }, {
            label: "Confidential",
            data: [
                [1, 3000]
            ],
            color: '#7986cb'
        }, {
            label: "Secret",
            data: [
                [1, 3000]
            ],
            color: '#ed9c28'
        }, {
            label: "Banking Secrecy",
            data: [
                [1, 3000]
            ],
            color: '#E36159'
        }];

        var plot = $.plot('#confidentialityOverviewChart', flotPieData, {
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
                container: $('#confidentialityChartLegend'),
                  itemStyle: {
                    fontFamily: 'Roboto'
                  }
            },
            grid: {
                hoverable: true,
                clickable: true,
            },
            tooltip: {
              show: true,
              content: function(label,x,y){
                return label + ': ' +addCommas(y)+ ' Documents';
              },
            }
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
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'left',
                verticalAlign: 'bottom',
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                shadow: false,
                enabled: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y} Documents<br/>Total: {point.stackTotal} Documents'
                
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
                data: [900,900,900,900,1080]
            }, {
                name: 'Internal',
                data: [600,600,600,600,600]
            }, {
                name: 'Confidential',
                data: [600,600,600,600,600]
            },{
                name: 'Secret',
                data: [600,600,600,600,600]
            }, {
                name: 'Banking Secrecy',
                data: [600,600,600,600,600]
            }]
        });
    }
}