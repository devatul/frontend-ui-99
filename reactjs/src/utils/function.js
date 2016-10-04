module.exports = {
    formatNumber: (nStr) => {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },

    orderByIndex: (array, orders) => {
        let newArray = [];

        for(let i = orders.length - 1; i >= 0; i--) {
            newArray[i] = array[orders[i]];
        }

        return newArray;
    },

    renderClassType: (documentName) => {
        let word = /(.doc|.dotx|.dot|.docm|.dotm|.rtf)$/gi,
            excel = /(.xlsx|.xls|.xltx|.xlt|.csv|.xlsb|.xlsm|.xltm|.xml|.xlam|.xla)$/gi,
            powerPoint = /(.pptx|.ppt|.potx|.pot|.ppsx|.pps|.pptm|.potm|.ppsm)$/gi,
            pdf = /.pdf$/gi,
            text = /.txt$/gi;
        switch(true) {
            case word.test(documentName) === true:
                return "fa-file-word-o";
            case excel.test(documentName) === true:
                return "fa-file-excel-o";
            case powerPoint.test(documentName) === true:
                return "fa-file-powerpoint-o";
            case pdf.test(documentName) === true:
                return "fa-file-pdf-o";
            case text.test(documentName) === true:
                return "fa-file-text-o";
        }
    }
}