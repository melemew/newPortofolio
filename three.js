import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';



// console.log(OrbitControls);


const container = document.getElementById('three-container');

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);


cam.position.set(15, 10, 10);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);




// ! controls
const orbit = new OrbitControls(cam, renderer.domElement);
// orbit.update();
// controls.enableZoom = false;
orbit.enablePan = false;


// ! light
scene.add(new THREE.AmbientLight(0xffffff, 2));


// ! starfield
const starGeo = new THREE.BufferGeometry();
const starCount = 2500;
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




// * import model
const loader = new GLTFLoader();
// loader.load(
//     './models/earth/scene.gltf',
//     (res) => {
//         const model = res.scene;
//         scene.add(model);
//     }
// );







// ! vector3d, sun & planets
const vector = new THREE.Vector3(0, 0, 0);


const objectP = [];
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshStandardMaterial({ emissive: 0xffaa00 })
);
sun.name = 'matahari'
scene.add(sun);
objectP.push(sun);



const experiences = [
    { title:"Software & Embedded System", desc:"Frontend layout & styling", color:0xf13557, r:8, angle:0.0045 },
    { title:"Electric & Electronics", desc:"Logic, DOM, async", color:0xffff00, r:11, angle:0.008 },
    { title:"Achievement", desc:"3D web graphics", color:0x00ff00, r:15, angle:0.0025 }
];


const planets = [];
experiences.forEach(e => {
    const p = new THREE.Mesh(
        new THREE.SphereGeometry(1,32,32),
        new THREE.MeshStandardMaterial({ color: e.color })
    );
    p.userData = e;
    scene.add(p);
    planets.push(p);
    objectP.push(p);
});


// console.log(planets);
// console.log(scene);







// ! interaksi
const raycaster = new THREE.Raycaster();
const mouse = {}


window.addEventListener('mousedown', e => {
    const rect = container.getBoundingClientRect();
    // console.log(rect);
    

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = ((e.clientY - rect.top) / rect.height) * -2 + 1;
    
    raycaster.setFromCamera(mouse, cam);
    const hits = raycaster.intersectObjects(objectP);
    
    // console.log(hits);

    hits.forEach(i => {

        if (Object.keys(i.object.userData).length != 0 && i.object.name === '') {
            // console.log(i.object.userData);
            // console.log('hello');
            

            document.getElementById("exp-title").textContent =
            i.object.userData.title;
            document.getElementById("exp-desc").innerHTML =
            i.object.userData.desc;
        } else if (i.object.name !== ''  && Object.keys(i.object.userData).length === 0)     {
            document.getElementById("exp-title").textContent = `Education`
            document.getElementById("exp-desc").innerHTML = 
            `<ul>
                <li>Merah : HTML & CSS</li>
                <li>Kuning : JAVASCRIPT</li>
                <li>Hijau : THREEJS</li>
            </ul>`
        }

    })
    
});






// ! controls manual by up, down, left, right ( rotate cam ) & plus, mines ( zoom in-out )
window.addEventListener('keydown', e => {
    if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
        !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)
    ) {
        e.preventDefault();
    }
}, { passive:false });

let radius = 30;          // jarak kamera dari model
let polar = Math.PI / 3;  // rotasi vertikal (atas–bawah)
let azimuth = 1.6;          // rotasi horizontal (kiri–kanan)

const ROT_SPEED = 0.02;   // kecepatan rotasi
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
});






// ! render & animation
let angle = 0;
let angle2 = 0;
let angle3 = 0;

let body = document.querySelector('html body').clientWidth;
let dekstop;

function animate() {

    // ! rotating cam to a model
    // kiri
    if (keys[37]) {
        azimuth += ROT_SPEED;
    }
    
    // kanan
    if (keys[39]) {
        azimuth -= ROT_SPEED;
    }

    // atas
    if (keys[38]) {
        polar -= ROT_SPEED;
        polar = Math.max(0.1, Math.min(Math.PI - 0.1, polar));
    }

    // bawah
    if (keys[40]) {
        polar += ROT_SPEED;
        polar = Math.max(0.1, Math.min(Math.PI - 0.1, polar));
    } 

    // deketin atau mundurin cam
    if (keys[189]) {
        radius += 0.5;
    }
    if (keys[187]) {
        radius -= 0.5;
    }

    // update posisi cam
    if (body >= 1024 || dekstop === true) {
        cam.position.x = radius * Math.sin(polar) * Math.cos(azimuth);
        cam.position.y = radius * Math.cos(polar);
        cam.position.z = radius * Math.sin(polar) * Math.sin(azimuth);
        cam.lookAt(vector);
    } else {
        orbit.update();
        orbit.target = vector;
        cam.lookAt(vector);
    }


    



    // ! rotate planets
    // angle += 0.005;

    planets.forEach((p,i) => {
        const r = experiences[i].r;
        if (i === 0) { 
            angle += experiences[i].angle 
            p.position.x = Math.cos(angle+i) * r;
            p.position.z = Math.sin(angle+i) * r;
        } else
        if (i === 1) { 
            angle2 += experiences[i].angle 
            p.position.x = Math.cos(angle2+i) * r;
            p.position.z = Math.sin(angle2+i) * r;
        } else
        if (i === 2) { 
            angle3 += experiences[i].angle 
            p.position.x = Math.cos(angle3+i) * r;
            p.position.z = Math.sin(angle3+i) * r;
        }
    });



    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}
animate();




// ! responsive
window.addEventListener('resize', () => {

    body = document.querySelector('html body').clientWidth;
    if (body >= 1024) {
        dekstop = true;
        // console.log(dekstop);
    } else {
        dekstop = false;
        // console.log(dekstop);
    }


    renderer.setSize(container.clientWidth, container.clientHeight);
    cam.aspect = container.clientWidth / container.clientHeight;
    cam.updateProjectionMatrix();
});
