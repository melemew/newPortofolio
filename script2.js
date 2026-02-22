// untuk marking Navbar sesuai scrolling pada setiap section yang dimarked
const headerLink = document.querySelectorAll('.link');
const reveals = document.querySelectorAll('.changes');

window.addEventListener('load', reveal);
window.addEventListener('scroll', reveal);

function reveal() {

    for (let i = 0; i < reveals.length; i++) {

        const windowheight = window.innerHeight;
        const revealtop = reveals[i].getBoundingClientRect().top;
        const revealpoint = 300;

        if (revealtop < windowheight - revealpoint) {

            headerLink.forEach(link => link.classList.remove('marked'));

            if (headerLink[i]) {
                headerLink[i].classList.add('marked');
            }

        }
    }
}