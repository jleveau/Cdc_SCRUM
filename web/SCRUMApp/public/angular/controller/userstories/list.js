angular.module('UserStories')
    .controller('UserStoriesListController', ['$scope', '$location', 'UserStoriesServices',
        function ($scope, $location, UserStoriesServices) {

            $scope.user_story = {};
            $scope.view_us = function(us_num){
                alert("us number is "+us_num);
            };
            
            $scope.update_us = function (us) {
                $location.path();

     // TODO créer une nouvelle view avec un formulaire comme pour ajout US. passer le ID user afficher US et ajouter update.


            };

            $scope.view_sprint = function (sprint_num) {
                alert("sprint_num is "+sprint_num);
            };

            $scope.updatePriorityUs = function (user_story) {

            }

            $scope.updateCostUs = function (user_story) {

            }

            $scope.delete_us = function (us) {
                var _id = us._id;
                var index = $scope.listUserStories.indexOf(us);
                UserStoriesServices.delete($scope.params.project_id, _id).then(function(response){
                    $scope.listUserStories.splice(index,1);
                    $location.path( "/project/" + $scope.params.project_id + "/backlog");
                });
            };

            if ($scope.params.project_id){
                UserStoriesServices.get($scope.params.project_id).then(function(response){
                    $scope.listUserStories = response.data;
                    UserStoriesServices.setListUS($scope.listUserStories);
                });
            };
    }]);