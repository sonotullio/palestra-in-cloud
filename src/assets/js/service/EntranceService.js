APP.service('EntranceService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/entrances';

    self.save = function (entrance) {
        return $http.post(path, entrance);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getAll = function () {
        return $http.get(path);
    };

    self.getAllMappedByProduct = function () {
        return $http.get(path + '/map');
    };

    self.getAllByClientId = function(clientId) {
        return $http.get(path + '?clientId=' + clientId);
    };

    self.markAsDeleted = function(entrance) {
        entrance.deleted = true;
        return $http.post(path, entrance);
    };

    self.delete = function (entrance) {
        return $http.delete(path + '/' + entrance.id);
    };

    self.isThisWeek = function(entrance) {
        var today = new Date();
        var firtyDayOfWeek = new Date().setDate(today.getDate() - today.getDay());

        if (new Date(entrance.date) >= firtyDayOfWeek) {
            return true;
        }

        return false;
    };

    self.getSplitted = function(entrances) {
        var retval = {
            "weekly": [], "old": [], "deleted": [],
        };

        entrances.forEach(function (entrance) {
            if (entrance.deleted) {
                retval["deleted"].push(entrance);
            } else if (self.isThisWeek(entrance)) {
                retval["weekly"].push(entrance);
            } else {
                retval["old"].push(entrance);
            }
        });

        return retval;
    };

}]);
