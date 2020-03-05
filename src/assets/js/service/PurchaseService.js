APP.service('PurchaseService', ['$http', function ($http) {

    var self = this;

    const path = "http://localhost:8094/rocky-marciano" + '/purchases';

    self.save = function (purchase) {
        return $http.post(path, purchase);
    };

    self.get = function (id) {
        return $http.get(path + '/' + id);
    };

    self.getByClientId = function (id) {
        return $http.get(path + '?clientId=' + id);
    };

    self.getByProductId = function (id) {
        return $http.get(path + '?productId=' + id);
    };

    self.getAll = function () {
        return $http.get(path);
    };

    self.getSplitted = function(purchases) {
        var retval = {
            "sport": [], "merchandise": [], "other": [],
        };

        purchases.forEach(function (purchase) {
            if (purchase.product.type == "sport") {
                retval["sport"].push(purchase);
            } else if (purchase.product.type == "merchandise") {
                retval["merchandise"].push(purchase);
            } else {
                retval["other"].push(purchase);
            }
        });

        return retval;
    };

    self.getLastPurchase = function(purchases) {
        return purchases[purchases.length -1];
    }

    self.delete = function (purchase) {
        $http.delete(path + '/' + purchase.id).then(function (success) {
            console.log('deleted: ', purchase.id)
        }, function (error) {
            console.log(error);
        });
    }

}]);