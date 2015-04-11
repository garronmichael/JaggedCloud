

(function() {

  angular
    .module('hackbox')
    .controller('createInterviewCtrl', CreateInterviewCtrl);

    CreateInterviewCtrl.$inject = ['$scope', 'Room'];

    function CreateInterviewCtrl($scope, Room) {
      $scope.interview = {name: "firstname lastname", email: "email", time: ''};

      $scope.reset = function() {
        console.log('reset');
      };

      $scope.createInterview = function(a,b,c) {
        Room.createRoom($scope.interview);
      };

      $scope.reset();
    }

})();