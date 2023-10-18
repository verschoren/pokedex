var client = ZAFClient.init();
var environment, pokemon, type;
client.invoke('resize', { width: '100%', height: '600px' });
client.invoke('ticketFields:tags.hide')

$(document).ready(async function() {
    init();
    
    client.on('ticket.custom_field_14502103878802.changed', function(e) {
        init();
    });
});


async function init() {
    environment = await client.context().then(async function(context){
        return context.account.subdomain;
    });
    console.log(environment);
    pokemon = await getPokemon();
    console.log(pokemon);
    if (pokemon != null){
        type = await getType();
        updateUI();
    } else {
        showEmpty();
    }
}

function updateUI(){
    $('#pokemon').removeClass('hidden');
    $('#empty').addClass('hidden');
    console.log(type)
    $('#image').attr('src',pokemon.custom_object_record.custom_object_fields.image)
    $('#name').html(pokemon.custom_object_record.name)
    $('#index').html('Pokedex #'+pokemon.custom_object_record.external_id)
    $('#type').html(type.custom_object_record.name)
    $('#view').attr('href','https://'+environment+'zendesk.com/agent/custom-objects/pokemon/records/'+pokemon.custom_object_record.id+'?zcli_apps=true')
    $('#type').addClass('bg-'+type.custom_object_record.custom_object_fields.color+'-50');
    $('#type').addClass('text-'+type.custom_object_record.custom_object_fields.color+'-700');
    $('#type').addClass('ring-'+type.custom_object_record.custom_object_fields.color+'-600/20');
    $('#type').removeClass('bg-green-50');
    $('#type').removeClass('text-green-700');
    $('#type').removeClass('ring-green-600/20');
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