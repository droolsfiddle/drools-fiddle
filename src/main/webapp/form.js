var helloAjaxApp = angular.module("helloAjaxApp", ['ngRoute', 'angular-json-editor']);

helloAjaxApp.config(
['$routeProvider', 'JSONEditorProvider', function($routeProvider, JSONEditorProvider) {
  $routeProvider.
  when('/:id', {}).
  otherwise({
    redirectTo: '/'
  });

  JSONEditorProvider.configure({
          defaults: {
              options: {
                  iconlib: 'bootstrap3',
                  theme: 'bootstrap3',
                  disable_edit_json: true,
                  disable_properties: false,
                  no_additional_properties: true
              }
          }
  });

}]);

helloAjaxApp.controller("myController", ['$scope',
        '$http', '$route', '$routeParams', '$location', function($scope, $http, $route, $routeParams, $location) {

    $scope.attribute = {};

    //$scope.message = {};
    $scope.editor = ace.edit("editor");

    $scope.mySchema = {};

    $scope.myStartVal = {};

    $scope.onChange = function (data) {
        console.log('Form changed!');
        console.dir(data);
    };

	$scope.compileDrl = function(){

        // reset data and graph
        reset();

		var dataObj = {
		        data : btoa($scope.editor.getValue()),
		};

		var res = $http.post('/rest/message/drlCompile', dataObj);

		res.success(function(data, status, headers, config) {
            console.log(data);
            //$scope.message.packages = data.packages;
            $scope.mySchema = data.jsonSchema;
            //$scope.message.packages = JSON.stringify($scope.message.packages, null, 2);

		});
		res.error(function(data, status, headers, config) {
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
                    $scope.editor.setValue(data.drl);
                }
            });
            res.error(function(data, status, headers, config) {
                console.log(data);
            });
    });

}]).controller('SyncButtonsController', function ($scope,$http) {

       /**
        * Custom actions controller which allows you to add any other buttons/actions to the form.
        */

         $scope.onSubmit = function () {
              var data = $scope.editor.getValue();
              console.log('onSubmit data in sync controller', data);

              for (var key in data) {
                  console.log(key);
                  console.log(data[key]);

                  var msg = {
                    "data" : btoa(JSON.stringify(data[key]))
                  }

                  var res = $http.post('/rest/facts/insert/' + key, msg);

                  res.success(function(data, status, headers, config) {
                      console.log(data);

                  });
                  res.error(function(data, status, headers, config) {
                      console.log(data);
                  });
              }
          };

   });