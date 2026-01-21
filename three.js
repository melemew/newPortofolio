import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
// import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';


const container = document.getElementById('three-container');

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
cam.position.set(0, 0, 25);
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);



// ! controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
// controls.enablePan = false;


// ! light
scene.add(new THREE.AmbientLight(0xffffff, 2));


// ! starfield
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




// * import model





// ! sun & planets
const objectP = [];
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshStandardMaterial({ emissive: 0xffaa00 })
);
sun.name = 'matahari'
scene.add(sun);
objectP.push(sun);



const experiences = [
    { title:"HTML & CSS", desc:"Frontend layout & styling", color:0xf13557, r:8 },
    { title:"JavaScript", desc:"Logic, DOM, async", color:0xffff00, r:11 },
    { title:"Three.js", desc:"3D web graphics", color:0x00ff00, r:14 }
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
console.log(scene);







// ! interaksi
const raycaster = new THREE.Raycaster();
const mouse = {}
let selected;

window.addEventListener('mousedown', e => {
    const rect = container.getBoundingClientRect();
    // console.log(rect);
    

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = ((e.clientY - rect.top) / rect.height) * -2 + 1;
    
    raycaster.setFromCamera(mouse, cam);
    const hits = raycaster.intersectObjects(objectP);
    
    console.log(hits);

    hits.forEach(i => {

        if (Object.keys(i.object.userData).length != 0 && i.object.name === '') {
            console.log(i.object.userData);
            console.log('hello');
            

            document.getElementById("exp-title").textContent =
            i.object.userData.title;
            document.getElementById("exp-desc").textContent =
            i.object.userData.desc;
        } else if (i.object.name !== ''  && Object.keys(i.object.userData).length === 0) {
            document.getElementById("exp-title").textContent = `Clue Warna Planets :`
            document.getElementById("exp-desc").innerHTML = 
            `<ul>
                <li>Merah : HTML & CSS</li>
                <li>Kuning : JAVASCRIPT</li>
                <li>Hijau : THREEJS</li>
            </ul>`
        }

    })
    
});






// ! controls manual by up, down, left, right
window.addEventListener('keydown', e => {
    if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
        !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)
    ) {
        e.preventDefault();
    }
}, { passive:false });

let radius = 30;          // jarak kamera dari model
let polar = Math.PI / 2;  // rotasi vertikal (atas–bawah)
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
        radius += 0.2;  
    }
    if (keys[187]) {
        radius -= 0.2;
    }

    // update posisi cam
    cam.position.x = radius * Math.sin(polar) * Math.cos(azimuth);
    cam.position.y = radius * Math.cos(polar);
    cam.position.z = radius * Math.sin(polar) * Math.sin(azimuth);


    cam.lookAt(0, 0, 0);



    // ! rotate planets
    angle += 0.004;

    planets.forEach((p,i) => {
        const r = experiences[i].r;
        p.position.x = Math.cos(angle+i) * r;
        p.position.z = Math.sin(angle+i) * r;
    });

    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}
animate();




// ! responsive
window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    cam.aspect = container.clientWidth / container.clientHeight;
    cam.updateProjectionMatrix();
});
