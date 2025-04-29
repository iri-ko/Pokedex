function getPokeCardTemplate(pkeList, adjustedIndex) {
    return `<div id="pokemon${adjustedIndex + 1}" class="poke-card">
                <div class="card-top">
                    <h2>${pkeList[adjustedIndex].name}</h2>
                    <span>#${adjustedIndex + 1}</span>
                </div>
                <div class="card-bottom">
                    <div id="types${adjustedIndex + 1}" class="types"></div> <!-- Container for types -->
                    <img
                        class="poke-img"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${adjustedIndex + 1}.svg"
                    />
                </div>
                <div class="card-bg"></div>
            </div>`;
}



function getTypeTemplate(typeObject) {
    return `<span class="${typeObject.type.name}">${typeObject.type.name}</span>`; 
}
