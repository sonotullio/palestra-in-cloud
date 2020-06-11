APP.controller('CoursesController', ['$rootScope', '$scope', '$state', '$stateParams', 'CoursesService', 'UserService', '$filter', '$http',
    function ($rootScope, $scope, $state, $stateParams, CoursesService, UserService, $filter, $http) {

        $scope.user = UserService.get();
        $scope.today = new Date();
        $scope.search = $scope.today;

        $scope.updateSearch = function () {
            if ($scope.user) {
                $scope.search = $filter('date')($scope.search, 'yyyy-MM-dd');

                CoursesService.getAllByDate($scope.search).then(function (success) {
                    $scope.courses = success.data;
                })
            }

        }

        $scope.updateSearch();

        $scope.prenotato = function(course) {
            var prenotato = false;

            course.clients.forEach(function (user) {
                if (user.email == $scope.user.email) {
                    console.log('prenotato: ' + course.sport + ' ' + course.startTime + ' - ' + $scope.user.email);
                    prenotato = true;
                }
            })

            return prenotato;
        }

        $scope.prenota = function (course) {
            if ($scope.user) {
                course.clients.push($scope.user);
                CoursesService.save(course).then(function (success) {
                    course = success.data;
                    $scope.updateSearch();
                }, function (error) {
                    alert(error.data.message);
                })
            } else {
                alert('Effettuare il login per poter prenotare.')
            }
        }

        $scope.annullaPrenotazione = function (course) {
            course.clients.forEach(function (user, index) {
                if (user.email == $scope.user.email) {
                    course.clients.splice(index, 1);
                }
            });

            course.prenotation --;

            CoursesService.save(course).then(function (success) {
                $scope.updateSearch();
            })
        }

        $scope.courseDetails = function (course) {
            $scope.selectedCourse = course;
            UIkit.modal('#course-details').show();
        }

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

    }]);
