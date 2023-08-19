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
        // const base = Object.values(poke.bs).join(" / ");
        // const baseText = base ? ` (${base})` : '';
        const stat = Object.values(poke.stat).join(" / ");
        const statText = stat ? ` ${stat}` : '';
        const typeText = poke.t2 ? `${poke.t1} / ${poke.t2}` : poke.t1 || '?';
        const teraType = poke.teratype ? `${poke.teratype}` : `${poke.t1}`;
        const moveText = `
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
          <table>
            <tr>
              <td class="poke-display">
                <b>${poke.name || '-'}</b>
                <span style="float: right;">${typeText} | ${teraType}</span><br>
                ${poke.ability || ''}
                <span style="float: right;">${poke.item || 'no item'}</span><br>
                ${statText}
                <span style="float: right;">${poke.nature || 'no nature'}</span><br>
                ${moveText}
              </td>
            </tr>
          </table>
        `;
    }).join('');

    return `<table><tr>${formattedOutput}</tr></table>`;
}
