'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowDagView
 * @description
 * # WorkflowDagViewCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowDagViewCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {
      $scope.dagJson = "";
      var cy;

      $scope.getWorkflowVersions = function() {
        var sortedVersionObjs = $scope.workflowObj.workflowVersions;
        sortedVersionObjs.sort(function(a, b) {
          if (a.name === 'master') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var versions = [];
        for (var i = 0; i < sortedVersionObjs.length; i++) {
          if (!sortedVersionObjs[i].hidden) {
            versions.push(sortedVersionObjs[i].name);
          }
        }
        return versions;
      };

      $scope.nodesAndEdges = function(workflowId, workflowVersions) {
      var workflowVersionId;
      if (workflowVersions.length == 0) {
        return null;
      }
      for (var i = 0; i < workflowVersions.length; i++) {
        if (workflowVersions[i].name === $scope.selVersionName) {
          if (workflowVersions[i].valid) {
            workflowVersionId = workflowVersions[i].id;
            break;
          } else {
            return null;
          }
        }
      }
        return WorkflowService.getWorkflowDag(workflowId, workflowVersionId)
          .then(
            function(dagJson) {
              $scope.dagJson = dagJson;
              return dagJson;
            },
            function(response) {
              return $q.reject(response);
            });
      };

      $scope.setDocument = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        $scope.selVersionName = $scope.workflowVersions[0];

      };

      $scope.refreshDocument = function() {
        $scope.dagJson = $scope.nodesAndEdges($scope.workflowObj.id, $scope.workflowObj.workflowVersions);
        if ($scope.dagJson !== null){
        cy = window.cy = cytoscape({
      	  container: document.getElementById('cy'),

          boxSelectionEnabled: false,
          autounselectify: true,

      		layout: {
      		  name: 'dagre'
      		},

      		style: [
      			{
      				selector: 'node',
      				style: {
      					'content': 'data(name)',
      					'text-valign': 'center',
      					'text-halign': 'center',
      					'background-opacity': '0'
      				}
      			},

      			{
      				selector: 'edge',
      				style: {
      					'width': 4,
      					'target-arrow-shape': 'triangle',
      					'line-color': '#9dbaea',
      					'target-arrow-color': '#9dbaea'
      				}
      			}
      		],

      		elements: $scope.dagJson,
    		});

      	cy.on('tap', 'node', function(){
          try { // your browser may block popups
            window.open( this.data('tool') );
          } catch(e){ // fall back on url change
            window.location.href = this.data('tool');
          }
        });
        } else {
          cy = window.cy = null;
        }
      };

      $scope.setDocument();

  }]);
