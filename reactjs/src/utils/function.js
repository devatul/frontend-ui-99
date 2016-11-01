import { _confidentialities } from '../Constant'

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
        let newArray = [], total = orders.length;

        for(let i = 0; i < total; i++) {
            if(array[orders[i]]) {
                newArray[i] = array[orders[i]];
            }
        }

        return newArray;
    },

    orderConfidentialities(array) {
        let newArray = [],
            {
                BANKING,
                SECRET,
                CONFIDENTIAL,
                INTERNAL,
                PUBLIC
            } = _confidentialities;

        for( let i = array.length - 1; i >= 0; i-- ) {
            if(array[i]) {
                var name = array[i].name.toLowerCase();

                if( name ==  BANKING.name.toLowerCase() )
                {
                    newArray[BANKING.pos] = array[i];
                } else if( name ==  SECRET.name.toLowerCase() )
                {
                    newArray[SECRET.pos] = array[i];
                } else if( name ==  CONFIDENTIAL.name.toLowerCase() )
                {
                    newArray[CONFIDENTIAL.pos] = array[i];
                } else if( name ==  INTERNAL.name.toLowerCase() )
                {
                    newArray[INTERNAL.pos] = array[i];
                } else if( name ==  PUBLIC.name.toLowerCase() )
                {
                    newArray[PUBLIC.pos] = array[i];
                } else {
                    newArray[i] = array[i];
                }
            }
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