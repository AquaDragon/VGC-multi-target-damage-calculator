function getStatFromPokedex(poke, statName) {
    // Assuming the variable name is "POKEDEX_SV_NATDEX" in pokedex.js
    if (typeof POKEDEX_SV_NATDEX !== 'undefined') {
        const pokemonData = POKEDEX_SV_NATDEX[poke];
        if (pokemonData && pokemonData.bs && typeof pokemonData.bs[statName] !== 'undefined') {
            return pokemonData.bs[statName];
        }
    }
    return null; // Pokémon data not found or stat not available
}

function formatParsedData(parsedData) {
    const statNames = ["hp", "at", "df", "sa", "sd", "sp"];

    const formattedOutput = parsedData.map((block, index) => {
        const stats = statNames.map(statName => getStatFromPokedex(block.pkmn, statName)).join(" / ");
        const statText = stats ? ` (${stats})` : '';
        return `${block.pkmn || '-'}${statText}<br>`;
    }).join('');

    return formattedOutput;
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
