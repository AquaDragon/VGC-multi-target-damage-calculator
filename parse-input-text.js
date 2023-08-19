class PokeInfo {
    constructor(name, item, level, ability, nature, teratype, moves, evs = {}, ivs = {}, ) {
        this.name = name;
        this.item = item;
        this.level = level;
        this.ability = ability;
        this.nature = nature;
        this.teratype = teratype;
        this.moves = moves;
        this.evs = {
            "hp": 0,
            "at": 0,
            "df": 0,
            "sa": 0,
            "sd": 0,
            "sp": 0,
            ...evs // Merge provided evs with defaults
        };
        this.ivs = {
            "hp": 31,
            "at": 31,
            "df": 31,
            "sa": 31,
            "sd": 31,
            "sp": 31,
            ...ivs // Merge provided ivs with defaults
        };
        
        this.fetchDataFromPokedex();
    }

    // Method to fetch data from the Pokédex
    fetchDataFromPokedex() {
        // Implement this method to retrieve data from your data source
        const pokemonData = POKEDEX_SV_NATDEX?.[this.name];
        
        if (pokemonData) {
            this.t1 = pokemonData.t1;
            this.t2 = pokemonData.t2 || '';
            this.bs = {};
            
            const statNames = ["hp", "at", "df", "sa", "sd", "sp"];
            for (const statName of statNames) {
                const statValue = pokemonData.bs?.[statName];
                if (typeof statValue !== 'undefined') {
                    this.bs[statName] = statValue;
                }
            }
        }
    }
}

function parseStats(parts, targetObj, targetKey) {
    targetObj[targetKey] = {}; // Initialize the target object key as an empty object

    const sub = {
        'HP': 'hp',
        'Atk': 'at',
        'Def': 'df',
        'SpA': 'sa',
        'SpD': 'sd',
        'Spe': 'sp'
    };

    parts.forEach(part => {
        const [value, stat] = part.trim().split(' ');
        const statKey = sub[stat] || stat.substring(0, 2).toUpperCase();
        targetObj[targetKey][statKey] = parseInt(value);
    });
}

function parseInputText(inputText) {
    inputText = inputText.trim();
    
    const blocks = inputText.split('\n\n');
    const parsedData = [];

    for (let index = 0; index <= 5 && index < blocks.length; index++) {
        const lines = blocks[index].split('\n');

        const [nameItemLine, ...dataLines] = lines.map(line => line.trim());
        const [name, item] = nameItemLine.split(' @ ');

        // Extract other properties using the class constructor
        const evs = {}; // Initialize evs as an empty object
        const ivs = {}; // Initialize ivs as an empty object

        let level = 100; // Initialize level
        let nature = ''; // Initialize nature
        let ability = ''; // Initialize ability
        let teratype = ''; // Initialize teratype
        let moves = []; // Initialize moves

        dataLines.forEach(line => {
            const trimmedLine = line.trim();
            
            const splitLine = trimmedLine.split(' ');

            // Check lines for nature
            if (splitLine.length >= 2 && splitLine[splitLine.length - 1] === 'Nature') {
                nature = splitLine[0];
            } else {
                const [key, value] = trimmedLine.split(':').map(part => part.trim());
                const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

                if (normalizedKey === 'level') {
                    level = parseInt(value);
                } else if (normalizedKey === 'evs') {
                    parseStats(value.split('/'), evs, 'evs');
                } else if (normalizedKey === 'ivs') {
                    parseStats(value.split('/'), ivs, 'ivs');
                } else if (trimmedLine.startsWith('- ')) {
                    moves.push(trimmedLine.substring(2));    // Moves
                } else if (normalizedKey === 'ability') {
                    ability = value;
                } else if (normalizedKey === 'teratype') {
                    teratype = value;
                }
            }
        });

        const poke = new PokeInfo(name, item, level, ability, nature, teratype, moves, evs, ivs);
        parsedData.push(poke);
    }

    return parsedData;
}
