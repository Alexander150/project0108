app.controller('NodeCtrl', ['$scope', function($scope) {
	$scope.init = function(){
		$scope.div1 = null;
		$scope.div2 = null;
		$scope.getNodes();
	}

	$scope.getNodes = function(){
		$.getJSON("/nodes/get_nodes_in_order", function(res){
			$scope.nodes = res.nodes;
			$scope.$apply();
			$scope.draw($scope.nodes);
		});
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

	$scope.getLine = function(node, nextNode){
		var mainCurrentNode = document.getElementById("node_" + node).getBoundingClientRect();
		var mainTop = Math.round(mainCurrentNode.top + window.pageYOffset - document.body.clientTop);
		var mainLeft = Math.round(mainCurrentNode.left + window.pageXOffset - document.body.clientLeft);
		var currentNode = document.getElementById("node_" + parseInt(nextNode)).getBoundingClientRect();
		var top = Math.round(currentNode.top + window.pageYOffset - document.body.clientTop);
		var left = Math.round(currentNode.left + window.pageXOffset - document.body.clientLeft);
		var path;
		if (mainLeft < left){
			path = $scope.setLine(node, nextNode, mainLeft, left, mainTop, top, 10, path, true);
		}else if (mainLeft > left){
			path = $scope.setLine(node, nextNode, left, mainLeft, top, mainTop, 10, path, true);
		}else if (mainLeft == left){
			if (mainTop < top){
				path = $scope.setLine(node, nextNode, mainTop, top, mainLeft, left, 10, path, false);
			}else{
				path = $scope.setLine(node, nextNode, top, mainTop, left, mainLeft, 10, path, false);
			}
		}
		document.getElementById("nodes").innerHTML += path;
	}

	$scope.setLine = function(node, nextNode, toStart, toFinish, topOrLeft1, topOrLeft2, fixed, path, leftOrTop){
		var color = $scope.getRandomColor();
		var start = toStart + 100;
		var onePart = Math.abs(toStart - toFinish) / 3;
		var firstPoint = toStart + onePart;
		var secondPoint = firstPoint + onePart;
		var finish = toFinish + 100;
		if (leftOrTop){
			path = '<path ng-click="watch($event)" class="path" id="nodes_' + node + '_' + nextNode + '" d="M ' + start + ', ' + topOrLeft1 + ' C ' + firstPoint + ', ' + fixed + ' , ' + secondPoint + ', ' + fixed + ', ' + finish + ', ' + topOrLeft2 + '" style="stroke:' + color + '; stroke-width: 5; fill: none;"/>';
		}else{
			path = '<path ng-click="watch($event)" class="path" id="nodes_' + node + '_' + nextNode + '" d="M ' + start + ', ' + topOrLeft1 + ' C ' + fixed + ', ' + firstPoint + ' , ' + fixed + ', ' + secondPoint + ', ' + topOrLeft2 + ', ' + finish + '" style="stroke:' + color + '; stroke-width: 5; fill: none;"/>';
		}
		return path
	}

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
				$scope.init();
			})
			.fail(function() {
				console.log("error");
			});
			$scope.div1 = null;
			$scope.div2 = null;
	}

	$(document).on('click', 'path', function(){
		let path = $("#" + this.id);
		let node1 = $("#node_" + this.id.split("_")[1]);
		let node2 = $("#node_" + this.id.split("_")[2]);
		let shadowColor = path.css('stroke');
		let paths = document.getElementsByClassName("path");
		let nodes = document.getElementsByClassName("node");
		for (var i = 0; i < paths.length; i++) {
			$("#" + paths[i].id).css({
				'transform': 'none'
			});
		}
		for (var i = 0; i < nodes.length; i++) {
			$("#" + nodes[i].id).css({
				'box-shadow': 'none',
				'transform': 'none',
			});
		}
		path.css({
			'transform': 'translateY(40px)',
			'filter': 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 1))'
			// 'filter': 'drop-shadow(10 10 10 ' + shadowColor + ')'
		});
		node1.css({
			'box-shadow': '0 0 40px ' + shadowColor,
			'transform': 'translateY(40px)'
		});
		node2.css({
			'box-shadow': '0 0 40px ' + shadowColor,
			'transform': 'translateY(40px)'
		});
	});
}]);