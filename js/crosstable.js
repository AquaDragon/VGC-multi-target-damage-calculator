// Functions associated with creating the crosstable display
function createTable(rows, columns) {
    const table = document.createElement('table');

    // Create rows and cells for each row
    for (let row = 0; row <= rows; row++) {
        const newRow = table.insertRow();
        for (let col = 0; col <= columns; col++) {
            const cell = newRow.insertCell();
            cell.id = `cell-${row}-${col}`;

            if (row === 0 && col === 0) {
                cell.innerHTML = `
                    <div class='crosstable-cell'>
                        <p style="text-align: right;">Team B →</p> Team A ↓
                    </div>`;
            }
        }
    }

    return table;
}

function updateCell(row, col, content) {
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.innerHTML = content;
    }
}

// Populate the table with parsed team data
function populateTable(parsedDataTeamA, parsedDataTeamB) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear existing content

    // Create a table with rows for Team A and columns for Team B
    const table = createTable(parsedDataTeamA.length, parsedDataTeamA.length);
    tableContainer.appendChild(table); // Append the table to the container

    const htmlOutputTeamA = formatParsedData(parsedDataTeamA);
    const htmlOutputTeamB = formatParsedData(parsedDataTeamB);

    // Populate 1st column with Team A data
    for (let row = 1; row <= parsedDataTeamA.length; row++) {
        updateCell(row, 0, htmlOutputTeamA[row - 1]);
    }

    // Populate 1st row with Team B data
    for (let col = 1; col <= parsedDataTeamB.length; col++) {
        updateCell(0, col, htmlOutputTeamB[col - 1]);
    }

    for (let row = 1; row <= parsedDataTeamA.length; row++) {
        for (let col = 1; col <= parsedDataTeamB.length; col++) {
            const pokenameA = parsedDataTeamA[row - 1].name;
            const pokenameB = parsedDataTeamB[col - 1].name;

            const content = `
                <div class='crosstable-cell'>
                    ${pokenameA} (A)<br> vs. <br> ${pokenameB} (B)
                </div>
            `;
            updateCell(row, col, content);
        }
    }
}
