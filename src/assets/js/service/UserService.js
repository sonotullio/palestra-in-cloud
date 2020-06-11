APP.service('UserService', [function () {

    var self = this;

    self.user;

    self.set = function (user) {
        self.user = user;
    }

    self.get = function () {
        return self.user;
    }

}]);
