$(function () {
    var chart = c3.generate({
        bindto: '#chart1',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ],
            axes: {
                data2: 'y2' // ADD
            }
        },
        axis: {
            y2: {
                show: true // ADD
            }
        }
    });
    var chart = c3.generate({
        data: {
            columns: [
                ['data1', 30],
                ['data2', 120],
            ],
            type: 'donut',
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
        },
        donut: {
            title: "Iris Petal Width"
        }
    });

    var chart = c3.generate({
        bindto: '#chart2',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ],
            axes: {
                data2: 'y2'
            },
            types: {
                data2: 'bar'
            }
        },
        axis: {
            y: {
                label: {
                    text: 'Y Label',
                    position: 'outer-middle'
                },
                tick: {
                    format: d3.format("$,") // ADD
                }
            },
            y2: {
                show: true,
                label: {
                    text: 'Y2 Label',
                    position: 'outer-middle'
                }
            }
        }
    });

    $("#ok").click(function(e){
        e.stopImmediatePropagation();
        $('.modal').not(".select_filer").hide(); 
        $(".select_filer").toggle();
        //$(".table_content").toggleClass("opacity");
        //$(".charts").toggleClass("opacity");
        $(".filter_ul").css({"color": "red","margin-top" : "25px"});
        $(".first_table").removeClass("display");
        
        $('.opacity_layer').show();
    });

    $('#info').click(function (e) {
        e.stopImmediatePropagation();
        $('.modal').not(".first_table").hide(); 
       
        $(".first_table").toggle();
        
        $('.opacity_layer').show();
        
    });

    $('#bell').click(function (e) {
        e.stopImmediatePropagation();
        $('.modal').not(".bell_table").hide(); 
        
        $('.opacity_layer').show();
        
        $(".bell_table").toggle();

    });
    
    $('input.search-query').click(function (e) {
        e.stopImmediatePropagation();
        $('.modal').not(".search_table").hide(); 
        $(".search_table").toggle();
        
        $('.opacity_layer').show();

    });
    
    $('.modal').click(function(e){
        e.stopImmediatePropagation();
    })
    $('body').click(function(){
        $('.modal').hide(); 
        $('.opacity_layer').hide();
    });     
                                

});