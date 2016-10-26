import Constants from '../Constant'
import { browserHistory } from 'react-router'
import $ from 'jquery'

module.exports = {
    makeRequest: function({ sync = true, dataType = 'json', contentType = "application/json", method = 'GET', path, params = {}, success, error }) {
       return $.ajax({
				url: Constants.SERVER_API + path,
				dataType: dataType,
				contentType: contentType,
                async: sync,
				type: method,
				data: params,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", "JWT " + sessionStorage.getItem('token'));
				},
				success: function(data) {
					success &&
                        success(data)
				}.bind(this),
				error: function(err) {
					if(err.status === 401)
					{
						browserHistory.push('/Account/SignIn');
					}
					error &&
						error(err)
				}.bind(this)
			});
    }
}