module.exports = function() {
    if( $('#flotPie').length){
        // PIE CHART

        var plot = $.plot('#flotPie', flotPieData, {
            series: {
                pie: {
                    show: true,
                    radius:0.8,
                    innerRadius: 0.4,
                    // label: {
                    //     show: true,
                    //     radius: 1/2,
                    //     formatter: function (label, series) {
                    //         return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                    //     },
                    //     threshold: 0.1
                    // }
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

    if( $('#flotPie2').length){
        // PIE CHART
        var flotPieData2 = [{
            label: "Accounting/ Tax",
            data: [
                [1, 50]
            ],
            color: '#5bc0de'
        }, {
            label: "Corporate Entity",
            data: [
                [1, 25]
            ],
            color: '#349da2'
        }, {
            label: "Transaction",
            data: [
                [1, 15]
            ],
            color: '#7986cb'
        }, {
            label: "Legal",
            data: [
                [1, 6]
            ],
            color: '#ed9c28'
        }, {
            label: "Employee",
            data: [
                [1, 4]
            ],
            color: '#E36159'
        }];

        var plot = $.plot('#flotPie2', flotPieData2, {
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
            }
        });

        var flotPieInnerData2 = [{
            label: "EN",
            data: [
                [1, 50]
            ],
            color: '#5bc0de'
        }, {
            label: "FR",
            data: [
                [1, 25]
            ],
            color: '#349da2'
        }, {
            label: "DE",
            data: [
                [1, 4]
            ],
            color: '#E36159'
        }];

        $.plot('#flotPie2Inner', flotPieInnerData2, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    innerRadius: 0.6,
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
            }
        });
    }

    if( $('#flotPie2Filter').length){
        // PIE CHART

        var flotPie2FilterData = [{
            label: "EN",
            data: [
                [1, 50]
            ],
            color: '#5bc0de'
        }, {
            label: "FR",
            data: [
                [1, 25]
            ],
            color: '#349da2'
        }, {
            label: "DE",
            data: [
                [1, 4]
            ],
            color: '#E36159'
        }];

        $.plot('#flotPie2Filter', flotPie2FilterData, {
            series: {
                pie: {
                    show: true,
                    radius: 0.8,
                    innerRadius: 0.4,
                }
            },
            legend: {
                show: true,
                position: 'sw',
                noColumns: 3,
                container:$("#legendContainer2Filter"),       
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
    }

    if( $('#flotPie3').length){
        // PIE CHART 3
        var flotPieData3 = [{
            label: "Excel",
            data: [
                [1, 50]
            ],
            color: '#5bc0de'
        }, {
            label: "Word",
            data: [
                [1, 25]
            ],
            color: '#349da2'
        }, {
            label: "PDF",
            data: [
                [1, 15]
            ],
            color: '#7986cb'
        }, {
            label: "Text",
            data: [
                [1, 6]
            ],
            color: '#ed9c28'
        }, {
            label: "Power Point",
            data: [
                [1, 4]
            ],
            color: '#E36159'
        }];

        var plot = $.plot('#flotPie3', flotPieData3, {
            series: {
                pie: {
                    show: true,
                    radius:0.8,
                    innerRadius: 0.4,
                    // label: {
                    //     show: true,
                    //     radius: 1/2,
                    //     formatter: function (label, series) {
                    //         return '<div style="font-size:14pt;text-align:center;padding:5px;color:white;">'+ Math.round(series.percent) + '%</div>';
                    //     },
                    //     threshold: 0.1
                    // }
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
            }
        });
    }
}