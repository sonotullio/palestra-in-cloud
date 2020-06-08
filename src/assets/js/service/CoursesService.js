APP.service('CoursesService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/courses';

    self.courses  = [];

    self.getAll = function() {
        return $http.get(path);
    };

    self.getAllByDate = function(date) {
        return $http.get(path + '?date=' + date);
    };

    self.courses = self.getAll();

    self.save = function (course) {
        return $http.post(path, course);
    };

    self.delete = function (product) {
        $http.delete(path + '/' + product.id).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

    self.downloadTemplate = function () {
        return $http({
            url: path + "/template",
            method: "GET",
            headers: {'Content-type': 'application/json'},
            responseType: 'arraybuffer'
        })
    }

    self.import = function () {
        return $http({
            url: path + "/import",
            method: "POST",
            headers: {'Content-type': 'application/json'},
            responseType: 'arraybuffer'
        })
    }

    return self;

}]);
