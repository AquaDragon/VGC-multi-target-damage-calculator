function formatParsedData(parsedData) {
    const formattedOutput = parsedData.map((block, index) => {
        return `${block.pkmn || '-'}`;
    }).join(' / ');

    return formattedOutput;
}

document.getElementById("processButton").addEventListener("click", function() {
    const inputText = document.getElementById("textInput").value;
    const parsedResult = parseInputText(inputText);

    // Print parsed data to the console for debugging
    console.log(parsedResult);

    const formattedOutput = formatParsedData(parsedResult);
    document.getElementById("outputText").textContent = formattedOutput;
});
