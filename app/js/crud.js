'use strict';

// var mySite is defined in config.js 

// Declare app level module which depends on filters, and services
var headlessDrupal = angular.module('headlessDrupal', [
  'ngRoute',
  'ngResource',
  'ngSanitize']);

headlessDrupal.controller('NodeLoader', function($scope, $resource) {
  var nodeService = $resource(mySite +'node/:nodeId',
    { nodeId: '@nodeId' },
    {
      get: {
        method:'GET',
        transformRequest: function(data, headersGetter) {
                headersGetter()['Accept'] = 'application/hal+json'
        }
      }
    });

  $scope.load = function() {
    if (Number.isInteger($scope.nodeId) && $scope.nodeId > 0) {
      loadNode($scope.nodeId)
    }
  }

  // Initial dummy content for a "node":
  $scope.node = {
    'disclaimer': [{'value': 'This data is bundled into app.js, not loaded from the backend.'}],
    'title': [{'value': 'Headless Drupal + Angular.js'}],
    'body': [{'value': '<p>This demo shows how you can use a dynamic front-end (Angular.js) and a Drupal back-end to power a great user experience. Go ahead and click the number field below to start loading nodes.</p>'}]
  }

  // Load a node helper function.
  function loadNode(nid, callback) {
    var node = nodeService.get({'nodeId': nid}, function() {
      $scope.node = node
      if (typeof callback === "function") {
        // Call it, since we have confirmed it is callable
        callback(nid);
      }
    });
  }
});


headlessDrupal.controller('NodeCreator', function($scope, $resource) {
  var nodeService = $resource(mySite +'entity/node',
    { }, //No param for post
    {
      testtransform : {
        method:'POST',
        transformRequest: function(data, headersGetter) {
                headersGetter()['Authorization'] = 'Basic ' + passphase
                headersGetter()['Content-Type'] = 'application/hal+json'
        },
      },
      save : {
        method:'POST',
        headers: {
            "Content-Type" : 'application/hal+json',
	    "Authorization" : 'Basic ' + passphase,
        },
      }
    }
  );
  //Form the data and 
  $scope.post = function() {
  $scope.ndata =
        {
            "_links" : {
                "type":
                {
                "href": mySite + "rest/type/node/page"
                }
            },
        "langcode" : [
            {
            "value": "en"
            }
        ],
        "title" : {"value": $scope.nodetitle },
        "body" :
          [
            {
            "value": $scope.nodebody,
            "format": "basic_html",
            "summary": "",
            "lang": "en"
            }
          ]
        };

    if ($scope.ndata) {
      createNode($scope.ndata)
    }
  }

  // create a node helper function.
  function createNode(ndata, callback) {
    var node = nodeService.save({}, ndata, function(response) {
      if (typeof callback === "function") {
        // Call it, since we have confirmed it is callable
        callback(response);
        $scope.message = "node created";
      }
    }, function(error) {
       //Error handling
       $scope.error = error
    });
  }
});

// Viewloader
headlessDrupal.controller('ViewLoader', function($scope, $resource) {
  var path = ':viewpath'.replace(/%2F/g, "/")
  //var path = decodeURIComponent(':viewpath').replace(/\//, '%2F')
  var request_url = mySite + path 
  var viewService = $resource( request_url.replace(/%2F/g, "/"),
  //var viewService = $resource(mySite + 'rest/views/content',
//Empty for view GET
    {},
    {
      get: {
        method:'GET',
//        transformRequest: function(data, headersGetter) {
//                headersGetter()['Accept'] = 'application/hal+json',
//	        headersGetter()['Authorization'] = 'Basic ' + passphase
//        }
      }
    });

  $scope.load = function() {
    if (angular.isString($scope.viewpath)) {
      loadView($scope.viewpath)
    }
  }

  // Load a node helper function.
  function loadView(vid, callback) {
    var view = viewService.get({'viewpath': vid}, function() {
      $scope.view = view
      if (typeof callback === "function") {
        // Call it, since we have confirmed it is callable
        callback();
      }
    });
  }
});


