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
        const natureMods = this.nature ? NATURES[this.nature] : ['',''];

        for (const statName of statNames) {
            const base = ~~this.bs[statName];
            const evs = ~~this.evs[statName];
            const ivs = ~~this.ivs[statName];
            const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
            const total = Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * nature);
            this.stat[statName] = total;
        }
    }
}
