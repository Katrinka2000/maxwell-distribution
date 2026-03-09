const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");

const chartCanvas = document.getElementById("chart");

let particles = [];
let running = false;

let countSlider = document.getElementById("count");
let tempSlider = document.getElementById("temp");

let startBtn = document.getElementById("start");
let pauseBtn = document.getElementById("pause");
let resetBtn = document.getElementById("reset");

let W = canvas.width;
let H = canvas.height;

const k = 1;
const m = 1;



function maxwell(v, T) {

    return 4 * Math.PI *
        Math.pow(m / (2 * Math.PI * k * T), 1.5) *
        v * v *
        Math.exp(-m * v * v / (2 * k * T));
}



function randomSpeed(T) {
    return (Math.random() - 0.5) * T * 2;
}



function createParticles() {

    particles = [];

    let n = countSlider.value;
    let T = tempSlider.value;

    for (let i = 0; i < n; i++) {

        particles.push({

            x: Math.random() * W,
            y: Math.random() * H,

            vx: randomSpeed(T),
            vy: randomSpeed(T),

            r: 4
        });
    }
}



function update() {

    if (!running) return;

    ctx.clearRect(0, 0, W, H);

    for (let p of particles) {

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        let speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);

        let color = Math.min(speed * 30, 255);

        ctx.fillStyle =
            "rgb(" + color + ",100,255)";

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
    }

    updateChart();

    requestAnimationFrame(update);
}



startBtn.onclick = () => {
    running = true;
    update();
};

pauseBtn.onclick = () => {
    running = false;
};

resetBtn.onclick = () => {
    running = false;
    createParticles();
    draw();
};

countSlider.oninput = createParticles;
tempSlider.oninput = createParticles;



createParticles();



/* chart */

let chart = new Chart(chartCanvas, {

    type: "line",

    data: {
        labels: [],
        datasets: [
            {
                label: "Simulation",
                data: [],
                borderColor: "red",
                fill: false
            },
            {
                label: "Maxwell",
                data: [],
                borderColor: "cyan",
                fill: false
            }
        ]
    },

    options: {
        animation: false,
        scales: {
            x: { title: { display: true, text: "speed" } },
            y: { title: { display: true, text: "f(v)" } }
        }
    }
});



function updateChart() {

    let T = tempSlider.value;

    let speeds = particles.map(
        p => Math.sqrt(p.vx*p.vx + p.vy*p.vy)
    );

    let bins = 25;

    let hist = new Array(bins).fill(0);

    let max = Math.max(...speeds)+0.1;

    for (let s of speeds) {

        let i =
            Math.floor(s / max * bins);

        if (i >= 0 && i < bins)
            hist[i]++;
    }



    let maxwellData = [];

    for (let i = 0; i < bins; i++) {

        let v = i / bins * max;

        maxwellData.push(
            maxwell(v, T) * 100
        );
    }



    chart.data.labels =
        hist.map((_,i)=>i);

    chart.data.datasets[0].data =
        hist;

    chart.data.datasets[1].data =
        maxwellData;

    chart.update();
}



function draw() {

    ctx.clearRect(0,0,W,H);

    for (let p of particles) {

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="#60a5fa";
        ctx.fill();
    }

    updateChart();
}

draw();
