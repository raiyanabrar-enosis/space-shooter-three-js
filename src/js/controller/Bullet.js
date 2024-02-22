import * as THREE from "three";

export default class Bullet {
	constructor(scene, playerPosition) {
		this.speed = 0.15;
		this.radius = 0.05;
		this.object = this.createBullet(scene, playerPosition);
	}

	createBullet(scene, playerPosition) {
		const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
		const material = new THREE.MeshBasicMaterial({
			color: 0xeeeeee,
		});
		const bullet = new THREE.Mesh(geometry, material);

		bullet.position.x = playerPosition.x;
		// bullet.position.y = playerPosition.y - 1;
		bullet.position.z = playerPosition.z - 0.3;

		scene.add(bullet);
		return bullet;
	}

	moveBullet() {
		this.object.position.z -= this.speed;
	}

	isOutOfBoundary() {
		return this.object.position.z <= -6.5;
	}

	disposeObject(scene) {
		scene.remove(this.object);
		this.object.geometry.dispose();
		this.object.material.dispose();
	}
}
