/*
    Important functions equivalent to those in (dmg calc)/script_res/ap_calc.js
    29 Aug 2023
*/

// Equivalent to Pokemon()
class PokemonInfo {
    constructor(name, item, level, ability, nature, tera_type, moves, evs = {}, ivs = {}) {
        this.name = name;
        this.item = item;
        this.level = level;
        this.ability = ability;
        this.nature = nature;
        this.tera_type = tera_type;
        this.moves = [
            this.getMoveDetails(moves[0]),
            this.getMoveDetails(moves[1]),
            this.getMoveDetails(moves[2]),
            this.getMoveDetails(moves[3])
        ];
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

        this.stats = {};
        this.calcHP();
        this.calcStats();
        this.HPEVs = this.evs.hp;
        this.maxHP = this.stats.hp;

        this.rawStats = this.stats;  // Set to calculated stats
        this.boosts = {
            "at": 0,
            "df": 0,
            "sa": 0,
            "sd": 0,
            "sp": 0
        };
        this.highestStat = -1;
    }

    fetchDataFromPokedex() {
        const pokemonData = POKEDEX_SV_NATDEX?.[this.name];

        if (pokemonData) {
            this.type1 = pokemonData.t1;
            this.type2 = pokemonData.t2 || '';
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
            this.stats.hp = 1;
        } else {
            const level = ~~this.level;
            const evs = ~~this.evs.hp;
            const ivs = ~~this.ivs.hp;
            const totalHP = Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + level + 10;
            this.stats.hp = totalHP;
        }
    }

    calcStats() {
        const statNames = ["at", "df", "sa", "sd", "sp"];
        const level = ~~this.level;
        const natureMods = this.nature ? NATURES[this.nature] : ['', ''];

        for (const statName of statNames) {
            const base = ~~this.bs[statName];
            const evs = ~~this.evs[statName];
            const ivs = ~~this.ivs[statName];
            const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
            const total = Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * nature);
            this.stats[statName] = total;
        }
    }

    // Load move details so it may be read by damage calc
    getMoveDetails(moveName) {
        var defaultDetails = MOVES_SV[moveName];
        return $.extend({}, {
            name: moveName,
            bp: ~~defaultDetails.bp,
            type: defaultDetails.type,
            category: defaultDetails.category,
            isCrit: 0,
            isZ: 0,
            hits: (defaultDetails.isMultiHit) ? 5  // 2 to 5
                : (defaultDetails.isTenMultiHit) ? 10
                    : (moveName == "Dragon Darts") ? 2
                        : (defaultDetails.isTwoHit) ? 2
                            : (defaultDetails.isThreeHit) ? 3
                                : (moveName == "Beat Up") ? 4
                                : 1,
            isDouble: (defaultDetails.canDouble) ? 2 : 0,
            tripleHits: (defaultDetails.isTripleHit) ? 3 : 0,
            combinePledge: (moveName.includes(" Pledge")) ? moveInfo.find(".move-pledge").val() : 0,
            timesAffected: (["Last Respects", "Rage Fist"].indexOf(moveName) != -1) ? 1 : 0,
        });  // MOVES_SV[move]
    }
}
