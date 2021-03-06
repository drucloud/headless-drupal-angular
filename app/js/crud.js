'use strict';

// var mySite is defined in config.js 

// Declare app level module which depends on filters, and services
var headlessDrupal = angular.module('headlessDrupal', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'naif.base64']);

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
                "href": mySite + "rest/type/node/article"
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
          ],
        "field_image":
	  [
	    {
		    "value": $scope.nodeimage.base64,
		    "filename": $scope.nodeimage.filename,
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
	$scope.test = $scope.nodeimage;
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

//Load user
headlessDrupal.controller('UserLoader', function($scope, $resource) {
  var nodeService = $resource(mySite +'user/:userId',
    { nodeId: '@userId' },
    {
      get: {
        method:'GET',
        transformRequest: function(data, headersGetter) {
                headersGetter()['Accept'] = 'application/hal+json'
                headersGetter()['Authorization'] = 'Basic ' + passphase
        }
      }
    });

  $scope.load = function() {
    if (Number.isInteger($scope.userId) && $scope.userId > 0) {
      loadNode($scope.userId)
    }
  }

  // Load a node helper function.
  function loadNode(uid, callback) {
    var user = nodeService.get({'userId': uid}, function() {
      $scope.user = user
      if (typeof callback === "function") {
        // Call it, since we have confirmed it is callable
        callback(uid);
      }
    });
  }
});

headlessDrupal.controller('UserCreator', function($scope, $resource) {
  var userService = $resource(mySite +'entity/user',
    { }, //No param for post
    {
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
  $scope.udata = {
	       "_links":
	       {
		   "type":
		   {
		       "href": mySite + "rest/type/user/user"
		   }
	       },
	       "langcode":
	       [
		   {
		       "value": "en"
		   }
	       ],
	       "name":
	       [
		   {
		       "value": $scope.username
		   }
	       ],
	       "pass":
	       [
		   {
		       "value": $scope.password
		   }
	       ],
	       "mail":
	       [
		   {
		       "value": $scope.email
		   }
	       ],
	       "status":
	       [
		   {
		       "value": "1"
		   }
	       ],
	       "roles":
	       [
		   {
		       "target_id": "editor"
		   },
	           { //It need to put here to assign role
			"target_id": "authenticated"
		   }
	       ]
    	}

    if ($scope.udata) {
      createUser($scope.udata)
    }
  }

  // create a node helper function.
  function createUser(udata, callback) {
    var user = userService.save({}, udata, function(response) {
      if (typeof callback === "function") {
        // Call it, since we have confirmed it is callable
        callback(response);
        $scope.message = "user created";
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
  var request_url = mySite + path 
  var viewService = $resource( request_url.replace(/%2F/g, "/"), //encode problem not solved, but still functioning
//Empty for view GET
    {},
    {
      get: {
        method:'GET',
        transformRequest: function(data, headersGetter) {
                headersGetter()['Accept'] = 'application/hal+json',
	        headersGetter()['Authorization'] = 'Basic ' + passphase
        }
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


