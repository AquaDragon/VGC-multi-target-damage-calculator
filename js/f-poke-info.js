// Equivalent to Pokemon() in (dmg calc)/script_res/ap_calc.js
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
      this.getMoveDetails(moves[3]),
    ];
    this.evs = {
      hp: 0,
      at: 0,
      df: 0,
      sa: 0,
      sd: 0,
      sp: 0,
      ...evs, // Merge provided evs with defaults
    };
    this.ivs = {
      hp: 31,
      at: 31,
      df: 31,
      sa: 31,
      sd: 31,
      sp: 31,
      ...ivs, // Merge provided ivs with defaults
    };

    this.fetchDataFromPokedex();

    this.stats = {};
    this.calcHP();
    this.calcStats();
    this.HPEVs = this.evs.hp;
    this.maxHP = this.stats.hp;
    this.curHP = this.stats.hp; // Set to max HP (for KO chance calc)

    this.rawStats = this.stats; // Set to calculated stats
    this.boosts = {
      at: 0,
      df: 0,
      sa: 0,
      sd: 0,
      sp: 0,
    };
    this.highestStat = -1;
  }

  fetchDataFromPokedex() {
    const pokemonData = POKEDEX_SV_NATDEX?.[this.name] || POKEDEX_SV_NATDEX?.[SHOWDOWN_TO_DMGCALC_NAMES[this.name]];

    if (pokemonData) {
      this.type1 = pokemonData.t1;
      this.type2 = pokemonData.t2 || '';
      this.bs = {};

      const statNames = ['hp', 'at', 'df', 'sa', 'sd', 'sp'];
      for (const statName of statNames) {
        const statValue = pokemonData.bs?.[statName];
        if (typeof statValue !== 'undefined') {
          this.bs[statName] = statValue;
        }

        this.weight = pokemonData.w;
        this.formes = pokemonData.formes;
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
      const totalHP = Math.floor(((base * 2 + ivs + Math.floor(evs / 4)) * level) / 100) + level + 10;
      this.stats.hp = totalHP;
    }
  }

  calcStats() {
    const statNames = ['at', 'df', 'sa', 'sd', 'sp'];
    const level = ~~this.level;
    const natureMods = this.nature ? NATURES[this.nature] : ['', ''];

    for (const statName of statNames) {
      const base = ~~this.bs[statName];
      const evs = ~~this.evs[statName];
      const ivs = ~~this.ivs[statName];
      const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
      const total = Math.floor((Math.floor(((base * 2 + ivs + Math.floor(evs / 4)) * level) / 100) + 5) * nature);
      this.stats[statName] = total;
    }
  }

  // Load move details so it may be read by damage calc
  getMoveDetails(moveName) {
    if (MOVES_SV[moveName]) {
      var moveDetails = MOVES_SV[moveName];
      return $.extend({}, moveDetails, {
        name: moveName,
        bp: ~~moveDetails.bp,
        type: moveDetails.type,
        category: moveDetails.category,
        isCrit: 0,
        isZ: 0,
        hits: moveDetails.isMultiHit
          ? 5 // 2 to 5
          : moveDetails.isTenMultiHit
            ? 10
            : moveName == 'Dragon Darts'
              ? 2
              : moveDetails.isTwoHit
                ? 2
                : moveDetails.isThreeHit
                  ? 3
                  : moveName == 'Beat Up'
                    ? 4
                    : 1,
        isDouble: moveDetails.canDouble ? 2 : 0,
        isSpread: moveDetails.isSpread ? 1 : 0,
        tripleHits: moveDetails.isTripleHit ? 3 : 0,
        combinePledge: moveName.includes(' Pledge') ? moveInfo.find('.move-pledge').val() : 0,
        timesAffected: ['Last Respects', 'Rage Fist'].indexOf(moveName) != -1 ? 1 : 0,
      }); // MOVES_SV[move]
    } else {
      return null;
    }
  }
}

// Check if forme changes based on held item
function updatePokeForme(poke) {
  const pokeItemCombos = {
    Zamazenta: { 'Rusted Shield': 'Zamazenta-Crowned' },
    Zacian: { 'Rusted Sword': 'Zacian-Crowned' },
  };

  if (pokeItemCombos[poke.name]?.[poke.item]) {
    // Grab old Pokémon info
    const { name, item, level, ability, nature, tera_type, moves, evs, ivs } = poke;

    // Create new Pokémon with updated forme
    const newPoke = new PokemonInfo(
      pokeItemCombos[poke.name][poke.item],
      item,
      level,
      ability,
      nature,
      tera_type, // teratype
      Object.values(moves).map((move) => move.name), // moves, need to parse into list
      evs,
      ivs
    );
    return newPoke;
  } else {
    return poke;
  }
}

// from ap_calc.js > autoSetTerrain()
function updateFieldTerrain(p1, p2, field) {
  // Grassy Terrain check is first due to the need to check for abilityToggle with Seed Sower
  if ([p1.ability, p2.ability].includes('Grassy Surge') || p1.ability == 'Seed Sower' || p2.ability == 'Seed Sower') {
    field.setTerrain('Grassy');
  } else if (
    [p1.ability, p2.ability].includes('Electric Surge') ||
    [p1.ability, p2.ability].includes('Hadron Engine')
  ) {
    field.setTerrain('Electric');
  } else if ([p1.ability, p2.ability].includes('Misty Surge')) {
    field.setTerrain('Misty');
  } else if ([p1.ability, p2.ability].includes('Psychic Surge')) {
    field.setTerrain('Psychic');
  }
}

// manually adjust the stats checking for Ruin abilities
function checkRuinAbility(p1, p2) {
  const ruinAbilities = {
    'Tablets of Ruin': 'at',
    'Vessel of Ruin': 'sa',
    'Sword of Ruin': 'df',
    'Beads of Ruin': 'sd',
  };

  for (const [ability, stat] of Object.entries(ruinAbilities)) {
    if ([p1.ability, p2.ability].includes(ability)) {
      if (p1.ability !== ability) p1.stats[stat] *= 0.75;
      if (p2.ability !== ability) p2.stats[stat] *= 0.75;
    }
  }
}
