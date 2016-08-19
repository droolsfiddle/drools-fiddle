var helloAjaxApp = angular.module("helloAjaxApp", ['ngRoute']);

helloAjaxApp.config(
['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/:id', {}).
  otherwise({
    redirectTo: '/'
  });
}]);

helloAjaxApp.controller("myController", ['$scope',
        '$http', '$route', '$routeParams', '$location', function($scope, $http, $route, $routeParams, $location) {

    $scope.attribute = {};

    $scope.message = {};

	$scope.compileDrl = function(){

        // reset data and graph
        reset();

		var dataObj = {
		        data : btoa($scope.message.data),
		};

		var res = $http.post('/rest/message/drlCompile', dataObj);
//		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/drlParser', dataObj);
//		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/droolsverifier', dataObj);

		res.success(function(data, status, headers, config) {
            console.log(data);
            $scope.message.packages = data.packages;
            //$scope.message.packages = JSON.stringify($scope.message.packages, null, 2);

		});
		res.error(function(data, status, headers, config) {
            console.log(data);
		});
    };

	$scope.pushAttribute = function(iFactName){
	    console.log(iFactName);
        console.log($scope.attribute[iFactName]);

		var dataObj = {
		    data : btoa(JSON.stringify($scope.attribute[iFactName]))
		}

		//var options = {
        //  headers: { 'Content-Type': ['text/plain'] }
        //};

		var res = $http.post('/rest/facts/insert/' + iFactName, dataObj);

		res.success(function(data, status, headers, config) {
            //$scope.message.log = data.log
            console.log(data);

		});
		res.error(function(data, status, headers, config) {
            //$scope.message.log = data.log
            console.log(data);
		});

	};

    $scope.fireDrl = function(){

        var dataObj = {
                data : "",
        };

        var res = $http.post('/rest/message/drlFire', dataObj);

        res.success(function(data, status, headers, config) {
            console.log(data);
            //$scope.message.log = data.log

        });
        res.error(function(data, status, headers, config) {
            //$scope.message.log = data.log
            console.log(data);
        });
    };

    $scope.saveDrl = function(){

            var res = $http.post('/rest/context');

            res.success(function(data, status, headers, config) {
                console.log(data);
                if (data.result) {
                    $location.path('/'+data.contextId)
                }
            });
            res.error(function(data, status, headers, config) {
                //$scope.message.log = data.log
                console.log(data);
            });
     };

    $scope.$on('$routeChangeSuccess', function() {
        // $routeParams should be populated here
        console.log($routeParams);

        if (!$routeParams.id) {
            return;
        }

        var res = $http.get('/rest/context/'+$routeParams.id);

        res.success(function(data, status, headers, config) {
            console.log(data);
                if (data.result) {
                    $scope.message.data = data.drl;
                }
            });
            res.error(function(data, status, headers, config) {
                //$scope.message.log = data.log
                console.log(data);
            });
    });

}]);