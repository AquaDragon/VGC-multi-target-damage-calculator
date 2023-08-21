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
