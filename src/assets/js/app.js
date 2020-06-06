var APP = angular.module('myApp', [
    'ui.router',
    'myApp.config',
]);

APP.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {

    };
    $httpProvider.defaults.headers.post = {
        "Content-Type": "application/json; charset=utf-8"
    };
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);

APP.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

APP.run([function () {
    console.log('Palestra in Cloud is running!');
}]);
