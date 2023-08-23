document.getElementById("processButton").addEventListener("click", function() {
    const inputText1 = document.getElementById("textInput1").value;
    const inputText2 = document.getElementById("textInput2").value;

    // Check if any of the input boxes is empty
    if (inputText1.trim() === "" || inputText2.trim() === "") {
        displaySystemMessage("Please input the PokePaste for both teams.", true);
        return;
    }

    const parsedResult1 = parseInputText(inputText1);
    const parsedDataTeamA = formatParsedData(parsedResult1);

    const parsedResult2 = parseInputText(inputText2);
    const parsedDataTeamB = formatParsedData(parsedResult2);

    updateTable(parsedDataTeamA, parsedDataTeamB);

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