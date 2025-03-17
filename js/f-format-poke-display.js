function formatPokeDisplay(teamData, whichteam) {
  const formattedOutput = teamData.map((poke, index) => {
    // Get category of all moves, used to format stat and moves later
    let moveCats = [];
    poke.moves.forEach((move) => {
      if (move.name === 'Tera Blast' && poke.stats.at > poke.stats.sa) {
        moveCats.push('Physical');
      } else {
        moveCats.push(move.category ? move.category : null);
      }
    });

    const statEntries = Object.entries(poke.stats);
    const natureMods = poke.nature ? NATURES[poke.nature] : ['', ''];
    const noPhysicalMoves = !moveCats.includes('Physical');
    const noSpecialMoves = !moveCats.includes('Special');

    const statDisplay = statEntries
      .map(([statName, statValue]) => {
        // Determine the color based on the statName and statValue
        let statStyle = '';
        const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
        // Color stat if nature-boosting or nature-hindering
        if (nature === 1.1) {
          statStyle += 'color: #006400; font-weight: bold;';
        } else if (nature === 0.9) {
          statStyle += 'color: #F08080; font-weight: bold;';
        }
        // Strikethrough if stat is unused
        if ((statName === 'at' && noPhysicalMoves) || (statName === 'sa' && noSpecialMoves)) {
          statStyle += 'text-decoration: line-through;';
        }
        return `<span style="${statStyle}">${statValue}</span>`;
      })
      .join(' / ');

    const evEntries = Object.entries(poke.evs);
    const evDisplay = evEntries
      .map(([evName, evValue]) => {
        const sub = {
          hp: 'HP',
          at: 'Atk',
          df: 'Def',
          sa: 'SpA',
          sd: 'SpD',
          sp: 'Spe',
        };
        const statName = sub[evName];

        // L1: even if EV = 0, display it if poke is attacking & there is a move that uses it
        if ((appState.mode === 'attack' && whichteam === 'A') || (appState.mode === 'defense' && whichteam === 'B')) {
          if ((moveCats.includes('Physical') && evName === 'at') || (moveCats.includes('Special') && evName === 'sa')) {
            return `${evValue} ${statName}`;
          }
        }

        // L2: show relevant non-zero EV stats
        if (
          (appState.mode === 'attack' && whichteam === 'A' && ['at', 'sa'].includes(evName)) ||
          (appState.mode === 'attack' && whichteam === 'B' && ['hp', 'df', 'sd'].includes(evName)) ||
          (appState.mode === 'defense' && whichteam === 'B' && ['at', 'sa'].includes(evName)) ||
          (appState.mode === 'defense' && whichteam === 'A' && ['hp', 'df', 'sd'].includes(evName))
        ) {
          return evValue ? `${evValue} ${statName}` : '';
        }

        return '';
      })
      .filter((item) => item !== '')
      .join(' / ');

    const teraType = poke.tera_type ? `${poke.tera_type}` : `${poke.type1}`;
    const typeDisplay = `
      <img
          src="https://play.pokemonshowdown.com/sprites/types/${poke.type1}.png"
          alt="${poke.type1}"
      >
      ${
        poke.type2
          ? `
          <img
              src="https://play.pokemonshowdown.com/sprites/types/${poke.type2}.png"
              alt=" / ${poke.type2}"
          >`
          : ''
      }`;
    const teraDisplay = `
      <img
          src="https://play.pokemonshowdown.com/sprites/types/Tera${teraType}.png"
          alt="${teraType}"
          style="height: 25px;"
      >`;

    const itemDisplay = ITEMS_SV.includes(poke.item)
      ? `<span class='item-icon' style="${getItemIcon(poke.item)}" title="${poke.item}"></span>`
      : poke.item
        ? `<span style="font-weight: bold; font-size: 2em;" title="undefined item (${poke.item})">?</span>`
        : '';

    const moveDisplay = poke.moves
      .map((moveEntry) => {
        const move = moveEntry.name;
        const moveCat = MOVES_SV[move] ? MOVES_SV[move].category : null;
        const moveType = MOVES_SV[move] ? MOVES_SV[move].type : null;
        const moveColor = typeColors[moveType] || 'transparent';

        let singleMove = '';
        let backgroundStyle = '';
        let checkSpecial = '';

        if (moveCat) {
          if ((whichteam === 'A' && appState.mode === 'defense') || (whichteam === 'B' && appState.mode === 'attack')) {
            checkSpecial = `color: ${moveColor}`;
          } else {
            backgroundStyle = moveCat === 'Status' ? '' : `background-color: ${moveColor}`;
            checkSpecial = moveCat === 'Status' ? `color: ${moveColor}` : '';
          }

          singleMove = `
            <div>
                <div class="move-display-text" style="${checkSpecial}">${move}</div>
                <div class="move-display-background" style="${backgroundStyle}"></div>
            </div>
          `;
        } else {
          singleMove = `<div>?</div>`;
        }

        return singleMove;
      })
      .join('');

    const pokeNameExceptions = ['chi-yu', 'ting-lu', 'wo-chien', 'chien-pao'];
    const formatPokeName = pokeNameExceptions.includes(poke.name.toLowerCase())
      ? poke.name.toLowerCase().replace(/[\s-]+/g, '') // don't remove hyphen for alternate forme sprites
      : poke.name.toLowerCase().replace(/[\s]+/g, '');

    const pokeDisplay = `
      <img
          src="https://play.pokemonshowdown.com/sprites/gen5/${formatPokeName}.png"
          alt="${poke.name}"
      >`;

    // Change what is displayed depending on the team
    let moveDisplayHTML = '';
    if (whichteam === 'A' || (whichteam === 'B' && appState.mode === 'defense')) {
      moveDisplayHTML = `<div class="move-display">${moveDisplay}</div>`;
    }

    return `
      <table>
        <td class="display-cell" id="dcell${index}">
          <div>
            <div class="poke-name-display">${poke.name || '-'}</div>
            <div class="type-display">${typeDisplay}</div>
          </div>
          <div>
            <div class="text-display">${poke.ability || ''}</div>
            <div class="item-display"></div>
            <div class="type-display">${itemDisplay}<div style="margin-right: 18px;"></div>${teraDisplay}</div>
          </div>
          <div>
            <div class="text-display">${statDisplay}</div>
          </div>
          <div>
            <div class="text-display" style="font-size: 0.9em;">(${evDisplay})</div>
          </div>
          <div>
            ${moveDisplayHTML}
            <div class="poke-display">${pokeDisplay}</div>
          </div>
        </td>
      </table>`;
  });

  return formattedOutput;
}
