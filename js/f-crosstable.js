// Load Data files
var pokedex = localStorage.getItem('dex') == 'natdex' ? POKEDEX_SV_NATDEX : POKEDEX_SV;
// var setdex = SETDEX_SV;
// var setdexCustom = SETDEX_CUSTOM_SV;
var typeChart = TYPE_CHART_XY;
var moves = localStorage.getItem('dex') == 'natdex' ? MOVES_SV_NATDEX : MOVES_SV;
var items = localStorage.getItem('dex') == 'natdex' ? ITEMS_SV_NATDEX : ITEMS_SV;
var abilities = ABILITIES_SV;
// var STATS = STATS_GSC;
var calculateAllMoves = CALCULATE_ALL_MOVES_SV;
// var calcHP = CALC_HP_ADV;
// var calcStat = CALC_STAT_ADV;

var AT = 'at',
  DF = 'df',
  SA = 'sa',
  SD = 'sd',
  SP = 'sp',
  SL = 'sl';

// Creates the crosstable display
function createTable(rows, columns) {
  const table = document.createElement('table');

  // Create rows and cells for each row
  for (let row = 0; row <= rows; row++) {
    const newRow = table.insertRow();
    for (let col = 0; col <= columns; col++) {
      const cell = newRow.insertCell();
      cell.id = `tableCell-${row}-${col}`;

      if (row === 0 && col === 0) {
        cell.innerHTML = `
          <div class='crosstable-cell'>
              <p style="text-align: right;">Your Team →</p> Other Team ↓
          </div>`;
      }
    }
  }

  return table;
}

function updateCell(row, col, content, type) {
  const cellId = type === 'table' ? `tableCell-${row}-${col}` : `listCell-${row}-${col}`;
  const cell = document.getElementById(cellId);
  if (cell) {
    cell.innerHTML = content;
  }
}

// Populate the table with parsed team data
function populateTable(parsedDataTeamA, parsedDataTeamB) {
  const tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = ''; // Clear existing content

  // Create a table with rows for Team A and columns for Team B
  const table = createTable(parsedDataTeamA.length, parsedDataTeamA.length);
  tableContainer.appendChild(table); // Append the table to the container

  const htmlOutputTeamA = formatPokeDisplay(parsedDataTeamA, 'A');
  const htmlOutputTeamB = formatPokeDisplay(parsedDataTeamB, 'B');

  // Populate 1st column with Team A data
  for (let row = 1; row <= parsedDataTeamA.length; row++) {
    updateCell(row, 0, htmlOutputTeamA[row - 1], 'table');
  }

  // Populate 1st row with Team B data
  for (let col = 1; col <= parsedDataTeamB.length; col++) {
    updateCell(0, col, htmlOutputTeamB[col - 1], 'table');
  }

  for (let row = 1; row <= parsedDataTeamA.length; row++) {
    for (let col = 1; col <= parsedDataTeamB.length; col++) {
      var p1 = parsedDataTeamA[row - 1];
      var p2 = parsedDataTeamB[col - 1];

      var { resultA, resultB, maxDamageA, maxDamageB } = calculateDamage(p1, p2, 'table');

      let content;
      if (mode === 'attack') {
        content = `
          <div class='crosstable-cell'><small>
            ${maxDamageB[0] !== 0 && !isNaN(maxDamageB[0]) ? resultB[0].damageText + '<br>' : ''}
            ${maxDamageB[1] !== 0 && !isNaN(maxDamageB[1]) ? resultB[1].damageText + '<br>' : ''}
            ${maxDamageB[2] !== 0 && !isNaN(maxDamageB[2]) ? resultB[2].damageText + '<br>' : ''}
            ${maxDamageB[3] !== 0 && !isNaN(maxDamageB[3]) ? resultB[3].damageText + '<br>' : ''}
          </small></div>
      `;
      } else {
        content = `
          <div class='crosstable-cell'><small>
            ${maxDamageA[0] !== 0 && !isNaN(maxDamageA[0]) ? resultA[0].damageText + '<br>' : ''}
            ${maxDamageA[1] !== 0 && !isNaN(maxDamageA[1]) ? resultA[1].damageText + '<br>' : ''}
            ${maxDamageA[2] !== 0 && !isNaN(maxDamageA[2]) ? resultA[2].damageText + '<br>' : ''}
            ${maxDamageA[3] !== 0 && !isNaN(maxDamageA[3]) ? resultA[3].damageText + '<br>' : ''}
          </small></div>`;
      }
      updateCell(row, col, content, 'table');
    }
  }
}

/* ------------------------------------------------------------------
    list functions
   ------------------------------------------------------------------
*/
function createList(rows) {
  const list = document.createElement('table');
  list.classList.add('sortable-table');

  // create table headers
  const header = list.createTHead();
  const headerRow = header.insertRow();
  const headers = ['EVs', 'Attacker', 'Move', '', 'EVs', 'Defender', 'Damage Range'];

  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.textContent = headerText;

    if (headerText === 'Damage Range') {
      th.setAttribute('colspan', 4);
    } else {
      th.addEventListener('click', () => sortList(list, index)); // Add sorting functionality on header click
    }

    headerRow.appendChild(th);
  });

  list.createTBody(); // create table body

  return list;
}

function populateList(parsedDataTeamA, parsedDataTeamB) {
  const damageList = {};

  for (let row = 0; row < parsedDataTeamA.length; row++) {
    for (let col = 0; col < parsedDataTeamB.length; col++) {
      const [p1, p2] =
        mode === 'attack' ? [parsedDataTeamB[row], parsedDataTeamA[col]] : [parsedDataTeamA[row], parsedDataTeamB[col]];

      let {
        resultA,
        resultB,
        maxDamageA,
        maxDamageB,
        minDamageA,
        minDamageB,
        minPercentA,
        minPercentB,
        maxPercentA,
        maxPercentB,
      } = calculateDamage(p1, p2, 'list');

      for (let jj = 0; jj < p1.moves.length; jj++) {
        let move = p1.moves[jj];
        if (!move) continue; // Avoid accessing undefined move

        let moveCat = move.name === 'Tera Blast' ? (p1.evs.at > p1.evs.sa ? 'Physical' : 'Special') : move.category;
        if (moveCat !== 'Status') {
          let atkStatKey = moveCat === 'Physical' ? `${p1.evs.at}A` : `${p1.evs.sa}C`;
          let defStatKey = moveCat === 'Physical' ? `${p2.evs.df}B` : `${p2.evs.sd}D`;
          let key = [
            atkStatKey,
            p1.name.toLowerCase().replace(/[\s-]+/g, ''),
            move.name.toLowerCase().replace(/\s+/g, ''),
            `${p2.evs.hp}H`,
            defStatKey,
            p2.name.toLowerCase().replace(/[\s-]+/g, ''),
          ].join('-');

          damageList[key] = {
            attacker: p1.name,
            moveName: move.name,
            moveCategory: moveCat,
            attackerAC: moveCat === 'Physical' ? p1.evs.at : p1.evs.sa,
            attackerStat: moveCat === 'Physical' ? 'Atk' : 'SpA',
            attackerItem: p1.item,
            defender: p2.name,
            defenderHP: p2.evs.hp,
            defenderBD: moveCat === 'Physical' ? p2.evs.df : p2.evs.sd,
            defenderStat: moveCat === 'Physical' ? 'Def' : 'SpD',
            defenderItem: p2.item,
            isSpread: move.isSpread,
            damageRange: [minDamageA[jj], maxDamageA[jj]],
            percentRange: [minPercentA[jj], maxPercentA[jj]],
          };
        }
      }
    }
  }

  const tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = ''; // Clear existing content

  const list = createList(Object.keys(damageList).length); // Get number of entries in damageList
  tableContainer.appendChild(list);

  const tbody = list.tBodies[0]; // Access the table body (tbody)

  // Populate the rows with data from damageList
  Object.values(damageList).forEach((entry) => {
    let row = tbody.insertRow();
    row.innerHTML = `
      <td style="text-align: right;">${entry.attackerAC} ${entry.attackerStat}</td>
      <td>${entry.attacker}</td>
      <td>${entry.moveName}${entry.isSpread ? ' (Spread)' : ''}</td>
      <td>vs.</td>
      <td style="text-align: right;">${entry.defenderHP} HP / ${entry.defenderBD} ${entry.defenderStat}</td>
      <td>${entry.defender}</td>
      <td style="text-align: right;">${entry.percentRange[0]}</td><td>-</td><td>${entry.percentRange[1]} %</td>
      <td>(${entry.damageRange[0]}-${entry.damageRange[1]})</td>
    `;
  });
}

let currentSortState = {}; // Object to track the current sort state for each column

function sortList(table, columnIndex) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);

  // Determine current sort direction (ascending, descending, or unsorted) -- 05Feb2025 unsorted does not work
  const currentState = currentSortState[columnIndex] || 'ascending'; // Default is ascending if not defined

  // Sort rows based on current state
  if (currentState === 'ascending') {
    rows.sort((a, b) => {
      let valA = a.cells[columnIndex].innerText;
      let valB = b.cells[columnIndex].innerText;

      // Convert to numbers for sorting, fallback to string comparison
      let numA = parseFloat(valA);
      let numB = parseFloat(valB);

      return isNaN(numA) || isNaN(numB) ? valA.localeCompare(valB) : numA - numB;
    });
    currentSortState[columnIndex] = 'descending'; // Set next state to descending
  } else if (currentState === 'descending') {
    rows.sort((a, b) => {
      let valA = a.cells[columnIndex].innerText;
      let valB = b.cells[columnIndex].innerText;

      // Convert to numbers for sorting, fallback to string comparison
      let numA = parseFloat(valA);
      let numB = parseFloat(valB);

      return isNaN(numA) || isNaN(numB) ? valB.localeCompare(valA) : numB - numA;
    });
    currentSortState[columnIndex] = 'unsorted'; // Set next state to unsorted
  } else {
    // Revert to unsorted (original order)
    rows.sort(() => 0); // No sorting, will revert to original order
    currentSortState[columnIndex] = 'ascending'; // Set next state to ascending
  }

  // Append sorted rows back to tbody
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

function calculateDamage(p1, p2, outputType) {
  var field = new dummyField();
  var damageResults = CALCULATE_ALL_MOVES_SV(p1, p2, field);

  var resultA = [],
    resultB = [],
    minDamageA = [],
    minDamageB = [],
    maxDamageA = [],
    maxDamageB = [],
    minPercentA = [],
    maxPercentA = [],
    minPercentB = [],
    maxPercentB = [];

  for (var i = 0; i < 4; i++) {
    p1.moves[i].painMax = p1.moves[i].name === 'Pain Split' && p1.isDynamax;
    resultA[i] = damageResults[0][i];
    minDamageA[i] = resultA[i].damage[0] * p1.moves[i].hits;
    maxDamageA[i] = resultA[i].damage[resultA[i].damage.length - 1] * p1.moves[i].hits;
    minPercentA[i] = Math.floor((minDamageA[i] * 1000) / p2.maxHP) / 10;
    maxPercentA[i] = Math.floor((maxDamageA[i] * 1000) / p2.maxHP) / 10;
    resultA[i].intro =
      outputType === 'list'
        ? `${p1.moves[i].category === 'Physical' ? p1.evs.at + ' Atk ' : p1.evs.sa + ' Sp.Atk '} ${p1.name}'s `
        : '';
    resultA[i].damageText =
      `${resultA[i].intro}${p1.moves[i].name} ${minDamageA[i]}-${maxDamageA[i]} (${minPercentA[i]} - ${maxPercentA[i]}%)`;

    p2.moves[i].painMax = p2.moves[i].name === 'Pain Split' && p2.isDynamax;
    resultB[i] = damageResults[1][i];
    minDamageB[i] = resultB[i].damage[0] * p2.moves[i].hits;
    maxDamageB[i] = resultB[i].damage[resultB[i].damage.length - 1] * p2.moves[i].hits;
    minPercentB[i] = Math.floor((minDamageB[i] * 1000) / p1.maxHP) / 10;
    maxPercentB[i] = Math.floor((maxDamageB[i] * 1000) / p1.maxHP) / 10;
    resultB[i].intro =
      outputType === 'list'
        ? `vs. ${p1.evs.hp} HP / ${p2.moves[i].category === 'Physical' ? p1.evs.df + ' Def' : p1.evs.sd + ' Sp.Def'} (${p2.moves[i].category}) ${p1.name} `
        : '';
    resultB[i].damageText =
      `${p2.moves[i].name} ${resultB[i].intro} ${minDamageB[i]}-${maxDamageB[i]} (${minPercentB[i]} - ${maxPercentB[i]}%)`;
  }

  return {
    resultA,
    resultB,
    maxDamageA,
    maxDamageB,
    minDamageA,
    minDamageB,
    minPercentA,
    minPercentB,
    maxPercentA,
    maxPercentB,
  };
}

// Dummy field input for the damage calculator
function dummyField() {
  var format = 'Doubles';
  var isGravity = false;
  var isSR = [false, false];
  var isProtect = [false, false];
  var weather = '';
  var spikes = [0, 0];
  var terrain = '';
  var isReflect = [false, false];
  var isLightScreen = [false, false];
  var isForesight = [false, false];
  var isHelpingHand = [false, false]; // affects attacks against opposite side
  var isGMaxField = [false, false];
  var isNeutralizingGas = false;
  var isFriendGuard = [false, false];
  var isBattery = [false, false];
  var isPowerSpot = [false, false];
  var isSteelySpirit = [false, false];
  var isFlowerGiftSpD = [false, false];
  var isFlowerGiftAtk = [false, false];
  var isTailwind = [false, false];
  var isSaltCure = [false, false];
  var isAuroraVeil = [false, false];
  var isSwamp = [false, false];
  var isSeaFire = [false, false];

  this.getNeutralGas = function () {
    return isNeutralizingGas;
  };
  this.getTailwind = function (i) {
    return isTailwind[i];
  };
  this.getWeather = function () {
    return weather;
  };
  this.getTerrain = function () {
    return terrain;
  };
  this.getSwamp = function (i) {
    return isSwamp[i];
  };
  this.clearWeather = function () {
    weather = '';
  };
  this.getSide = function (i) {
    return new Side(
      format,
      terrain,
      weather,
      isGravity,
      isSR[i],
      spikes[i],
      isReflect[i],
      isLightScreen[i],
      isForesight[i],
      isHelpingHand[i],
      isFriendGuard[i],
      isBattery[i],
      isProtect[i],
      isPowerSpot[i],
      isSteelySpirit[i],
      isNeutralizingGas,
      isGMaxField[i],
      isFlowerGiftSpD[i],
      isFlowerGiftAtk[i],
      isTailwind[i],
      isSaltCure[i],
      isAuroraVeil[i]
    );
  };
}
