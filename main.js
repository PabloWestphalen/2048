var grid;
var nums;
var blockWidth;
var blockHeight;
var blockSize;
var matrix = [[],[],[],[]];
var placenPieces = 0;

$(document).ready(function() {
	nums = ["#2AB767", "#26A65D", "#229654", "#1E854B", "#1A7441", "#176438", "#13532F", "#0F4325", "#0B321C", "#082113", "#041109"];

	setupGrid();
	setupMatrix();

	makePiece().fadeIn();
	makePiece().fadeIn();
	//makePiece().fadeIn();

	$(window).on("keydown swipeleft swiperight swipeup swipedown", function(evt) {
		movePieces(evt)	;
	});
});

function setupMatrix() {
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			matrix[i][j] = null;
		}
	}
}

function hasPiece(y, x) {
	console.log($(".numberBlock").length + "pieces in the grid");
	var result = isNull(matrix[y][x]);
	if(result) {
		console.log("Yay, index [" + y + "][" + x + "] is free");
	} else {
		console.log("Hmmm, there's already a piece at [" + y + "][" + x + "]");
	}
	return result;
}

function getRandom(limit) {
	if(!limit) {
		limit = 0;	
	}
	return Math.floor(Math.random() * limit);
}

function makePiece() {
	console.log('making a piece');
	//alert();
	var posX, posY, number;



	

	

	if(placenPieces == 0) {
		posX = 0;
		posY = 1;
		number = 2;
	} else if (placenPieces == 1) {
		posX = 3;
		posY = 3;
		number = 2;
	} else if (placenPieces == 2) {
		posX = 0;
		posY = 2;
		number = 1;
	} else {
		do {
			posX = getRandom(4);
			posY = getRandom(4);
		} while(!hasPiece(posY, posX));
		number = getRandom(2); 
	}

	

	var block = $("<div>", {
			"class": "numberBlock",
			"data-y": posY,
			"data-x": posX,
			"style": "left: " + getPos(posX) + ";"
				+ "top: " + getPos(posY) + ";"
				+ "background-color: " + nums[number] + ";"
				+ "line-height: " + blockSize + "px;"
				+ "font-size: " + (blockSize / 3) + "px;",
			"text": Math.pow(2, number+1),
			"id": "block" + placenPieces
			});

	matrix[posY][posX] = block[0];
	placenPieces++;
	grid.append(block);
	console.log('done making piece');
	return block;
}

function reversePow(n, factor) {
	if(n < factor) {
		return 0;
	}

	var i = 0;
	while(n > 1) {
		n /= factor;
		i++;
	}
	return i;
}


function calculateMove(block, direction) {
	var step = {};
	var x = parseInt(block.dataset.x);
	var y = parseInt(block.dataset.y);
	var targetX = x;
	var targetY = y;

	console.error("Calculating ", direction, " position for this guy: ", block);

	if(direction == "left" && x == 0) return false;
	if(direction == "up" && y == 0) return false;
	if(direction == "right" && x == 3) return false
	if(direction == "down"  && y == 3) return false;

	//make i the index for the target block to move to. it's either the first block with a number or the corner index 0
	console.group();
	if(direction == "left" || direction == "right") {console.log("His x index starts at ", x);}
	else {console.log("His y index starts at ", y);}

	if(direction == "left") {
		targetX-=1;
		while(targetX > 0 && hasPiece(targetY, targetX)) {
			targetX--;
		}
	} else if(direction == "up") {
		targetY-=1;
		while(targetY > 0 && hasPiece(targetY, targetX)) {
			targetY--;
		}
	} else if(direction == "right") {
		targetX+=1;
		while(targetX < 3 && hasPiece(targetY, targetX)) {
			targetX++;
		}
	} else if(direction == "down") {
		targetY+=1;
		while(targetY < 3 && hasPiece(targetY, targetX)) {
			targetY++;
		}
	}
	console.groupEnd();

	console.log("my target coord is [", targetY, "][", targetX, "]");
	targetBlock = matrix[targetY][targetX];

	if(!isNull(targetBlock)) { // if handling a block that is taken
		if($(targetBlock).text() == $(block).text()) { // and they have the same value, merge them
			$(block).text();
			step.merge = true;
			step.mergeTo = {};
			step.mergeTo.number = parseInt($(block).text() * 2);
			step.mergeTo.bgColor = nums[reversePow(parseInt($(block).text())), 2];
			step.mergeTo.targetBlock = targetBlock;
			//console.log("Giving this obj: ", step);
		} else { // otherwise, move to the next available block
			//alert('merge avoid');
			console.log("but meh, i can't merge");
			if(direction == "left") targetX++;
			if(direction == "right") targetX--;
			if(direction == "up") targetY++;
			if(direction == "down") targetY--;
			console.log("so my actual target will be [", targetY, "][", targetX, "]");
			
		}
	}

	step.x = targetX;
	step.y = targetY;
	step.leftPos = getPos(targetX);
	step.topPos = getPos(targetY);
	return step;
}

function movePieces(evt) {

	console.log(evt);
	
	if((evt.which >= 37 && evt.which <= 40) || evt.type.indexOf("swipe") == 0) {
		var blocks = $(".numberBlock"); //get all blocks;


		/*
		se eu cliquei pra direita
		eu vou começar por todas as peças da direita pra esquerda = do 3 pro 0 e diminuindo
		*/

		var startX, startY, endX, endY, incrX, incrY;
		var direction;

		if(evt.which == 37 || evt.type == "swipeleft") {
			for(var i = 0; i < 4; i++) { // vertical
				for(var j = 0; j < 4; j++) { //horizontal
					block = matrix[i][j];
					if(!isNull(block)) {
						moveBlock(block, "left");
					}
				}
			}
		}

		if(evt.which == 38 || evt.type == "swipeup") {
			for(var i = 0; i < 4; i++) { // vertical
				for(var j = 0; j < 4; j++) { //horizontal
					block = matrix[i][j];
					if(!isNull(block)) {
						moveBlock(block, "up");
					}
				}
			}
		}

		if(evt.which == 39 || evt.type == "swiperight") {
			for(var i = 0; i < 4; i++) { // vertical
				for(var j = 3; j >= 0; j--) { //horizontal

					console.log("Going to the matrix[" + i + "]" + "[" + j + "]");
					block = matrix[i][j];
					if(!isNull(block)) {
						moveBlock(block, "right");
					}
				}
			}
		}

		if(evt.which == 40 || evt.type == "swipedown") {
			for(var i = 3; i >= 0; i--) { // vertical
				for(var j = 0; j < 4; j++) { //horizontal
					block = matrix[i][j];
					if(!isNull(block)) {
						moveBlock(block, "down");
					}
				}
			}
		}

		makePiece().fadeIn();



	}
}

function moveBlock(block, direction) {
	console.log("parsing block!", block);
	var step = calculateMove(block, direction);	
	$(block).animate({
		left: step.leftPos,
		top: step.topPos
	}, function() {
		if(step.merge) {
			console.log("merging numbers", step);
			$(block).text(step.mergeTo.number);
			block.style.backgroundColor = step.mergeTo.bgColor;
			block.style.zIndex = 10;
			$(step.mergeTo.targetBlock).remove();
		}
	});	
	readjustMatrix(block, {y: step.y, x: step.x});
	console.log('at end of iteration');

	/*if($(".numberBlock").length == 16) {
			alert('game over');
	}*/
}


function readjustMatrix(block, opts) {
	var currX = parseInt(block.dataset.x), currY = parseInt(block.dataset.y);
	var newX, newY;
	

	matrix[currY][currX] = null;

	if(typeof opts.y != "undefined") {
		newY = parseInt(opts.y);
		block.dataset.y = newY.toString();
	}

	if(typeof opts.x != "undefined") {
		newX = parseInt(opts.x);
		block.dataset.x = newX.toString();
	}

	matrix[typeof newY == "undefined" ? currY : newY][typeof newX == "undefined" ? currX : newX] = block;
}


function getPos(pos) {
	return (blockSize * pos) + "px";
}

function setupGrid() {
	grid = $("#grid");
	$(window).on("resize", resizeWindow);
	resizeWindow();
	$(".numberBlock").css("left", (blockSize * 3) + "px");
	$(".numberBlock").attr("data-x", "2");
	$(".numberBlock").attr("data-y", "0");
	grid.css("visibility", "visible");
}



function resizeWindow() {
	var height = Math.floor(grid.height / 4);
	grid.css("height", (height * 4) + "px");
	grid.css("width", grid.height() + "px");
	blockSize = grid.children().eq(0).outerWidth();

	$(".numberBlock").each(function(i, block) {
		$(block).css("left", (blockSize * parseInt(block.dataset.x) + "px"));
		$(block).css("top", (blockSize * parseInt(block.dataset.y) + "px"));
		$(block).css("line-height", blockSize + "px");
		$(block).css("font-size", (blockSize / 3) + "px");
	});
}

function isNull(obj) {
  return obj == null;
}
