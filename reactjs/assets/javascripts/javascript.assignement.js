$(function () {

  if ($('#confidentialityOverviewChart').length){
    $('#confidentialityOverviewChart').highcharts({
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
            categories: ['Unrestricted', 'Internal', 'Confidential', 'Secret', 'Banking Secrecy' ],
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
            }
        },
        legend: {
            align: 'left',
            verticalAlign: 'bottom',
            floating: false,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: 'Confidentiality Overview',
            data: [80,100,123,90,111]
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
        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
        xAxis: {
            categories: ['txt', 'log', 'rtf', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'xlsm', 'ppt', 'pptx', 'msg', 'eml'],
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
                enabled: true,
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
            shadow: false
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
            name: 'Unrestricted',
            data: [400,420,390,410,440,400,395,80,100,123,90,111,85]
        }, {
            name: 'Internal',
            data: [80,100,123,90,111,85,140,210,180,188,240,250,230]
        }, {
            name: 'Confidential',
            data: [200,210,180,188,240,250,230,390,410,440,400,395,80]
        },{
            name: 'Secret',
            data: [400,420,390,410,440,400,395,100,123,90,111,85,140]
        }, {
            name: 'Banking Secrecy',
            data: [80,100,123,90,111,85,140,440,400,395,80,100,123]
        }]
    });
  }

   $('#userReviewChart').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        colors: ['#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#E36159'],
        xAxis: {
            categories: ['todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat'],
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
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
          enabled:  false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                pointWidth: 20,
                groupPadding: 0.1,
                pointPadding: 0,
            }
        },

        series: [{
            data: [25,50,2,73,55]
        }]
    });

$("div.off").click(function(){
    $(this).toggleClass("on");
  });

});