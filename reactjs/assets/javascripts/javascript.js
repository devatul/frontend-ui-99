$(function () {

    if( $('#flotPie').length){
        // PIE CHART
        var flotPieData = [{
            label: "Unrestricted",
            data: [
                [1, 10]
            ],
            color: '#5bc0de'
        }, {
            label: "Internal",
            data: [
                [1, 20]
            ],
            color: '#349da2'
        }, {
            label: "Confidential",
            data: [
                [1, 10]
            ],
            color: '#7986cb'
        }, {
            label: "Secret",
            data: [
                [1, 10]
            ],
            color: '#ed9c28'
        }, {
            label: "Banking Secrecy",
            data: [
                [1, 50]
            ],
            color: '#E36159'
        }];

        var plot = $.plot('#flotPie', flotPieData, {
            series: {
                pie: {
                    show: true,
                    label: {
                        show: true,
                        radius: 1/2,
                        formatter: function (label, series) {
                            return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                        },
                        threshold: 0.1
                    }
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
            }
        });
    }

    if( $('#flotBar').length){
        // BAR CHART
        var flotBarData = [
            {data: [[0,10]], color: "#0088cc", label: "Legal"}, 
            {data: [[1,20]], color: "#349da2", label: "Employee"},
            {data: [[2,40]], color: "#7986cb", label: "Transaction"},
            {data: [[3,30]], color: "#E36159", label: "Accounting/Tax"},
            {data: [[4,20]], color: "#ed9c28", label: "Corporate Entity"},
            {data: [[5,20]], color: "#5bc0de", label: "Customer"}
        ];

        var plot2 = $.plot("#flotBar",flotBarData, {
            series: {
                bars: {
                    show: true,
                    barWidth: 0.5,
                    align: "center",
                    lineWidth: 0,
                    fill:1,
                }
            },
            grid: {
                margin: {top: 30, left: 0, bottom: 20, right: 0},
                labelMargin: 10,
                borderWidth: {top: 0, right: 0, bottom: 1, left: 1},
            },
            xaxis: {
                tickLength: 0,
                show: false,
                min: -0.5,
                max: flotBarData.length - 0.5
            },
            yaxis: {
                tickLength: 0,           
                show: false
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 3,        
                container:$("#legendContainer2"), 
            },
        });

        for (var int=0; int<flotBarData.length; int++){
            $.each(plot2.getData()[int].data, function(i, el){
              var o = plot2.pointOffset({x: el[0], y: el[1]});
              $('<div class="data-point-label">' + el[1] + '%</div>').css( {
                position: 'absolute',
                left: o.left - 10,
                top: o.top - 20,
                display: 'none'
              }).appendTo(plot2.getPlaceholder()).fadeIn('slow');
            });
        }
    }

    if( $('#flotPie2').length){
        // PIE CHART 2
        var flotPieData2 = [{
            label: "Excel",
            data: [
                [1, 80]
            ],
            color: '#0088cc'
        }, {
            label: "PDF",
            data: [
                [1, 20]
            ],
            color: '#349da2'
        }];

        var plot = $.plot('#flotPie2', flotPieData2, {
            series: {
                pie: {
                    show: true,
                    label: {
                        show: true,
                        radius: 1/2,
                        formatter: function (label, series) {
                            return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                        },
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 4,
                container:$("#legendContainer3"), 
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
    }

    if( $('#flotPie3').length){
        // PIE CHART 2
        var flotPieData3 = [{
            label: "English",
            data: [
                [1, 80]
            ],
            color: '#0088cc'
        }, {
            label: "French",
            data: [
                [1, 20]
            ],
            color: '#349da2'
        }];

        var plot = $.plot('#flotPie3', flotPieData2, {
            series: {
                pie: {
                    show: true,
                    label: {
                        show: true,
                        radius: 1/2,
                        formatter: function (label, series) {
                            return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                        },
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 4,
                container:$("#legendContainer4"), 
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
    } 
       
    $(document).on('click', '.dropdown-menu.has-arrow', function (e) {
        e.stopPropagation();
    });    

    // hold onto the drop down menu                                             
    var dropdownMenu;

    // and when you show it, move it to the body                                     
    $(window).on('show.bs.dropdown', function (e) {

        var windowWidth = $(window).innerWidth();
        // grab the menu     
        dropdownMenu = $(e.target).find('.dropdown-menu');

        if ( windowWidth <=996 && dropdownMenu.hasClass('full-mobile') ){   
            // detach it and append it to the body
            $('body').append(dropdownMenu.detach());

            // grab the new offset position
            var eOffset = $(e.target).offset();

            // make sure to place it where it would normally go (this could be improved)
            dropdownMenu.css({
                'display': 'block',
                'top': eOffset.top + $(e.target).outerHeight(),
                'left': eOffset.left
            });
        }
    });

    // and when you hide it, reattach the drop down, and hide it normally                                                   
    $(window).on('hide.bs.dropdown', function (e) {
        var windowWidth = $(window).innerWidth();

        if ( windowWidth <=996 && dropdownMenu.hasClass('full-mobile') ){
            $(e.target).append(dropdownMenu.detach());
            dropdownMenu.hide();
        }
    });     

    $('select.detail-select').select2({
        minimumResultsForSearch: Infinity
    }).select2('val', null);;

});