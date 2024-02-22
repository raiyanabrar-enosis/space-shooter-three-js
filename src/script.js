import * as THREE from "three";

import { initCamera } from "./js/camera";
import setupLights from "./js/lights";
import Player from "./js/controller/Player";
import { createAudioListener } from "./js/audio";

import starsTexture from "./assets/stars.jpg";
import backgroundMusic from "./assets/bgm.mp3";
import Enemy from "./js/controller/Enemy";

const canvasWidth = 600;
const canvasHeight = window.innerHeight - 5;

let renderer,
	scene,
	camera,
	textureLoader,
	lights,
	player,
	bullets,
	enemies,
	enemySpawnInterval,
	score;

let playing = false;

function init() {
	for (let i = 0; i < 1000; i++) {
		window.clearInterval(i);
	}
	// Canvas renderer
	const canvas = document.querySelector("#c");
	canvas.innerHTML = "";
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
	renderer.setSize(canvasWidth, canvasHeight);
	document.body.appendChild(renderer.domElement);

	// Scene and Camera
	scene = new THREE.Scene();
	camera = initCamera(renderer);

	// Background using cube texture loader
	textureLoader = new THREE.TextureLoader();
	scene.background = textureLoader.load(starsTexture);

	// BGM
	// scene.add();

	//Lights setup
	lights = setupLights(scene);
}

function initializeGame() {
	player = new Player(scene);

	bullets = [];

	enemies = [];
	enemySpawnInterval = 1300;

	score = 0;
	spawnEnemies();
	createAudioListener(backgroundMusic);

	playing = true;
}

function spawnEnemies() {
	setInterval(() => {
		const enemy = new Enemy(scene);
		enemies.push(enemy);
	}, enemySpawnInterval);
}

function gameHandlers() {
	if (!playing) return;

	if (player.object) {
		// Check key input
		if (player.keyboardState["ArrowLeft"] || player.keyboardState["a"])
			player.moveLeft();
		else if (player.keyboardState["ArrowRight"] || player.keyboardState["d"])
			player.moveRight();
		else player.object.rotation.z = Math.PI;

		// Fire gun
		if (player.keyboardState["Click"]) {
			const bullet = player.fire(scene);

			if (bullet) {
				bullets.push(bullet);
			}
		}
	}

	// Move enemies
	for (let j = 0; j < enemies.length; j++) {
		enemies[j].move();
		if (enemies[j].isGameOver(scene)) {
			alert("GameOver!! Score: ", score);
			init();
			play();
		}
	}

	// Move bullets forward
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].moveBullet();

		if (bullets[i].isOutOfBoundary()) {
			bullets[i].disposeObject(scene);
			delete bullets[i];
			bullets.splice(i, 1);
		}

		// Check hit for enemies
		for (let j = 0; j < enemies.length; j++) {
			const enemy = enemies[j];

			if (enemy.checkCollision(bullets[i], scene)) {
				enemy.disposeObject(scene);
				delete enemies[j];
				enemies.splice(j, 1);

				bullets[i].disposeObject(scene);
				delete bullets[i];
				bullets.splice(i, 1);

				score++;
			}
		}
	}

	document.querySelector("#score").textContent = score;

	// Restart
	if (player.keyboardState["r"]) init();
}

function render() {
	requestAnimationFrame(render);

	gameHandlers();

	renderer.render(scene, camera);
}

function play() {
	initializeGame();
}

document.querySelector("#playbtn").addEventListener("click", (event) => {
	if (!playing) {
		play();
		document.querySelector("#playbtn").style.display = "none";
	}
});

init();
render();
