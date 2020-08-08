app.controller('NodeCtrl', ['$scope', function($scope) {
	$scope.init = function(){
		$scope.getNodes();
		setTimeout(function(){
			$scope.draw($scope.nodes);
		}, 2000);
	}
	$scope.getNodes = function(){
		$.getJSON("/nodes/get_nodes_in_order", function(res){
			$scope.nodes = res.nodes;
			$scope.$apply();
		});
	}

	$scope.div1 = null;
	$scope.div2 = null;
	$scope.change = function($event){
		if ($scope.div1 == null) {
			$scope.div1 = document.getElementById($event.currentTarget.id);
			$scope.div1.style.background = 'red';
		}else{
			$scope.div2 = document.getElementById($event.currentTarget.id);
			$scope.div2.style.background = 'yellow';
		}
		if ($scope.div1 != null && $scope.div2 != null){
			$scope.div1.style.background = 'lightblue';
			$scope.div2.style.background = 'lightblue';
			var div11 = $scope.div1.cloneNode(true);
			var div22 = $scope.div2.cloneNode(true);
			$scope.div2.parentNode.insertBefore(div11,$scope.div2);
			$scope.div1.parentNode.insertBefore(div22,$scope.div1);
			$scope.div1.parentNode.removeChild($scope.div1);
			$scope.div2.parentNode.removeChild($scope.div2);
			$.ajax({
				url: '/nodes/change',
				type: 'POST',
				data: {
					id_1: $scope.div1.id,
					id_2: $scope.div2.id
				},
			})
			.done(function() {
				console.log("success");
				location.reload();
			})
			.fail(function() {
				console.log("error");
			});
			$scope.div1 = null;
			$scope.div2 = null;
		}
	}

	$scope.draw = function(nodes){
		var nextNodes = [];
		var tops = [];
		var lefts = [];
		nextNodes += [nodes[0].id];
		for (var i = 0; i < nodes.length; i++) {
			nextNodes += [nodes[i].next_node];
		}
		var currentNode;
		for (var i = 0; i < nextNodes.length; i++) {
			currentNode = document.getElementById("node_" + nextNodes[i]).getBoundingClientRect();
			var top = currentNode.top + window.pageYOffset - document.body.clientTop+100;
			var left = currentNode.left + window.pageXOffset - document.body.clientLeft+100;
			tops.push(top);
			lefts.push(left);
		}
		for (var i = 0; i < tops.length-1; i++) {
			var line = "<line class='line' x1='" + Math.round(lefts[i]) + "' y1='" + Math.round(tops[i]) + "' x2='" + Math.round(lefts[i+1]) + "' y2='" + Math.round(tops[i+1]) + "'/>"
			document.getElementById("nodes").innerHTML += line;
		}
	}

}]);