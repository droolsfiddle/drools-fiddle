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
                  no_additional_properties: true,
                  display_required_only: false
              }
          }
  });

}]);

helloAjaxApp.controller("myController", ['$scope',
        '$http', '$route', '$routeParams', '$location', function($scope, $http, $route, $routeParams, $location) {

    $scope.attribute = {};

    $scope.editor = ace.edit("editor");

    $scope.mySchema = {"type":"object", "title":"Facts"};

    $scope.myStartVal = undefined;

    $scope.onChange = function (data) {
        console.log('Form changed!');
        console.dir(data);
    };

	$scope.compileDrl = function(){

        // reset data and graph
        reset();
        $('#theTabs a[data-target="#drl"]').tab('show');
        $('#firebtn').addClass("disabled");
        $scope.mySchema = {"type":"object", "title":"Facts"};
        $scope.myStartVal = undefined;

		var dataObj = {
		        data : btoa($scope.editor.getValue()),
		};

		var res = $http.post(window.location.pathname+'rest/drools/drlCompile', dataObj);

		res.success(function(data, status, headers, config) {
            console.log(data);
            if (data.success) {
                $scope.myStartVal = undefined;
                $scope.mySchema = data.jsonSchema;
                $('#theTabs a[data-target="#facts"]').tab('show');
                $('#firebtn').removeClass("disabled");
            }
		});
		res.error(function(data, status, headers, config) {
            console.log(data);
		});
    };

    $scope.fireDrl = function(){
        var dataObj = {
                data : "",
        };

        var res = $http.post(window.location.pathname+'rest/drools/drlFire', dataObj);

        res.success(function(data, status, headers, config) {
            console.log(data);

        });
        res.error(function(data, status, headers, config) {
            console.log(data);
        });
    };

    $scope.saveDrl = function(){
            var res = $http.post(window.location.pathname+'rest/context');

            res.success(function(data, status, headers, config) {
                console.log(data);
                if (data.result) {
                    $location.path('/'+data.contextId)
                }
            });
            res.error(function(data, status, headers, config) {
                console.log(data);
            });
     };

    $scope.$on('$routeChangeSuccess', function() {
        // $routeParams should be populated here
        console.log($routeParams);

        if (!$routeParams.id) {
            return;
        }

        var res = $http.get(window.location.pathname+'rest/context/'+$routeParams.id);

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

                  var res = $http.post(window.location.pathname+'rest/facts/insert/' + key, msg);

                  res.success(function(data, status, headers, config) {
                      console.log(data);

                  });
                  res.error(function(data, status, headers, config) {
                      console.log(data);
                  });
              }
          };

   });