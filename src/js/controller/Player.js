import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Bullet from "./Bullet";
const spaceship_url = new URL("../../models/spaceship.glb", import.meta.url);

export default class Player {
	constructor(scene) {
		this.object;
		this.speed = 0.05;
		this.rotationOffset = 0.3;
		this.fireOffset = 300;
		this.lastFire = Date.now();
		this.keyboardState = {};
		this.loadModel(scene);
	}

	loadModel(scene) {
		const loader = new GLTFLoader();
		let loadedModel;

		loader.load(
			spaceship_url.href,
			function (gltf) {
				const model = gltf.scene;
				scene.add(model);

				// model.rotation.x = -Math.PI / 2;
				model.rotation.y = Math.PI;
				model.scale.multiplyScalar(0.001);
				loadedModel = model;
			},
			undefined,
			function (e) {
				console.log(e);
			}
		);

		let intervalID = setInterval(() => {
			if (loadedModel) {
				this.object = loadedModel;
				this.setControls();

				clearInterval(intervalID);
			}
		}, 100);
	}

	setControls() {
		document.addEventListener("keydown", (event) => {
			this.keyboardState[event.key] = true;
		});
		document.addEventListener("keyup", (event) => {
			this.keyboardState[event.key] = false;
		});
		document.addEventListener("mousedown", (e) => {
			this.keyboardState["Click"] = true;
		});

		document.addEventListener("mouseup", (e) => {
			this.keyboardState["Click"] = false;
		});
	}

	moveLeft() {
		this.object.position.x -= this.speed;
		this.object.rotation.z -= this.speed;

		// Clamp position and rotation
		this.object.position.x = Math.max(-2, this.object.position.x);
		this.object.rotation.z = Math.max(
			Math.PI - this.rotationOffset,
			this.object.rotation.z
		);
	}
	moveRight() {
		this.object.position.x += this.speed;
		this.object.rotation.z += this.speed;

		// Clamp position and rotation
		this.object.position.x = Math.min(2, this.object.position.x);
		this.object.rotation.z = Math.min(
			Math.PI + this.rotationOffset,
			this.object.rotation.z
		);
	}

	fire(scene) {
		const diff = Date.now() - this.lastFire;
		// console.log(diff);
		if (diff >= this.fireOffset) {
			const playerPos = new THREE.Vector3(
				this.object.position.x,
				this.object.position.y,
				this.object.position.z
			);

			const bullet = new Bullet(scene, playerPos);

			this.lastFire = Date.now();

			return bullet;
		}
	}
}
