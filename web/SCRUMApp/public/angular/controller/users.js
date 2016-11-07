//angular modules
angular.module('User',[])

    .controller('UserController', ['$scope','$routeParams','Projects','$http','$location','AuthService',
        function($scope,$routeParams,Projects,$http,$location,AuthService) {
        $scope.params = $routeParams;
        $scope.users = [];
        $scope.users_search = [];


        $http.get('users/allusers').then(function(response){
            $scope.users = response.data;
            $scope.users_search = $scope.users;
        });

        if ($scope.params.user_id){
            $http.get('users/info/' + $scope.params.user_id).then(function(response){
                $scope.user = response.data;
                $scope.user.projects = [];
            }).then(function(){
                $http.get('users/userprojects/' + $scope.user._id).then(function(response){
                    $scope.user.projects= response.data;
                });
            });
        }

        AuthService.getCurrentUser().then(function(){
            $scope.current_user = AuthService.getUserStatus();
        });


        ////////// SearchBar
        //TO DO replace with request to get all public projects + logged user project
        Projects.getAll().then(function(response){
                $scope.projects = response;
                $scope.projects_search = $scope.projects;
            }, function(response){
                $scope.data = response.status;
                $scope.projects_search = $scope.projects;
            }
        );

        $scope.limit = 5; // max 10 project loaded
        $scope.searchProject = '';

        $scope.setProject = function (project) {
            angular.copy(project,$scope.searchProject);
        };

        $scope.go = function ( path ) {
            $location.path( path );
        };

        $scope.go_to_project = function ( ) {
            $location.path( "/project/" + $scope.searchProject._id);
        };
        ///////// End Searchbar
    }]);