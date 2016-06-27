google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

      var data = google.visualization.arrayToDataTable([
        ['', '2010 Population',],
        ['User', 0],
        ['todd smith', 23],
        ['tony.gomes', 50],
        ['stan.siow', 2],
        ['matt.nixon', 73],
		['chris.mufat', 55]
      ]);

      var options = {
        title: '',
        chartArea: {width: '50%'},
        hAxis: {
          title: '',
          minValue: 0
        },
        vAxis: {
          title: ''
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }