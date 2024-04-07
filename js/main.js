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
  var randInt = Math.floor(Math.random() * samplePastes.length);
  document.getElementById(inputId).value = samplePastes[randInt];
}

// get rid of lame error message from imports/dmgcalc/ap_calc.js
function checkaprilfools() {}
