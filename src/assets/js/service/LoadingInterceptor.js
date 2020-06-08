APP.service('LoadingInterceptor', function ($q, $log, $rootScope, baseURL) {

    var xhrCreations = 0;
    var xhrResolutions = 0;

    function isLoading() {
        console.log('isLoading', xhrResolutions < xhrCreations);
        return xhrResolutions < xhrCreations;
    }

    function updateStatus() {
        $rootScope.loading = isLoading();
    }

    return {
        request: function (config) {
            if (config.url !== (baseURL + '/security/login')) {
                config.headers['X-JWT-Assertion'] = localStorage.getItem('tokenJwt');
            }

            xhrCreations++;
            updateStatus();
            return config;
        },
        requestError: function (rejection) {
            xhrResolutions++;
            updateStatus();
            $log.error('Request error:', rejection);
            return $q.reject(rejection);
        },
        response: function (response) {
            xhrResolutions++;
            updateStatus();
            return response;
        },
        responseError: function (rejection) {
            xhrResolutions++;
            updateStatus();
            $log.error('Response error:', rejection);
            $rootScope.$broadcast('loginError', rejection.data);
            return $q.reject(rejection);
        }
    };
});
