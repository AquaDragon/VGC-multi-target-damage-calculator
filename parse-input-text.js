class PokeInfo {
    constructor(name, item, level, ability, nature, teratype, moves, evs = {}, ivs = {}) {
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

        this.stat = {}; // Initialize the stat object
        this.fetchDataFromPokedex();
        this.calcHP();
        this.calcStats();
    }

    fetchDataFromPokedex() {
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

    calcHP() {
        const base = this.bs.hp;
        if (base === 1) {
            this.stat.hp = 1;
        } else {
            const level = ~~this.level;
            const evs = ~~this.evs.hp;
            const ivs = ~~this.ivs.hp;
            const totalHP = Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + level + 10;
            this.stat.hp = totalHP;
        }
    }

    calcStats() {
        const statNames = ["at", "df", "sa", "sd", "sp"];
        const level = ~~this.level;

        for (const statName of statNames) {
            const base = ~~this.bs[statName];
            const evs = ~~this.evs[statName];
            const ivs = ~~this.ivs[statName];
            const natureMods = NATURES[this.nature];
            const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
            const total = Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * nature);
            this.stat[statName] = total;
        }
    }
}


function parseStats(spread, statObj) {
    // Format is like: "4 HP / 252 Atk / 252 Spe"
    // statObj: the default EV/IV object 
    
    const sub = {
        'HP': 'hp',
        'Atk': 'at',
        'Def': 'df',
        'SpA': 'sa',
        'SpD': 'sd',
        'Spe': 'sp'
    };

    spread.split('/').forEach(part => {
        const [value, stat] = part.trim().split(' ');    // Split number & stat name
        const statKey = sub[stat];
        statObj[statKey] = parseInt(value);    // Update the specific EV/IV stat
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

        let ability = '';
        let level = 100;
        let teratype = '';
        let evs = {};
        let nature = '';
        let ivs = {};
        let moves = [];

        dataLines.forEach(line => {
            const trimmedLine = line.trim();
            const splitLine = trimmedLine.split(' ');

            if (splitLine.length >= 2 && splitLine[splitLine.length - 1] === 'Nature') {
                nature = splitLine[0];
            } else {
                const [key, value] = trimmedLine.split(':').map(part => part.trim());
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

        const poke = new PokeInfo(name, item, level, ability, nature, teratype, moves, evs, ivs);
        parsedData.push(poke);
    }

    return parsedData;
}
