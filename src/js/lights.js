import * as THREE from "three";

export default function setupLights(scene) {
	let ambientLight = new THREE.AmbientLight(0x888888);
	scene.add(ambientLight);

	// Directional Light
	const color = 0xffdfef;
	const intensity = 5;
	const directionalLight = new THREE.DirectionalLight(color, intensity);
	directionalLight.position.set(-8, 9, -8);
	scene.add(directionalLight);

	const color2 = 0x008aaa;
	const intensity2 = 4;
	const directionalLight2 = new THREE.DirectionalLight(color2, intensity2);
	directionalLight2.position.set(2, 7, -2);
	scene.add(directionalLight2);

	return [ambientLight, directionalLight, directionalLight2];
}
