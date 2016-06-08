function Hello($scope, $http) {
    $http.get('http://127.0.0.1:8080/test-project/rest/message/').
        success(function(data) {
            $scope.message = data;
        });
}