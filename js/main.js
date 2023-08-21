document.getElementById("processButton").addEventListener("click", function() {
    const inputText1 = document.getElementById("textInput1").value;
    const parsedResult1 = parseInputText(inputText1);
    const parsedDataTeamA = formatParsedData(parsedResult1);

    const inputText2 = document.getElementById("textInput2").value;
    const parsedResult2 = parseInputText(inputText2);
    const parsedDataTeamB = formatParsedData(parsedResult2);

    updateTable(parsedDataTeamA, parsedDataTeamB);
});

// Function to create a table with specified number of rows and columns
function createTable(rows, columns) {
    const table = document.createElement('table');
    
    // Create rows and cells for each row
    for (let row = 0; row <= rows; row++) {
        const newRow = table.insertRow();
        for (let col = 0; col <= columns; col++) {
            const cell = newRow.insertCell();
            cell.id = `cell-${row}-${col}`;
            cell.innerHTML = cell.id;
        }
    }

    return table;
}

// Function to populate a cell with content
function populateCell(row, col, content) {
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.innerHTML = content;
    }
}

// Function to update the table based on parsed data
function updateTable(parsedDataTeamA, parsedDataTeamB) {
    const tableContainer = document.getElementById('tableContainer');
    
    // Clear existing content
    tableContainer.innerHTML = '';
    
    // Create a table with rows for Team A and columns for Team B
    const table = createTable(parsedDataTeamA.length, parsedDataTeamB.length);

    // Append the table to the container
    tableContainer.appendChild(table);
    
    // Populate cells with parsed data for Team A
    for (let row = 1; row <= parsedDataTeamA.length; row++) {
        const contentA = parsedDataTeamA[row - 1];
        populateCell(row, 0, contentA);
    }

    // Populate cells with parsed data for Team B
    for (let col = 1; col <= parsedDataTeamB.length; col++) {
        const contentB = parsedDataTeamB[col - 1];
        populateCell(0, col, contentB);
    }
}

function formatParsedData(parsedData) {
    const formattedOutput = parsedData.map((poke, index) => {
        // Get category of all moves, used to format stat and moves later
        let moveCats = [];
        poke.moves.forEach((move) => {
            if (move === 'Tera Blast' && poke.stat.at > poke.stat.sa) {
                moveCats.push("Physical"); 
            } else {
                moveCats.push(MOVES_SV[move] ? MOVES_SV[move].category : null);
            }
        });

        const statEntries = Object.entries(poke.stat);
        const natureMods = poke.nature ? NATURES[poke.nature] : ['',''];
        const noPhysicalMoves = !moveCats.includes("Physical");
        const noSpecialMoves = !moveCats.includes("Special");

        const statDisplay = statEntries.map(([statName, statValue]) => {
            // Determine the color based on the statName and statValue
            let statStyle = "";
            const nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
            // Color stat if nature-boosting or nature-hindering
            if (nature === 1.1) {
                statStyle += "color: #006400; font-weight: bold;";
            } else if (nature === 0.9) {
                statStyle += "color: #F08080; font-weight: bold;";
            }
            // Italicize if stat is unused
            if (statName === "at" && noPhysicalMoves || statName === "sa" && noSpecialMoves) {
                statStyle += "font-style: italic";
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


        const moveDisplay = poke.moves.map((move) => {
            const moveCat = MOVES_SV[move] ? MOVES_SV[move].category : null;
            const moveType = MOVES_SV[move] ? MOVES_SV[move].type : null;
            const moveColor = typeColors[moveType] || "transparent";

            let singleMove = '';
            if (moveCat) {
                const backgroundStyle = `background-color: ${moveColor}`;
                singleMove = `
                    <div>
                        <div class="move-display-text">${move}</div>
                        <div class="move-display-background" style="${backgroundStyle}"></div>
                    </div>
                `;
            } else {
                singleMove = `
                    <div>?</div>
                `;
            }
            return singleMove;
        }).join('');


        const formatPokeName = poke.name.toLowerCase().replace(/[-\s]+/g, '');
        const pokeDisplay = `
            <img
                src="https://play.pokemonshowdown.com/sprites/gen5/${formatPokeName}.png"
                alt="${poke.name}"
            >`;

            //<div class="text-display">${poke.nature || 'no nature'}</div>
        return `
            <table>
                <td class="display-cell">
                    <div>
                        <div>
                            <div class="poke-name-display">${poke.name || '-'}</div>
                            <div class="text-display">${poke.ability || ''}</div>
                        </div>
                        <div class="item-display">${itemDisplay}</div>
                        <div class="type-display">${typeDisplay}</div>
                    </div>
                    <div>
                        <div class="text-display">${statDisplay}</div>
                    </div>
                    <div>
                        <div class="move-display">${moveDisplay}</div>
                        <div class="poke-display">${pokeDisplay}</div>
                    </div>
                </td>
            </table>`;
    });

    return formattedOutput;
}
