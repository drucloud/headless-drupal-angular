'use strict';

// var mySite is defined in config.js

// Declare app level module which depends on filters, and services
var headlessDrupal = angular.module('headlessDrupal', [
  'ngRoute',
  'ngResource',
  'ngSanitize']);


// Viewloader
headlessDrupal.controller('ViewLoader', function($scope, $resource) {
  var viewService = $resource(mySite +':viewpath',
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

  // Initial dummy content for a "node":
  $scope.view = {
    'disclaimer': [{'value': 'This data is bundled into app.js, not loaded from the backend.'}],
    'title': [{'value': 'Headless Drupal + Angular.js'}],
    'body': [{'value': '<p>This demo shows how you can use a dynamic front-end (Angular.js) and a Drupal back-end to power a great user experience. Go ahead and click the number field below to start loading nodes.</p>'}]
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

