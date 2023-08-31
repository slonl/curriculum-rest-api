    window.slo = {
        api: {
            get: function(path, params) {
                var url = window.apiURL + path;
                if (!params && window.location.search) {
                    url = url + window.location.search;
                }
                if (params) {
                    var args = Object.keys(params).map(function(param) {
                        return encodeURIComponent(param)+'='+encodeURIComponent(params[param]);
                    }).join('&');
                    url = url + '?' + args;
                }
                return fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Basic b3BlbmRhdGFAc2xvLm5sOjM1ODUwMGQzLWNmNzktNDQwYi04MTdkLTlmMGVmOWRhYTM5OQ=='
                    }
                })
                .then(function(response) {
                    var json = response.json();
                    if (response.ok) {
                        return json;
                    }
                    return json.then(Promise.reject.bind(Promise));
                })
                .then(function(json) {
                    if (json.error) {
                        browser.view.error = json.error;
                    } else {
                        browser.view.error = '';
                    }
                    return json;
                })
                .catch(error => {
                    browser.view.error = error.error;
                    browser.view.errorMessage = error.message;
                });
            }
        }
    }

