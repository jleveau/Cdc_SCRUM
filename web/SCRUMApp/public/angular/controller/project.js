//angular modules
angular.module('Project', [])
    .controller('ProjectController', ['$scope', '$routeParams','$location','$http', 'Projects',
                                            function($scope, $routeParams,$location,$http,Projects) {

        $scope.params = $routeParams;
        $scope.new_project = {};

        // TODO getCurrent_User($scope.params.id)
        $scope.user = {
            username: "username"
        };

        //TODO Get project

        Projects.get($scope.params.project_id).then(function(response){
            $scope.project = response.data;
            Projects.setProject($scope.project);
        });


        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

    }]);