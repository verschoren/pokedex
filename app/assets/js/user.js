var client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '600px' });
var badge, current_badge_id, gym_owner, gym_type;
$(document).ready(async function() {
    init();
});

async function init() {
    current_badge_id = await client.get('user.customField:current_badge').then(async function(userfield){
        return userfield['user.customField:current_badge'];
    });
    console.log(current_badge_id);
    
    if (current_badge_id != null){
        badge = await getBadge();
        gym_owner = await getGymOwner();
        gym_type = await getType();
        updateUI();
    }
}

//on click gym_owner
$('#gym_owner').click(async function(){
    await client.invoke('routeTo', 'user', gym_owner.user.id);
});

async function getBadge(){
    return await client.request({
        url: '/api/v2/custom_objects/trainer_badge/records/'+current_badge_id+'.json',
    })
}

async function getGymOwner(){
    if (badge.custom_object_record.custom_object_fields.gym_owner == null){
        return null;
    } else {
        return await client.request({
            url: '/api/v2/users/'+badge.custom_object_record.custom_object_fields.gym_owner+'.json',
        })
    }
};

async function getType(){
    if (badge.custom_object_record.custom_object_fields.gym_type == null){
        return null;
    } else {
        return await client.request({
            url: '/api/v2/custom_objects/pokemon_type/records/'+badge.custom_object_record.custom_object_fields.gym_type+'.json',
            type: 'GET',
            dataType: 'json'
        });
    }
}

function updateUI(){
    $('#badge_image').attr('src', 'https://pokedex.verschoren.dev/badges/'+ badge.custom_object_record.name.toLowerCase().replaceAll(' badge','') +'.png');
    $('#name').html(badge.custom_object_record.name);
    $('#earned').html(formatDate(badge.custom_object_record.created_at));
    
    if (gym_owner == null){
        $('#gym_owner').text('No owner');
    } else {
        $('#gym_owner').text(gym_owner.user.name);
    }
    
    if (gym_type == null){
        $('#gym_type').html('');
    } else {
        $('#gym_type').html(`
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
        `)
    }
    $('#information').html(badge.custom_object_record.custom_object_fields.information);
}

function formatDate(date){
    //format date to yyyy-mm-dd
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    if (month.length < 2){
        month = '0' + month;
    }
    var day = '' + d.getDate();
    if (day.length < 2){
        day = '0' + day;
    }
    var year = d.getFullYear();
    return [year, month, day].join('-');
}