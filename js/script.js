/* ================= NAVEGAÇÃO + ANIMAÇÕES ================= */

document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".painel");
    const navLinks = document.querySelectorAll("nav a");
    const seta = document.querySelector(".seta-rolar");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            const id = entry.target.getAttribute("id");
            const link = document.querySelector(`nav a[href="#${id}"]`);

            if (entry.isIntersecting) {

                navLinks.forEach(l => l.classList.remove("active"));

                if (link) {
                    link.classList.add("active");
                }

                const elementos = entry.target.querySelectorAll(".animar");

                elementos.forEach((el, i) => {

                    setTimeout(() => {
                        el.classList.add("ativo");
                    }, i * 150);

                });

                if (seta) {

                    if (id === "home") {
                        seta.classList.remove("esconder");
                        seta.classList.remove("clicada");
                    } else {
                        seta.classList.add("esconder");
                    }

                }

            }

        });

    }, {
        threshold: 0
    });

   /* ================= OBSERVER DAS SEÇÕES ================= */

const sectionObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`nav a[href="#${id}"]`);

        if (entry.isIntersecting) {

            navLinks.forEach(l => l.classList.remove("active"));

            if (link) {
                link.classList.add("active");
            }

            if (seta) {
                if (id === "home") {
                    seta.classList.remove("esconder");
                    seta.classList.remove("clicada");
                } else {
                    seta.classList.add("esconder");
                }
            }

        }

    });

}, {
    threshold: 0.2
});

sections.forEach(sec => sectionObserver.observe(sec));



/* ================= OBSERVER DAS ANIMAÇÕES ================= */
const animationObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const delay = Number(entry.target.dataset.delay) || 0;

            setTimeout(() => {
                entry.target.classList.add("ativo");
            }, delay);

            animationObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.08
});

document.querySelectorAll(".animar").forEach(el => {
    animationObserver.observe(el);
});


    /* ================= SETA ================= */

    if (seta) {

        seta.addEventListener("click", () => {

            seta.classList.add("clicada");

            let indexAtual = 0;

            sections.forEach((sec, i) => {

                const rect = sec.getBoundingClientRect();

                if (rect.top >= -50 && rect.top < window.innerHeight / 2) {
                    indexAtual = i;
                }

            });

            const proxima = sections[indexAtual + 1];

            if (proxima) {
                proxima.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    }


    /* ================= DRAG ================= */

    const polaroid = document.querySelector(".polaroid");
    const adesivo = document.querySelector(".adesivo-decorativo");

    if (window.innerWidth > 768) {
        tornarArrastavel(polaroid);
        tornarArrastavel(adesivo);
    } else {
        tornarArrastavel(adesivo);
    }

});


/* ================= MENU MOBILE ================= */

const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {

    toggle.addEventListener("click", () => {

        menu.classList.toggle("active");
        toggle.classList.toggle("active");
        document.body.classList.toggle("menu-open");

    });

}

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");
        toggle.classList.remove("active");
        document.body.classList.remove("menu-open");

    });

});


/* ================= DOWNLOAD ================= */

function animarDownload(e) {

    const btn = e.currentTarget;

    btn.classList.add("clicado");

    setTimeout(() => {
        btn.classList.remove("clicado");
    }, 700);

    for (let i = 0; i < 20; i++) {

        const particula = document.createElement("div");

        particula.classList.add("particula");

        const cores = [
            "#4B3296",
            "#9674FF",
            "#B8A1FF",
            "#311B92"
        ];

        particula.style.backgroundColor =
            cores[Math.floor(Math.random() * cores.length)];

        const rect = btn.getBoundingClientRect();

        particula.style.left =
            rect.left + rect.width / 2 + "px";

        particula.style.top =
            rect.top + rect.height / 2 + "px";

        const angulo = Math.random() * Math.PI * 2;
        const distancia = 50 + Math.random() * 100;

        const x = Math.cos(angulo) * distancia;
        const y = Math.sin(angulo) * distancia;

        particula.style.setProperty("--x", `${x}px`);
        particula.style.setProperty("--y", `${y}px`);

        document.body.appendChild(particula);

        setTimeout(() => {
            particula.remove();
        }, 800);

    }

}


/* ================= DRAG UNIVERSAL ================= */

function tornarArrastavel(el) {

    if (!el) return;

    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    el.onmousedown = iniciarMouse;
    el.ontouchstart = iniciarTouch;

    function iniciarMouse(e) {

        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = parar;
        document.onmousemove = moverMouse;

        el.style.zIndex = "1000";

    }

    function iniciarTouch(e) {

        const t = e.touches[0];

        pos3 = t.clientX;
        pos4 = t.clientY;

        document.ontouchend = parar;
        document.ontouchmove = moverTouch;

        el.style.zIndex = "1000";

    }

    function moverMouse(e) {

        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;

        pos3 = e.clientX;
        pos4 = e.clientY;

        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";

    }

    function moverTouch(e) {

        const t = e.touches[0];

        pos1 = pos3 - t.clientX;
        pos2 = pos4 - t.clientY;

        pos3 = t.clientX;
        pos4 = t.clientY;

        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";

    }

    function parar() {

        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;

        el.style.zIndex =
            el.classList.contains("adesivo-decorativo")
                ? "10"
                : "3";

    }
}
