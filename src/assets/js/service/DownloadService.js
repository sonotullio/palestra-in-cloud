APP.service('DownloadService', ['$http', 'apiUrl', function ($http, apiUrl) {

    var self = this;

    self.downloadExcel = function (data, fileName) {
        var file = new Blob([data], {type: 'application/vnd.ms-excel'});
        //IE11 & Edge
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(file, fileName);
        } else {
            //In FF link must be added to DOM to be clicked
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(file);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    self.uploadFileToUrl = function (fd, url) {

        url = apiUrl + url;

        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            data: {date:new Date()}
        });

    }

    return self;

}])
