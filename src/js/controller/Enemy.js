import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const spaceship_url = new URL("../../models/enemy.glb", import.meta.url);

export default class Enemy {
	constructor(scene) {
		this.object;
		this.colliderRadius = 0.15;
		this.speed = 0.028;
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

				model.rotation.x = -Math.PI / 3;
				model.position.z = -7;
				model.position.x = Math.random() * (2 - -2) + -2;
				model.scale.multiplyScalar(0.25);

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

				clearInterval(intervalID);
			}
		}, 100);
	}

	move() {
		if (!this.object) return;
		this.object.position.z += this.speed;
	}

	isGameOver(scene) {
		if (!this.object) return false;
		if (this.object.position.z >= 1) {
			this.disposeObject(scene);
			return true;
		}
		return false;
	}

	checkCollision(object, scene) {
		if (!this.object || !object) return false;

		const distance = this.object.position.distanceTo(object.object.position);
		const combinedRadius = this.colliderRadius + object.radius;
		return distance - combinedRadius <= 0.05;
	}

	disposeObject(scene) {
		scene.remove(this.object);
	}
}
