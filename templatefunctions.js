function getPokeCardTemplate(pkeList, pIndex) {
    return `<div id="pokemon${pIndex + 1}" class="poke-card">
                <div class="card-top">
                    <h2>${pkeList[pIndex].name}</h2>
                    <span>#${pIndex + 1}</span>
                </div>
                <div class="card-bottom">
                    <div id="types${pIndex + 1}" class="types"></div> <!-- Container for types -->
                    <img
                        class="poke-img"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pIndex + 1}.svg"
                    />
                </div>
                <div class="card-bg"></div>
            </div>`;
}

function getTypeTemplate(typeObject) {
    return `<span class="${typeObject.type.name}">${typeObject.type.name}</span>`;
}
