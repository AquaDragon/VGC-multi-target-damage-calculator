const files = [
  ['2025-03-gen9vgc2025regg-1500.json', 'Regulation G (2025-03) 1500'],
  ['2025-03-gen9vgc2025reggbo3-1500.json', 'Regulation G Bo3 (2025-03) 1500'],
];

// Get the dropdown element
const dropdown = document.getElementById('ladder-selection');

// Populate the dropdown with the files
files.forEach(([filename, displayName]) => {
  const option = document.createElement('option');
  option.value = filename;
  option.textContent = displayName;
  dropdown.appendChild(option);
});

document.getElementById('generateSpeedUsage').addEventListener('click', async function () {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const selectedValue = selectedOption.value;
  const selectedText = selectedOption.textContent;

  if (selectedValue) {
    // console.log(`${selectedValue}`);
    const output = await generateSpeedUsage();

    clearSystemMessage();
    document.getElementById('outputSection').innerHTML = output;
  } else {
    displaySystemMessage('No ladder selected.');
  }
});
