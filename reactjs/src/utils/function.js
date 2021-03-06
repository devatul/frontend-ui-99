import { _confidentialities, urls } from '../App/Constant';
import { makeRequest } from '../utils/http';
import Demo from '../Demo.js';

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

        newArray = newArray.filter(function (a) { return a !== undefined; });

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
        if (Demo.MULTIPLIER != 1) {
            module.exports.getProfile({
              success: function(profile_data) {
                let department = profile_data.department;
                if (department == null)
                  department = "Swiss Bank";
                let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                if (mode === undefined)
                  mode = Demo.INDUSTRIES[0];
                options.success(mode.categories);
              }
            });
        } else {
            makeRequest(options);
        }
    },

    getConfidentialities: (options) => {
        options.path = urls.LABEL_CONFIDENTIAL;
        if (Demo.MULTIPLIER != 1) {
            module.exports.getProfile({
              success: function(profile_data) {
                let department = profile_data.department;
                if (department == null)
                  department = "Swiss Bank";
                let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                if (mode === undefined)
                  mode = Demo.INDUSTRIES[0];
                options.success(mode.confidentialities);
              }
            });
        } else {
            makeRequest(options);
        }
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

    getDataLoss: (options) => {
        options.path = urls.DATALOSS
        if (Demo.MULTIPLIER != 1) {
            let old_success = options.success;
            options.success = function(data) {
                module.exports.getProfile({
                    success: function(profile_data) {
                        let department = profile_data.department;
                        if (department == null)
                          department = "Swiss Bank";
                        let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                        if (mode === undefined)
                            mode = Demo.INDUSTRIES[0];
                        for (let i = 0, len = data.length; i < len; ++i) {
                            // Iterates over languages
                            for (let j = 0, len_j = data[i]["most efficient keywords"].length; j < len_j; ++j) {
                                // Iterates over categories
                                let cat_index = Demo.INDUSTRIES[0].categories.findIndex(function(e) { return e.name == data[i]["most efficient keywords"][j].category_name; });
                                data[i]["most efficient keywords"][j].category_name = mode.categories[cat_index != -1 ? Math.min(cat_index, mode.categories.length - 1) : 0].name;
                                for (let k = 0, len_k = data[i]["most efficient keywords"][j]["confidentiality levels"].length; k < len_k; ++k) {
                                    let conf_index = Demo.INDUSTRIES[0].confidentialities.findIndex(function(e) { return e.name == data[i]["most efficient keywords"][j]["confidentiality levels"][k].name; });
                                    data[i]["most efficient keywords"][j]["confidentiality levels"][k].name = mode.confidentialities[conf_index != -1 ? Math.min(conf_index, mode.confidentialities.length - 1) : 0].name;
                                }
                            }
                        }
                        old_success(data);
                    }
                });
            };
            options.success(Demo.DATALOSS_DATA);
        } else {
            makeRequest(options);
        }
    },

    getDataRisk: (options) => {
        options.path = urls.DATARISK + "?number_users=" + options.number_users;
        makeRequest(options);
    },

    getScan: (options) => {
        options.path = urls.SCAN
        if (Demo.MULTIPLIER != 1) {
            let old_success = options.success;
            options.success = function(data) {
                module.exports.getProfile({
                    success: function(profile_data) {
                        let department = profile_data.department;
                        if (department == null)
                          department = "Swiss Bank";
                        let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                        if (mode === undefined)
                            mode = Demo.INDUSTRIES[0];
                        if (data.categories.length > mode.categories.length) {
                            data.categories = data.categories.slice(0, mode.categories.length);
                        }
                        for (let i = 0, len = data.categories.length; i < len; ++i) {
                            data.categories[i].name = mode.categories[i].name;
                        }

                        if (data.confidentialities.length > mode.confidentialities.length) {
                            data.confidentialities = data.confidentialities.slice(0, mode.confidentialities.length);
                        }
                        for (let i = 0, len = data.confidentialities.length; i < len; ++i) {
                            data.confidentialities[i].name = mode.confidentialities[i].name;
                        }
                        old_success(data);
                    }
                });
            };
        }
        makeRequest(options);
    },

  getInsightIAM: (options) => {
        options.path = urls.INSIGHT_IAM;
        if (options.id) {
            options.path += '?number_users=' + options.number_users;
        } else {
            options.path += '?number_users=5';
        }

        if (Demo.MULTIPLIER != 1) {
            let old_success = options.success;
            options.success = function(data) {
                module.exports.getProfile({
                    success: function(profile_data) {
                        let department = profile_data.department;
                        if (department == null)
                          department = "Swiss Bank";
                        let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                        if (mode === undefined)
                            mode = Demo.INDUSTRIES[0];

                        for (let i = 0, len = data.key_contributor.length; i < len; ++i) {
                            let cat_index = Demo.INDUSTRIES[0].categories.findIndex(function(e) { return e.name == data.key_contributor[i].category_name; });
                            data.key_contributor[i].category_name = mode.categories[cat_index != -1 ? Math.min(cat_index, mode.categories.length - 1) : 0].name;
                        }
                        old_success(data);
                    }
                });
            };
        }
        makeRequest(options);
  },

    setScan: (options) => {
        options.path = urls.SCAN;
        options.method = 'POST';
        makeRequest(options);
    },

    getClassificationReview: (options) => {
        options.path = urls.CLASSIFICATION_REVIEW;
        if (Demo.MULTIPLIER != 1) {
            let old_success = options.success;
            options.success = function(data) {
                module.exports.getProfile({
                    success: function(profile_data) {
                        let department = profile_data.department;
                        if (department == null)
                          department = "Swiss Bank";
                        let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                        if (mode === undefined)
                            mode = Demo.INDUSTRIES[0];

                        console.log(data);
                        for (let i = 0, len = data.length; i < len; ++i) {
                            data[i].confidentiality.name = mode.confidentialities[Math.min(parseInt(data[i].confidentiality.id), mode.confidentialities.length - 1)].name;
                            data[i].category.name = mode.categories[Math.min(parseInt(data[i].category.id), mode.categories.length - 1)].name;
                        }
                        old_success(data);
                    }
                });
            };
        }
        makeRequest(options);
    },

    assignCategoryAndConfidentiality2nd: (options) => {
        options.path = urls.CLASSIFICATION_REVIEW;
        options.method = 'POST';
        makeRequest(options);
    },

    getStatistics: (options) => {
        options.path = urls.STATISTICS;
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
        if (Demo.MULTIPLIER != 1) {
            let old_success = options.success;
            options.success = function(data) {
                module.exports.getProfile({
                    success: function(profile_data) {
                        let department = profile_data.department;
                        if (department == null)
                          department = "Swiss Bank";
                        let mode = Demo.INDUSTRIES.find(function(e) { return e.name.toUpperCase() === department.toUpperCase(); });
                        if (mode === undefined)
                            mode = Demo.INDUSTRIES[0];

                        for (let i = 0, len = data.length; i < len; ++i) {
                            let cat = data[i].name.split(',')[0];
                            let conf = data[i].name.split(',')[1];
                            let cat_index = Demo.INDUSTRIES[0].categories.findIndex(function(e) { return e.name == cat; });
                            let conf_index = Demo.INDUSTRIES[0].confidentialities.findIndex(function(e) { return e.name == conf; });
                            data[i].name = (cat_index == -1 ? "Undefined" : mode.categories[Math.min(cat_index, mode.categories.length - 1)].name) + "," + (conf_index == -1 ? "Undefined" : mode.confidentialities[Math.min(conf_index, mode.confidentialities.length - 1)].name);
                            console.log(data[i].name);
                        }

                        old_success(data);
                    }
                });
            }
        }
        makeRequest(options);
    },

    setGroupDocuments: (options) => {
        options.path = urls.GROUP_SAMPLES;
        if (options.id) {
            options.path += '?id=' + options.id;
        }
        options.method = 'POST';
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
        options.method = 'POST'
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

    setVerifyToken: (options) => {
        options.path = urls.VERIFYTOKEN;
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
    },

    getSla: (options) => {
        options.path = urls.SLA;
        makeRequest(options);
    },

    checkConfidentiality: (options) => {
        options.path = urls.CONFIDENTIAL;
        makeRequest(options);
    },

    getTechDomain: (options) => {
        options.path = urls.TECH_DOMAIN
        makeRequest(options)
    },

    setTechDomain: (options) => {
        options.path = urls.TECH_DOMAIN
        options.method = 'PUT'
        makeRequest(options)
    },

    getTechHdpserver: (options) => {
        options.path = urls.TECH_HDPSERVER
        makeRequest(options)
    },

    getTechFolder: (options) => {
        options.path = urls.TECH_FOLDER
        makeRequest(options)
    },

    setTechFolder: (options) => {
        options.path = urls.TECH_FOLDER
        options.method = 'PUT'
        makeRequest(options)
    },

    getTechEmailServerExchange: (options) => {
        options.path = urls.TECH_EMAILSERVER_EXCHANGE
        makeRequest(options)
    },

    getMyTeam: (options) => {
        options.path = urls.MY_TEAM;
        makeRequest(options);
    },

    getRole: (options) => {
        options.path = urls.ROLES;
        makeRequest(options);
    },
}
