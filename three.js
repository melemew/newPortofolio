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


cam.position.set(20, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);




// ! controls
const orbit = new OrbitControls(cam, renderer.domElement);
// orbit.update();
// controls.enableZoom = false;
orbit.enablePan = false;


// ! light
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const pointlight = new THREE.PointLight( 0xffffff, 1100, 1000000 );
pointlight.position.set(0, 0, 0);
scene.add(pointlight);


// ! starfield
const starGeo = new THREE.BufferGeometry();
const starCount = 7000;
const positions = [];

for (let i = 0; i < starCount; i++) {
    positions.push(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
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








// * import planets
const objectP = [];
const models = {};

const loader = new GLTFLoader();
function loadModel(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}

async function init(url, scale, key, name, data) {

    if (name !== 'matahari' && key !== 'sun') {

        const res = await loadModel(url);

        res.scene.scale.setScalar(scale);
        scene.add(res.scene);

        res.scene.traverse(child => {
            if (child.isMesh) {
                child.name = name; 
                child.userData = data;
            }
        });
        
        objectP.push(res.scene);
        models[key] = res.scene;

        return res.scene

    } else {

        const res = await loadModel(url);

        res.scene.scale.setScalar(scale);
        scene.add(res.scene);

        res.scene.traverse(child => {
            if (child.isMesh) {
                child.name = name; 
            }
        });

        objectP.push(res.scene);
        models[key] = res.scene;

    }  
    
}
init('./models/sun/sun/scene.gltf', 0.5, 'sun', 'matahari'); // sun


// animate : planets imports
function rotateModel(model, direction = 'kanan', speed = 0.005) {
    if (!model) return;
    model.rotation.y += direction === 'kiri' ? speed : -speed;
}




// ! vector3d, sun & planets
const vector = new THREE.Vector3(0, 0, 0);


// const sun = new THREE.Mesh(
//     new THREE.SphereGeometry(2.5, 32, 32),
//     new THREE.MeshStandardMaterial({ emissive: 0xffaa00 })
// );
// sun.name = 'matahari'
// scene.add(sun);
// objectP.push(sun);



const experiences = [
    { title:"Software & Embedded System", desc:`
            <ul>
                <li>Web development using HTML, CSS, and JavaScript</li>
                <li>Building responsive and interactive user interfaces</li>
                <li>DOM manipulation, events handling, and basic animations</li>
                <li>Basic backend concept & API integration</li>
                <li>Embedded system projects using Arduino</li>
                <li>Microcontroller programming, sensors, and actuators</li>
                <li>Combining software logic with hardware control</li>
            </ul>
    `, color:0xf13557, r:18, angle:0.0024, name:'jupiter', key:'jupiter', path:'./models/jupiter/scene.gltf', scale:0.02 },
    { title:"Electric & Electronics", desc:`
        <ul>
            <li>Design and assembly of robotic and drone electronic systems</li>
            <li>Microcontroller-based control systems (Arduino)</li>
            <li>Motor control (DC, servo, stepper) and driver circuits</li>
            <li>Sensor integration (IR, ultrasonic, gyroscope, accelerometer)</li>
            <li>Power management: battery, regulator, and current distribution</li>
            <li>Troubleshooting hardware issues during testing and competitions</li>
        </ul>
    `, color:0xffff00, r:14, angle:0.0018, name:'mars', key:'mars', path:'./models/mars/mars/scene.gltf', scale:0.9 },
    { title:"Achievement & Certificate", desc:`
        <ul class="achievement-list">
            <li>🏆 <strong>RC SumoBot Competition</strong> — 1st Runner Up | Daihatsu</li>
            <li>🤖 Participant SumoBot Competition | Trisakti</li>
            <li>🤖 Participant SumoBot Competition — ASEAN Robotic Day | SMAN 28 Jakarta</li>
            <li>⚙️ Arduino Debugging Coding Participant | Universitas Indonesia</li>
            <li>📜 Web Development | Sololearn</li>
            <li>📜 Fundamental Front-End Web Development | Codingstudio</li>
            <li>📜 Fundamental Front-End Web Development II | Codingstudio</li>
            <li>📜 Belajar Dasar Pemrograman Web | Dicoding</li>
        </ul>
    `, color:0x00ff00, r:24, angle:0.0025, name:'bumi', key:'earth', path:'./models/earth/earth/scene.gltf', scale:0.3 }
];


const planets = [];
// experiences.forEach(e => {
//     const p = new THREE.Mesh(
//         new THREE.SphereGeometry(1,32,32),
//         new THREE.MeshStandardMaterial({ color: e.color })
//     );
//     p.userData = e;
//     scene.add(p);
//     planets.push(p);
//     objectP.push(p);
// });


experiences.forEach(async e => {
    const p = await init(e.path, e.scale, e.key, e.name, e)
    p.userData = e;
    scene.add(p);
    planets.push(p);
    objectP.push(p);
});



// ! interaksi
const raycaster = new THREE.Raycaster();
const mouse = {}


window.addEventListener('mousedown', e => {
    const rect = container.getBoundingClientRect();
    

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = ((e.clientY - rect.top) / rect.height) * -2 + 1;
    
    raycaster.setFromCamera(mouse, cam);
    const hits = raycaster.intersectObjects(objectP);
    
    // console.log(hits);

    hits.forEach(i => {

        if (Object.keys(i.object.userData).length !== 0 && i.object.name !== 'matahari') {
            // console.log(i.object.userData);
            // console.log('hello');
            

            document.getElementById("exp-title").textContent =
            i.object.userData.title;
            document.getElementById("exp-desc").innerHTML =
            i.object.userData.desc;
        } else if (i.object.name === 'matahari'  && Object.keys(i.object.userData).length !== 0)     {
            document.getElementById("exp-title").textContent = `Education`
            document.getElementById("exp-desc").innerHTML = 
            `<ul>
                <li>Elementary School : Cahaya Ilmu ( 2017 - 2022 )</li>
                <li>Junior High School : Baitul Quran Cirata ( 2022 - 2024 )</li>
                <li>Senior High School : Perguruan Rakyat 2 ( 2024 - 2026 )</li>
                <li>College : Politeknik Negeri Lampung ( 2026 - now )</li>
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

let radius = 42;          // jarak kamera dari model
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




    // rotate Imports
    rotateModel(models.sun, 'kiri', 0.0015);
    rotateModel(models.earth, 'kanan', 0.0035);
    rotateModel(models.jupiter, 'kanan', 0.0035);
    rotateModel(models.mars, 'kiri', 0.0035);



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