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

function resetOutput() {
  document.getElementById('teamSummary').innerHTML = '';
  document.getElementById('modeLabel').innerHTML = '';
  const systemMessage = document.getElementById('systemMessage');
  if (systemMessage.innerHTML === 'Output Reset!') {
    systemMessage.innerHTML = '';
  } else {
    systemMessage.innerHTML = 'Output Reset!';
  }
  document.getElementById('outputSection').innerHTML =
    '<p id="outputText">The output will appear here once the teams have loaded.</p>';
}

/* ------------------------------------------------------------------
    TABLE MODE functions
   ------------------------------------------------------------------
*/
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
  resetOutput();
  const outputSection = document.getElementById('outputSection');
  outputSection.innerHTML = ''; // Clear existing content

  // Create a table with rows for Team B and columns for Team A
  const table = createTable(parsedDataTeamB.length, parsedDataTeamA.length);
  outputSection.appendChild(table); // Append the table to the container

  const htmlOutputTeamA = formatPokeDisplay(parsedDataTeamA, 'A');
  const htmlOutputTeamB = formatPokeDisplay(parsedDataTeamB, 'B');

  // Populate 1st row with Team A data
  for (let col = 1; col <= parsedDataTeamA.length; col++) {
    updateCell(0, col, htmlOutputTeamA[col - 1], 'table');
  }

  // Populate 1st column with Team B data
  for (let row = 1; row <= parsedDataTeamB.length; row++) {
    updateCell(row, 0, htmlOutputTeamB[row - 1], 'table');
  }

  for (let row = 1; row <= parsedDataTeamB.length; row++) {
    for (let col = 1; col <= parsedDataTeamA.length; col++) {
      var p1Raw = parsedDataTeamA[col - 1];
      var p2Raw = parsedDataTeamB[row - 1];

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
    Team Summary (LIST MODE) functions
   ------------------------------------------------------------------
*/
function createSummaryTable(parsedDataTeamA) {
  const sumTable = document.createElement('table');
  const sumRow = sumTable.insertRow();

  const htmlOutputTeamA = formatPokeDisplay(parsedDataTeamA, 'A');

  for (let col = 0; col < parsedDataTeamA.length; col++) {
    const sumCell = sumRow.insertCell();
    sumCell.id = `sumTable${col}`;
    sumCell.innerHTML = htmlOutputTeamA[col];
  }

  document.body.appendChild(sumTable);
  return sumTable;
}

// currently unused
function updateSummaryCell(col, content) {
  const cell = document.getElementById(`sumTable${col}`);
  if (cell) {
    cell.innerHTML = content;
  }
}

function updateTeamSummary(parsedDataTeamA) {
  const teamSummaryTable = document.getElementById('teamSummary');
  teamSummaryTable.innerHTML = '<p>'; // Clear existing content

  teamSummaryTable.appendChild(createSummaryTable(parsedDataTeamA));
}

/* ------------------------------------------------------------------
    LIST MODE functions
   ------------------------------------------------------------------
*/
function createList(rows) {
  const list = document.createElement('table');
  list.classList.add('sortable-table');

  // Create table headers
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
    'KO value',
  ];

  let columnIndex = 0; // Tracks actual column index (ignoring empty columns)
  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.textContent = headerText;

    if (headerText === 'Damage Range') {
      th.setAttribute('colspan', 4);
      th.addEventListener('click', () => sortList(list, columnIndex)); // Sort using first sub-column of Damage Range
      // columnIndex++;  // issue with indexing, need to adjust later
    } else {
      let currentIndex = columnIndex; // Capture the correct index for closure
      th.addEventListener('click', () => sortList(list, currentIndex));
      columnIndex++;
    }

    headerRow.appendChild(th);
  });

  list.createTBody(); // Create table body
  return list;
}

let currentSortState = {}; // Tracks sorting state per column

function sortList(table, col) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);

  // Determine the correct column to sort
  let targetCol = col; // Default: Use the clicked column

  // Handle colspan for 'Damage Range', always sort by the first sub-column
  const headerCell = table.tHead.rows[0].cells[col];
  if (headerCell && headerCell.colSpan > 1) {
    targetCol = col; // Always use the first column of 'Damage Range' for sorting
  }

  // Get current sort state (default: ascending)
  const currentState = currentSortState[targetCol] || 'ascending';

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

  // Update sorting icons
  updateSortIcons(table.tHead.rows[0].cells, targetCol, currentSortState[targetCol]);

  // Reverse the order for descending sort
  if (currentSortState[col] === 'descending') {
    rows.reverse();
  }

  // Append sorted rows back to tbody
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

// Function to extract values for sorting
function extractSortValue(row, col) {
  let cell = row.cells[col];
  if (!cell) return 0;

  let text = cell.innerText.trim();

  // Extract the first number from a range like "23 - 45 %"
  let match = text.match(/\d+/); // Get first number
  return match ? parseFloat(match[0]) : text.localeCompare(text);
}

// Function to update sorting icons in table headers
function updateSortIcons(headers, col, sortState) {
  for (let i = 0; i < headers.length; i++) {
    let header = headers[i];
    let text = header.innerText.replace(/ ▲| ▼/g, ''); // Remove existing icons
    if (i === col) {
      header.innerText = text + (sortState === 'ascending' ? ' ▲' : ' ▼');
    } else {
      header.innerText = text; // Reset other headers
    }
  }
}

/* ------------------------------------------------------------------
    LIST MODE calculation functions
   ------------------------------------------------------------------
*/
// Checks p1, p2 and field before performing calculation
function checkPokeFieldCombos(p1, p2) {
  // Check if held items result in a different Poke forme
  p1 = updatePokeForme(p1);
  p2 = updatePokeForme(p2);

  // generate the field, use default dummy otherwise
  var field = new dummyField();
  updateFieldTerrain(p1, p2, field);
  // checkAuraAbility(p1, p2)  // have to add Fairy/Dark Aura and Aura Break
  checkRuinAbility(p1, p2); // manually adjust the stats checking for Ruin ability

  return { p1, p2, field };
}

function populateList(parsedDataTeamA, parsedDataTeamB) {
  const damageList = {};

  for (let row = 0; row < parsedDataTeamB.length; row++) {
    for (let col = 0; col < parsedDataTeamA.length; col++) {
      const p1Raw = structuredClone(mode === 'attack' ? parsedDataTeamA[col] : parsedDataTeamB[row]);
      const p2Raw = structuredClone(mode === 'attack' ? parsedDataTeamB[row] : parsedDataTeamA[col]);

      const { p1, p2, field } = checkPokeFieldCombos(p1Raw, p2Raw);
      const { result, maxDamage, minDamage, minPercent, maxPercent } = calculateDamage(p1, p2, field, 'list');

      for (let jj = 0; jj < p1.moves.length; jj++) {
        const move = p1.moves[jj];
        if (!move) continue; // Avoid accessing undefined move

        // --------------------------------------------------------------------
        //   Deconstruct the koChanceText to define KO value
        // --------------------------------------------------------------------
        const koChanceText = getKOChanceText(
          result[jj].damage,
          p1.moves[jj],
          p2,
          field.getSide(0),
          p1.ability === 'Bad Dreams'
        );

        const koChanceTextParts = koChanceText.split(/(\d+|O)HKO/);

        const chanceText = koChanceTextParts[0].trim();
        const matchPercent = chanceText.match(/(\d+(\.\d+)?)%[\s]*chance/);
        const percentKO = matchPercent
          ? parseInt(matchPercent[1], 10)
          : chanceText.includes('guaranteed')
            ? 100
            : chanceText.includes('possible')
              ? 50
              : null;

        const koText = koChanceTextParts[1]?.trim();
        const koNumber = koText ? (koText === 'O' ? 1 : parseInt(koText, 10)) : null;
        const koValue =
          koNumber !== null
            ? Math.round((koNumber + (1 - percentKO / 100)) * 100) / 100 // round to 2 decimals
            : 0;

        // --------------------------------------------------------------------
        //   Deconstruct description from Damage Calculator
        // --------------------------------------------------------------------
        const desc = result[jj].description
          .replace(/Lv\. \d{1,2}|100/g, '') // remove "Lv. XX" (by default all Lv.50)
          .split(' vs. ')
          .map((part) => part.trim());

        const statPattern = /\d+\+?\-?\s*(HP|Atk|Def|SpA|SpD)/g;
        const attackerStat = desc[0].match(statPattern) || [];
        const defenderStat = desc[1].match(statPattern) || [];

        // Flags to check if Ability or Item were used in the damage calc
        const attackerAbilityUsed = !!desc[0].match(p1.ability);
        const attackerItemUsed = !!desc[0].match(p1.item);
        const defenderAbilityUsed = !!desc[0].match(p2.ability);
        const defenderItemUsed = !!desc[0].match(p2.item);

        // Define unique key (ID) for each damage calc
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
            attackerStat: attackerStat,
            attackerItem: p1.item,
            attackerItemUsed: attackerItemUsed,
            attackerAbility: p1.ability,
            attackerAbilityUsed: attackerAbilityUsed,
            defender: p2.name,
            defenderStat: defenderStat.join(' / '),
            defenderItem: p2.item,
            defenderItemUsed: defenderItemUsed,
            defenderAbility: p2.ability,
            defenderAbilityUsed: defenderAbilityUsed,
            isSpread: move.isSpread,
            damageRange: [minDamage[jj], maxDamage[jj]],
            percentRange: [minPercent[jj], maxPercent[jj]],
            koChance: koChanceText,
            koValue: koValue,
          };
        }
      }
    }
  }

  updateTeamSummary(parsedDataTeamA);

  const outputSection = document.getElementById('outputSection');
  outputSection.innerHTML = ''; // Clear existing content

  const list = createList(Object.keys(damageList).length); // Get number of entries in damageList
  outputSection.appendChild(list);

  const tbody = list.tBodies[0]; // Access the table body (tbody)

  // Populate the rows with data from damageList
  Object.values(damageList).forEach((entry) => {
    let row = tbody.insertRow();
    row.innerHTML = `
      <td style="text-align: right;">${entry.attackerStat}</td>
      <td>${entry.attackerAbilityUsed ? entry.attackerAbility : ''}</td>
      <td>
        <span class='item-icon' 
          style="${entry.attackerItemUsed ? getItemIcon(entry.attackerItem) : ''}" 
          title="${entry.attackerItem}">
        </span>
      </td>
      <td>${entry.attacker}</td>
      <td>${entry.moveName}${entry.isSpread ? '*' : ''}</td>
      <td>vs.</td>
      <td style="text-align: right;">${entry.defenderStat}</td>
      <td>${entry.defenderAbilityUsed ? entry.defenderAbility : ''}</td>
      <td>
        <span class='item-icon' 
          style="${entry.defenderItemUsed ? getItemIcon(entry.defenderItem) : ''}" 
          title="${entry.defenderItem}">
        </span>
      </td>
      <td>${entry.defender}</td>
      <td style="text-align: right;">${entry.percentRange[0]}</td><td>-</td><td>${entry.percentRange[1]} %</td>
      <td>(${entry.damageRange[0]}-${entry.damageRange[1]})</td>
      <td>(${entry.koChance})</td>
      <td>${entry.koValue}</td>
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
