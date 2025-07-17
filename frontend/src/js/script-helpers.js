function setupLoggerStatus() {
    let statusElement = document.getElementById('logs_status');
    if (statusElement && !logsEnabled) {
        statusElement.classList.add('disabled');
    }
}

function updateLoggerUI() {
    let statusElement = document.getElementById('logs_status');
    if (statusElement) {
        if (logsEnabled) {
            statusElement.classList.remove('disabled');
        } else {
            statusElement.classList.add('disabled');
        }
    }
}

function updateAllLogSettings() {
    apiLogs = logsEnabled;
    renderLogs = logsEnabled;
    pageLogs = logsEnabled;
    generationLogs = logsEnabled;
    searchLogs = logsEnabled;
    pokemonLogs = logsEnabled;
    loadingLogs = logsEnabled;
    paginationLogs = logsEnabled;
    evolutionLogs = logsEnabled;
    appLogs = logsEnabled;
    errorLogs = logsEnabled;
}

function createAllGenerationsObject(allSpecies) {
    let sortedGenerationData = new Object();
    sortedGenerationData.id = 'all';
    sortedGenerationData.name = 'all-generations';
    sortedGenerationData.pokemon_species = allSpecies;
    
    return sortedGenerationData;
}

function getAllPokemonIdsFromGeneration() {
    let allPokemonIds = [];
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        allPokemonIds.push(species.id);
    }
    logSearchMessage("searching through " + allPokemonIds.length + " pokemon in current generation");
    return allPokemonIds;
}

function filterPokemonBySearchTerm(allPokemonIds) {
    let matchingIds = [];
    
    for (let idIndex = 0; idIndex < allPokemonIds.length; idIndex++) {
        let pokemonId = allPokemonIds[idIndex];
        let species = findSpeciesById(pokemonId);
        
        if (species && shouldIncludePokemon(species, pokemonId)) {
            matchingIds.push(pokemonId);
            logSearchMessage("match found: " + species.name + " (#" + pokemonId + ")");
        }
    }
    
    return matchingIds;
}

function shouldIncludePokemon(species, pokemonId) {
    if (isNumericSearch(currentSearchTerm)) {
        return pokemonId.toString().includes(currentSearchTerm);
    } else {
        return species.name.toLowerCase().includes(currentSearchTerm);
    }
}

function findSpeciesById(pokemonId) {
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        if (species.id === pokemonId) {
            return species;
        }
    }
    return null;
}

function isNumericSearch(searchTerm) {
    for (let characterIndex = 0; characterIndex < searchTerm.length; characterIndex++) {
        let currentCharacter = searchTerm[characterIndex];
        
        if (currentCharacter < '0' || currentCharacter > '9') {
            return false;
        }
    }
    
    logSearchMessage("numeric search detected: " + searchTerm);
    return true;
}

function processPokemonSpeciesData(generationData) {
    logGenerationMessage("processing pokemon species data for sorting");

    let pokemonSpeciesWithIds = extractPokemonSpeciesWithIds(generationData);
    pokemonSpeciesWithIds.sort(sortPokemonById);

    let sortedGenerationData = buildSortedGenerationData(generationData, pokemonSpeciesWithIds);
    
    logGenerationMessage("pokemon species sorting completed");
    return sortedGenerationData;
}

function extractPokemonSpeciesWithIds(generationData) {
    let pokemonSpeciesWithIds = [];
    
    for (let speciesIndex = 0; speciesIndex < generationData.pokemon_species.length; speciesIndex++) {
        let species = generationData.pokemon_species[speciesIndex];
        let urlParts = species.url.split('/');
        let pokemonId = parseInt(urlParts[urlParts.length - 2]);

        let pokemonWithId = {
            name: species.name,
            url: species.url,
            id: pokemonId
        };
        pokemonSpeciesWithIds.push(pokemonWithId);
    }
    
    return pokemonSpeciesWithIds;
}

function sortPokemonById(pokemonA, pokemonB) {
    return pokemonA.id - pokemonB.id;
}

function buildSortedGenerationData(generationData, pokemonSpeciesWithIds) {
    return {
        id: generationData.id,
        name: generationData.name,
        main_region: generationData.main_region,
        pokemon_species: pokemonSpeciesWithIds
    };
}

function calculatePagination(page, itemsPerPage, pokemonSpeciesList) {
    logPaginationMessage("calculating pagination for page: " + page);
    
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, pokemonSpeciesList.length);

    let pokemonIds = extractPokemonIdsFromRange(pokemonSpeciesList, startIndex, endIndex);

    let paginationResult = buildPaginationResult(startIndex, endIndex, pokemonIds, pokemonSpeciesList.length, page);
    
    logPaginationMessage("pagination calculated: " + paginationResult.itemsOnThisPage + " items on page " + page);
    return paginationResult;
}

function extractPokemonIdsFromRange(pokemonSpeciesList, startIndex, endIndex) {
    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = pokemonSpeciesList[index];
        pokemonIds.push(species.id);
    }
    return pokemonIds;
}

function buildPaginationResult(startIndex, endIndex, pokemonIds, totalItems, currentPage) {
    return {
        startIndex: startIndex,
        endIndex: endIndex,
        pokemonIds: pokemonIds,
        totalItems: totalItems,
        currentPage: currentPage,
        itemsOnThisPage: pokemonIds.length
    };
}

function prepareStatsModalContentData(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let typeBadges = extractTypeBadges(pokemon);
    let abilities = extractAbilities(pokemon);
    
    let typeBadgesHTML = typeBadges.join(' ');
    let abilityString = abilities.join(', ');
    let pokemonHeight = pokemon.height / 10;
    let pokemonWeight = pokemon.weight / 10;
    const evolutionChain = parseEvolutionChain(pokemon.evolution_chain);
    
    return buildStatsModalData(sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain);
}

function extractTypeBadges(pokemon) {
    let typeBadges = [];
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let typeName = pokemon.types[typeIndex].type.name;
        typeBadges.push(getTypeBadgeHTML(typeName)); 
    }
    return typeBadges;
}

function extractAbilities(pokemon) {
    let abilities = [];
    for (let abilityIndex = 0; abilityIndex < pokemon.abilities.length; abilityIndex++) {
        abilities.push(pokemon.abilities[abilityIndex].ability.name);
    }
    return abilities;
}

function buildStatsModalData(sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain) {
    return {
        sprites: sprites,
        typeBadgesHTML: typeBadgesHTML,
        abilityString: abilityString,
        pokemonHeight: pokemonHeight,
        pokemonWeight: pokemonWeight,
        evolutionChain: evolutionChain
    };
}

function findStatsContentContainer() {
    let statsContent = document.getElementsByClassName('stats_content')[0];
    if (!statsContent) {
        logErrorMessage("stats content container not found");
        return null;
    }
    return statsContent;
}

function findEvolutionContainer() {
    let evolutionContainer = document.getElementsByClassName('evolution_chain')[0];
    if (!evolutionContainer) {
        logErrorMessage("evolution container not found");
        return null;
    }
    return evolutionContainer;
}

function updateStatsModalPrimaryType(statsContent, pokemon) {
    let primaryType = pokemon.types[0].type.name;
    statsContent.setAttribute('data-primary-type', primaryType);
}