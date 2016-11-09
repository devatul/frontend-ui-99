import Constants from '../Constant'
import { browserHistory } from 'react-router'
import $ from 'jquery'


const limitRetry = 3;
let count = 0;

function makeRequest({ sync = true, dataType = 'json', contentType = "application/json", method = 'GET', path, params = {}, success, error, timeout = 0 }) {

    return $.ajax({
        url: Constants.SERVER_API + path,
        dataType: dataType,
        timeout: timeout;
        contentType: contentType,
        async: sync,
        type: method,
        data: params,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
        },
        success: function(data) {
            success &&
                success(data);
        }.bind(this),
        error: function(err) {
            switch (true) {
                case (err.status === 401):
                    browserHistory.push('/Account/SignIn');
                    break;
                case (err.status === 500 || err.status === 503 || err.textStatus === 'timeout'):
                    if (count < limitRetry) {
                        makeRequest({ sync, dataType, contentType, method, path, params, success, error });
                        count++;
                    }
            }
            error &&
                error(err)
        }.bind(this)
    });
}



module.exports = {
    makeRequest
}
