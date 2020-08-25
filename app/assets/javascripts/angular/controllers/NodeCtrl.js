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

	$scope.draw = function(nodes){
		var nextNodes = [];
		var tops = [];
		var lefts = [];
		for (var i = 0; i < nodes.length; i++) {
			nextNodes.push(nodes[i].next_node);
		}
		var currentNode;
		for (var i = 0; i < nextNodes.length; i++) {
			if (nextNodes[i] == "") {
				continue;
			}
			var mainCurrentNode = document.getElementById("node_" + nodes[i].id).getBoundingClientRect();
			var mainTop = mainCurrentNode.top + window.pageYOffset - document.body.clientTop + 100 - i*10;
			var mainLeft = mainCurrentNode.left + window.pageXOffset - document.body.clientLeft + 100;
			if (nextNodes[i].length > 2) {
				var currentNodes = nextNodes[i].split(";");
				for (var j = 0; j < currentNodes.length; j++) {
					if (currentNodes[j] == ""){
						continue;
					}
					currentNode = document.getElementById("node_" + parseInt(currentNodes[j])).getBoundingClientRect();
					var top = currentNode.top + window.pageYOffset - document.body.clientTop + 100 - i*5 + j*30;
					var left = currentNode.left + window.pageXOffset - document.body.clientLeft + 100;
					var color = $scope.getRandomColor();
					var line = "<line style='stroke-width: 2; stroke:" + color + ";' class='line' x1='" + Math.round(mainLeft) + "' y1='" + Math.round(mainTop) + "' x2='" + Math.round(left) + "' y2='" + Math.round(top) + "'/>"
					document.getElementById("nodes").innerHTML += line;

				}
			}else{
				if (nextNodes[i][nextNodes[i].length-1] == ';'){
					nextNodes[i] = nextNodes[i].substring(0, nextNodes[i].length - 1);
				}
				currentNode = document.getElementById("node_" + nextNodes[i]).getBoundingClientRect();
				var top = currentNode.top + window.pageYOffset - document.body.clientTop+100;
				var left = currentNode.left + window.pageXOffset - document.body.clientLeft+100;
				var color = $scope.getRandomColor();
				var line = "<line style='stroke-width: 2; stroke:" + color + ";' class='line' x1='" + Math.round(mainLeft) + "' y1='" + Math.round(mainTop) + "' x2='" + Math.round(left) + "' y2='" + Math.round(top) + "'/>"
				document.getElementById("nodes").innerHTML += line;
			}
		}
	}

}]);