var helloAjaxApp = angular.module("helloAjaxApp", []);

helloAjaxApp.controller("myController", ['$scope', '$http', function($scope, $http) {

    $scope.attribute = {};

	$scope.compileDrl = function(){

		var dataObj = {
		        data : $scope.message.data,
		};

		var res = $http.post('/drools-fiddle/rest/message/drlCompile', dataObj);
//		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/drlParser', dataObj);
//		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/droolsverifier', dataObj);

		res.success(function(data, status, headers, config) {
            console.log(data);
            $scope.message = data;
            //$scope.message.packages = JSON.stringify($scope.message.packages, null, 2);

		});
		res.error(function(data, status, headers, config) {
            console.log(data);
		});
    };

	$scope.pushAttribute = function(iFactName){
	    console.log(iFactName);
        console.log($scope.attribute[iFactName]);

		var dataObj = $scope.attribute[iFactName];

		var options = {
          headers: { 'Content-Type': ['text/plain'] }
        };

		var res = $http.post('/drools-fiddle/rest/facts/insert/' + iFactName, dataObj, options);

		res.success(function(data, status, headers, config) {
            $scope.message.log = data.log
            console.log(data);

		});
		res.error(function(data, status, headers, config) {
            $scope.message.log = data.log
            console.log(data);
		});

	};

    $scope.fireDrl = function(){

        var dataObj = {
                data : "",
        };

        var res = $http.post('/drools-fiddle/rest/message/drlFire', dataObj);

        res.success(function(data, status, headers, config) {
            console.log(data);
            $scope.message.log = data.log

        });
        res.error(function(data, status, headers, config) {
            $scope.message.log = data.log
            console.log(data);
        });
    };

}]);