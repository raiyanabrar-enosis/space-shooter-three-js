import { BufferGeometry } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const spaceship_url = new URL("../../models/enemy.glb", import.meta.url);

export default class Enemy {
	constructor(scene, type = 1) {
		this.object;
		this.colliderRadius = 0.2;
		this.speed = 0.028;
		this.minX = -2;
		this.maxX = 2;

		if (type === 1) this.createBufferGeometry(scene);
		else this.loadModel(scene);
	}

	loadModel(scene) {
		const loader = new GLTFLoader();
		let loadedModel;

		const mx = this.maxX;
		const mn = this.minX;

		loader.load(
			spaceship_url.href,
			function (gltf) {
				const model = gltf.scene;
				scene.add(model);

				model.rotation.x = -Math.PI / 3;
				model.position.z = -7;
				model.position.x = Math.random() * (mx - mn) + mn;
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

	createBufferGeometry(scene) {
		const vertices = [-1, -1, 2, 0, 0, -1, 1, -1, 2, 0, 0, 0];
		const indices = [0, 1, 3, 1, 2, 3];
		const geometry = new BufferGeometry();
		const material = new THREE.MeshBasicMaterial({
			color: 0xa29bfe,
			side: THREE.DoubleSide,
			// wireframe: true,
		});
		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3)
		);
		geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
		const mesh = new THREE.Mesh(geometry, material);

		this.colliderRadius *= 2;

		mesh.rotation.y = -Math.PI;
		mesh.rotation.x = -0.2;
		mesh.position.z = -7;
		mesh.position.x = Math.random() * (this.maxX - this.minX) + this.minX;
		mesh.scale.multiplyScalar(0.25);

		this.object = mesh;
		scene.add(mesh);
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
