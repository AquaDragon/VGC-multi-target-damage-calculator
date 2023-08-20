document.getElementById("processButton").addEventListener("click", function() {
    const inputText = document.getElementById("textInput").value;
    const parsedResult = parseInputText(inputText);

    // Print parsed data to the console for debugging
    console.log(parsedResult);

    const formattedOutput = formatParsedData(parsedResult);
    const outputElement = document.getElementById("outputText");
    outputElement.innerHTML = formattedOutput;
});

function formatParsedData(parsedData) {
    const formattedOutput = parsedData.map((poke, index) => {
        const statEntries = Object.entries(poke.stat);
        const statDisplay = statEntries.map(([statName, statValue]) => {
            // Determine the color based on the statName and statValue
            let statStyle = "";

            const natureMods = poke.nature ? NATURES[poke.nature] : ['',''];
            const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
            if (nature === 1.1) {
                statStyle = "color: #006400; font-weight: bold;"; // Nature-boosting stat in green + bold
            } else if (nature === 0.9) {
                statStyle = "color: #FF0000; font-weight: bold;"; // Nature-hindering stat in red + bold
            }
            return `<span style="${statStyle}">${statValue}</span>`;
        }).join(" / ");


        const teraType = poke.teratype ? `${poke.teratype}` : `${poke.t1}`;
        const typeDisplay = `
            <img
                src="https://play.pokemonshowdown.com/sprites/types/${poke.t1}.png"
                alt="${poke.t1}"
            >
            ${poke.t2 ? `
                <img
                    src="https://play.pokemonshowdown.com/sprites/types/${poke.t2}.png"
                    alt=" / ${poke.t2}"
                >` : ''}
            <img
                src="https://play.pokemonshowdown.com/sprites/types/Tera${teraType}.png"
                alt="${teraType}"
                style="height: 25px;"
            >`;


        const formattedItemName = ITEMS_SV.includes(poke.item)
            ? poke.item.toLowerCase().replace(/\s+/g, '-')
            : 'data-card-01';
        const imgSourceURL = `https://github.com/PokeAPI/sprites/blob/master/sprites/items/`;
        const altText = ITEMS_SV.includes(poke.item)
            ? poke.item
            : poke.item ? 'undefined item (' + poke.item + ')' : 'no item';
        const itemDisplay = poke.item ? `
            <img
                src="${imgSourceURL}${formattedItemName}.png?raw=true"
                alt="${altText}"
                title="${altText}"
                onerror="this.src='${imgSourceURL}data-card-01.png?raw=true'"
            >` : `—`;


        let moveDisplay = "";
        poke.moves.forEach((move) => {
            const moveCat = MOVES_SV[move] ? MOVES_SV[move].category : 'undefined';
            const moveStyle = moveCat === 'Status' ? 'color: #A0A0A0;' : '';
            const singleMove = `
                <div style="${moveStyle}">${move}</div>
            `;
            moveDisplay += singleMove;
        });

        return `
            <tr>
                <td class="display-cell">
                    <div>
                        <div>
                            <div class="poke-name-display">${poke.name || '-'}</div>
                            <div>${poke.ability || ''}</div>
                        </div>
                        <div class="item-display">${itemDisplay}</div>
                        <div class="type-display">${typeDisplay}</div>
                    </div>
                    <div>
                        <div class="stat-display">${statDisplay}</div>
                        <div>${poke.nature || 'no nature'}</div>
                    </div>
                    <div>
                        <div class="move-display">${moveDisplay}</div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `<table>${formattedOutput}</table>`;
}
