const k = 1.38e-23;

function maxwell(v, m, T) {

return 4 * Math.PI * Math.pow(m/(2*Math.PI*k*T),1.5)
* v*v * Math.exp(-m*v*v/(2*k*T));

}

function generateData(T,m){

let speeds=[];
let values=[];

for(let v=0; v<2000; v+=20){

speeds.push(v);
values.push(maxwell(v,m,T));

}

return {speeds,values};

}

const tempSlider=document.getElementById("tempSlider");
const massSlider=document.getElementById("massSlider");

const tempValue=document.getElementById("tempValue");
const massValue=document.getElementById("massValue");

let m = massSlider.value * 1e-26;

massValue.textContent = m.toExponential(2);

let data = generateData(300,m);

const ctx=document.getElementById("chart");

let chart=new Chart(ctx,{

type:'line',

data:{
labels:data.speeds,
datasets:[{
label:'Probability Density',
data:data.values,
borderColor:'blue',
borderWidth:2,
fill:false
}]
},

options:{
responsive:true,
scales:{
x:{
title:{
display:true,
text:'Speed (m/s)'
}
},
y:{
title:{
display:true,
text:'Probability'
}
}
}
}

});

function update(){

let T=tempSlider.value;
let m=massSlider.value*1e-26;

tempValue.textContent=T;
massValue.textContent=m.toExponential(2);

let newData=generateData(T,m);

chart.data.labels=newData.speeds;
chart.data.datasets[0].data=newData.values;

chart.update();

}

tempSlider.oninput=update;
massSlider.oninput=update;