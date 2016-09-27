$(function () {

    var colors = [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'];
    var colorsHover  = [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];

    var colorsRev = [ 
        '#5bbfe1', 
        '#8cc1d1', 
        '#b0d6e1', 
        '#349da1', 
        '#8ababc',
        '#aecccc',
        '#7986cc',
        '#a5aaca',
        '#c0c4df',
        '#e46159',
        '#e4a5a0',
        '#f2cac8',
        '#ed9c27',
        '#fbc481',
        '#f0d3ab',
        '#5a94de',
        '#8fbaed',
        '#c3d8f5',
        '#de5a7f',
        '#e58da5',
        '#efaabd',
        '#de795d',
        '#e89f8c',
        '#e5bdb3',
        '#96a0a2',
        '#b2b6b9',
        '#c0c8ca',
        '#5aded0',
        '#8fdfd6',
        '#aeede5',
    ];
    var colorsRevHover = [ 
        '#dcf1f9', 
        '#f9fcfd', 
        '#fafcfd', 
        '#6ccccf', 
        '#cbe0e1',
        '#edf3f3',
        '#c3c9e8',
        '#e5e7f0',
        '#e2e4f0',
        '#f2b5b1',
        '#e4a5a0',
        '#fcf2f1',
        '#f5c785',
        '#fef2e4',
        '#f8ead6',
        '#afcbef',
        '#e7f0fb',
        '#eff4fc',
        '#efafc1',
        '#f8e0e7',
        '#f7d5de',
        '#efbfb2',
        '#f9e6e1',
        '#f2ded9',
        '#ccd1d2',
        '#e7e9ea',
        '#dce0e1',
        '#afefe8',
        '#def6f3',
        '#d8f6f2',
    ];

    var reviewData = [{
        y: 70,
    },{
        y: 66,
    },{
        y: 64,
    },{
        y: 63,
    },{
        y: 62,
    },{
        y: 58,
    },{
        y: 54,
    },{
        y: 48,
    },{
        y: 45,
    },{
        y: 41,
    },{
        y: 40,
    },{
        y: 38,
    },{
        y: 36,
    },{
        y: 29,
    },{
        y: 25,
    },{
        y: 22,
    },{
        y: 18,
    },{
        y: 15,
    },{
        y: 14,
    },{
        y: 13,
    },{
        y: 12,
    },{
        y: 11,
    },{
        y: 10,
    },{
        y: 9,
    },{
        y: 8,
    },{
        y: 7,
    },{
        y: 6,
    },{
        y: 5,
    },{
        y: 3,
    },{
        y: 1,
    }];

   $('#userReviewChart').highcharts({
        chart: {
            type: 'bar',
            height: (reviewData.length + 1) * 35,
            events: {
                load: function () {
                    var chart = this;
                    var serie = chart.series[0].points;
                    $.each(serie, function (i, e) {
                        this.graphic.attr({
                            fill: colorsRev[i]
                        });
                    });
                }
            }
        },
        title: {
            text: ''
        },
        colors: colorsRev,
        xAxis: {
            categories: ['todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat', 'todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat', 'todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat', 'todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat', 'todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat', 'todd.smith', 'tony.gomes', 'stan.siow', 'matt.nixon', 'chris.muffat'],
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
                pointWidth: 15,
                pointPadding: 0,
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
                states: {
                    hover: {
                        brightness: 0,
                    }
                },
                point:  {
                    events: {
                      mouseOver: function(event){
                        this.graphic.attr({
                          fill: colorsRev[this.index]
                        });
                      },
                    }
                  },
                events: {
                    mouseOver: function(e){
                      var serie = this.points;
                      $.each(serie, function (i, e) {
                          this.graphic.attr({
                              fill: colorsRevHover[i]
                          });
                      });
                    },
                    mouseOut: function(){
                      var serie = this.points;
                      $.each(serie, function (i, e) {
                          this.graphic.attr({
                              fill: colorsRev[i]
                          });
                      });
                    }
                }
            }
        },

        series: [{
            name: 'Documents',
            data: reviewData
        }]
    });
    
    if ($('#confidentialityLevelChartHorizon').length){
        $('#confidentialityLevelChartHorizon').highcharts({
            chart: {
                type: 'bar'
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
                //headerFormat: '<b>{point.x}</b><br/>',
                headerFormat: '',
                decimalPoints: 2,
                //pointFormat: '{series.name}: {point.percentage:.1f}% / {point.y} Documents<br/>Total: {point.stackTotal} Documents'
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}' 
            },
            plotOptions: {
                bar: {
                    stacking: 'normal',
                    pointWidth: 18,
                    pointPadding: 0,
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false,
                    },
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


    $(".ios-switch.off").not('.select-all').click(function(){
        $(this).toggleClass("on");
        $('.ios-switch').not('.select-all').each(function(){
            if ($(this).hasClass('off')){
                $('.ios-switch.select-all').removeClass('on');
            }
        });
    });

    $('.select-all').click(function(){
        $(this).toggleClass("on");
        setTimeout(function(){
            if ($('.select-all').hasClass('on')){
                $('.ios-switch.off').not('.select-all').addClass('on');
            }
            else{
                $('.ios-switch.off').not('.select-all').removeClass('on');
            }
        }, 10);
    });

    // if ($('.assigment-select').length){
    //   $('.assigment-select').each(function(){
    //       var buttonText = $(this).attr('data-title');
    //       $(this).multiselect({
    //           buttonText: function(options, select) {
    //               return buttonText;
    //           },
    //           onDropdownShow: function(event){
    //             var dropdown = $(event.target).find('.dropdown-menu');
    //             var dropdownHeight = dropdown.height();
    //             var parentDropdown = dropdown.parents('.dropdown-menu.has-child');
    //             var newHeight = parentDropdown.height() + dropdownHeight + 40;
    //             parentDropdown.css('height', newHeight);
    //           },
    //           onDropdownHide: function(event){
    //             var dropdown = $(event.target).find('.dropdown-menu');
    //             var parentDropdown = dropdown.parents('.dropdown-menu.has-child');
    //             parentDropdown.css('height', '');
    //           },
    //           onChange: function(option, checked){
    //               var selectedOption = $(option).val();
    //               var filterCriteria = $(this).attr('name');
    //               if(selectedOption) {
    //                 if ($('[data-crit="'+filterCriteria+'"]').length){
    //                     $('[data-crit="'+filterCriteria+'"]').find('.option-name').text(selectedOption);
    //                 }
    //                 else{
    //                     $('<span class="filter-label label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags');
    //                 }
    //               }
    //               else{
    //                   $('.filter-label[data-value="'+selectedOption+'"]').remove();
    //             }
    //             if ($('.filter-tags .filter-label').length){
    //               $('.filter-clear').show();
    //             }
    //             else{
    //               $('.filter-clear').hide();
    //             }
    //           }
    //       });
    //   });
    // }

    $('.assigment-select').on('change', function(){
        var selectedOption = $(this).find('option:selected').text();
        var filterCriteria = $(this).attr('name');
          if(selectedOption) {
            if ($('[data-crit="'+filterCriteria+'"]').length){
                $('[data-crit="'+filterCriteria+'"]').find('.option-name').text(selectedOption);
            }
            else{
                $('<span class="filter-label label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags');
            }
          }
          else{
              $('.filter-label[data-value="'+selectedOption+'"]').remove();
        }
        if ($('.filter-tags .filter-label').length){
          $('.filter-clear').show();
        }
        else{
          $('.filter-clear').hide();
        }
    });

    $('.sample-params select').on('change', function(){
        $('.sample-params .validation-btn i').removeClass('icon-success');
        $(this).next().find('i').addClass('icon-success');
    });

    $('body').on('click', '.sample-params .validation-btn', function(e){
        e.preventDefault();
        $('.sample-params .validation-btn i').removeClass('icon-success');
        $(this).find('i').addClass('icon-success');
    });

    $('.btn-next-cat').on('click', function(){
        $('.cat-list > .active').next('li').find('a').trigger('click');
    });
});