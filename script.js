const STORAGE_KEY = "mundial_2026_full";

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

const state = loadState();

let allStandings = {};

function loadState(){

const saved = localStorage.getItem(STORAGE_KEY);

if(saved){

return JSON.parse(saved);

}

const data = {
groups:{}
};

Object.keys(groups).forEach(group=>{

data.groups[group] = [];

for(let i=0;i<6;i++){

data.groups[group].push(["",""]);

}

});

return data;

}

function saveState(){

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);

}

function createSidebar(){

const menu =
document.getElementById("groups-menu");

menu.innerHTML = "";

Object.keys(groups).forEach(letter=>{

menu.innerHTML += `

<div
class="group-btn
${letter===currentGroup ? "active" : ""}"

onclick="loadGroup('${letter}')"

data-group="${letter}">

<div
class="group-circle"
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

createSidebar();

renderGroup();

updateAll();

}

function renderGroup(){

const group =
groups[currentGroup];

document.getElementById("group-title")
.innerHTML = `Grupo ${currentGroup}`;

const teamsDiv =
document.getElementById("group-teams");

teamsDiv.innerHTML = "";

group.teams.forEach(team=>{

teamsDiv.innerHTML += `

<div class="team-chip">

<img
class="flag"
src="${team[1]}">

${team[0]}

</div>

`;

});

renderMatches();

}

function renderMatches(){

const matches =
document.getElementById("matches");

matches.innerHTML = "";

schedule.forEach((match,index)=>{

const t1 =
groups[currentGroup]
.teams[match[0]];

const t2 =
groups[currentGroup]
.teams[match[1]];

const saved =
state.groups[currentGroup][index];

matches.innerHTML += `

<div class="match">

<div class="team">

<img
class="flag"
src="${t1[1]}">

${t1[0]}

</div>

<div class="score-box">

<input
class="match-input"
type="number"
min="0"
data-match="${index}"
data-side="0"
value="${saved[0]}">

<div class="vs">VS</div>

<input
class="match-input"
type="number"
min="0"
data-match="${index}"
data-side="1"
value="${saved[1]}">

</div>

<div class="team">

<img
class="flag"
src="${t2[1]}">

${t2[0]}

</div>

</div>

`;

});

attachInputs();

}

function attachInputs(){

document
.querySelectorAll(".match-input")
.forEach(input=>{

input.addEventListener(
"keyup",
e=>{

saveMatchInput(input);

if(e.key==="Enter"){

updateAll();

}

}
);

input.addEventListener(
"change",
()=>{

saveMatchInput(input);
updateAll();

}
);

});

}

function saveMatchInput(input){

const match =
Number(input.dataset.match);

const side =
Number(input.dataset.side);

state.groups[currentGroup]
[match][side] = input.value;

saveState();

}

function calculateGroup(letter){

const stats = {};

groups[letter]
.teams
.forEach(team=>{

stats[team[0]] = {
pts:0,
gf:0,
gc:0,
dg:0,
flag:team[1]
};

});

let complete = true;

schedule.forEach((match,index)=>{

let a =
state.groups[letter]
[index][0];

let b =
state.groups[letter]
[index][1];

if(a==="" || b===""){

complete = false;
return;

}

a = parseInt(a);
b = parseInt(b);

const teamA =
groups[letter]
.teams[match[0]][0];

const teamB =
groups[letter]
.teams[match[1]][0];

stats[teamA].gf += a;
stats[teamA].gc += b;

stats[teamB].gf += b;
stats[teamB].gc += a;

if(a>b){

stats[teamA].pts += 3;

}

else if(b>a){

stats[teamB].pts += 3;

}

else{

stats[teamA].pts += 1;
stats[teamB].pts += 1;

}

});

Object.keys(stats).forEach(team=>{

stats[team].dg =
stats[team].gf -
stats[team].gc;

});

const sorted =
Object.keys(stats)
.sort((a,b)=>{

if(stats[b].pts !== stats[a].pts){

return stats[b].pts -
stats[a].pts;

}

if(stats[b].dg !== stats[a].dg){

return stats[b].dg -
stats[a].dg;

}

return stats[b].gf -
stats[a].gf;

});

return {
table:sorted,
stats,
complete
};

}

function updateAllStandings(){

allStandings = {};

Object.keys(groups)
.forEach(group=>{

allStandings[group] =
calculateGroup(group);

});

renderCurrentTable();

}

function renderCurrentTable(){

const tbody =
document.getElementById("table-body");

tbody.innerHTML = "";

const standing =
allStandings[currentGroup];

standing.table
.forEach((team,index)=>{

const stats =
standing.stats[team];

tbody.innerHTML += `

<tr class="
${index<2 ? "qualify" : ""}
${index===2 ? "third" : ""}
">

<td>${index+1}</td>

<td>

<div class="table-team">

<img
class="flag"
src="${stats.flag}">

${team}

</div>

</td>

<td>${stats.pts}</td>
<td>${stats.gf}</td>
<td>${stats.gc}</td>
<td>${stats.dg}</td>

</tr>

`;

});

}

function updateBracket(){

const leftContainer =
document.getElementById("r32-left");

const rightContainer =
document.getElementById("r32-right");

leftContainer.innerHTML = "";
rightContainer.innerHTML = "";

const completedGroups =
Object.keys(allStandings)
.filter(g=>allStandings[g].complete);

if(completedGroups.length < 12){

return;

}

const firsts = {};
const seconds = {};
let thirds = [];

completedGroups.forEach(group=>{

firsts[group] =
allStandings[group]
.table[0];

seconds[group] =
allStandings[group]
.table[1];

thirds.push({

group,

team:
allStandings[group]
.table[2],

stats:
allStandings[group]
.stats[
allStandings[group]
.table[2]
]

});

});

thirds.sort((a,b)=>{

if(b.stats.pts !== a.stats.pts){

return b.stats.pts -
a.stats.pts;

}

if(b.stats.dg !== a.stats.dg){

return b.stats.dg -
a.stats.dg;

}

return b.stats.gf -
a.stats.gf;

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
[bestThirds[0]?.team,bestThirds[1]?.team],
[bestThirds[2]?.team,bestThirds[3]?.team]

];

const rightMatches = [

[firsts["B"],seconds["A"]],
[firsts["D"],seconds["C"]],
[firsts["F"],seconds["E"]],
[firsts["H"],seconds["G"]],
[firsts["J"],seconds["I"]],
[firsts["L"],seconds["K"]],
[bestThirds[4]?.team,bestThirds[5]?.team],
[bestThirds[6]?.team,bestThirds[7]?.team]

];

renderSide(
leftContainer,
leftMatches
);

renderSide(
rightContainer,
rightMatches
);

}

function renderSide(container,matches){

matches.forEach((match,index)=>{

container.innerHTML += `

<div class="bracket-match">

<div class="bracket-match-title">

Partido ${index+1}

</div>

${renderTeam(match[0])}

${renderTeam(match[1])}

</div>

`;

});

}

function renderTeam(team){

if(!team){

return `

<div class="bracket-team">

<div class="placeholder">

Por definir

</div>

<input
class="bracket-score"
type="number">

</div>

`;

}

const data =
findTeam(team);

return `

<div class="bracket-team">

<div class="bracket-left">

<img
class="flag"
src="${data[1]}">

${team}

</div>

<input
class="bracket-score"
type="number">

</div>

`;

}

function findTeam(name){

for(const group in groups){

const found =
groups[group]
.teams
.find(t=>t[0]===name);

if(found){

return found;

}

}

return [name,""];

}

function updateAll(){

updateAllStandings();

updateBracket();

}

createSidebar();

loadGroup(currentGroup);

updateAll();
