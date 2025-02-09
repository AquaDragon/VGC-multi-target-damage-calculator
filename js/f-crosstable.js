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
  const table = createTable(parsedDataTeamA.length, parsedDataTeamB.length);
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
      var p1Raw = parsedDataTeamA[row - 1];
      var p2Raw = parsedDataTeamB[col - 1];

      const { p1, p2, field } = checkPokeFieldCombos(p1Raw, p2Raw);

      let result, maxDamage;
      if (mode === 'attack') {
        ({ result, maxDamage } = calculateDamage(p1, p2, field, 'table'));
      } else {
        ({ result, maxDamage } = calculateDamage(p2, p1, field, 'table'));
      }
      let content = `
        <div class='crosstable-cell'><small>
          ${maxDamage[0] !== 0 && !isNaN(maxDamage[0]) ? result[0].damageText + '<br>' : ''}
          ${maxDamage[1] !== 0 && !isNaN(maxDamage[1]) ? result[1].damageText + '<br>' : ''}
          ${maxDamage[2] !== 0 && !isNaN(maxDamage[2]) ? result[2].damageText + '<br>' : ''}
          ${maxDamage[3] !== 0 && !isNaN(maxDamage[3]) ? result[3].damageText + '<br>' : ''}
        </small></div>`;

      updateCell(row, col, content, 'table');
    }
  }
}

/* ------------------------------------------------------------------
    Functions to generate LIST of calculations
   ------------------------------------------------------------------
*/
function createList(rows) {
  const list = document.createElement('table');
  list.classList.add('sortable-table');

  // create table headers
  const header = list.createTHead();
  const headerRow = header.insertRow();
  const headers = [
    'EVs',
    'Ability',
    'Item',
    'Attacker',
    'Move',
    '',
    'EVs',
    'Ability',
    'Item',
    'Defender',
    'Damage Range',
    'KO chance',
  ];

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

// Checks p1, p2 and field before performing calculation
function checkPokeFieldCombos(p1, p2) {
  // Check if held items result in a different Poke forme
  p1 = updatePokeForme(p1);
  p2 = updatePokeForme(p2);

  // generate the field, use default dummy otherwise
  var field = new dummyField();
  updateFieldTerrain(p1, p2, field);
  // checkRuinAbility(p1, p2); // does not work yet

  return { p1, p2, field };
}

function populateList(parsedDataTeamA, parsedDataTeamB) {
  const damageList = {};

  for (let row = 0; row < parsedDataTeamA.length; row++) {
    for (let col = 0; col < parsedDataTeamB.length; col++) {
      const p1Raw = structuredClone(mode === 'attack' ? parsedDataTeamB[col] : parsedDataTeamA[row]);
      const p2Raw = structuredClone(mode === 'attack' ? parsedDataTeamA[row] : parsedDataTeamB[col]);

      const { p1, p2, field } = checkPokeFieldCombos(p1Raw, p2Raw);
      let { result, maxDamage, minDamage, minPercent, maxPercent } = calculateDamage(p1, p2, field, 'list');

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
            attackerStat:
              moveCat === 'Physical'
                ? 'Atk' + parseNatureDisplay(p1.nature, 'at')
                : 'SpA' + parseNatureDisplay(p1.nature, 'sa'),
            attackerItem: p1.item,
            attackerAbility: p1.ability,
            defender: p2.name,
            defenderHP: p2.evs.hp,
            defenderBD: moveCat === 'Physical' ? p2.evs.df : p2.evs.sd,
            defenderStat:
              moveCat === 'Physical'
                ? 'Def' + parseNatureDisplay(p2.nature, 'df')
                : 'SpD' + parseNatureDisplay(p2.nature, 'sd'),
            defenderItem: p2.item,
            defenderAbility: p2.ability,
            isSpread: move.isSpread,
            damageRange: [minDamage[jj], maxDamage[jj]],
            percentRange: [minPercent[jj], maxPercent[jj]],
            kochance: getKOChanceText(
              result[jj].damage,
              p1.moves[jj],
              p2,
              field.getSide(0),
              p1.ability === 'Bad Dreams'
            ),
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
      <td>${entry.attackerAbility}</td>
      <td><span class='item-icon' style="${getItemIcon(entry.attackerItem)}" title="${entry.attackerItem}"></span></td>
      <td>${entry.attacker}</td>
      <td>${entry.moveName}${entry.isSpread ? '*' : ''}</td>
      <td>vs.</td>
      <td style="text-align: right;">${entry.defenderHP} HP / ${entry.defenderBD} ${entry.defenderStat}</td>
      <td>${entry.defenderAbility}</td>
      <td><span class='item-icon' style="${getItemIcon(entry.defenderItem)}" title="${entry.defenderItem}"></span></td>
      <td>${entry.defender}</td>
      <td style="text-align: right;">${entry.percentRange[0]}</td><td>-</td><td>${entry.percentRange[1]} %</td>
      <td>(${entry.damageRange[0]}-${entry.damageRange[1]})</td>
      <td>(${entry.kochance})</td>
    `;
  });
}

function calculateDamage(p1, p2, field, outputType) {
  var damageResults = CALCULATE_ALL_MOVES_SV(p1, p2, field);

  var result = [],
    minDamage = [],
    maxDamage = [],
    minPercent = [],
    maxPercent = [];

  for (var i = 0; i < 4; i++) {
    p1.moves[i].painMax = p1.moves[i].name === 'Pain Split' && p1.isDynamax;
    result[i] = damageResults[0][i];
    minDamage[i] = result[i].damage[0] * p1.moves[i].hits;
    maxDamage[i] = result[i].damage[result[i].damage.length - 1] * p1.moves[i].hits;
    minPercent[i] = Math.floor((minDamage[i] * 1000) / p2.maxHP) / 10;
    maxPercent[i] = Math.floor((maxDamage[i] * 1000) / p2.maxHP) / 10;
    result[i].damageText = `${p1.moves[i].name} ${minDamage[i]}-${maxDamage[i]} (${minPercent[i]} - ${maxPercent[i]}%)`;
  }

  return { result, maxDamage, minDamage, minPercent, maxPercent };
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

  this.setTerrain = function (newTerrain) {
    terrain = newTerrain;
  };

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

let currentSortState = {}; // Object to track the current sort state for each column

function sortList(table, col) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);

  // Get the current sort state, default to 'ascending'
  const currentState = currentSortState[col] || 'ascending';

  // Sort rows based on current state
  rows.sort((a, b) => {
    let valA = a.cells[col].innerText;
    let valB = b.cells[col].innerText;

    // Convert to numbers for sorting, fallback to string comparison
    let numA = parseFloat(valA);
    let numB = parseFloat(valB);

    return isNaN(numA) || isNaN(numB) ? valA.localeCompare(valB) : numA - numB;
  });

  // Toggle the sort state between 'ascending' and 'descending'
  currentSortState[col] = currentState === 'ascending' ? 'descending' : 'ascending';

  // Reverse the order for descending sort
  if (currentSortState[col] === 'descending') {
    rows.reverse();
  }

  // Append sorted rows back to tbody
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}
