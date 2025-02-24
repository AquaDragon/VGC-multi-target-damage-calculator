var mode = 'attack';
var currentOutputType = 'none';

document.getElementById('constructTableButton').addEventListener('click', function () {
  currentOutputType = 'table';
  updateOutput('table');
});

document.getElementById('constructListButton').addEventListener('click', function () {
  currentOutputType = 'list';
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

  const parsedDataTeamA = parseInputText(inputTextA);
  const parsedDataTeamB = parseInputText(inputTextB);

  return { parsedDataTeamA, parsedDataTeamB };
}

function updateOutput(type) {
  const { parsedDataTeamA, parsedDataTeamB } = validateInputs();
  if (type === 'table') {
    populateTable(parsedDataTeamA, parsedDataTeamB);
  } else if (type === 'list') {
    populateList(parsedDataTeamA, parsedDataTeamB);
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
  if (mode === 'attack') {
    mode = 'defense';
  } else {
    mode = 'attack';
  }
  updateOutput(currentOutputType);
}

function updateModeLabel() {
  const modeLabelElement = document.getElementById('modeLabel');
  const buttonText = mode === 'attack' ? 'Switch to Defense Mode' : 'Switch to Attack Mode';
  modeLabelElement.innerHTML = `<b style="font-size: calc(1.2 * 1rem);">${toTitleCase(mode)} Mode</b>
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
