function parseText(inputText) {
    inputText = inputText.trim();

    // Define the statSubstitution function within parseText
    function statSubstitution(stat) {
        const substitutions = {
            'HP': 'HP',
            'Atk': 'AT',
            'Def': 'DF',
            'SpA': 'SA',
            'SpD': 'SD',
            'Spe': 'SP'
        };

        return substitutions[stat] || stat.substring(0, 2).toUpperCase();
    }

    const blocks = inputText.split('\n\n');
    const parsedData = [];

    for (let index = 0; index <= 5 && index < blocks.length; index++) {
        const lines = blocks[index].split('\n');
        const p = {}; // Create a new object for each block data

        // Check the first line for (name) @ (item) format
        const nameItemLine = lines.shift().trim();
        const [pkmn, item] = nameItemLine.split(' @ ');

        p.pkmn = pkmn;
        p.item = item;
        p.ability = '';
        p.level = '';
        p.teratype = ''; // Set teraType to an empty string
        p.evs = {
            HP: 0,
            AT: 0,
            DF: 0,
            SA: 0,
            SD: 0,
            SP: 0
        };
        p.nature = '';
        p.ivs = {
            HP: 31,
            AT: 31,
            DF: 31,
            SA: 31,
            SD: 31,
            SP: 31
        };
        p.moves = [];

        lines.forEach(line => {
            const trimmedLine = line.trim();

            const natureParts = trimmedLine.split(' ');
            if (natureParts.length >= 2 && natureParts[natureParts.length - 1] === 'Nature') {
                p['nature'] = natureParts[0];
            } else {
                const [key, value] = trimmedLine.split(':').map(part => part.trim());
                const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

                if (normalizedKey === 'level') {
                    p[normalizedKey] = parseInt(value); // Parse value as an integer
                } else if (normalizedKey === 'evs') {
                    const evParts = value.split('/');
                    evParts.forEach(evPart => {
                        const [evValue, evStat] = evPart.trim().split(' ');
                        const evStatKey = statSubstitution(evStat);
                        p.evs[evStatKey] = parseInt(evValue);
                    });
                } else if (normalizedKey === 'ivs') {
                    const ivParts = value.split('/');
                    ivParts.forEach(ivPart => {
                        const [ivValue, ivStat] = ivPart.trim().split(' ');
                        const ivStatKey = statSubstitution(ivStat);
                        p.ivs[ivStatKey] = parseInt(ivValue);
                    });
                } else if (normalizedKey && value) {
                    p[normalizedKey] = value;
                } else if (trimmedLine.startsWith('- ')) {
                    p.moves.push(trimmedLine.substring(2));
                }
            }
        });

        parsedData.push(p);
    }

    return parsedData;
}

function formatParsedData(parsedData) {
    const formattedOutput = parsedData.map((block, index) => {
        return `${block.pkmn || '-'}`;
    }).join(' / ');

    return formattedOutput;
}

document.getElementById("processButton").addEventListener("click", function() {
    const inputText = document.getElementById("textInput").value;
    const parsedResult = parseText(inputText);

    // Print parsed data to the console for debugging
    console.log(parsedResult);

    const formattedOutput = formatParsedData(parsedResult);
    document.getElementById("outputText").textContent = formattedOutput;
});
