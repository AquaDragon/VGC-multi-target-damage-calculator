document.getElementById("processButton").addEventListener("click", function() {
    const inputText1 = document.getElementById("textInput1").value;
    const parsedResult1 = parseInputText(inputText1);
    const parsedDataTeamA = formatParsedData(parsedResult1);

    const inputText2 = document.getElementById("textInput2").value;
    const parsedResult2 = parseInputText(inputText2);
    const parsedDataTeamB = formatParsedData(parsedResult2);

    updateTable(parsedDataTeamA, parsedDataTeamB);
});
