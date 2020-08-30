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

	$scope.notOk = function(){
		$("#isOk").css({
			'opacity': '0',
			'z-index': "0"
		});
		$("#" + $scope.div1.id).css({
			'-webkit-transform': 'rotateZ(0deg)',
			'-ms-transform': 'rotateZ(0deg)',
			'transform': 'rotateZ(0deg)'
		});
		$("#" + $scope.div2.id).css({
			'-webkit-transform': 'rotateZ(0deg)',
			'-ms-transform': 'rotateZ(0deg)',
			'transform': 'rotateZ(0deg)'
		});
		$scope.div1 = null;
		$scope.div2 = null;
	}

	$scope.isOk = function(yesOrNo){
		if (yesOrNo){
			$scope.send($scope.div1.id, $scope.div2.id);
			$("#isOk").css({
			'opacity': "0",
			'z-index': "0"
		});
		}else{
			$scope.notOk();
		}
	}

	$scope.send = function(id1, id2){
		$.ajax({
				url: '/nodes/change',
				type: 'POST',
				data: {
					id_1: id1,
					id_2: id2
				},
			})
			.done(function() {
				console.log("success");
				// location.reload();
				$scope.init();
			})
			.fail(function() {
				console.log("error");
			});
			$scope.div1 = null;
			$scope.div2 = null;
	}

	$scope.div1 = null;
	$scope.div2 = null;
	$scope.change = function($event){
		if ($scope.div1 == null) {
			$scope.div1 = document.getElementById($event.currentTarget.id);
			$("#" + $scope.div1.id).css({
				'-webkit-transform': 'rotateZ(20deg)',
				'-ms-transform': 'rotateZ(20deg)',
				'transform': 'rotateZ(20deg)',
			});
		}else{
			$scope.div2 = document.getElementById($event.currentTarget.id);
			$("#" + $event.currentTarget.id).css({
				'-webkit-transform': 'rotateZ(20deg)',
				'-ms-transform': 'rotateZ(20deg)',
				'transform': 'rotateZ(20deg)',
			});
		}
		if ($scope.div1.id == $scope.div2.id){
			return;
		}
		if ($scope.div1 != null && $scope.div2 != null){
			$("#isOk").css({
				'opacity': "1",
				'z-index': "100"
			});
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

	$scope.setLine = function(toStart, toFinish, topOrLeft1, topOrLeft2, fixed, path, leftOrTop){
		var color = $scope.getRandomColor();
		var start = toStart + 100;
		var onePart = Math.abs(toStart - toFinish) / 3;
		var firstPoint = toStart + onePart;
		var secondPoint = firstPoint + onePart;
		var finish = toFinish + 100;
		if (leftOrTop){
			path = '<path d="M ' + start + ', ' + topOrLeft1 + ' C ' + firstPoint + ', ' + fixed + ' , ' + secondPoint + ', ' + fixed + ', ' + finish + ', ' + topOrLeft2 + '" style="stroke:' + color + '; stroke-width: 3; fill: none;"/>';
		}else{
			path = '<path d="M ' + start + ', ' + topOrLeft1 + ' C ' + fixed + ', ' + firstPoint + ' , ' + fixed + ', ' + secondPoint + ', ' + topOrLeft2 + ', ' + finish + '" style="stroke:' + color + '; stroke-width: 3; fill: none;"/>';
		}
		return path
	}

	$scope.getLine = function(node, nextNode){
		var mainCurrentNode = document.getElementById("node_" + node).getBoundingClientRect();
		var mainTop = Math.round(mainCurrentNode.top + window.pageYOffset - document.body.clientTop);
		var mainLeft = Math.round(mainCurrentNode.left + window.pageXOffset - document.body.clientLeft);
		var currentNode = document.getElementById("node_" + parseInt(nextNode)).getBoundingClientRect();
		var top = Math.round(currentNode.top + window.pageYOffset - document.body.clientTop);
		var left = Math.round(currentNode.left + window.pageXOffset - document.body.clientLeft);
		var path;
		if (mainLeft < left){
			path = $scope.setLine(mainLeft, left, mainTop, top, 10, path, true);
		}else if (mainLeft > left){
			path = $scope.setLine(left, mainLeft, top, mainTop, 10, path, true);
		}else if (mainLeft == left){
			if (mainTop < top){
				path = $scope.setLine(mainTop, top, mainLeft, left, 10, path, false);
			}else{
				path = $scope.setLine(top, mainTop, left, mainLeft, 10, path, false);
			}
		}
		document.getElementById("nodes").innerHTML += path;
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