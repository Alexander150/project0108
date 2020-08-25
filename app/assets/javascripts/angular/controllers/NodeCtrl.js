app.controller('NodeCtrl', ['$scope', function($scope) {
	$scope.init = function(){
		$scope.getNodes();
		setTimeout(function(){
			$scope.draw($scope.nodes);
		}, 1500);
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

	$scope.getRandomColor = function() {
  		var letters = '0123456789ABCDEF';
  		var color = '#';
  		for (var i = 0; i < 6; i++) {
    		color += letters[Math.floor(Math.random() * 16)];
  		}
  		return color;
	}

	$scope.getLine = function(node, nextNode){
		var mainCurrentNode = document.getElementById("node_" + node).getBoundingClientRect();
		var mainTop = mainCurrentNode.top + window.pageYOffset - document.body.clientTop + 100 - Math.round(10 - 0.5 + Math.random() * (50 - 10 + 1));
		var mainLeft = mainCurrentNode.left + window.pageXOffset - document.body.clientLeft + 100;
		var currentNode = document.getElementById("node_" + parseInt(nextNode)).getBoundingClientRect();
		var top = currentNode.top + window.pageYOffset - document.body.clientTop + 100 - Math.round(50 - 0.5 + Math.random() * (100 - 50 + 1)) + Math.round(100 - 0.5 + Math.random() * (150 - 100 + 1));
		var left = currentNode.left + window.pageXOffset - document.body.clientLeft + 100;
		var color = $scope.getRandomColor();
		var line = "<line style='stroke-width: 2; stroke:" + color + ";' class='line' x1='" + Math.round(mainLeft) + "' y1='" + Math.round(mainTop) + "' x2='" + Math.round(left) + "' y2='" + Math.round(top) + "'/>"
		document.getElementById("nodes").innerHTML += line;
	}

	$scope.draw = function(nodes){
		var nextNodes = [];
		var tops = [];
		var lefts = [];
		for (var i = 0; i < nodes.length; i++) {
			nextNodes.push(nodes[i].next_node);
		}
		for (var i = 0; i < nextNodes.length; i++) {
			if (nextNodes[i] == "") {
				continue;
			}
			if (nextNodes[i].length > 2) {
				var currentNodes = nextNodes[i].split(";");
				for (var j = 0; j < currentNodes.length; j++) {
					if (currentNodes[j] == ""){
						continue;
					}
					$scope.getLine(nodes[i].id, currentNodes[j]);
				}
			}else{
				if (nextNodes[i][nextNodes[i].length-1] == ';'){
					nextNodes[i] = nextNodes[i].substring(0, nextNodes[i].length - 1);
				}
				$scope.getLine(nodes[i].id, nextNodes[i]);
			}
		}
	}

}]);