// bagian Hero
// h1 : nama guweh
const h1 = document.querySelector('.hero .about1 div h1').innerHTML;
const h1_element = document.querySelector('.hero .about1 h1');
// div > h1
const div_h1 = document.querySelector('.hero .about1 div');
const p = document.querySelectorAll('p');


const h1_2 = 'as Software Engineer';
let newH1 = '';
let newH1_2 = '';
let i = 0;
let loop = 0;
let limit;
hero_h1();

console.log(h1); // M. Syihabuddin Yazid


// fungsi untuk h1 : myName
function hero_h1() {

    limit = 7;
    h1_element.innerHTML = newH1;
    const interval = setInterval(() => {

        if (i == 20) {

            loop++
            // console.log(loop);
            if (loop === 2) {
                limit = -1;
            } 

            clearInterval(interval);
            div_h1.classList.add('none');
            return setTimeout(() => hero2_h1(h1), 1000);

        } else {
            div_h1.classList.remove('none');
            newH1 += h1[i];
            h1_element.innerHTML = newH1;
            i++
        }

    }, 100);

}

function hero2_h1() {

    let e = '';
    let j = 0;

    const interval = setInterval(() => {

        if (i === limit) {

            if (loop == 2) {
                clearInterval(interval);
                return setTimeout(() => h1_se(), 200)
            }

            i++
            newH1 = e;
            h1_element.innerHTML = newH1;
            clearInterval(interval);
            return setTimeout(() => hero_h1(), 200);

        } else {
            div_h1.classList.remove('none');
            e = splice(h1,i--,j++);
            h1_element.innerHTML = e;
            // console.log(i);
        }

    }, 100);

}


// fungsi splice 
function splice(data, a, b) {
    const split = data.split("");
    split.splice(a,b)
    return split.join('');
}


// fungsi h1 : Software Enggineer
function h1_se() {

    newH1_2 = '';
    i = 0;
    h1_element.innerHTML = newH1_2;
    const interval = setInterval(() => {

        if (i == 20) {

            loop = 0;
            // i = 0;
            newH1 = '';
            clearInterval(interval);
            div_h1.classList.add('none');
            return setTimeout(() => h1_se2(), 1500);

        } else {
            div_h1.classList.remove('none');
            newH1_2 += h1_2[i];
            h1_element.innerHTML = newH1_2;
            // console.log(i);
            i++
        }

    }, 100);

}

function h1_se2() {

    let e = '';
    let j = 0;

    const interval = setInterval(() => {

        if (i === limit) {

            i = 0
            newH1_2 = e;
            h1_element.innerHTML = newH1_2;
            clearInterval(interval);
            return setTimeout(() => hero_h1(), 200);

        } else {
            div_h1.classList.remove('none');
            e = splice(h1_2,i--,j++);
            h1_element.innerHTML = e;
            // console.log(i);
        }

    }, 100);

}









// bagian Skills
const skill = document.querySelector('.skills .container')
const dataSkills = fetch('data/skills.json')
    .then(d => d.json())
    .then(d => {

        let tag = '';
        let data = '';
        d.forEach(e => {
            data = (e.perify === 'done') ? 'img/done.svg' : 'img/nope.svg';

            tag += `<div>
                        <img class="logo" src="${e.gambar}" alt="">
                        <p>${e.isi}</p>
                        <img class="perify" src="${data}" alt="">
                    </div>`
        });

        return skill.innerHTML = tag;

    })


// nambahin class di tag P
p.forEach(e => e.classList.add('no-select'));

// JavaScript tambahan untuk cegah klik kanan & copy event
// cegah menu konteks (klik kanan)
    // document.addEventListener('contextmenu', function(e){
    //     e.preventDefault();
    // });

    // cegah shortcut copy / cut
    document.addEventListener('copy', function(e){
        e.preventDefault();
        // optional: beri pesan ke clipboard
        // e.clipboardData.setData('text/plain', 'Konten tidak boleh disalin.');
    });
    document.addEventListener('cut', function(e){
        e.preventDefault();
    });

    // kompatibilitas lama (IE): cegah selectstart
    document.addEventListener('selectstart', function(e){
        // jika mau izinkan seleksi di area tertentu, cek e.target
        e.preventDefault();
    });