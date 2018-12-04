$(document).ready(function(){
    const url = 'https://statchomper.herokuapp.com/basketball-statlines?sort=player';
    $.ajax({
        url,
        type: "GET",
        crossDomain: true,
        success: function (response) {
            if(response.length > 0){
                $('body').append(`<ul id="game_list"></ul>`); 
            }
            let curPlayer;
            for (let i = 0; i < response.length; i++){
                const bs = response[i].boxScore.game;
                if (curPlayer !== response[i].player){
                    console.log(curPlayer);
                    curPlayer = response[i].player;
                    $(`#game_list`).append(`<li><a href="#" id="${curPlayer}" class="player">${curPlayer}</a></li>`);    
                }
                let opponent = '???';
                if (response[i].opponent){
                    opponent = response[i].opponent;
                }
                let twoPointPercentage = 'n/a';
                if (bs.twoPointPercentage !== 'n/a' && bs.twoPointPercentage !== 'NaN' && bs.twoPointPercentage !== null){
                    twoPointPercentage = `${Math.round(bs.twoPointPercentage)}%`;
                }
                let threePointPercentage = 'n/a';
                if (bs.threePointPercentage !== 'n/a' && bs.threePointPercentage !== 'NaN' && bs.threePointPercentage !== null){
                    threePointPercentage = `${Math.round(bs.threePointPercentage)}%`;
                }
                let freeThrowPercentage = 'n/a';
                if (bs.freeThrowPercentage !== 'n/a' && bs.freeThrowPercentage !== 'NaN' && bs.freeThrowPercentage !== null){
                    freeThrowPercentage = `${Math.round(bs.freeThrowPercentage)}%`;
                }
                $(`#game_list`).append(`<li class="game_date ${curPlayer}">
                    <a href="#" id="${response[i]._id}" class="game_detail_link">${response[i].datePlayed} vs. ${opponent}</a></li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Points: ${bs.points}</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Rebounds: ${bs.assists}</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Assists: ${bs.assists}</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Blocks: ${bs.blocks}</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Fouls: ${bs.fouls}</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Steals: ${bs.steals}</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Two-Pointers: ${bs.twoPointMade} for ${bs.twoPointAttempts} (${twoPointPercentage})</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Three-Pointers: ${bs.threePointMade} for ${bs.threePointAttempts} (${threePointPercentage})</li>
                    <li class="game_details ${curPlayer}_details ${response[i]._id}">Freethrows: ${bs.freeThrowMade} for ${bs.freeThrowAttempts} (${freeThrowPercentage})</li>`
                );    
            }
            $('#loader').hide();
        },
        error: function (xhr, status) {
            $('body').append(`${status}`);
        }
    });

    $(document).on( 'click', '.player, .game_detail_link', function(e) {
        //
        //  If a <li> gets clicked and it is a player, and it is closing,
        //  and it has open game details, be sure to close them.
        //
        var css_class = $(e.target).attr('class');
        if (css_class == 'player'){
            if ($(`.${this.id}`).is(':visible')) {
                $(`.${this.id}_details`).each(function() {
                    if ($(this).is(':visible')){
                        $(this).toggle();
                    }
                });
            }
        }

        $(`.${this.id}`).toggle();
        e.preventDefault();
    });
});