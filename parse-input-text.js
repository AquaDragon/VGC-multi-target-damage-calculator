// Define the statSubstitution function within parseText
function statSubstitution(stat) {
    const sub = {
        'HP': 'hp',
        'Atk': 'at',
        'Def': 'df',
        'SpA': 'sa',
        'SpD': 'sd',
        'Spe': 'sp'
    };

    return sub[stat] || stat.substring(0, 2).toUpperCase();
}

function parseStats(parts, targetObj, targetKey) {
    parts.forEach(part => {
        const [value, stat] = part.trim().split(' ');
        const statKey = statSubstitution(stat);
        targetObj[targetKey][statKey] = parseInt(value);
    });
}

function parseInputText(inputText) {
    inputText = inputText.trim();

    const blocks = inputText.split('\n\n');
    const parsedData = [];

    for (let index = 0; index <= 5 && index < blocks.length; index++) {
        const lines = blocks[index].split('\n');
        const poke = {}; // Create a new object for each block data

        const [nameItemLine, ...dataLines] = lines.map(line => line.trim());
        const [name, item] = nameItemLine.split(' @ ');

        poke.name = name;
        poke.item = item;
        poke.ability = '';
        poke.level = '';
        poke.teratype = '';
        poke.evs = {
            "hp": 0,
            "at": 0,
            "df": 0,
            "sa": 0,
            "sd": 0,
            "sp": 0
        };
        poke.nature = '';
        poke.ivs = {
            "hp": 31,
            "at": 31,
            "df": 31,
            "sa": 31,
            "sd": 31,
            "sp": 31
        };
        poke.moves = [];

        dataLines.forEach(line => {
            const trimmedLine = line.trim();

            const splitLine = trimmedLine.split(' ');
            // Check lines for nature
            if (splitLine.length >= 2 && splitLine[splitLine.length - 1] === 'Nature') {
                poke['nature'] = splitLine[0];
            } else {
                const [key, value] = trimmedLine.split(':').map(part => part.trim());
                const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

                if (normalizedKey === 'level') {
                    poke[normalizedKey] = parseInt(value); // Parse value as an integer
                } else if (normalizedKey === 'evs') {
                    parseStats(value.split('/'), poke, 'evs');
                } else if (normalizedKey === 'ivs') {
                    parseStats(value.split('/'), poke, 'ivs');
                } else if (normalizedKey && value) {
                    poke[normalizedKey] = value;
                } else if (trimmedLine.startsWith('- ')) {
                    poke.moves.push(trimmedLine.substring(2));
                }
            }
        });

        parsedData.push(poke);
    }

    return parsedData;
}
