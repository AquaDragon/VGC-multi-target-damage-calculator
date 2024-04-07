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

// Functions associated with creating the crosstable display
function createTable(rows, columns) {
  const table = document.createElement('table');

  // Create rows and cells for each row
  for (let row = 0; row <= rows; row++) {
    const newRow = table.insertRow();
    for (let col = 0; col <= columns; col++) {
      const cell = newRow.insertCell();
      cell.id = `cell-${row}-${col}`;

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

function updateCell(row, col, content) {
  const cellId = `cell-${row}-${col}`;
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

  const htmlOutputTeamA = formatParsedData(parsedDataTeamA);
  const htmlOutputTeamB = formatParsedData(parsedDataTeamB);

  // Populate 1st column with Team A data
  for (let row = 1; row <= parsedDataTeamA.length; row++) {
    updateCell(row, 0, htmlOutputTeamA[row - 1]);
  }

  // Populate 1st row with Team B data
  for (let col = 1; col <= parsedDataTeamB.length; col++) {
    updateCell(0, col, htmlOutputTeamB[col - 1]);
  }

  for (let row = 1; row <= parsedDataTeamA.length; row++) {
    for (let col = 1; col <= parsedDataTeamB.length; col++) {
      var p1 = parsedDataTeamA[row - 1];
      var p2 = parsedDataTeamB[col - 1];
      var field = new dummyField();

      var damageResults = CALCULATE_ALL_MOVES_SV(p1, p2, field);

      var resultA = [],
        resultB = [],
        minDamageA,
        minDamageB,
        maxDamageA = [],
        maxDamageB = [],
        minPercent,
        maxPercent,
        percentText;
      var highestMaxPercent = -1;
      var bestResult;
      for (var i = 0; i < 4; i++) {
        p1.moves[i].painMax = p1.moves[i].name === 'Pain Split' && p1.isDynamax;
        resultA[i] = damageResults[0][i];
        minDamageA = resultA[i].damage[0] * p1.moves[i].hits;
        maxDamageA[i] = resultA[i].damage[resultA[i].damage.length - 1] * p1.moves[i].hits;
        minPercent = Math.floor((minDamageA * 1000) / p2.maxHP) / 10;
        maxPercent = Math.floor((maxDamageA[i] * 1000) / p2.maxHP) / 10;
        resultA[i].damageText =
          p1.moves[i].name + ' ' + minDamageA + '-' + maxDamageA[i] + ' (' + minPercent + ' - ' + maxPercent + '%)';

        p2.moves[i].painMax = p2.moves[i].name === 'Pain Split' && p2.isDynamax;
        resultB[i] = damageResults[1][i];
        minDamageB = resultB[i].damage[0] * p2.moves[i].hits;
        maxDamageB[i] = resultB[i].damage[resultB[i].damage.length - 1] * p2.moves[i].hits;
        minPercent = Math.floor((minDamageB * 1000) / p1.maxHP) / 10;
        maxPercent = Math.floor((maxDamageB[i] * 1000) / p1.maxHP) / 10;
        resultB[i].damageText =
          p2.moves[i].name + ' ' + minDamageB + '-' + maxDamageB[i] + ' (' + minPercent + ' - ' + maxPercent + '%)';
      }

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
      updateCell(row, col, content);
    }
  }
}

function dummyField() {
  var format = 'Singles';
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
