var client = ZAFClient.init();
var environment, pokemon, gym_type, captured;
client.invoke('resize', { width: '100%', height: '600px' });
client.invoke('ticketFields:tags.hide')
client.invoke('ticketFields:ticket_field_14512152430226.hide')

$(document).ready(async function() {
    init();
    
    client.on('ticket.custom_field_14502103878802.changed', function(e) {
        init();
    });
    client.on('ticket.custom_field_14504649143442.changed', function(e) {
        init();
    });
});


async function init() {
    environment = await client.context().then(async function(context){
        return context.account.subdomain;
    });
    captured = await client.metadata().then(async function(metadata){
        return metadata.settings.captured;
    });

    if (captured == false){
        client.invoke('ticketFields:custom_field_14504649143442.hide')
        pokemon = await getPokemon();
    } else {
        client.invoke('ticketFields:custom_field_14502103878802.hide')
        pokemon = await getCapturedPokemon();   
    }

    if (pokemon != null){
        gym_type = await getType();
        updateUI();
    } else {
        showEmpty();
    }
}

function updateUI(){
    $('#pokemon').removeClass('hidden');
    $('#empty').addClass('hidden');
    $('#image').attr('src',pokemon.custom_object_record.custom_object_fields.image)
    $('#name').html(pokemon.custom_object_record.name)
    $('#index').html('Pokedex #'+pokemon.custom_object_record.external_id)
    $('#view').attr('href','https://'+environment+'.zendesk.com/agent/custom-objects/pokemon/records/'+pokemon.custom_object_record.id+'?zcli_apps=true')
    $('#type').html(`
        <span class="
            inline-flex items-center rounded-full 
            bg-${gym_type.custom_object_record.custom_object_fields.color}-50 
            px-2 py-1 text-xs font-medium text-${gym_type.custom_object_record.custom_object_fields.color}-700 
            ring-1 ring-inset ring-${gym_type.custom_object_record.custom_object_fields.color}-600/20
        ">
            <img 
                src="https://pokedex.verschoren.dev/types/${gym_type.custom_object_record.name.toLowerCase()}.png"
                class="h-4 w-4 mr-2"
            >
            ${gym_type.custom_object_record.name}
        </span>
    `);
}

async function getPokemon(){
    var linked_pokemon = await client.get('ticket.customField:custom_field_14502103878802').then(async function(custom_field){
        return custom_field['ticket.customField:custom_field_14502103878802'];
    })
    if (linked_pokemon == null){
        return null;
    } else {
        return await client.request({
            url: '/api/v2/custom_objects/pokemon/records/'+linked_pokemon+'.json',
            type: 'GET',
            dataType: 'json'
        });
    }
}

async function getCapturedPokemon(){
    var captured_pokemon_id = await client.get('ticket.customField:custom_field_14504649143442').then(async function(custom_field){
        return custom_field['ticket.customField:custom_field_14504649143442'];
    })
    if (captured_pokemon_id == null){
        return null;
    } else {
        var linked_pokemon = await client.request({
            url: '/api/v2/custom_objects/pokemon_captured/records/'+captured_pokemon_id+'.json',
            type: 'GET',
            dataType: 'json'
        }).then(async function(pokemon){
            return pokemon.custom_object_record.custom_object_fields.pokemon_species;
        });
        return await client.request({
            url: '/api/v2/custom_objects/pokemon/records/'+linked_pokemon+'.json',
            type: 'GET',
            dataType: 'json'
        });
    }
}

async function getType(){
    return await client.request({
        url: '/api/v2/custom_objects/pokemon_type/records/'+pokemon.custom_object_record.custom_object_fields.type+'.json',
        type: 'GET',
        dataType: 'json'
    });
}

function showEmpty(){
    $('#empty').removeClass('hidden');
    $('#pokemon').addClass('hidden');
}