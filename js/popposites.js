window.onload = function() {

	//set up canvas

	var canvas = document.getElementById("game-main");
	canvas.width = 495;
	canvas.height = 495;
	var context = canvas.getContext('2d');
	context.font="16px Hind Siliguri";
	context.textAlign = 'center';
	context.fillStyle = '#ffffff';

	//set up variables

	var spacing = 125;
	var x = 0;
	var y = 0;
	var spdY = -5;
	var lives = 3;
	var offset = 68;
	var championScore = 10000;

	var player = {};
	player.name = 'Guest';
	player.lives = lives;
	player.topScore = 0;
	player.level = 1;
	player.score = 0;
	player.guest = true;

	var advance = false;
	var restart = false;
	var start = true;
	var stopGame = false;
	var reload = false;

	var countPops = 0;

	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}
	if (!player.topScore || player.topScore.length === 0) {
		player.topScore = 0;
	}
	if (!player.name || player.name.length === 0) {
		player.name = 'Guest';
		player.guest = true;
	}

	//load images

	var bubbleImage1 = new Image();
	bubbleImage1.src = "./images/yellow-bubble-01.png";
	var bubbleImage2 = new Image();
	bubbleImage2.src = "./images/green-bubble-01.png";
	var bubbleImage3 = new Image();
	bubbleImage3.src = "./images/blue-bubble-01.png";
	var bubbleImage4 = new Image();
	bubbleImage4.src = "./images/purple-bubble-01.png";
	var bubbleImage5 = new Image();
	bubbleImage5.src = "./images/red-bubble-01.png";
	var bubbleImage6 = new Image();
	bubbleImage6.src = "./images/white-bubble-01.png";

	var bubblePopImage = new Image();
	bubblePopImage.src = "./images/bubble-sheet.png";

	var bubbleAnimation = {}; //popping bubble sprite
	bubbleAnimation.width = 1200;
	bubbleAnimation.height = 120;
	bubbleAnimation.image = bubblePopImage;

	var startScreen = new Image();
	startScreen.src = "./images/start_screen-01.png";
	var levelComplete = new Image();
	levelComplete.src = "./images/level-complete-02.png";
	var gameOver = new Image();
	gameOver.src = "./images/game-over-03.png";
	var newTopScore = new Image();
	newTopScore.src = "./images/top-score-04.png";
	var newChampion = new Image();
	newChampion.src = "./images/new-champion-05.png";


	var bubbleImage = {
		image1: bubbleImage1,
		image2: bubbleImage2,
		image3: bubbleImage3,
		image4: bubbleImage4,
		image5: bubbleImage5,
		};

	//generate random number for random bubble image

	function n() {
		var n = Math.floor(Math.random() * 5) + 1;
		return n;
	}

	//draw start screen
	startScreen.onload = function(e){
		context.drawImage(startScreen, 0, 0);
	}

	//gameover
	function gameover() {
		stopGame = true;
		if ((player.score > player.topScore) && (player.guest == false)) {
			player.topScore = player.score;
			if (player.score > championScore) {
				context.drawImage(newChampion, 0, 0);
				setTimeout(function(){ reaload = true; },2000);
			} else {
				context.drawImage(newTopScore, 0, 0);
				setTimeout(function(){ restart = true; },2000);
			}
			clearInterval(myTimer);
			bubbleList = {}
		} else {
			bubbleList = {}
			setTimeout(function(){ restart = true; },1000);
			context.drawImage(gameOver, 0, 0);
			clearInterval(myTimer);
		}
	}

	//set up timer
	var myTimer;
	function startTimer(duration, display) {
		var timer = duration, minutes, seconds;
	myTimer = setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.textContent = minutes + ":" + seconds;

			if (--timer < 0) {
				clearInterval(myTimer);
				player.lives = 0;
			}
		}, 1000);
	}

	display = document.querySelector('#time');

	// get coordinates from assigned column and row
	function getCoordinatesCol(xy) {
		if (xy == 1) {
			return x;
		}
		if (xy == 2) {
			return x + spacing;
		}
		if (xy == 3) {
			return x + (spacing + spacing);
		}
		if (xy == 4) {
			return x + (spacing + spacing + spacing);
		}
	}
	function getCoordinatesRow(xy) {
		if (xy == 1) {
			return y;
		}
		if (xy == 2) {
			return y + spacing;
		}
		if (xy == 3) {
			return y + (spacing + spacing);
		}
		if (xy == 4) {
			return y + (spacing + spacing + spacing);
		}
	}

	//load list of vocabulary

	var vocabList = {};

	var numberOfWords = 30;

	function newVocab(id, word, q_key, state) {
		var n = Math.floor(Math.random() * numberOfWords) + 1;
		for (var key in vocabList) {
			while (n in vocabList) {
				n = Math.floor(Math.random() * numberOfWords) + 1;
			}
		}
		var vocab = {
			id: id,
			word: word,
			q_key: q_key,
			state: state,
		};
		vocabList[n] = vocab;
	}

	//generate initial bubbles from vocablist

	var bubbleList = {};

	function initialBubbles() {
		var i = 1;
		for (var key in vocabList) {
			col = i;
			row = i;
			i += 1;
			if (i > 17) {
				break;
			}
			while (col > 4) {
				col = col - 4;
			}
			row = row / 4;
			row = Math.ceil(row);
			life = 0;
			vocabList[key].state = 1;
			n = Math.floor(Math.random() * 5) + 1;;
			image = bubbleImage['image' + n];
			value = n;
			pair_key = vocabList[key].q_key;
			for (var each in bubbleList) {
				check_key = bubbleList[each].q_key;
				if (pair_key == check_key) {
					image = bubbleList[each].image;
					value = bubbleList[each].value;
				}
			}
			Bubble(vocabList[key].id, vocabList[key].word, col, row, image, pair_key, value, life);
		}
	}

	function headerText(){
		level = document.querySelector('#level');
		level.textContent = 'Level: ' + player.level;
		score = document.querySelector('#score');
		score.textContent = 'Score: ' + player.score;
		livesText = document.querySelector('#lives');
		livesText.textContent = player.lives;
		liveTopScore = player.topScore;
		if (player.score > player.topScore) {
			liveTopScore = player.score;
		}
	}

	headerText();
	display.textContent = "05:00";

	var startTime = (60 * 5) + 10
	var timeLimit = startTime;

	function initialiseVocab() {
		timeLimit = timeLimit - 10;
		if (player.level == 1 || player.level == 2 || player.level == 3) {
			var min = 1;
			var max = 5;
			var n = Math.floor(Math.random()*(max - min + 1) + min);
			while (wordset['set' + n].used == 1) {
				n = Math.floor(Math.random()*(max - min + 1) + min);
			}
			var i = 1;
			while (i < 31) {
				var p = i / 2;
				p = Math.ceil(p);
				newVocab(i, wordset['set' + n]['word' + i], p, 0);
				i += 1;
			}
			wordset['set' + n].used = 1;
		} else if (player.level == 4 || player.level == 5 || player.level == 6) {
			var min = 6;
			var max = 9;
			var n = Math.floor(Math.random()*(max - min + 1) + min);
			while (wordset['set' + n].used == 1) {
				n = Math.floor(Math.random()*(max - min + 1) + min);
			}
			var i = 1;
			while (i < 31) {
				var p = i / 2;
				p = Math.ceil(p);
				newVocab(i, wordset['set' + n]['word' + i], p, 0);
				i += 1;
			}
			wordset['set' + n].used = 1;
		} else if (player.level == 7 || player.level == 8 || player.level == 9) {
			var min = 10;
			var max = 13;
			var n = Math.floor(Math.random()*(max - min + 1) + min);
			while (wordset['set' + n].used == 1) {
				n = Math.floor(Math.random()*(max - min + 1) + min);
			}
			var i = 1;
			while (i < 31) {
				var p = i / 2;
				p = Math.ceil(p);
				newVocab(i, wordset['set' + n]['word' + i], p, 0);
				i += 1;
			}
			wordset['set' + n].used = 1;
		} else if (player.level == 10 || player.level == 11 || player.level == 12) {
			var min = 14;
			var max = 17;
			var n = Math.floor(Math.random()*(max - min + 1) + min);
			while (wordset['set' + n].used == 1) {
				n = Math.floor(Math.random()*(max - min + 1) + min);
			}
			var i = 1;
			while (i < 31) {
				var p = i / 2;
				p = Math.ceil(p);
				newVocab(i, wordset['set' + n]['word' + i], p, 0);
				i += 1;
			}
			wordset['set' + n].used = 1;
		} else if (player.level == 13 || player.level == 14 || player.level == 15) {
			var min = 18;
			var max = 21;
			var n = Math.floor(Math.random()*(max - min + 1) + min);
			while (wordset['set' + n].used == 1) {
				n = Math.floor(Math.random()*(max - min + 1) + min);
			}
			var i = 1;
			while (i < 31) {
				var p = i / 2;
				p = Math.ceil(p);
				newVocab(i, wordset['set' + n]['word' + i], p, 0);
				i += 1;
			}
			wordset['set' + n].used = 1;
		} else {
			var min = 13;
			var max = 21;
			var n = Math.floor(Math.random()*(max - min + 1) + min);
			var i = 1;
			while (i < 31) {
				var p = i / 2;
				p = Math.ceil(p);
				newVocab(i, wordset['set' + n]['word' + i], p, 0);
				i += 1;
			}
		}

		//check there is at least one pair in the first 16 words generated
		var everythingReady = false;

		for (var key in vocabList) {
			var q_key = vocabList[key].q_key;
			var i = 1;
			for (var check in vocabList) {
				var t = 1;
				if ((q_key = vocabList[check].q_key) && (t < 17)) {
					everythingReady = true;
				}
			}
			i += 1;
			if (i = 17) {
				break;
			}
		}

		if (everythingReady == false) {
			vocabList = {};
			initialiseVocab();
		} else {
			initialBubbles();
			headerText();
			startTimer(timeLimit, display);
		}
	}

	//add a new bubble when one gets popped

	function newBubble(col, row, life){
		for (var key in vocabList) {
			if (vocabList[key].state == 0) {
				n = Math.floor(Math.random() * 5) + 1;
				image = bubbleImage['image' + n];
				value = n;
				pair_key = vocabList[key].q_key;
				for (var each in bubbleList) {
					check_key = bubbleList[each].q_key;
					if (pair_key == check_key) {
						image = bubbleList[each].image;
						value = bubbleList[each].value;
					}
				}
				Bubble(vocabList[key].id, vocabList[key].word, col, row, image, pair_key, value, life);
				vocabList[key].state = 1;
				break
			}
		}
	}

	// function to create a bubble object

	function Bubble(id, word, col, row, bubbleImage, q_key, value, life) {
		var x = getCoordinatesCol(col);
		var y = getCoordinatesRow(row);
		if (life == 0) {
			image_y = y + canvas.height;
			word_y = image_y + offset;
		} else if (life == 1) {
			image_y = canvas.height + 5;
			word_y = image_y + offset;
		} else {
			image_y = y + spacing + spacing;
			word_y = image_y + offset;
		}
		var bubble = {
			spd: 0,
			spdY: spdY,
			column: col,
			row: row,
			image: bubbleImage,
			image_x: x,
			image_y: image_y,
			destination_y: y,
			word: word,
			word_x: x + 60,
			word_y: word_y,
			width: 120,
			height: 120,
			r: 60,
			id:id,
			q_key: q_key,
			popping: 0,
			frameIndex: 0,
			value: value,
		};
		bubbleList[id] = bubble;
	}

	//set up variables and functions for popping bubble
	function bubblePopping(id, col, row) {
		var numberOfFrames = 10;
		var renderPopX = getCoordinatesCol(col);
		var renderPopY = getCoordinatesRow(row);
		var frameIndex = bubbleList[id].frameIndex;
		if (frameIndex < 11) {
			context.drawImage(
			bubbleAnimation.image,
			frameIndex * bubbleAnimation.width / numberOfFrames,
			0,
			bubbleAnimation.width / numberOfFrames,
			bubbleAnimation.height,
			renderPopX,
			renderPopY,
			bubbleAnimation.width / numberOfFrames,
			bubbleAnimation.height);
		} else {
			bubbleList[id].popping = 0;
			bubbleList[id].frameIndex = 0;
			delete bubbleList[id];
			if (countPops == 30) {
				// level complete
				clearInterval(myTimer);
				bubbleList = {};
				player.score += 50;
				stopGame = true;
				setTimeout(function(){ advance = true; },1000);
				context.drawImage(levelComplete, 0, 0);
				headerText();
			}
		}
	}

	//check for user click on bubble

	function checkCollides(bubbleList, mouse_x, mouse_y) {
		var isCollision = false;
		for(var key in bubbleList) {
			var x = mouse_x - (bubbleList[key].image_x + 60);
			var y = mouse_y - (bubbleList[key].image_y + 60);
			var dist = Math.sqrt(y*y + x*x);
			if (dist < 60) {
				return bubbleList[key];
			}
		}
	}

	function bubblePop(b1, b2) {
		var b1Col = bubbleList[b1].column;
		var b1OldRow = bubbleList[b1].row;
		var b2Col = bubbleList[b2].column;
		var b2OldRow = bubbleList[b2].row;
		for(var key in bubbleList) {
			if ((bubbleList[key].id != bubbleList[b1].id) && (bubbleList[key].id != bubbleList[b2].id)) {
				if (bubbleList[b1].column === bubbleList[key].column) {
					if (bubbleList[b1].row <= bubbleList[key].row) {
						bubbleList[key].row -= 1;
						bubbleList[key].destination_y -= spacing;
					}
				}
			}
		}
		for(var key in bubbleList) {
			if ((bubbleList[key].id != bubbleList[b1].id) && (bubbleList[key].id != bubbleList[b2].id)) {
				if (bubbleList[b2].column === bubbleList[key].column) {
					if (bubbleList[b2].row <= bubbleList[key].row) {
						bubbleList[key].row -= 1;
						bubbleList[key].destination_y -= spacing;
					}
				}
			}
		}
		var b1Row = 4;
		var b2Row = 4;
		var life = 1;
		if (b1Col === b2Col) {
			life = 2;
			b2Row = 3;
			life = 3;
		}
		for(var key in vocabList) {
			if ((vocabList[key].id == b1) || (vocabList[key].id == b2)) {
				vocabList[key].state = 2;
			}
		}
		bubbleList[b1].popping = 1;
		bubbleList[b2].popping = 1;

		countPops += 2;
		player.score += bubbleList[b1].value;
		//player.score += bubbleList[b2].value;

		if (countPops < 28) {
			newBubble(b1Col, b1Row, life);
			newBubble(b2Col, b2Row, life);
		}
	}

	var selectedWord1 = {};
	var selectedWord2 = {};

	function selectedBubble(id, word, q_key) {
		if (isEmpty(selectedWord1)) {
			selectedWord1.id = id;
			selectedWord1.word = word;
			selectedWord1.q_key = q_key;
			selectedWord1.originalImage = bubbleList[id].image;
			bubbleList[id].image = bubbleImage6;
		} else {
			if (id !== selectedWord1.id) {
				selectedWord2.id = id;
				selectedWord2.word = word;
				selectedWord2.q_key = q_key;
				selectedWord2.originalImage = bubbleList[id].image;
				bubbleList[id].image = bubbleImage6;
			} else {
				bubbleList[selectedWord1.id].image = selectedWord1.originalImage;
				selectedWord1 = {}; //clear selected word 1 on double click
			}
		}
		if (isEmpty(selectedWord2) == false) {
			if (selectedWord1.q_key === selectedWord2.q_key) {
				bubblePop(selectedWord1.id, selectedWord2.id);
				selectedWord1 = {};
				selectedWord2 = {};
			} else {
				bubbleList[selectedWord1.id].image = selectedWord1.originalImage;
				bubbleList[selectedWord2.id].image = selectedWord2.originalImage;
				player.lives -= 1;
				selectedWord1 = {};
				selectedWord2 = {};
			}
		}
		headerText();
	}

	canvas.addEventListener('click', function(e) {
		var mouse_x = e.offsetX;
		var mouse_y = e.offsetY;
		var clickedBubble = checkCollides(bubbleList, mouse_x, mouse_y);
		if (isEmpty(clickedBubble) == false) {
			selectedBubble(clickedBubble.id, clickedBubble.word, clickedBubble.q_key);
		}
		if (start == true) {
			start = false;
			initialiseVocab();
		}
		if (restart == true) {
			for(var key in wordset) {
				wordset[key].used = 0;
			}
			countPops = 0;
			player.lives = lives;
			player.level = 1;
			player.score = 0;
			timeLimit = startTime;
			vocabList = {};
			initialiseVocab();
			stopGame = false;
			restart = false;
		}
		if (advance == true) {
			countPops = 0;
			vocabList = {};
			player.level += 1;
			initialiseVocab();
			advance = false;
			stopGame = false;
		}
		if (reload == true) {
			location.reload();
		}
	}, false);

	//animation loop, interval and update
	function animate() {
		if ((start == false) && (stopGame == false) && (advance == false) && (reload == false)) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			if (player.lives > 0) {
				for(var key in bubbleList) {
					if (bubbleList[key].image_y <= bubbleList[key].destination_y) {
						bubbleList[key].spdY = 0;
						bubbleList[key].spd = 0;
						bubbleList[key].image_y = bubbleList[key].destination_y;
						bubbleList[key].word_y = bubbleList[key].destination_y + offset;
					} else {
						bubbleList[key].spdY = spdY;
						if (bubbleList[key].spd > bubbleList[key].spdY) {
							bubbleList[key].spd -= 0.7;
						}
					}
					if (bubbleList[key].popping == 1) {
						bubbleList[key].frameIndex += 1;
						bubblePopping(bubbleList[key].id, bubbleList[key].column, bubbleList[key].row);
					} else {
						context.drawImage(bubbleList[key].image, bubbleList[key].image_x, bubbleList[key].image_y += bubbleList[key].spd);
						context.fillText(bubbleList[key].word,bubbleList[key].word_x,bubbleList[key].word_y += bubbleList[key].spd);
					}
				}
			} else {
				for (var key in bubbleList) {
					bubbleList[key].popping == 1;
					bubbleList[key].frameIndex += 1;
					bubblePopping(bubbleList[key].id, bubbleList[key].column, bubbleList[key].row);
				}
				if (isEmpty(bubbleList)) {
					gameover();
					stopGame = true;
				}
			}
		}
	}

	setInterval(update,30); //run the loop

	function update() {
		animate();
	}
}
