import * as THREE from "three";

const width = 600;
const height = window.innerHeight;
const fov = 75;
const aspect = width / height;
const near = 0.1;
const far = 1000;

export function initCamera() {
	const width = 600;
	const height = window.innerHeight;

	// const camera = new THREE.OrthographicCamera(
	// 	-width / 200,
	// 	width / 200,
	// 	-height / 200,
	// 	height / 200,
	// 	near,
	// 	far
	// );

	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	camera.position.y = 5;
	camera.position.z = -2.5;
	camera.rotation.x = -Math.PI / 2;

	return camera;
}
