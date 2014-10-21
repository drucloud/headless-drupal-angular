'use strict';

// var mySite is defined in config.js

// Declare app level module which depends on filters, and services
var headlessDrupal = angular.module('headlessDrupal', [
  'ngRoute',
  'ngResource',
  'ngSanitize']);


// Viewloader
headlessDrupal.controller('ViewLoader', function($scope, $resource) {
  var viewService = $resource(mySite +'rest/views/content',
//Empty for view GET
    {},
    {
      get: {
        method:'GET',
        transformRequest: function(data, headersGetter) {
                headersGetter()['Accept'] = 'application/hal+json'
        }
      }
    });

  $scope.load = function() {
    if (angular.isString($scope.viewpath)) {
      $scope.viewpath = $scope.viewpath.replace(/2/g, '\/');
      loadView($scope.viewpath)
    }
  }

  // Load a node helper function.
  function loadView(vid, callback) {
    var view = viewService.get({'viewpath': vid}, function() {
      $scope.view = view
      if (typeof callback === "function") {
        // Call it, since we have confirmed it is callable
        callback(vid);
      }
    });
  }
});

