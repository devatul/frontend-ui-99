module.exports = function(data) {
        //chart pie confidentiality
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
        var plot = $.plot('#flotPie', data.data_confidentiality, {
            series: {
                pie: {
                    show: true,
                    radius:0.8,
                    innerRadius: 0.4
                    
                }
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 3,
                container:$("#legendContainer"),       
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: {
              show: true,
              content: function(label,x,y){
                return label + ': ' +addCommas(y) + ' Documents';
              },
            }
        });
        if(data.data_confidentiality.length <= 1){
            $("#legendContainerCensord1").css("display","");
        }else{
            $("#legendContainerCensord1").css("display","none");
        }
        //chart pie category
        var plot = $.plot('#flotPie2', data.data_categories, {
            series: {
                pie: {
                    show: true,
                    radius:0.8,
                    innerRadius: 0.6,
                }
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 3,
                container:$("#legendContainer2"),       
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: {
              show: true,
              content: function(label,x,y){
                return label + ': ' + addCommas(y) + ' Documents';
              },
            }
        });
        //chart pie languages
        if(data.data_languages.length > 1){
            $("#flotPie2Inner").css("display","");
            $.plot('#flotPie2Inner', data.data_languages, {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        innerRadius: 0.4,
                    }
                },
                legend: {
                    show: true,
                    position: 'sw',
                    noColumns: 1,
                    container:$("#legendContainer2Inner"),       
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: {
                  show: true,
                  content: function(label,x,y){
                    return label + ': ' +addCommas(y) +' Documents';
                  },
                }
            });
        }else{
            $.plot('#flotPie2Inner', data.data_languages, {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        innerRadius: 0.4,
                    }
                },
                legend: {
                    show: true,
                    position: 'sw',
                    noColumns: 1,
                    container:$("#legendContainer2Inner"),       
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: {
                  show: true,
                  content: function(label,x,y){
                    return label + ': ' +addCommas(y) +' Documents';
                  },
                }
            });
            $("#flotPie2Inner").css("display","none");
            var plot = $.plot('#flotPie2', data.data_categories, {
                series: {
                    pie: {
                        show: true,
                        radius:0.8,
                        innerRadius: 0.4,
                    }
                },
                legend: {
                    show: true,
                    position: 'sw',
                    noColumns: 3,
                    container:$("#legendContainer2"),       
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: {
                  show: true,
                  content: function(label,x,y){
                    return label + ': ' + addCommas(y) + ' Documents';
                  },
                }
            });
        }
        //chart pie doctypes
         var plot = $.plot('#flotPie3', data.data_doctypes, {
            series: {
                pie: {
                    show: true,
                    radius:0.8,
                    innerRadius: 0.4,
                    // label: {
                    //     show: true,
                    //     radius: 1/2,
                    //     formatter: function (label, series) {
                    //         return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                    //     },
                    //     threshold: 0.1
                    // }
                }
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 5,
                container:$("#legendContainer3"), 
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: {
              show: true,
              content: function(label,x,y){
                return label + ': ' +addCommas(y)  + ' Documents';
              },
            }
        });
         if(data.data_doctypes.length <= 1){
            $("#legendContainerCensord3").css("display","");
        }else{
            $("#legendContainerCensord3").css("display","none");
        }
          if(data.data_languages.length <= 1 && data.data_categories.length <= 1){
            $("#legendContainerCensord2").css("display","");
        }else{
            $("#legendContainerCensord2").css("display","none");
        }
        
}