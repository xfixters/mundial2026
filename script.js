const groups = {

A:{
color:"#26a65b",
teams:[
["México","https://flagcdn.com/w40/mx.png"],
["Sudáfrica","https://flagcdn.com/w40/za.png"],
["Corea del Sur","https://flagcdn.com/w40/kr.png"],
["República Checa","https://flagcdn.com/w40/cz.png"]
]
},

B:{
color:"#e74c3c",
teams:[
["Canadá","https://flagcdn.com/w40/ca.png"],
["Bosnia","https://flagcdn.com/w40/ba.png"],
["Qatar","https://flagcdn.com/w40/qa.png"],
["Suiza","https://flagcdn.com/w40/ch.png"]
]
},

C:{
color:"#f39c12",
teams:[
["Brasil","https://flagcdn.com/w40/br.png"],
["Marruecos","https://flagcdn.com/w40/ma.png"],
["Haití","https://flagcdn.com/w40/ht.png"],
["Escocia","https://flagcdn.com/w40/gb-sct.png"]
]
},

D:{
color:"#c0392b",
teams:[
["Estados Unidos","https://flagcdn.com/w40/us.png"],
["Paraguay","https://flagcdn.com/w40/py.png"],
["Australia","https://flagcdn.com/w40/au.png"],
["Turquía","https://flagcdn.com/w40/tr.png"]
]
},

E:{
color:"#27ae60",
teams:[
["Alemania","https://flagcdn.com/w40/de.png"],
["Curazao","https://flagcdn.com/w40/cw.png"],
["Costa de Marfil","https://flagcdn.com/w40/ci.png"],
["Ecuador","https://flagcdn.com/w40/ec.png"]
]
},

F:{
color:"#2e86de",
teams:[
["Países Bajos","https://flagcdn.com/w40/nl.png"],
["Japón","https://flagcdn.com/w40/jp.png"],
["Suecia","https://flagcdn.com/w40/se.png"],
["Túnez","https://flagcdn.com/w40/tn.png"]
]
},

G:{
color:"#f1c40f",
teams:[
["Bélgica","https://flagcdn.com/w40/be.png"],
["Egipto","https://flagcdn.com/w40/eg.png"],
["Irlanda","https://flagcdn.com/w40/ie.png"],
["Venezuela","https://flagcdn.com/w40/ve.png"]
]
},

H:{
color:"#ff0033",
teams:[
["España","https://flagcdn.com/w40/es.png"],
["Uruguay","https://flagcdn.com/w40/uy.png"],
["Arabia Saudita","https://flagcdn.com/w40/sa.png"],
["Cabo Verde","https://flagcdn.com/w40/cv.png"]
]
},

I:{
color:"#6c5ce7",
teams:[
["Francia","https://flagcdn.com/w40/fr.png"],
["Irak","https://flagcdn.com/w40/iq.png"],
["Dinamarca","https://flagcdn.com/w40/dk.png"],
["Camerún","https://flagcdn.com/w40/cm.png"]
]
},

J:{
color:"#0984e3",
teams:[
["Argentina","https://flagcdn.com/w40/ar.png"],
["Austria","https://flagcdn.com/w40/at.png"],
["Jordania","https://flagcdn.com/w40/jo.png"],
["Nigeria","https://flagcdn.com/w40/ng.png"]
]
},

K:{
color:"#8e44ad",
teams:[
["Italia","https://flagcdn.com/w40/it.png"],
["Colombia","https://flagcdn.com/w40/co.png"],
["Noruega","https://flagcdn.com/w40/no.png"],
["Nueva Zelanda","https://flagcdn.com/w40/nz.png"]
]
},

L:{
color:"#e67e22",
teams:[
["Inglaterra","https://flagcdn.com/w40/gb-eng.png"],
["Croacia","https://flagcdn.com/w40/hr.png"],
["Ghana","https://flagcdn.com/w40/gh.png"],
["Panamá","https://flagcdn.com/w40/pa.png"]
]
}

};

const schedule = [
[0,1],
[2,3],
[0,2],
[1,3],
[0,3],
[1,2]
];

let currentGroup = "A";

const allStandings = {};
const groupResults = {};

function createSidebar(){

const menu = document.getElementById("groups-menu");

Object.keys(groups).forEach(letter=>{

menu.innerHTML += `

<div class="group-btn ${letter==="A" ? "active" : ""}"
onclick="loadGroup('${letter}')"
data-group="${letter}">

<div class="group-circle"
style="background:${groups[letter].color};">

${letter}

</div>

Grupo ${letter}

</div>

`;

});

}

function loadGroup(letter){

currentGroup = letter;

document.querySelectorAll(".group-btn").forEach(btn=>{
btn.classList.remove("active");
});

document.querySelector(`[data-group="${letter}"]`)
.classList.add("active");

const group = groups[letter];

document.querySelector(".group-title")
.innerHTML = `Grupo ${letter}`;

const teamsContainer = document.querySelector(".group-teams");

teamsContainer.innerHTML = "";

group.teams.forEach(team=>{

teamsContainer.innerHTML += `

<div class="team-chip">

<img class="flag" src="${team[1]}">

${team[0]}

</div>

`;

});

renderMatches(letter);

updateTable();

}

function renderMatches(letter){

const matchesDiv = document.getElementById("matches");

matchesDiv.innerHTML = "";

schedule.forEach((match,index)=>{

const t1 = groups[letter].teams[match[0]];
const t2 = groups[letter].teams[match[1]];

const savedA =
groupResults[letter]?.[`a${index}`] || "";

const savedB =
groupResults[letter]?.[`b${index}`] || "";

matchesDiv.innerHTML += `

<div class="match">

<div class="team">

<img class="flag" src="${t1[1]}">

${t1[0]}

</div>

<div class="score-box">

<input
class="match-input"
type="number"
min="0"
id="a${index}"
value="${savedA}">

<div class="vs">VS</div>

<input
class="match-input"
type="number"
min="0"
id="b${index}"
value="${savedB}">

</div>

<div class="team">

<img class="flag" src="${t2[1]}">

${t2[0]}

</div>

</div>

`;

});

document.querySelectorAll(".match-input").forEach(input=>{

input.addEventListener("keyup",e=>{

saveResults();

if(e.key==="Enter"){
updateTable();
}

});

});

}

function saveResults(){

if(!groupResults[currentGroup]){
groupResults[currentGroup] = {};
}

schedule.forEach((m,index)=>{

groupResults[currentGroup][`a${index}`] =
document.getElementById(`a${index}`).value;

groupResults[currentGroup][`b${index}`] =
document.getElementById(`b${index}`).value;

});

}

function updateTable(){

const stats = {};

groups[currentGroup].teams.forEach(team=>{

stats[team[0]] = {
pts:0,
gf:0,
gc:0,
dg:0,
flag:team[1]
};

});

schedule.forEach((match,index)=>{

let a = document.getElementById(`a${index}`).value;
let b = document.getElementById(`b${index}`).value;

if(a==="" || b==="") return;

a = parseInt(a);
b = parseInt(b);

const teamA =
groups[currentGroup].teams[match[0]][0];

const teamB =
groups[currentGroup].teams[match[1]][0];

stats[teamA].gf += a;
stats[teamA].gc += b;

stats[teamB].gf += b;
stats[teamB].gc += a;

if(a>b){

stats[teamA].pts += 3;

}else if(b>a){

stats[teamB].pts += 3;

}else{

stats[teamA].pts += 1;
stats[teamB].pts += 1;

}

});

Object.keys(stats).forEach(team=>{

stats[team].dg =
stats[team].gf - stats[team].gc;

});

const sorted = Object.keys(stats).sort((a,b)=>{

if(stats[b].pts !== stats[a].pts){
return stats[b].pts - stats[a].pts;
}

if(stats[b].dg !== stats[a].dg){
return stats[b].dg - stats[a].dg;
}

return stats[b].gf - stats[a].gf;

});

allStandings[currentGroup] = {
table:sorted,
stats
};

renderTable(sorted,stats);

updateBracket();

}

function renderTable(sorted,stats){

const tbody =
document.getElementById("table-body");

tbody.innerHTML = "";

sorted.forEach((team,index)=>{

tbody.innerHTML += `

<tr class="
${index<2 ? "qualify" : ""}
${index===2 ? " third" : ""}
">

<td>${index+1}</td>

<td>

<div class="table-team">

<img class="flag"
src="${stats[team].flag}">

${team}

</div>

</td>

<td>${stats[team].pts}</td>
<td>${stats[team].gf}</td>
<td>${stats[team].gc}</td>
<td>${stats[team].dg}</td>

</tr>

`;

});

}

function createEmptyRounds(){

createRound("r16-left",4);
createRound("qf-left",2);
createRound("sf-left",1);

createRound("r16-right",4);
createRound("qf-right",2);
createRound("sf-right",1);

document.getElementById("final-box").innerHTML =

createFinalBox(
"🏆 FINAL",
"Ganador SF1",
"Ganador SF2"
);

document.getElementById("third-box").innerHTML =

createFinalBox(
"🥉 TERCER PUESTO",
"Perdedor SF1",
"Perdedor SF2"
);

}

function createRound(id,count){

const container =
document.getElementById(id);

for(let i=0;i<count;i++){

container.innerHTML += `

<div class="bracket-match">

<div class="bracket-match-title">
MATCH
</div>

${createTeamLine("Ganador")}
${createTeamLine("Ganador")}

</div>

`;

}

}

function createFinalBox(title,t1,t2){

return `

<div class="final-box">

<div class="final-title">
${title}
</div>

${createTeamLine(t1)}
${createTeamLine(t2)}

</div>

`;

}

function createTeamLine(name){

return `

<div class="bracket-team">

<div class="bracket-left">

${name}

</div>

<input
class="bracket-score"
type="number">

</div>

`;

}

function updateBracket(){

if(Object.keys(allStandings).length < 12){
return;
}

const firsts = {};
const seconds = {};
let thirds = [];

Object.keys(allStandings).forEach(group=>{

firsts[group] =
allStandings[group].table[0];

seconds[group] =
allStandings[group].table[1];

thirds.push({
group,
team:allStandings[group].table[2],
stats:
allStandings[group]
.stats[
allStandings[group].table[2]
]
});

});

thirds.sort((a,b)=>{

if(b.stats.pts !== a.stats.pts){
return b.stats.pts - a.stats.pts;
}

if(b.stats.dg !== a.stats.dg){
return b.stats.dg - a.stats.dg;
}

return b.stats.gf - a.stats.gf;

});

const bestThirds =
thirds.slice(0,8);

const leftMatches = [

[firsts["A"],seconds["B"]],
[firsts["C"],seconds["D"]],
[firsts["E"],seconds["F"]],
[firsts["G"],seconds["H"]],
[firsts["I"],seconds["J"]],
[firsts["K"],seconds["L"]],
[bestThirds[0].team,bestThirds[1].team],
[bestThirds[2].team,bestThirds[3].team]

];

const rightMatches = [

[firsts["B"],seconds["A"]],
[firsts["D"],seconds["C"]],
[firsts["F"],seconds["E"]],
[firsts["H"],seconds["G"]],
[firsts["J"],seconds["I"]],
[firsts["L"],seconds["K"]],
[bestThirds[4].team,bestThirds[5].team],
[bestThirds[6].team,bestThirds[7].team]

];

renderR32("r32-left",leftMatches);
renderR32("r32-right",rightMatches);

}

function renderR32(id,matches){

const container =
document.getElementById(id);

container.innerHTML = "";

matches.forEach((match,index)=>{

container.innerHTML += `

<div class="bracket-match">

<div class="bracket-match-title">
Partido ${index+1}
</div>

${createTeamLine(match[0])}
${createTeamLine(match[1])}

</div>

`;

});

}

createSidebar();
createEmptyRounds();
loadGroup("A");
