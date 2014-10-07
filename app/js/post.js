'use strict';

// Declare app level module which depends on filters, and services
var headlessDrupal = angular.module('headlessDrupal', [
  'ngRoute',
  'ngResource',
  'ngSanitize']);

headlessDrupal.controller('NodeCreator', function($scope, $resource) {
  var passphase = btoa("keithyau" + ':' + "thomas");
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
        $scope.message = response;
      }
    }, function(error) {
       //Error handling
       $scope.error = error
    });
  }
});
