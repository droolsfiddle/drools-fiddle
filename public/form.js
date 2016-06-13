var helloAjaxApp = angular.module("helloAjaxApp", []);

helloAjaxApp.controller("myController", ['$scope', '$http', function($scope, $http) {


	$scope.submitDrl = function(){

		var dataObj = {
		        data : $scope.message.data,
		};

		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/drlCompile', dataObj);
//		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/drlParser', dataObj);
//		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/droolsverifier', dataObj);

		res.success(function(data, status, headers, config) {
            console.log(data);
            $scope.message = data;
            $scope.message.facts = JSON.stringify($scope.message.packages, null, 2);

		});
		res.error(function(data, status, headers, config) {
            console.log(data);
		});

	};
}]);