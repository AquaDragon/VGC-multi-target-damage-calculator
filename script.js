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
        const stats = Object.values(block.bs).join(" / "); // Combine base stats
        const statText = stats ? ` (${stats})` : '';
        const typeText = block.t2 ? `${block.t1} / ${block.t2}` : block.t1 || '?';
        return `
          <table>
            <tr>
              <td>${block.name || '-'}<br>${typeText}<br>${statText}</td>
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

