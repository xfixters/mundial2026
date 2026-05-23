const STORAGE_KEY = "mundial_2026_app_v2";

const groups = {
  A: { color: "#26a65b", teams: [["México","https://flagcdn.com/w40/mx.png"],["Sudáfrica","https://flagcdn.com/w40/za.png"],["Corea del Sur","https://flagcdn.com/w40/kr.png"],["República Checa","https://flagcdn.com/w40/cz.png"]] },
  B: { color: "#e74c3c", teams: [["Canadá","https://flagcdn.com/w40/ca.png"],["Bosnia y Herzegovina","https://flagcdn.com/w40/ba.png"],["Qatar","https://flagcdn.com/w40/qa.png"],["Suiza","https://flagcdn.com/w40/ch.png"]] },
  C: { color: "#f39c12", teams: [["Brasil","https://flagcdn.com/w40/br.png"],["Marruecos","https://flagcdn.com/w40/ma.png"],["Haití","https://flagcdn.com/w40/ht.png"],["Escocia","https://flagcdn.com/w40/gb-sct.png"]] },
  D: { color: "#c0392b", teams: [["Estados Unidos","https://flagcdn.com/w40/us.png"],["Paraguay","https://flagcdn.com/w40/py.png"],["Australia","https://flagcdn.com/w40/au.png"],["Turquía","https://flagcdn.com/w40/tr.png"]] },
  E: { color: "#27ae60", teams: [["Alemania","https://flagcdn.com/w40/de.png"],["Curazao","https://flagcdn.com/w40/cw.png"],["Costa de Marfil","https://flagcdn.com/w40/ci.png"],["Ecuador","https://flagcdn.com/w40/ec.png"]] },
  F: { color: "#2e86de", teams: [["Países Bajos","https://flagcdn.com/w40/nl.png"],["Japón","https://flagcdn.com/w40/jp.png"],["Suecia","https://flagcdn.com/w40/se.png"],["Túnez","https://flagcdn.com/w40/tn.png"]] },
  G: { color: "#f1c40f", teams: [["Bélgica","https://flagcdn.com/w40/be.png"],["Egipto","https://flagcdn.com/w40/eg.png"],["Irlanda","https://flagcdn.com/w40/ie.png"],["Venezuela","https://flagcdn.com/w40/ve.png"]] },
  H: { color: "#ff0033", teams: [["España","https://flagcdn.com/w40/es.png"],["Uruguay","https://flagcdn.com/w40/uy.png"],["Arabia Saudita","https://flagcdn.com/w40/sa.png"],["Cabo Verde","https://flagcdn.com/w40/cv.png"]] },
  I: { color: "#6c5ce7", teams: [["Francia","https://flagcdn.com/w40/fr.png"],["Irak","https://flagcdn.com/w40/iq.png"],["Dinamarca","https://flagcdn.com/w40/dk.png"],["Camerún","https://flagcdn.com/w40/cm.png"]] },
  J: { color: "#0984e3", teams: [["Argentina","https://flagcdn.com/w40/ar.png"],["Austria","https://flagcdn.com/w40/at.png"],["Jordania","https://flagcdn.com/w40/jo.png"],["Nigeria","https://flagcdn.com/w40/ng.png"]] },
  K: { color: "#8e44ad", teams: [["Italia","https://flagcdn.com/w40/it.png"],["Colombia","https://flagcdn.com/w40/co.png"],["Noruega","https://flagcdn.com/w40/no.png"],["Nueva Zelanda","https://flagcdn.com/w40/nz.png"]] },
  L: { color: "#e67e22", teams: [["Inglaterra","https://flagcdn.com/w40/gb-eng.png"],["Croacia","https://flagcdn.com/w40/hr.png"],["Ghana","https://flagcdn.com/w40/gh.png"],["Panamá","https://flagcdn.com/w40/pa.png"]] }
};

const schedule = [
  [0,1],
  [2,3],
  [0,2],
  [1,3],
  [0,3],
  [1,2]
];

const knockoutTemplate = {
  r32: Array.from({ length: 16 }, () => ({ s1: "", s2: "" })),
  r16: Array.from({ length: 8 }, () => ({ s1: "", s2: "" })),
  qf: Array.from({ length: 4 }, () => ({ s1: "", s2: "" })),
  sf: Array.from({ length: 2 }, () => ({ s1: "", s2: "" })),
  third: { s1: "", s2: "" },
  final: { s1: "", s2: "" }
};

const state = loadState();

let currentGroup = state.currentGroup || "A";
let allStandings = {};

function defaultGroupScores() {
  const obj = {};
  Object.keys(groups).forEach(g => {
    obj[g] = schedule.map(() => ["", ""]);
  });
  return obj;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      currentGroup: "A",
      groupScores: defaultGroupScores(),
      knockout: structuredClone(knockoutTemplate)
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      currentGroup: parsed.currentGroup || "A",
      groupScores: parsed.groupScores || defaultGroupScores(),
      knockout: parsed.knockout || structuredClone(knockoutTemplate)
    };
  } catch {
    return {
      currentGroup: "A",
      groupScores: defaultGroupScores(),
      knockout: structuredClone(knockoutTemplate)
    };
  }
}

function saveState() {
  state.currentGroup = currentGroup;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function teamLookup(name) {
  for (const key of Object.keys(groups)) {
    const found = groups[key].teams.find(t => t[0] === name);
    if (found) return found;
  }
  return [name, ""];
}

function renderGroupMenu() {
  const menu = document.getElementById("groups-menu");
  menu.innerHTML = "";

  Object.keys(groups).forEach(letter => {
    menu.innerHTML += `
      <div class="group-btn ${letter === currentGroup ? "active" : ""}" data-group="${letter}" onclick="loadGroup('${letter}')">
        <div class="group-circle" style="background:${groups[letter].color}">${letter}</div>
        Grupo ${letter}
      </div>
    `;
  });
}

function loadGroup(letter) {
  currentGroup = letter;
  renderGroupMenu();
  renderGroup(letter);
  updateAll();
  saveState();
}

function renderGroup(letter) {
  const group = groups[letter];
  document.getElementById("group-title").textContent = `Grupo ${letter}`;

  const teamsDiv = document.getElementById("group-teams");
  teamsDiv.innerHTML = "";
  group.teams.forEach(team => {
    teamsDiv.innerHTML += `
      <div class="team-chip">
        <img class="flag" src="${team[1]}" alt="${team[0]}">
        ${team[0]}
      </div>
    `;
  });

  const matchesDiv = document.getElementById("matches");
  matchesDiv.innerHTML = "";

  schedule.forEach((pair, i) => {
    const t1 = group.teams[pair[0]];
    const t2 = group.teams[pair[1]];
    const saved = state.groupScores[letter]?.[i] || ["", ""];

    matchesDiv.innerHTML += `
      <div class="match">
        <div class="team">
          <img class="flag" src="${t1[1]}" alt="${t1[0]}">
          ${t1[0]}
        </div>

        <div class="score-box">
          <input
            class="match-input"
            type="number"
            min="0"
            inputmode="numeric"
            data-group="${letter}"
            data-match="${i}"
            data-side="0"
            value="${saved[0]}"
          >
          <div class="vs">VS</div>
          <input
            class="match-input"
            type="number"
            min="0"
            inputmode="numeric"
            data-group="${letter}"
            data-match="${i}"
            data-side="1"
            value="${saved[1]}"
          >
        </div>

        <div class="team">
          <img class="flag" src="${t2[1]}" alt="${t2[0]}">
          ${t2[0]}
        </div>
      </div>
    `;
  });

  attachInputEvents();
}

function attachInputEvents() {
  document.querySelectorAll(".match-input, .bracket-score").forEach(input => {
    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUpdateFromInput(input);
      }
    };
    input.oninput = () => handleUpdateFromInput(input);
  });
}

function handleUpdateFromInput(input) {
  if (input.classList.contains("match-input")) {
    const g = input.dataset.group;
    const m = Number(input.dataset.match);
    const s = Number(input.dataset.side);
    state.groupScores[g][m][s] = input.value;
    saveState();
    updateAll();
    return;
  }

  if (input.classList.contains("bracket-score")) {
    const round = input.dataset.round;
    const match = Number(input.dataset.match);
    const side = Number(input.dataset.side);
    state.knockout[round][match][side] = input.value;
    saveState();
    updateAll();
  }
}

function computeGroupStats(letter) {
  const teams = groups[letter].teams;
  const stats = {};
  teams.forEach(t => {
    stats[t[0]] = { pts: 0, gf: 0, gc: 0, dg: 0, flag: t[1] };
  });

  let complete = true;

  schedule.forEach((pair, i) => {
    const r = state.groupScores[letter]?.[i] || ["", ""];
    const a = r[0];
    const b = r[1];
    if (a === "" || b === "") {
      complete = false;
      return;
    }

    const ga = parseInt(a, 10);
    const gb = parseInt(b, 10);

    const t1 = teams[pair[0]][0];
    const t2 = teams[pair[1]][0];

    stats[t1].gf += ga;
    stats[t1].gc += gb;

    stats[t2].gf += gb;
    stats[t2].gc += ga;

    if (ga > gb) stats[t1].pts += 3;
    else if (gb > ga) stats[t2].pts += 3;
    else {
      stats[t1].pts += 1;
      stats[t2].pts += 1;
    }
  });

  Object.keys(stats).forEach(name => {
    stats[name].dg = stats[name].gf - stats[name].gc;
  });

  const table = Object.keys(stats).sort((a, b) => {
    if (stats[b].pts !== stats[a].pts) return stats[b].pts - stats[a].pts;
    if (stats[b].dg !== stats[a].dg) return stats[b].dg - stats[a].dg;
    return stats[b].gf - stats[a].gf;
  });

  return { table, stats, complete };
}

function renderTable(letter, standing) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  standing.table.forEach((team, idx) => {
    const rowClass = idx < 2 ? "qualify" : idx === 2 ? "third" : "";
    tbody.innerHTML += `
      <tr class="${rowClass}">
        <td>${idx + 1}</td>
        <td>
          <div class="table-team">
            <img class="flag" src="${standing.stats[team].flag}" alt="${team}">
            ${team}
          </div>
        </td>
        <td>${standing.stats[team].pts}</td>
        <td>${standing.stats[team].gf}</td>
        <td>${standing.stats[team].gc}</td>
        <td>${standing.stats[team].dg}</td>
      </tr>
    `;
  });
}

function updateAllStandings() {
  allStandings = {};

  Object.keys(groups).forEach(letter => {
    const st = computeGroupStats(letter);
    allStandings[letter] = st;
    if (letter === currentGroup) {
      renderTable(letter, st);
    }
  });
}

function bestThirdsFromCompletedGroups() {
  const thirds = [];

  Object.keys(allStandings).forEach(letter => {
    const st = allStandings[letter];
    if (!st.complete) return;
    thirds.push({
      group: letter,
      team: st.table[2],
      stats: st.stats[st.table[2]]
    });
  });

  thirds.sort((a, b) => {
    if (b.stats.pts !== a.stats.pts) return b.stats.pts - a.stats.pts;
    if (b.stats.dg !== a.stats.dg) return b.stats.dg - a.stats.dg;
    return b.stats.gf - a.stats.gf;
  });

  return thirds.slice(0, 8);
}

function generateR32Slots() {
  const needed = {
    A: allStandings.A?.table?.[0],
    B: allStandings.B?.table?.[0],
    C: allStandings.C?.table?.[0],
    D: allStandings.D?.table?.[0],
    E: allStandings.E?.table?.[0],
    F: allStandings.F?.table?.[0],
    G: allStandings.G?.table?.[0],
    H: allStandings.H?.table?.[0],
    I: allStandings.I?.table?.[0],
    J: allStandings.J?.table?.[0],
    K: allStandings.K?.table?.[0],
    L: allStandings.L?.table?.[0],
  };

  const seconds = {
    A: allStandings.A?.table?.[1],
    B: allStandings.B?.table?.[1],
    C: allStandings.C?.table?.[1],
    D: allStandings.D?.table?.[1],
    E: allStandings.E?.table?.[1],
    F: allStandings.F?.table?.[1],
    G: allStandings.G?.table?.[1],
    H: allStandings.H?.table?.[1],
    I: allStandings.I?.table?.[1],
    J: allStandings.J?.table?.[1],
    K: allStandings.K?.table?.[1],
    L: allStandings.L?.table?.[1],
  };

  const thirds = bestThirdsFromCompletedGroups();

  const thirdAt = i => thirds[i]?.team || null;

  const left = [
    [needed.A, seconds.B],
    [needed.C, seconds.D],
    [needed.E, seconds.F],
    [needed.G, seconds.H],
    [needed.I, seconds.J],
    [needed.K, seconds.L],
    [thirdAt(0), thirdAt(1)],
    [thirdAt(2), thirdAt(3)]
  ];

  const right = [
    [needed.B, seconds.A],
    [needed.D, seconds.C],
    [needed.F, seconds.E],
    [needed.H, seconds.G],
    [needed.J, seconds.I],
    [needed.L, seconds.K],
    [thirdAt(4), thirdAt(5)],
    [thirdAt(6), thirdAt(7)]
  ];

  return { left, right };
}

function renderBracketColumn(containerId, matches, roundName, side) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  matches.forEach((match, idx) => {
    const stateIndex = side === "left" ? idx : idx;
    const stored = state.knockout[roundName]?.[stateIndex] || ["", ""];
    const a = match[0] || null;
    const b = match[1] || null;

    container.innerHTML += `
      <div class="bracket-match">
        <div class="bracket-match-title">
          ${a || b ? `Partido ${idx + 1}` : "Por definir"}
        </div>

        ${renderBracketTeam(a, roundName, stateIndex, 0, stored[0])}
        ${renderBracketTeam(b, roundName, stateIndex, 1, stored[1])}
      </div>
    `;
  });
}

function renderBracketTeam(teamName, round, matchIndex, side, scoreValue) {
  const safeName = teamName || "<span class='placeholder'>Por definir</span>";
  const flag = teamName ? teamLookup(teamName)[1] : "";

  return `
    <div class="bracket-team">
      <div class="bracket-left">
        ${teamName ? `<img class="flag" src="${flag}" alt="${teamName}">` : ""}
        <span>${safeName}</span>
      </div>
      <input
        class="bracket-score"
        type="number"
        min="0"
        inputmode="numeric"
        data-round="${round}"
        data-match="${matchIndex}"
        data-side="${side}"
        value="${scoreValue ?? ""}"
      >
    </div>
  `;
}

function winnerFromPair(teamA, teamB, scoreA, scoreB) {
  if (!teamA || !teamB) return null;
  if (scoreA === "" || scoreB === "") return null;
  const a = parseInt(scoreA, 10);
  const b = parseInt(scoreB, 10);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  if (a === b) return null;
  return a > b ? teamA : teamB;
}

function loserFromPair(teamA, teamB, scoreA, scoreB) {
  const winner = winnerFromPair(teamA, teamB, scoreA, scoreB);
  if (!winner) return null;
  return winner === teamA ? teamB : teamA;
}

function buildKnockoutTeams() {
  const { left: r32Left, right: r32Right } = generateR32Slots();

  return {
    r32: [...r32Left, ...r32Right]
  };
}

function roundPairWinners(prevTeams, scores, roundName) {
  const next = [];
  for (let i = 0; i < prevTeams.length; i += 2) {
    const teamA = prevTeams[i];
    const teamB = prevTeams[i + 1];
    const pairScores = scores[Math.floor(i / 2)] || ["", ""];
    next.push(winnerFromPair(teamA, teamB, pairScores[0], pairScores[1]));
  }
  return next;
}

function roundPairLosers(prevTeams, scores) {
  const next = [];
  for (let i = 0; i < prevTeams.length; i += 2) {
    const teamA = prevTeams[i];
    const teamB = prevTeams[i + 1];
    const pairScores = scores[Math.floor(i / 2)] || ["", ""];
    next.push(loserFromPair(teamA, teamB, pairScores[0], pairScores[1]));
  }
  return next;
}

function renderBracket() {
  const { left: r32Left, right: r32Right } = generateR32Slots();
  const r32Teams = [...r32Left, ...r32Right];

  renderBracketColumn("r32-left", r32Left, "r32", "left");
  renderBracketColumn("r32-right", r32Right, "r32", "right");

  const r32Winners = roundPairWinners(r32Teams, state.knockout.r32, "r32");
  const r16TeamsLeft = [r32Winners[0], r32Winners[1], r32Winners[2], r32Winners[3], r32Winners[4], r32Winners[5], r32Winners[6], r32Winners[7]];
  const r16TeamsRight = [r32Winners[8], r32Winners[9], r32Winners[10], r32Winners[11], r32Winners[12], r32Winners[13], r32Winners[14], r32Winners[15]];

  renderBracketColumn("r16-left", [
    [r16TeamsLeft[0], r16TeamsLeft[1]],
    [r16TeamsLeft[2], r16TeamsLeft[3]],
    [r16TeamsLeft[4], r16TeamsLeft[5]],
    [r16TeamsLeft[6], r16TeamsLeft[7]],
  ], "r16", "left");

  renderBracketColumn("r16-right", [
    [r16TeamsRight[0], r16TeamsRight[1]],
    [r16TeamsRight[2], r16TeamsRight[3]],
    [r16TeamsRight[4], r16TeamsRight[5]],
    [r16TeamsRight[6], r16TeamsRight[7]],
  ], "r16", "right");

  const r16WinnersLeft = roundPairWinners(r16TeamsLeft, state.knockout.r16, "r16");
  const r16WinnersRight = roundPairWinners(r16TeamsRight, state.knockout.r16, "r16");

  renderBracketColumn("qf-left", [
    [r16WinnersLeft[0], r16WinnersLeft[1]],
    [r16WinnersLeft[2], r16WinnersLeft[3]],
  ], "qf", "left");

  renderBracketColumn("qf-right", [
    [r16WinnersRight[0], r16WinnersRight[1]],
    [r16WinnersRight[2], r16WinnersRight[3]],
  ], "qf", "right");

  const qfWinnersLeft = roundPairWinners(r16WinnersLeft, state.knockout.qf, "qf");
  const qfWinnersRight = roundPairWinners(r16WinnersRight, state.knockout.qf, "qf");

  renderBracketColumn("sf-left", [
    [qfWinnersLeft[0], qfWinnersLeft[1]],
  ], "sf", "left");

  renderBracketColumn("sf-right", [
    [qfWinnersRight[0], qfWinnersRight[1]],
  ], "sf", "right");

  const sfLeftTeams = [qfWinnersLeft[0], qfWinnersLeft[1]];
  const sfRightTeams = [qfWinnersRight[0], qfWinnersRight[1]];

  const sfWinnerLeft = winnerFromPair(sfLeftTeams[0], sfLeftTeams[1], state.knockout.sf[0]?.[0] || "", state.knockout.sf[0]?.[1] || "");
  const sfWinnerRight = winnerFromPair(sfRightTeams[0], sfRightTeams[1], state.knockout.sf[1]?.[0] || "", state.knockout.sf[1]?.[1] || "");
  const sfLoserLeft = loserFromPair(sfLeftTeams[0], sfLeftTeams[1], state.knockout.sf[0]?.[0] || "", state.knockout.sf[0]?.[1] || "");
  const sfLoserRight = loserFromPair(sfRightTeams[0], sfRightTeams[1], state.knockout.sf[1]?.[0] || "", state.knockout.sf[1]?.[1] || "");

  document.getElementById("third-box").innerHTML = `
    <div class="final-box">
      <div class="final-title">🥉 Tercer puesto</div>
      ${renderBracketTeam(sfLoserLeft, "third", 0, 0, state.knockout.third.s1)}
      ${renderBracketTeam(sfLoserRight, "third", 0, 1, state.knockout.third.s2)}
    </div>
  `;

  document.getElementById("final-box").innerHTML = `
    <div class="final-box">
      <div class="final-title">🏆 Final</div>
      ${renderBracketTeam(sfWinnerLeft, "final", 0, 0, state.knockout.final.s1)}
      ${renderBracketTeam(sfWinnerRight, "final", 0, 1, state.knockout.final.s2)}
    </div>
  `;

  attachInputEvents();
}

function updateAll() {
  updateAllStandings();
  renderBracket();
}

function initialize() {
  renderGroupMenu();
  renderGroup(currentGroup);
  updateAll();
}

initialize();
