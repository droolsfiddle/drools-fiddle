function Hello($scope, $http) {
    $http.get('http://127.0.0.1:8080/drools-fiddle/rest/message/').
        success(function(data) {
            $scope.message = data;
        });
}