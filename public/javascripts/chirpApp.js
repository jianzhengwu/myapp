//we store main angular controllers in this page
var app = angular.module('chirpApp', ['ngRoute', 'ngResource']) //register angular module "chirpApp"

//define the authentification. Each controller only has access to its own $scope, but they all have access to the $rootScope
//that's why we hold autentification there
app.run(function($rootScope, $http){
  $rootScope.authenticated = false;
  $rootScope.current_user='';
  
  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
}); 

//define the routing
app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

//define a service to fetch REST data from server
app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});
//define the controllers
app.controller('mainController', function(postService, $scope, $rootScope){
    $scope.posts = postService.query();
    $scope.newPost = {created_by: '', text: '', created_at: ''};

    $scope.post = function(){
        //this function will be called when we do form submit because of Angular's ng-submit="post()""
        $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost,function(){
          $scope.posts = postService.query();
	        $scope.newPost = {created_by: '', text: '', created_at: ''};
        })
        $scope.posts.push($scope.newPost);
        $scope.newPost = {created_by: '', text: '', created_at: ''};
    };
});
app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''}; //databinding with user in login.html
  $scope.error_message = '';

//function to be called when ng-submit = login()
  $scope.login = function(){ 
    $http.post ('/auth/login', $scope.user).success(function(data){
      if (data.state === 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }else{
        $scope.error_message=data.message;
      }
    });
  };
//function to be called when ng-submit = signup
  $scope.register = function(){
    //below post will post the path and user info to nodejs, which will do route handler based on the path
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});
