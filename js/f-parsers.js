function parseStats(spread, statObj) {
  // Input format is like: "4 HP / 252 Atk / 252 Spe"
  // statObj: the default EV/IV object

  const sub = {
    HP: 'hp',
    Atk: 'at',
    Def: 'df',
    SpA: 'sa',
    SpD: 'sd',
    Spe: 'sp',
  };

  spread.split('/').forEach((part) => {
    const [value, stat] = part.trim().split(' '); // Split number & stat name
    const statKey = sub[stat];
    statObj[statKey] = parseInt(value); // Update the specific EV/IV stat
  });
}

function parseInputText(inputText) {
  inputText = inputText.trim();

  const blocks = inputText.split('\n\n');
  const parsedData = [];

  for (let index = 0; index <= 5 && index < blocks.length; index++) {
    const lines = blocks[index].split('\n');
    const [nameGenderItem, ...dataLines] = lines.map((line) => line.trim());
    const [nameGender, item] = nameGenderItem.split(' @ ');
    const [nameRaw, gender] = nameGender.split(/\s?\((M|F)\)/);
    const name = (nameRaw.match(/\(([^)]+)\)/) || [])[1] || nameRaw; // get rid of the nickname

    let ability = '';
    let level = 50; // default set to 50 (different from showdown)
    let teratype = '';
    let evs = {};
    let nature = '';
    let ivs = {};
    let moves = [];

    dataLines.forEach((lineRaw) => {
      const line = lineRaw.trim();
      const natureLine = line.match(/^(\w+)\sNature$/);

      if (natureLine) {
        nature = natureLine[1]; // regex group 1
      } else {
        const [key, value] = line.split(':').map((part) => part.trim());

        if (key === 'Ability') {
          ability = value;
        } else if (key === 'Level') {
          level = parseInt(value);
        } else if (key === 'Tera Type') {
          teratype = value;
        } else if (key === 'EVs') {
          parseStats(value, evs);
        } else if (key === 'IVs') {
          parseStats(value, ivs);
        } else if (line.startsWith('- ')) {
          moves.push(line.substring(2));
        }
      }
    });

    const poke = new PokemonInfo(name, item, level, ability, nature, teratype, moves, evs, ivs);
    parsedData.push(poke);
  }

  return parsedData;
}

function parseNatureDisplay(nature, stat) {
  return NATURES[nature][0] === stat ? '+' : NATURES[nature][1] === stat ? '-' : '';
}
