/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowsGridCtrl
 * @description
 * # WorkflowsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowsGridCtrl', [
    '$scope',
    '$rootScope',
    'FormattingService',
    '$filter',
    function ($scope, $rootScope, FrmttSrvc, $filter) {
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.numContsPage = 10;
      $scope.currPage = 1;
      $scope.contLimit = $scope.previewMode ? 5 : undefined;
      $scope.descriptionLimit = 150;

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrlFromPath = FrmttSrvc.getGitReposWebUrlFromPath;
      $scope.getDateModified = FrmttSrvc.getDateModified;

      $scope.hasDescription = function(description) {
        // temporary
        return false;
        //
        if (description !== undefined && description !== null && description !== '' && $scope.homePage === false) {
          return 'search-with-description';
        } else {
          return '';
        }
      };

      /* Column Sorting */
      $scope.clickSortColumn = function(columnName) {
        if ($scope.sortColumn === columnName) {
          $scope.sortReverse = !$scope.sortReverse;
        } else {
          $scope.sortColumn = columnName;
          $scope.sortReverse = false;
        }
      };

      $scope.getIconClass = function(columnName) {
        if ($scope.sortColumn === columnName) {
          return !$scope.sortReverse ?
            'glyphicon-sort-by-alphabet' : 'glyphicon-sort-by-alphabet-alt';
        } else {
          return 'glyphicon-sort';
        }
      };

      /* Pagination */
      $scope.getFirstPage = function() {
        return 1;
      };

      $scope.getLastPage = function() {
        return Math.ceil($scope.filteredWorkflows.length / $scope.numContsPage);
      };

      $scope.changePage = function(nextPage) {
        if (nextPage) {
          /* Next Page*/
          if ($scope.currPage === $scope.getLastPage) return;
          $scope.currPage++;
        } else {
          /* Previous Page*/
          if ($scope.currPage === $scope.getFirstPage) return;
          $scope.currPage--;
        }
      };

      $scope.getListRange = function() {
        return {
          start: Math.min($scope.numContsPage * ($scope.currPage - 1),
                          $scope.filteredWorkflows.length),
          end: Math.min($scope.numContsPage * $scope.currPage - 1,
                        $scope.filteredWorkflows.length)
        };
      };

      $scope.getHumanReadableDescriptor = function(descriptor) {
        switch(descriptor) {
          case 'DOCKSTORE_CWL':
            return 'CWL';
          case 'DOCKSTORE_WDL' :
            return 'WDL';
          default :
            return 'n/a';
        }
      };

      $scope.$watch('searchQueryWorkflow', function(term) {
        $scope.filteredWorkflows = $filter('filter')($scope.workflows, term);
        $scope.entryCount = $scope.filteredWorkflows.length;
      });

      $scope.$watch('workflows', function() {
        $scope.filteredWorkflows = $filter('filter')($scope.workflows, $scope.searchQueryWorkflow);
        $scope.entryCount = $scope.filteredWorkflows.length;
      });
  }]);
