$(function(){

  // CHART
  var datas = [
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 45, color: '#7986cb'},{y: 40, color: '#ed9c28'},{y: 10, color: '#E36159'}]
    },
    {
      categories: ['ADCompl.WE', 'ADHR.WR', 'ADHR.WR', 'ADHR.WR', 'ADHR.WR'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
    },
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
    },
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
    },
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 35, color: '#349da2'},{y: 20, color: '#7986cb'},{y: 10, color: '#ed9c28'},{y: 4, color: '#E36159'}]
    },
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 40, color: '#7986cb'},{y: 35, color: '#ed9c28'},{y: 30, color: '#E36159'}]
    },
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
    },
    {
      categories: ['Jack.Giford', 'Judith.McConnell', 'Farley.Granger', 'Bob.Hope', 'Alice.Ghostley'],
      data: [{y: 70, color: '#5bc0de'},{y: 54, color: '#349da2'},{y: 25, color: '#7986cb'},{y: 20, color: '#ed9c28'},{y: 4, color: '#E36159'}]
    },
  ];

  $('.identity-chart').each(function(index){
    $(this).highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: datas[index].categories,
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
                    enabled: false
                }
            }
        },
        tooltip: {
          formatter: function() {
            return '<b>'+this.x+'</b><br>'+this.series.name+': '+this.y;
          }
        },
        series: [{
            name: 'Documents',
            data: datas[index].data,
        }]
    });
  });

  // CONTENT TOGGLE
  // Configure/customize these variables.
  var showChar = 42;  // How many characters are shown by default
  var ellipsestext = "...";
  var moretext = "more keywords";
  var lesstext = "less keywords";
  
  $('.more').each(function() {
      var content = $(this).html();

      if(content.length > showChar) {

          var c = content.substr(0, showChar);
          var h = content.substr(showChar, content.length - showChar);

          var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

          $(this).html(html);
      }

  });

  $(".morelink").click(function(){
      if($(this).hasClass("less")) {
          $(this).removeClass("less");
          $(this).html(moretext);
          $(this).parents('tr').find('.pie-wrapper').removeClass('pie-md').addClass('pie-sm');
      } else {
          $(this).addClass("less");
          $(this).html(lesstext);
          $(this).parents('tr').find('.pie-wrapper').removeClass('pie-sm').addClass('pie-md');
      }
      $(this).parent().prev().toggle();
      $(this).prev().toggle();
      return false;
  });

});