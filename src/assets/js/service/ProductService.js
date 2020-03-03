APP.service('ProductService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/sports';

    self.sports  = [];

    self.getAll = function() {
        return $http.get(path);
    };

    self.sports = self.getAll();

    self.save = function (sport) {
        $http.post(path, sport).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    }

    self.delete = function (sport) {
        $http.delete(path + '/' + sport.name).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    }

}]);