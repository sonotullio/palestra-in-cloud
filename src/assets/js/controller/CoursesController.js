APP.controller('CoursesController', ['$scope', '$stateParams', '$state', 'CoursesService', 'DownloadService', '$http', '$filter', 'apiUrl',
    function ($scope, $stateParams, $state, CoursesService, DownloadService, $http, $filter, apiUrl) {

        $scope.downloadTemplate = function() {
            CoursesService.downloadTemplate().then(function(success){
                var filename = "plan_template.xlsx";
                DownloadService.downloadExcel(success.data, filename);
            });

        }

        $scope.uploadFile = function(file) {
            var url = apiUrl + "/courses/import";
            $scope.uploadFileToUrl(file, url);
        };

        $scope.uploadFileToUrl = function(file, url) {
            var fd = new FormData();
            fd.append('file', file);
            //fd.append('date', $scope.date);

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(
                function successCallback(response) {
                    $scope.strategiesUpdated = [];

                    response.data.forEach(function (strategy) {
                        if (strategy.dateCreated !== strategy.lastUpdated) {
                            $scope.strategiesUpdated.push(strategy);
                        }
                    });

                    $scope.responseMsg =
                        'Created: ' + (response.data.length - $scope.strategiesUpdated.length) + ' Exposures' +
                        'Updated: ' + $scope.strategiesUpdated.length + ' Exposures';

                    $scope.myFile = null;
                },
                function errorCallback(response) {
                    $scope.myFile = null;
                    $scope.errorMsg = response.data.message;
                });
        };

        $scope.updateSearch = function () {
            $scope.search = $filter('date')($scope.search, 'yyyy-MM-dd');

            CoursesService.getAllByDate($scope.search).then(function (success) {
                $scope.courses = success.data;
            })

        }

    }]);
