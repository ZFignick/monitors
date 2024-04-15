import * as THREE from "/node_modules/three/build/three.module.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a GLTFLoader instance
const loader = new GLTFLoader();

// Load the GLTF file
loader.load('tc_gltf.gltf', function (gltf) {
    scene.add(gltf.scene);
    animate();
}, undefined, function (error) {
    console.error(error);
});

// Create an animate function
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update(); // Update the controls
}

// Set the camera position
camera.position.z = 5;
camera.position.y = 50;

// Set up lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 10); // Increase the intensity to make it brighter
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increase the intensity to make it brighter
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Variables to track mouse movement
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// Add event listeners for mouse events
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);

function onMouseDown(event) {
    isDragging = true;
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
    };

    const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
            toRadians(deltaMove.y * .1),
            toRadians(deltaMove.x * 1),
            toRadians(0),
            'XYZ'
        ));

    camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
    camera.updateProjectionMatrix();

    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
}

function onMouseUp(event) {
    isDragging = false;
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// Create an instance of OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

animate();
