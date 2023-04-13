//  /api/v2/custom_objects/{custom_object_key}/records
    // Initialise Apps framework client. See also:
    // https://developer.zendesk.com/apps/docs/developer-guide/getting_started
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '200px' });

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
    }
    
    
    async function getPokemon(linked_pokemon){
        return await client.request({
            url: '/api/v2/custom_objects/pokemon_captured/records/'+linked_pokemon+'.json',
            type: 'GET',
            dataType: 'json'
        }).then(
            function(pokemon) {
                console.log(pokemon);
                return pokemon
            }
        );
    }//use a zendesk get to retrieve data from api/v2/custom_objects/{custom_object_key}/records

