import * as THREE from "three";

let audios = [];

export function createAudioListener(bgm) {
	removeAudios();

	const audioLoader = new THREE.AudioLoader();
	const listener = new THREE.AudioListener();

	const sound = new THREE.Audio(listener);

	audioLoader.load(bgm, (buffer) => {
		console.log("loaded");
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.25);
		sound.play();
		audios.push(sound);
	});

	return listener;
}

function removeAudios() {
	for (let i = 0; i < audios.length; i++) {
		let audio = audios[i];
		audio.stop();
		audio = null;
		audios.splice(i, 1);
	}
}
