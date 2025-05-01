function getPokeCardTemplate(pkeList, pIndex) {
    return `<div onclick="showOverlay(${pIndex})" id="pokemon${pIndex + 1}" class="poke-card">
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

function getNotFoundTemplate(){
    return `<p class="not-found">Pokémon not found</p>`;
}


function getOverlayAboutTemplate(pokemonData, speciesData){
    return `<div class="flavor-text">
                                    ${getFlavorText(speciesData)}
                                </div>
                                <div class="info-points">
                                    <span>Pokédex-ID:</span>
                                    <span>#${pokemonData.id}</span>
                                </div>
                                <div class="info-points">
                                    <span>Height</span>
                                    <span>${getHeight(pokemonData)}m</span>
                                </div>
                                <div class="info-points">
                                    <span>Weight:</span>
                                    <span>${getweight(pokemonData)}kg</span>
                                </div>`
}