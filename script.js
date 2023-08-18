function getStatFromPokedex(poke) {
    const statNames = ["hp", "at", "df", "sa", "sd", "sp"];
    const pokemonData = POKEDEX_SV_NATDEX?.[poke.name];

    if (pokemonData) {
        poke.t1 = pokemonData.t1;
        poke.t2 = pokemonData.t2 ?? '';
        poke.bs = {};

        for (const statName of statNames) {
            const statValue = pokemonData.bs?.[statName];
            if (typeof statValue !== 'undefined') {
                poke.bs[statName] = statValue;
            }
        }
    }
}

function formatParsedData(parsedData) {
    parsedData.forEach(getStatFromPokedex); // Populate base stats for each pokemon

    const formattedOutput = parsedData.map((block, index) => {
        const base = Object.values(block.bs).join(" / ");
        const baseText = base ? ` (${base})` : '';
        const typeText = block.t2 ? `${block.t1} / ${block.t2}` : block.t1 || '?';
        const teraType = block.teratype ? `${block.teratype}` : `${block.t1}`;
        const moveText = `
            <table style="width: 100%;">
                <tr>
                    <td style="width: 50%;">${block.moves[0] || ''}</td>
                    <td style="width: 50%;">${block.moves[2] || ''}</td>
                </tr>
                <tr>
                    <td style="width: 50%;">${block.moves[1] || ''}</td>
                    <td style="width: 50%;">${block.moves[3] || ''}</td>
                </tr>
            </table>
        `;

        return `
          <table>
            <tr>
              <td class="poke-display">
                ${block.name || '-'}
                <span style="float: right;">${typeText} | ${teraType}</span><br>
                ${block.ability || ''}
                <span style="float: right;">${block.item || 'no item'}</span><br>
                ${baseText}
                <span style="float: right;">${block.nature || 'no nature'}</span><br>
                ${moveText}
              </td>
            </tr>
          </table>
        `;
    }).join('');

    return `<table><tr>${formattedOutput}</tr></table>`;
}

document.getElementById("processButton").addEventListener("click", function() {
    const inputText = document.getElementById("textInput").value;
    const parsedResult = parseInputText(inputText);

    // Print parsed data to the console for debugging
    console.log(parsedResult);

    const formattedOutput = formatParsedData(parsedResult);
    const outputElement = document.getElementById("outputText");
    outputElement.innerHTML = formattedOutput; // Use innerHTML to render HTML tags
});
