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
    var confidentialities = [];
    var doc_type=[];
    //var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];
    for(var i = 0; i < categoryInfo.doc_type.length; i++) 
    {
        var start = [];
        for(var j=0; j < categoryInfo.doc_type[i].types.length; j++){
            start.push(categoryInfo.doc_type[i].types[j].number);
        }
        doc_type.push({
            name: categoryInfo.doc_type[i].name,
            data: start
        });
    }
    if( $('#confidentialityOverviewChart').length){
        var flotPieData = [];
        var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'];
            for(var i = 0; i < categoryInfo.confidentialities.length; i++) {
                var name = categoryInfo.confidentialities[i].name;
                flotPieData.push({
                    label: name,
                    data: [
                        [1, categoryInfo.confidentialities[i].number]
                    ],
                    color: colors[i]
                });
            }
        }

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
                container: $('#confidentialityChartLegend')
            },
            grid: {
                hoverable: true,
                clickable: true,
            },
            tooltip: {
              show: true,
              content: function(label,x,y){
                return label + ': %p.0% / ' +y + ' Documents';
              }
            }
        });
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
            colors : ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
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
            series: doc_type
        });
    }
}