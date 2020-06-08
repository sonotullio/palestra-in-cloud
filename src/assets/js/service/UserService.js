APP.service('UserService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/users';

    self.save = function (client) {
        return $http.post(path, client);
    };

    self.login = function(cf, pwd) {
        return $http.get(apiUrl + '/login?cf=' + cf + '&password=' + pwd);
    }

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getAll = function() {
        return $http.get(path);
    };

    self.delete = function (client) {
        $http.delete(path + '/' + client.id).then(function (success) {
            console.log('deleted: ', client.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);
