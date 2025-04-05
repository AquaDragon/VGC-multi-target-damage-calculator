const appState = {
  mode: 'attack', // attack, defense
  displayStyle: 'none', // table, list
  activePokeCellID: 0, // integer
  listSort: {},
};

const storedData = {
  teamA: null,
  teamB: null,
};

document.getElementById('constructTableButton').addEventListener('click', function () {
  appState.displayStyle = 'table';
  updateOutput('table');
});

document.getElementById('constructListButton').addEventListener('click', function () {
  appState.displayStyle = 'list';
  updateOutput('list');
});

document.getElementById('resetOutput').addEventListener('click', function () {
  resetOutput();
});

function validateInputs() {
  const inputTextA = document.getElementById('textInputA').value;
  const inputTextB = document.getElementById('textInputB').value;

  // Check if any of the input boxes is empty
  if (inputTextA.trim() === '' && inputTextB.trim() === '') {
    displaySystemMessage('Please input PokePastes for both teams.', true);
    return;
  } else if (inputTextA.trim() === '') {
    displaySystemMessage('Please input a PokePaste for your team.', true);
    return;
  } else if (inputTextB.trim() === '') {
    displaySystemMessage('Please input a PokePaste for the other team.', true);
    return;
  }

  storedData.teamA = parseInputText(inputTextA);
  storedData.teamB = parseInputText(inputTextB);
}

function updateOutput(type) {
  validateInputs();
  if (type === 'table') {
    constructTable(storedData.teamA, storedData.teamB);
  } else if (type === 'list') {
    constructList(storedData.teamA, storedData.teamB);
  }

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

// Table display functions
function switchModes() {
  if (appState.mode === 'attack') {
    appState.mode = 'defense';
  } else {
    appState.mode = 'attack';
  }
  updateOutput(appState.displayStyle);
}

function updateModeLabel() {
  const modeLabelElement = document.getElementById('modeLabel');
  const buttonText = appState.mode === 'attack' ? 'Switch to Defense Mode' : 'Switch to Attack Mode';
  modeLabelElement.innerHTML = `<b style="font-size: calc(1.2 * 1rem);">${toTitleCase(appState.mode)} Mode</b>
  <button id="modeSwitchButton" onclick="switchModes()">↺ ${buttonText}</button>`;
}

// Input functions
function swapInputValues() {
  const textareaA = document.getElementById('textInputA');
  const textareaB = document.getElementById('textInputB');

  const tempValue = textareaA.value;
  textareaA.value = textareaB.value;
  textareaB.value = tempValue;
}

function clearTextInput(inputId) {
  document.getElementById(inputId).value = '';
}

function inputRandomTeam(inputId) {
  var randInt = Math.floor(Math.random() * samplePastes.length);
  document.getElementById(inputId).value = samplePastes[randInt];
}
