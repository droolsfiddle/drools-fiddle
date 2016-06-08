var helloAjaxApp = angular.module("helloAjaxApp", []);

helloAjaxApp.controller("myController", ['$scope', '$http', function($scope, $http) {


	$scope.submitDrl = function(){

		var dataObj = {
		        id   : $scope.id,
		        data : $scope.data,

		};

		var res = $http.post('http://127.0.0.1:8080/drools-fiddle/rest/message/submitdrl', dataObj);
		res.success(function(data, status, headers, config) {
            console.log(data);
		});
		res.error(function(data, status, headers, config) {
            console.log("NO");
		});

	};
}]);