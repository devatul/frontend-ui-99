module.exports = function() {
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
            categories: ['Public', 'Internal', 'Confidential', 'Secret', 'Banking Secrecy' ],
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
            shadow: false,
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y} Documents'
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: 'Classification',
            data: [{
                y: 80,
                color: '#5bc0de'
            },{
                y: 100,
                color: '#349da2'
            },{
                y: 123,
                color: '#7986cb'
            },{
                y: 90,
                color: '#ed9c28'
            },{
                y: 111,
                color: '#E36159'
            }]
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
            tickmarkPlacement: 'on',
            labels: {
                style: {
                    font: '11px Roboto, Helvetica, sans-serif'
                }
            }
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
            name: 'Documents',
            data: [{
                y: 70,
                color: '#5bc0de'
            },{
                y: 50,
                color: '#349da2'
            },{
                y: 25,
                color: '#7986cb'
            },{
                y: 20,
                color: '#ed9c28'
            },{
                y: 4,
                color: '#E36159'
            }]
        }]
    });

    $("div.off").click(function(){
        $(this).toggleClass("on");
    });

    $('.assignent-select').on('change', function(){
        var selectedOption = $(this).find('option:selected').text();
        var filterCriteria = $(this).attr('name');
          if(selectedOption) {
            if ($('[data-crit="'+filterCriteria+'"]').length){
                $('[data-crit="'+filterCriteria+'"]').find('.option-name').text(selectedOption);
            }
            else{
                $('<span class="filter-label-assign label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove-assign"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags-userassign');
            }
          }
          else{
              $('.filter-label[data-value="'+selectedOption+'"]').remove();
        }
    });

    $('.sample-params select').on('change', function(){
        $(this).next().find('i').addClass('icon-success');
    });

    $('.btn-next-cat').on('click', function(){
        $('.cat-list > .active').next('li').find('a').trigger('click');
    });
    $('body').on('click', '.filter-remove-assign', function(){
      var filterCriteria = $(this).parents('.filter-label').attr('data-crit');
      var value = $(this).parents('.filter-label').attr('data-value');
      $(this).parents('.filter-label-assign').remove();
      var a = $('.select-multiple[name="'+filterCriteria+'"]').multiselect('deselect', [value]).change();
      console.log("ddddddddddds", a);
    });
}