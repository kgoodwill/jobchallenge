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

myApp.controller('APIFormController', ['$scope', '$http', function($scope, $http) {
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
      function success(){
        // send to the instances page and display the data
      },
      function error(){
        // display the errors
      }
    );
  };
}]);
