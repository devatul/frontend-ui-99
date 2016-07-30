module.exports = function(reviewers) {

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
    function ucwords(str){
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function (a) {
            return a.toUpperCase();
        });
    }
    var categories = [];
    
    var data=[];
    var colors = ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159', '#1DCF46', '#E00BB5', '#731C08', '#10EBE0','#B5A874','#7717D1'];
    for(var i = 0; i < reviewers.length; i++) 
    {
        var fullName = ucwords(reviewers[i].first_name) + '.'+ ucwords(reviewers[i].last_name);
        categories.push(fullName);
        data.push({
            y: reviewers[i].number_hits,
            color: colors[i]
        });
    }
        
    $('#userReviewChart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            colors: colors,
            xAxis: {
                categories: categories,
                title: {
                    text: null
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
                    text: null
                },
                labels: {
                  enabled: false
                }
            },
            legend: {
              enabled:  false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
            name: 'Classification',
            data: data
        }]
    });

        
}