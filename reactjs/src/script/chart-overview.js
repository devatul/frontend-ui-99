module.exports = function(data) {
        //chart pie confidentiality
        function addCommas(nStr)
        {
            nStr += '';
            var num = nStr.split('.');
            var x1 = num[0];
            var x2 = num.length > 1 ? '.' + num[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
              x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

        $.plot('#flotPie', data.data_confidentiality, {
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
              content: function(label, xval, yval, flotitem) {
                return label + ': ' + addCommas(yval) + ' Documents';
              }
            }
        });
        if(data.data_confidentiality.length <= 1){
            $("#legendContainerCensord1").css("display","");
        }else{
            $("#legendContainerCensord1").css("display","none");
        }
        //chart pie category and languages
        var categoryConfig = {
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
        };
        var languagesConfig = {
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
            };

        if(data.data_categories.length > 1 && data.data_languages.length > 1) {
            $.plot('#flotPie2', data.data_categories, categoryConfig);
            $('#flotPie2').css('display', '');

            $.plot('#flotPie2Inner', data.data_languages, languagesConfig);
            $('#flotPie2Inner').css('display', '');
            $('#legendContainer2Inner').css('display', '');
        }
        if(data.data_languages.length > 1 && data.data_categories.length <= 1){

            var languagesConfig2 = {
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
                    noColumns: 5,
                    container:$("#legendContainer2"), 
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                tooltip: {
                  show: true,
                  content: function(label,x,y,z){
                    return label + ': ' +addCommas(y)  + ' Documents';
                  },
                }
            };
            
            $.plot('#flotPie2', data.data_languages, languagesConfig2);
            $('#flotPie2').css('display', '');
            $('#flotPie2Inner').css('display', 'none');
            $('#legendContainer2Inner').css('display', 'none');
        }
        if(data.data_categories.length > 1 && data.data_languages.length <= 1){
            var categoryConfig2 = {
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
                  content: function(label,x,y,z){
                    return label + ': ' +addCommas(y)  + ' Documents';
                  },
                }
            };
            $.plot('#flotPie2', data.data_categories, categoryConfig2);
            $('#flotPie2Inner').css('display', 'none');
            $("#legendContainer2Inner").css('display', 'none');

        }
        
        //chart pie doctypes
        var doctypeConfig = {
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
                noColumns: 5,
                container:$("#legendContainer3"), 
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: {
              show: true,
              content: function(label,x,y,z){
                return label + ': ' +addCommas(y)  + ' Documents';
              },
            }
        };
        $.plot('#flotPie3', data.data_doctypes, doctypeConfig);
        if(data.data_doctypes.length <= 1){
            $("#legendContainerCensord3").css("display","");
        }else{
            $("#legendContainerCensord3").css("display","none");
        }
        
}