import { _confidentialities, urls } from '../Constant'
import { makeRequest } from '../utils/http'

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

    removeUndefined(array) {
        return array;
    },

  orderLanguages(array) {
    let order = ['EN', 'FR', 'DE', 'OTHER'];
    let orderLength = order.length,
      arrayLength = array.length;
    for (let i = 0; i < arrayLength - 1; ++i) {
      for (let j = 0; j < orderLength; ++j) {
        if ((array[i].short_name && array[i].short_name.toUpperCase() === order[j])
          || (array[i].language && array[i].language.toUpperCase() === order[j]))
          break;
        if ((array[i+1].short_name && array[i+1].short_name.toUpperCase() === order[j])
        || (array[i+1].language && array[i+1].language.toUpperCase() === order[j])) {
          let tmp = array[i];
          array[i] = array[i+1];
          array[i+1] = tmp;
          i = Math.max(i - 2, -1);
          break;
        }
      }
    }

    return array;
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

      for (var i = 0; i < newArray.length; i++) {
        if (newArray[i] == undefined) {
          newArray.splice(i, 1);
          i--;
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
    },
    
    getCategories: (options) => {
        options.path = urls.LABEL_CATEGORY;
        makeRequest(options);
    },

    getConfidentialities: (options) => {
        options.path = urls.LABEL_CONFIDENTIAL;
        makeRequest(options);
    },

    getDoctypes: (options) => {
        options.path = urls.LABEL_DOCTYPES;
        makeRequest(options);
    },

    getLanguages: (options) => {
        options.path = urls.LABEL_LAGNUAGES;
        makeRequest(options);
    },

    getRole: (options) => {
        options.path = urls.ROLES;
        makeRequest(options);
    },

    getProfile: (options) => {
        options.path = urls.PROFILE;
        makeRequest(options);
    },
    
    setProfile: (options) => {
        options.path = urls.PROFILE;
        options.method = "PUT";
        makeRequest(options)
    },

    getPhoto: (options) => {
        options.path = urls.PHOTO;
        makeRequest(options);
    },

    setPhoto: (options) => {
        options.path = urls.PHOTO
        options.method = "PUT"
        makeRequest(options)
    },

    setAuth: (options) => {
        options.path = urls.TOKEN
        options.method = "POST";
        makeRequest(options);
    }, 

    setEmail: (options) => {
        options.path = urls.EMAIL;
        options.method = "PUT";
        makeRequest(options);
    },

    setPassword: (options) => {
        options.path = urls.PASSWORD;
        options.method = "PUT";
        makeRequest(options)
    },

    getNotification: (options) => {
        if (options.urgency)
            options.path = urls.NOTIFICATION + '?urgency=' + options.urgency;
        else if (options.period) 
            options.path = urls.NOTIFICATION + '?period=' + options.period
        else 
            return null
        makeRequest(path); 
    },

    getDataLose: (options) => {
        options.path = urls.DATALOSE
        makeRequest(options)
    },

    getDataRisk: (options) => {
        options.path = urls.DATARISK + "?number_users=" + options.number_users;
        makeRequest(options)
    },

    getScan: (options) => {
        options.path = urls.SCAN
        makeRequest(options)
    },

    setScan: (options) => {
        options.path = urls.SCAN
        options.method = 'POST'
        makeRequest(options)
    },

    getClassificationReview: (options) => {
        options.path = urls.CLASSIFICATION_REVIEW;
        makeRequest(options);
    },

    assignCategoryAndConfidentiality2nd: (options) => {
        options.path = urls.CLASSIFICATION_REVIEW;
        options.method = 'POST';
        makeRequest(options);
    },

    getStatistics: (options) => {
        options.path = urls.SATISFISTICS;
        makeRequest(options);
    },

    getCloudwords: (options) => {
        options.path = urls.CLOUDWORDS;
        makeRequest(options);
    },

    getCentroids: (options) => {
        options.path = urls.CENTROIDS;
        makeRequest(options);
    },

    getDocuments: (options) => {
        options.path = urls.SAMPLES;
        makeRequest(options);
    },

    getGroups: (options) => {
        options.path = urls.GROUP;
        makeRequest(options);
    },

    getOrphanDocuments: (options) => {
        options.path = urls.ORPHAN_SAMPLES;
        makeRequest(options);
    },

    setOrphanDocuments: (options) => {
        options.path = urls.ORPHAN_SAMPLES;
        if (options.id) {
            options.path += '?id=' + options.id;
        }
        options.method = 'POST';
        makeRequest(options);
    },

    getOrphan: (options) => {
        options.path = urls.ORPHAN;
        makeRequest(options);
    },

    getOrphanStatistics: (options) => {
        options.path = urls.ORPHAN_STATISTICS;
        makeRequest(options);
    },

    getOrphanCloudwords: (options) => {
        options.path = urls.ORPHAN_CLOUDWORDS;
        makeRequest(options);
    },

    getOrphanCentroids: (options) => {
        options.path = urls.ORPHAN_CENTROIDS;
        makeRequest(options);
    },

    getOrphanCategories: (options) => {
        options.path = urls.ORPHAN_CATEGORIES;
        makeRequest(options);
    },

    setTokenAuth: (options) => {
        options.path = urls.TOKENAUTH;
        options.method = ''
        makeRequest(options);
    },

    registration: (options) => {
        options.path = urls.REGISTRATION;
        options.method = 'POST';
        makeRequest(options);
    },

    getOrganization: (options) => {
        options.path = urls.ORGANIZATION;
        makeRequest(options);
    },

    setOrganization: (options) => {
        options.path = urls.ORGANIZATION;
        options.method = 'PUT';
        makeRequest(options);
    },

    setRefreshToken: (options) => {
        options.path = urls.REFRESHTOKEN;
        options.method = 'POST';
        makeRequest(options);
    },

    getAnomalyIamInfo: (options, path) => {
        options.path = urls.IAM + path;
        makeRequest(options);
    },

    setAnomalyIamInfo: (options, path) => {
        options.path = urls.IAM + path;
        makeRequest(options);
    }
}
