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
    const [nameItemLine, ...dataLines] = lines.map((line) => line.trim());
    const [name, item] = nameItemLine.split(' @ ');

    let ability = '';
    let level = 50; // default set to 50 (different from showdown)
    let teratype = '';
    let evs = {};
    let nature = '';
    let ivs = {};
    let moves = [];

    dataLines.forEach((line) => {
      const trimmedLine = line.trim();
      const splitLine = trimmedLine.split(' ');

      if (splitLine.length >= 2 && splitLine[splitLine.length - 1] === 'Nature') {
        nature = splitLine[0];
      } else {
        const [key, value] = trimmedLine.split(':').map((part) => part.trim());
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

        if (normalizedKey === 'level') {
          level = parseInt(value);
        } else if (normalizedKey === 'evs') {
          parseStats(value, evs);
        } else if (normalizedKey === 'ivs') {
          parseStats(value, ivs);
        } else if (trimmedLine.startsWith('- ')) {
          moves.push(trimmedLine.substring(2));
        } else if (normalizedKey === 'ability') {
          ability = value;
        } else if (normalizedKey === 'teratype') {
          teratype = value;
        }
      }
    });

    const poke = new PokemonInfo(name, item, level, ability, nature, teratype, moves, evs, ivs);
    parsedData.push(poke);
  }

  return parsedData;
}
