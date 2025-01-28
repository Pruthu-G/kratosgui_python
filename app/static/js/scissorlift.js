import { OrbitControls } from './OrbitControls.js';
import * as THREE from './three.module.min.js';
const container=document.getElementById('arm-post');

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x404040);
container.appendChild(renderer.domElement);
const controls=new OrbitControls(camera, renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Base platform
const baseGeometry = new THREE.BoxGeometry(3.8, 0.2, 1.8);
const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

// Top platform
const topGeometry = new THREE.BoxGeometry(4, 0.2, 2);
const topMaterial = new THREE.MeshPhongMaterial({ color: 0x2A3439 });
const top = new THREE.Mesh(topGeometry, topMaterial);
scene.add(top);

// Create scissor links
function createScissorPair() {
    const armGeometry = new THREE.BoxGeometry(4, 0.1, 0.1);
    const armMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00A8E8,
        metalness: 0.7,
        roughness: 0.3
    });
    const arms = [];
    
    // Create 4 arms (2 pairs, front and back)
    for (let i = 0; i < 4; i++) {
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arms.push(arm);
        scene.add(arm);
    }
    return arms;
}

// Create three sets of scissor links
const scissorSets = [
    createScissorPair(),
    createScissorPair(),
    createScissorPair()
];

// Camera position
camera.position.set(8, 12, 4);
camera.lookAt(0, 8, 0);

// Controls
const heightSlider = document.createElement('input');
heightSlider.type = 'range';
heightSlider.min = '1.5';
heightSlider.max = '9';
heightSlider.step = '0.1';
heightSlider.value = '3';
heightSlider.style.position = 'absolute';
heightSlider.style.top = '20px';
heightSlider.style.left = '20px';
heightSlider.style.width = '200px';
container.appendChild(heightSlider);
heightSlider.style.accentColor='grey';

// Animation
//base static top moving
// function animate() {
//     requestAnimationFrame(animate);

//     const totalHeight = parseFloat(heightSlider.value);
//     const heightPerSection = totalHeight / 3;

//     // Update each set of scissors
//     scissorSets.forEach((arms, index) => {
//         const baseOffset = index * heightPerSection;
//         const angle = Math.asin(heightPerSection / 4);

//         // Update arms positions and rotations
//         arms[0].position.y = baseOffset + heightPerSection / 2;
//         arms[0].rotation.z = angle;
//         arms[0].position.x = 0;  // Center the arms
        
//         arms[1].position.y = baseOffset + heightPerSection / 2;
//         arms[1].rotation.z = -angle;
//         arms[1].position.x = 0;  // Center the arms
        
//         arms[2].position.y = baseOffset + heightPerSection / 2;
//         arms[2].position.z = 0.5;
//         arms[2].rotation.z = angle;
//         arms[2].position.x = 0;  // Center the arms
        
//         arms[3].position.y = baseOffset + heightPerSection / 2;
//         arms[3].position.z = 0.5;
//         arms[3].rotation.z = -angle;
//         arms[3].position.x = 0;  // Center the arms
//     });


// Update top platform position
//     top.position.y = totalHeight;

//     renderer.render(scene, camera);
// }

// function animate() {
//     requestAnimationFrame(animate);

//     const totalHeight = parseFloat(heightSlider.value);
//     const heightPerSection = totalHeight / 3;

//     // Update each set of scissors
//     scissorSets.forEach((arms, index) => {
//         const baseOffset = totalHeight - index * heightPerSection;
//         const angle = Math.asin(Math.min(1, heightPerSection / 4));

//         // Update arms positions and rotations relative to the fixed top
//         arms[0].position.y = baseOffset - heightPerSection / 2;
//         arms[0].rotation.z = angle;
//         arms[0].position.x = 0;

//         arms[1].position.y = baseOffset - heightPerSection / 2;
//         arms[1].rotation.z = -angle;
//         arms[1].position.x = 0;

//         arms[2].position.y = baseOffset - heightPerSection / 2;
//         arms[2].position.z = 0.5;
//         arms[2].rotation.z = angle;
//         arms[2].position.x = 0;

//         arms[3].position.y = baseOffset - heightPerSection / 2;
//         arms[3].position.z = 0.5;
//         arms[3].rotation.z = -angle;
//         arms[3].position.x = 0;
//     });

//     // Update base platform position
//     base.position.y = totalHeight;

//     renderer.render(scene, camera);
// }

function animate() {
    requestAnimationFrame(animate);

    const totalHeight = parseFloat(heightSlider.value);
    const heightPerSection = totalHeight / 3;

    // Fix the top platform
    top.position.set(0, 9, 0);

    // Move the base platform
    base.position.set(0, 9 - totalHeight, 0);

    // Update each set of scissor arms
    scissorSets.forEach((arms, index) => {
        const sectionHeight = heightPerSection * (index + 1);
        const baseOffsetY = 9 - sectionHeight; // Base Y position decreases for lower sections
        const angle = Math.asin(heightPerSection / 4); // Calculate rotation angle based on height

        // Front left and right arms
        arms[0].position.set(0, baseOffsetY + heightPerSection / 2, -0.5);
        arms[0].rotation.z = angle;

        arms[1].position.set(0, baseOffsetY + heightPerSection / 2, -0.5);
        arms[1].rotation.z = -angle;

        // Back left and right arms
        arms[2].position.set(0, baseOffsetY + heightPerSection / 2, 0.5);
        arms[2].rotation.z = angle;

        arms[3].position.set(0, baseOffsetY + heightPerSection / 2, 0.5);
        arms[3].rotation.z = -angle;
    });

//     const socket= new WebSocket("ws://localhost:8765");
//     socket.onopen=()=>{
//         console.log("connected");
//     };
//     socket.onmessage=(event)=>{
//         const dat=JSON.parse(JSON.parse(event.data));
//         const totalHeight=Math.abs(7*dat.data[1])+1.0;
//     const heightPerSection = totalHeight / 3;

//     // Fix the top platform
//     top.position.set(0, 9, 0);

//     // Move the base platform
//     base.position.set(0, 9 - totalHeight, 0);

//     // Update each set of scissor arms
//     scissorSets.forEach((arms, index) => {
//         const sectionHeight = heightPerSection * (index + 1);
//         const baseOffsetY = 9 - sectionHeight; // Base Y position decreases for lower sections
//         const angle = Math.asin(heightPerSection / 4); // Calculate rotation angle based on height

//         // Front left and right arms
//         arms[0].position.set(0, baseOffsetY + heightPerSection / 2, -0.5);
//         arms[0].rotation.z = angle;

//         arms[1].position.set(0, baseOffsetY + heightPerSection / 2, -0.5);
//         arms[1].rotation.z = -angle;

//         // Back left and right arms
//         arms[2].position.set(0, baseOffsetY + heightPerSection / 2, 0.5);
//         arms[2].rotation.z = angle;

//         arms[3].position.set(0, baseOffsetY + heightPerSection / 2, 0.5);
//         arms[3].rotation.z = -angle;
//     });
//     };
//     socket.onerror=(error)=>{
//         const totalHeight = parseFloat(heightSlider.value);
//     const heightPerSection = totalHeight / 3;

//     // Fix the top platform
//     top.position.set(0, 9, 0);

//     // Move the base platform
//     base.position.set(0, 9 - totalHeight, 0);

//     // Update each set of scissor arms
//     scissorSets.forEach((arms, index) => {
//         const sectionHeight = heightPerSection * (index + 1);
//         const baseOffsetY = 9 - sectionHeight; // Base Y position decreases for lower sections
//         const angle = Math.asin(heightPerSection / 4); // Calculate rotation angle based on height

//         // Front left and right arms
//         arms[0].position.set(0, baseOffsetY + heightPerSection / 2, -0.5);
//         arms[0].rotation.z = angle;

//         arms[1].position.set(0, baseOffsetY + heightPerSection / 2, -0.5);
//         arms[1].rotation.z = -angle;

//         // Back left and right arms
//         arms[2].position.set(0, baseOffsetY + heightPerSection / 2, 0.5);
//         arms[2].rotation.z = angle;

//         arms[3].position.set(0, baseOffsetY + heightPerSection / 2, 0.5);
//         arms[3].rotation.z = -angle;
//     });
//     };

     renderer.render(scene, camera);
 }


// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Start animation
animate();