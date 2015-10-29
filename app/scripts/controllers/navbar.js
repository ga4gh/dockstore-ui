'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('NavbarCtrl', [
    '$scope',
    '$auth',
    '$location',
    'UserService',
    'NotificationService',
    function ($scope, $auth, $location, UserService, NtfnService) {
    
      var userObj = UserService.getUserObj();
      $scope.username = userObj ? userObj.username : '';

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.logout = function() {
        UserService.logout();
      };

  }]);
