var mode = 'attack';

document.getElementById('processButton').addEventListener('click', function () {
  updateTable();
});

function updateTable() {
  const inputTextA = document.getElementById('textInputA').value;
  const inputTextB = document.getElementById('textInputB').value;

  // Check if any of the input boxes is empty
  if (inputTextA.trim() === '' && inputTextB.trim() === '') {
    displaySystemMessage('Please input PokePastes for both teams.', true);
    return;
  } else if (inputTextA.trim() === '') {
    displaySystemMessage('Please input a PokePaste for Team A.', true);
    return;
  } else if (inputTextB.trim() === '') {
    displaySystemMessage('Please input a PokePaste for Team B.', true);
    return;
  }

  const parsedDataTeamA = parseInputText(inputTextA);
  const parsedDataTeamB = parseInputText(inputTextB);

  populateTable(parsedDataTeamA, parsedDataTeamB);

  updateModeLabel();
  displaySystemMessage(''); // Clear any previous system messages
}

function displaySystemMessage(message, isError = false) {
  const systemMessageElement = document.getElementById('systemMessage');
  systemMessageElement.textContent = message;

  if (isError) {
    systemMessageElement.classList.add('error');
  } else {
    systemMessageElement.classList.remove('error');
  }
}

function swapInputValues() {
  const textareaA = document.getElementById('textInputA');
  const textareaB = document.getElementById('textInputB');

  const tempValue = textareaA.value;
  textareaA.value = textareaB.value;
  textareaB.value = tempValue;
}

function switchModes() {
  var button = document.getElementById('modeSwitchButton');
  if (mode === 'attack') {
    mode = 'defense';
    button.innerText = 'Switch to Attack Mode';
  } else {
    button.innerText = 'Switch to Defense Mode';
    mode = 'attack';
  }
  updateTable();
}

function updateModeLabel() {
  const modeLabelElement = document.getElementById('modeLabel');
  modeLabelElement.innerHTML = `<h3>${toTitleCase(mode)} Mode</h3>`;
}

function clearTextInput(inputId) {
  document.getElementById(inputId).value = '';
}

function inputRandomTeam(inputId) {
  document.getElementById(inputId).value = `Tornadus @ Focus Sash
Ability: Prankster
Level: 50
Tera Type: Ghost
EVs: 20 HP / 252 SpA / 236 Spe
Naive Nature
- Air Slash
- Knock Off
- Tailwind
- Protect

Ogerpon-Hearthflame @ Hearthflame Mask
Ability: Mold Breaker
Level: 50
Tera Type: Fire
EVs: 36 HP / 212 Atk / 4 Def / 4 SpD / 252 Spe
Jolly Nature
IVs: 20 SpA
- Ivy Cudgel
- Grassy Glide
- Horn Leech
- Spiky Shield

Urshifu @ Life Orb
Ability: Unseen Fist
Level: 50
Tera Type: Dark
EVs: 172 HP / 140 Atk / 28 Def / 12 SpD / 156 Spe
Adamant Nature
- Close Combat
- Wicked Blow
- Detect
- Sucker Punch

Landorus-Therian @ Choice Scarf
Ability: Intimidate
Level: 50
Tera Type: Rock
EVs: 132 HP / 116 Atk / 4 Def / 4 SpD / 252 Spe
Adamant Nature
- Stomping Tantrum
- Rock Slide
- Rock Tomb
- U-turn

Rillaboom @ Assault Vest
Ability: Grassy Surge
Level: 50
Tera Type: Fire
EVs: 252 HP / 116 Atk / 4 Def / 76 SpD / 12 Spe
Adamant Nature
IVs: 8 SpA
- Grassy Glide
- High Horsepower
- U-turn
- Fake Out

Gholdengo @ Choice Specs
Ability: Good as Gold
Level: 50
Tera Type: Steel
EVs: 212 HP / 4 Def / 180 SpA / 4 SpD / 108 Spe
Modest Nature
IVs: 0 Atk
- Make It Rain
- Shadow Ball
- Thunderbolt
- Power Gem`;
}

// get rid of lame error message from imports/dmgcalc/ap_calc.js
function checkaprilfools() {}
