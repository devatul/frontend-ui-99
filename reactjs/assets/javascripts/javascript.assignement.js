$(function () {

    var colors = [ '#5bc0de', '#349da2', '#7986cb', '#ed9c28', '#e36159'];
    var colorsHover  = [ '#DFF2F8', '#D7EBEC', '#E4E7F6', '#FBEBD4', '#F9DFDE'];

   $('#userReviewChart').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        colors: colors,
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
                          fill: colors[this.index]
                        });
                      },
                    }
                  },
                events: {
                    mouseOver: function(e){
                      var serie = this.points;
                      $.each(serie, function (i, e) {
                          this.graphic.attr({
                              fill: colorsHover[i]
                          });
                      });
                    },
                    mouseOut: function(){
                      var serie = this.points;
                      $.each(serie, function (i, e) {
                          this.graphic.attr({
                              fill: colors[i]
                          });
                      });
                    }
                }
            }
        },

        series: [{
            name: 'Documents',
            data: [{
                y: 70,
                color: '#5bc0de',
                borderColor: '#DFF2F8'
            },{
                y: 50,
                color: '#349da2',
                borderColor: '#D7EBEC'
            },{
                y: 25,
                color: '#7986cb',
                borderColor: '#E4E7F6'
            },{
                y: 20,
                color: '#ed9c28',
                borderColor: '#FBEBD4'
            },{
                y: 4,
                color: '#E36159',
                borderColor: '#F9DFDE'
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
                $('<span class="filter-label label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags');
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
});