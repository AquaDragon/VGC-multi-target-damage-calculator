document.getElementById("processButton").addEventListener("click", function() {
    const inputTextA = document.getElementById("textInputA").value;
    const inputTextB = document.getElementById("textInputB").value;

    // Check if any of the input boxes is empty
    if (inputTextA.trim() === "" || inputTextB.trim() === "") {
        displaySystemMessage("Please input the PokePaste for both teams.", true);
        return;
    }

    const parsedDataTeamA = parseInputText(inputTextA);
    const parsedDataTeamB = parseInputText(inputTextB);

    populateTable(parsedDataTeamA, parsedDataTeamB);

    displaySystemMessage("");  // Clear any previous system messages
});


// Function to display a system message
function displaySystemMessage(message, isError = false) {
    const systemMessageElement = document.getElementById("systemMessage");
    systemMessageElement.textContent = message;

    if (isError) {
        systemMessageElement.classList.add("error");
    } else {
        systemMessageElement.classList.remove("error");
    }
}