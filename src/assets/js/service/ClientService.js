APP.service('ClientService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/clients';

    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    self.dateDiffInDays = function (a, b) {
        // Esclude l'ora ed il fuso orario
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return (utc1 - utc2) / _MS_PER_DAY;
    }

    self.getAll = function() {
        return $http.get(path);
    };

    self.save = function (client) {
        return $http.post(path, client);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.delete = function (client) {
        $http.delete(path + '/' + client.id).then(function (success) {
            console.log('deleted: ', client.id)
        }, function (error) {
            console.log(error);
        });
    }

    self.setStatus = function (client, date) {

        if (client.expirationDate == undefined || client.certificateExpirationDate == undefined) {
            client.isExpired = true;
        } else {
            if (self.dateDiffInDays(new Date(client.expirationDate), date) >= 0 && self.dateDiffInDays(new Date(client.expirationDate), date) < 8 || self.dateDiffInDays(new Date(client.certificateExpirationDate), date) >= 0 && self.dateDiffInDays(new Date(client.certificateExpirationDate), date) < 8 ) {
                client.isAlert = true;
            }

            if (self.dateDiffInDays(new Date(client.expirationDate), date) < 0 || self.dateDiffInDays(new Date(client.certificateExpirationDate), date) < 0 ) {
                client.isAlert = false;
                client.isExpired = true;
            }
        }
    }

    self.isExpired = function (date, limitDate) {
        if (date == undefined) {
            return true;
        } else {
            if (self.dateDiffInDays(date, limitDate) < 0) {
                return true;
            }
            return false;
        }
    }

    self.isAlert = function (date, limitDate) {
        if (self.dateDiffInDays(date, limitDate) >= 0 && self.dateDiffInDays(date, limitDate) < 8) {
            return true;
        } else {
            return false;
        }
    }

}]);
