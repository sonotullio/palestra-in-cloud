APP.service('$entranceService', ['$http', function ($http) {

    var self = this;

    const path = PATH + '/entrances';

    self.getAllByClientId = function(clientId) {
        return $http.get(path + '?clientId=' + clientId);
    };

    self.getOfThisWeek = function(entrances) {
        var retval = [];

        var today = new Date();
        var firtyDayOfWeek = new Date().setDate(today.getDate() - today.getDay());
        entrances.forEach(function (entrance) {
            if (new Date(entrance.date) >= firtyDayOfWeek) {
                retval.push(entrance);
            }
        })

        return retval;
    }


    self.save = function (entrance) {
        return $http.post(path, entrance);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.delete = function (entrance) {
        $http.delete(path + '/' + entrance.id).then(function (success) {
            console.log('deleted: ', entrance.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);