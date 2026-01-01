import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
// import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';


const container = document.getElementById('three-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 10, 25);
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);



/* controls */
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
// controls.enablePan = false;


/* ligth */
scene.add(new THREE.AmbientLight(0xffffff, 1.2));


/* ! starfield */
const starGeo = new THREE.BufferGeometry();
const starCount = 1000;
const positions = [];

for (let i = 0; i < starCount; i++) {
    positions.push(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
    );        
}

starGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
);

const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7
});

scene.add(new THREE.Points(starGeo, starMat));




// import model





/* ! sun */
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshStandardMaterial({ emissive: 0xffaa00 })
);
scene.add(sun);




/* ! planets */
const experiences = [
    { title:"HTML & CSS", desc:"Frontend layout & styling", color:0x00aaff, r:8 },
    { title:"JavaScript", desc:"Logic, DOM, async", color:0xff00ff, r:11 },
    { title:"Three.js", desc:"3D web graphics", color:0x00ff99, r:14 }
];

const planets = [];

experiences.forEach(e => {
    const p = new THREE.Mesh(
        new THREE.SphereGeometry(1,32,32),
        new THREE.MeshStandardMaterial({ color:e.color })
    );
    p.userData = e;
    scene.add(p);
    planets.push(p);
});





/* ! interaksi */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // console.log(mouse.x);
    // console.log(mouse.y);
    
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(planets);
    console.log(hit.length);

    if (hit.length) {
        document.getElementById("exp-title").textContent =
        hit[0].object.userData.title;
        document.getElementById("exp-desc").textContent =
        hit[0].object.userData.desc;
    }
});





/* render dan animasi */
let angle = 0;
function animate() {
    angle += 0.01;

    planets.forEach((p,i) => {
        const r = experiences[i].r;
        p.position.x = Math.cos(angle+i) * r;
        p.position.z = Math.sin(angle+i) * r;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();



/* responsive */
window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});
