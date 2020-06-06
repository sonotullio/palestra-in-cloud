APP.service('ProductService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    const path = apiUrl + '/products';

    self.products  = [];

    self.getAll = function() {
        return $http.get(path);
    };

    self.products = self.getAll();

    self.save = function (product) {
        $http.post(path, product).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

    self.delete = function (product) {
        $http.delete(path + '/' + product.id).then(function (success) {
            self.getAll();
        }, function (error) {
            console.log(error);
        });
    };

}]);
