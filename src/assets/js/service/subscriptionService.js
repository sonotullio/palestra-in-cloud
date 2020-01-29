APP.service('$subscriptionService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/subscription';

    self.save = function (subscription) {
        return $http.post(path, subscription);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getByClientId = function (id) {
        return $http.get(path + '/client/' + id);
    };

    self.delete = function (subscription) {
        $http.delete(path + '/' + subscription.id).then(function (success) {
            console.log('deleted: ', subscription.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);