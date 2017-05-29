'use strict';

var myApp = angular.module('myApp', [
  'ngRoute',
]);

myApp.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: '/static/partials/index.html',
      }).
      when('/instances', {
        templateUrl: '/static/partials/instances.html',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

myApp.service('instancesService', function() {
  var instances = [];

  var addInstance = function(obj){
      instances.push(obj);
  };

  var getInstances = function(obj){
    return instances;
  };

  return {
    addInstance: addInstance,
    getInstances: getInstances
  };
});

myApp.controller('APIFormController', ['$scope', '$http', '$location', 'instancesService', function($scope, $http, $location, instancesService) {
  $scope.apiKeys;

  $scope.sendKeys = function() {
    $http({
      method: 'POST',
      url: 'http://localhost:8000/keys',
      data: {
        "public": $scope.apiKeys.public,
        "private": $scope.apiKeys.private
      },
      headers: {
        'Content-Type': "application/json"
      }
    }).then(
      function success(response){
        for (var i = 0; i < response.data.length; i++){
          instancesService.addInstance(response.data[i]);
        }
        $location.path("/instances");
      },
      function error(){
        // display the errors
        alert("An error occurred!");
      }
    );
  };
}]);


myApp.controller('InstancesViewController', ['$scope', 'instancesService', function($scope, instancesService) {
  $scope.instances = instancesService.getInstances();

}]);
