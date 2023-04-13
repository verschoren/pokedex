//  /api/v2/custom_objects/{custom_object_key}/records
    // Initialise Apps framework client. See also:
    // https://developer.zendesk.com/apps/docs/developer-guide/getting_started
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '600px' });

    init();
    async function init() {
        var linked_pokemon = await client.get('ticket.customField:custom_field_10991970231570').then(async function(custom_field){
            //{ticket.customField:custom_field_10991970231570: '01GXXWZ8GWTDSTNEQHFZV02RAQ'}
            //return ticket.customField:custom_field_10991970231570
            return custom_field['ticket.customField:custom_field_10991970231570'];
        })
        console.log(linked_pokemon);
        var pokemon_data = await getPokemon(linked_pokemon);
        console.log(pokemon_data);
        /*
            hp: 42
            pokeball: "01GXXWVG2SG5QNFE6KEG9S0S5B"
            pokemon_species: "01GXXWN869WA5X6SSQKHSC7RJD"
            shiny: false
            trainer: "10992004688146"
        */
        var pokeball = await getBall(pokemon_data.custom_object_record.custom_object_fields.pokeball);
        console.log(pokeball);
        var pokemon_species = await getSpecies(pokemon_data.custom_object_record.custom_object_fields.pokemon_species);
        console.log(pokemon_species);
        /*
        evolves_into: "01GXXWMRCD1GAH0HNAY36DWJ7X"
        pokedex_number: 1
        type: "01GXXW5DKCD4A5T0559MSP2AS0"
        */
       var type = getTypes(pokemon_species.custom_object_record.custom_object_fields.type);
        console.log(type)
        var evolves = await getSpecies(pokemon_species.custom_object_record.custom_object_fields.evolves_into);
        console.log(evolves);
    }
    
    
    async function getPokemon(linked_pokemon){
        return await client.request({
            url: '/api/v2/custom_objects/pokemon_captured/records/'+linked_pokemon+'.json',
            type: 'GET',
            dataType: 'json'
        }).then(
            function(pokemon) {
                return pokemon
            }
        );
    }

    async function getSpecies(species){
        return await client.request({
            url: '/api/v2/custom_objects/pokemon/records/'+species+'.json',
            type: 'GET',
            dataType: 'json'
        }).then(
            function(pokemon) {
                return pokemon
            }
        );
    }
    async function getBall(ball){
        return await client.request({
            url: '/api/v2/custom_objects/pokeball/records/'+ball+'.json',
            type: 'GET',
            dataType: 'json'
        }).then(
            function(pokemon) {
                return pokemon
            }
        );
    }

    async function getTypes(types){
        return await client.request({
            url: '/api/v2/custom_objects/pokemon_type/records/'+types+'.json',
            type: 'GET',
            dataType: 'json'
        }).then(
            function(pokemon) {
                return pokemon
            }
        );
    }
