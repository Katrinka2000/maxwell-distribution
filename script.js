const chartCanvas =
    document.getElementById("chart");

const gasSelect =
    document.getElementById("gas");

const massInput =
    document.getElementById("mass");

const tempInput =
    document.getElementById("temp");

const addBtn =
    document.getElementById("add");

const clearBtn =
    document.getElementById("clear");


const k = 1.380649e-23;
const NA = 6.022e23;



let chart = new Chart(chartCanvas, {

    type: "line",

    data: {
        labels: [],
        datasets: []
    },

    options: {

        animation: false,

        plugins: {
            legend: {
                position: "top"
            }
        },

        scales: {

            x: {
                title: {
                    display: true,
                    text: "Speed (m/s)"
                }
            },

            y: {
                title: {
                    display: true,
                    text: "f(v)"
                }
            }

        }
    }

});



gasSelect.onchange = () => {

    if (gasSelect.value !== "custom") {

        massInput.value =
            gasSelect.value;
    }
};



function maxwell(v, m, T) {

    return 4 * Math.PI *
        Math.pow(
            m / (2 * Math.PI * k * T),
            1.5
        ) *
        v * v *
        Math.exp(
            -m * v * v /
            (2 * k * T)
        );
}



addBtn.onclick = () => {

    let M =
        parseFloat(
            massInput.value
        );

    let T =
        parseFloat(
            tempInput.value
        );

    let m =
        M / NA;



    let x = [];
    let y = [];

    let vmax = 2500;

    for (
        let v = 0;
        v < vmax;
        v += 10
    ) {

        x.push(v);

        y.push(
            maxwell(v, m, T)
        );
    }



    chart.data.labels = x;

    let color =
        "hsl(" +
        Math.random()*360 +
        ",70%,50%)";

    chart.data.datasets.push({

        label:
            "T=" +
            T +
            "K  M=" +
            M,

        data: y,

        borderColor: color,

        borderWidth: 2,

        fill: false
    });

    chart.update();
};



clearBtn.onclick = () => {

    chart.data.datasets = [];

    chart.update();

};
