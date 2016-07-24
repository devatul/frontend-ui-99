module.exports = function(data) {
        //chart pie confidentiality
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
                return label + ': ' +y + ' Documents';
              },
            }
        });
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
                return label + ': ' +y + ' Documents';
              },
            }
        });
        //chart pie languages
        $.plot('#flotPie2Inner', data.data_languages, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    innerRadius: 0.6,
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
                return label + ': ' +y+' Documents';
              },
            }
        });
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
                return label + ': ' +y + ' Documents';
              },
            }
        });
}