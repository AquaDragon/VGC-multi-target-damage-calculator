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
        const stat = Object.values(poke.stat).join(" / ");
        const statDisplay = stat ? ` ${stat}` : '';

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

        const formattedItemName = poke.item
            ? poke.item.toLowerCase().replace(/\s+/g, '-')
            : 'no-item';
        const itemSourceURL = `https://github.com/PokeAPI/sprites/blob/master/sprites/items/`;
        const itemDisplay = `
            <img
                src="${itemSourceURL}${formattedItemName}.png?raw=true"
                alt="${formattedItemName}"
                title="${poke.item || 'no item'}"
                onerror="this.src='${itemSourceURL}data-card-01.png?raw=true'"
            >`;

        const moveTable = `
            <table style="width: 100%;">
                <tr>
                    <td style="width: 50%;">${poke.moves[0] || ''}</td>
                    <td style="width: 50%;">${poke.moves[2] || ''}</td>
                </tr>
                <tr>
                    <td style="width: 50%;">${poke.moves[1] || ''}</td>
                    <td style="width: 50%;">${poke.moves[3] || ''}</td>
                </tr>
            </table>
        `;

        return `
            <tr>
                <td class="display-cell">
                    <div>
                        <div class="poke-name-display">${poke.name || '-'}</div>
                        <div class="item-display">${itemDisplay}</div>
                        <div class="type-display">${typeDisplay}</div>
                    </div>
                    <div>
                        <div>${poke.ability || ''}</div>
                    </div>
                    <div>
                        <div class="stat-display">${statDisplay}</div>
                        <div>${poke.nature || 'no nature'}</div>
                    </div>
                    ${moveTable}
                </td>
            </tr>
        `;
    }).join('');

    return `<table>${formattedOutput}</table>`;
}
