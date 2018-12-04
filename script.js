$(document).ready(function(){
    // const url = 'https://statchomper.herokuapp.com/basketball-statlines';
    // $.ajax({
    //     url,
    //     type: "GET",
    //     crossDomain: true,
    //     success: function (response) {
    //         for (let i = 0; i < response.length; i++){
    //             const bs = response[i].boxScore.game;
    //             $('body').append(`<table id="${response[i]._id}"></table>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id}">
    //                 <td><a href="#" class="player">${response[i].player}</a></td><td><a href="#" class="player">${response[i].datePlayed}</a></td>
    //             <td></td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Points: </td><td>${bs.points}</td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point attempts: </td><td>${bs.twoPointAttempts}</td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point made: </td><td>${bs.twoPointMade}</td></tr>`);
    //             if (bs.twoPointPercentage === 'n/a' || bs.twoPointPercentage === 'NaN' || bs.twoPointPercentage === null){
    //                 $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point percent: </td><td>n/a</td></tr>`);
    //             }else{
    //                 $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point percent: </td><td>${bs.twoPointPercentage}%</td></tr>`);
    //             }
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point attempts: </td><td>${bs.threePointAttempts}</td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point made: </td><td>${bs.threePointMade}</td></tr>`);
    //             if (bs.threePointPercentage === 'n/a' || bs.threePointPercentage === 'NaN' || bs.threePointPercentage === null){
    //                 $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point percent: </td><td>n/a</td></tr>`);
    //             }else{
    //                 $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point percent: </td><td>${bs.threePointPercentage}%</td></tr>`);
    //             }
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw attempts: </td><td>${bs.freeThrowAttempts}</td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw made: </td><td>${bs.freeThrowMade}</td></tr>`);
    //             if (bs.freeThrowPercentage === 'n/a' || bs.freeThrowPercentage === 'NaN' || bs.freeThrowPercentage === null){
    //                 $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw percent: </td><td>n/a</td></tr>`);
    //             }else{
    //                 $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw percent: </td><td>${bs.freeThrowPercentage}%</td></tr>`);
    //             }
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Blocks: </td><td>${bs.blocks}</td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Fouls: </td><td>${bs.fouls}</td></tr>`);
    //             $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Steals: </td><td>${bs.steals}</td></tr>`);
    //         }
    //     },
    //     error: function (xhr, status) {
    //         $('body').append(`${status}`);
    //     }
    // });

    // const url = 'https://statchomper.herokuapp.com/basketball-statlines?sort=player';
    // $.ajax({
    //     url,
    //     type: "GET",
    //     crossDomain: true,
    //     success: function (response) {
    //         let curPlayer;
    //         for (let i = 0; i < response.length; i++){
    //             const bs = response[i].boxScore.game;
    //             if (curPlayer !== response[i].player){
    //                 curPlayer = response[i].player;
    //                 $('body').append(`<ul><li><a href="#" class="player_name" id="${response[i].player}">${response[i].player}</a></li></ul>`);    
    //             }
    //             let opponent = '???';
    //             if (response[i].opponent){
    //                 opponent = response[i].opponent;
    //             }
    //             let twoPointPercentage = 'n/a';
    //             if (bs.twoPointPercentage !== 'n/a' && bs.twoPointPercentage !== 'NaN' && bs.twoPointPercentage !== null){
    //                 twoPointPercentage = bs.twoPointPercentage;
    //             }
    //             let threePointPercentage = 'n/a';
    //             if (bs.threePointPercentage !== 'n/a' && bs.threePointPercentage !== 'NaN' && bs.threePointPercentage !== null){
    //                 threePointPercentage = bs.threePointPercentage;
    //             }
    //             let freeThrowPercentage = 'n/a';
    //             if (bs.freeThrowPercentage !== 'n/a' && bs.freeThrowPercentage !== 'NaN' && bs.freeThrowPercentage !== null){
    //                 freeThrowPercentage = bs.freeThrowPercentage;
    //             }
    //             $(`#${curPlayer}`).append(`<ul class="games_${response[i].player}"><li>
    //                 <a href="#">${response[i].datePlayed} vs. ${opponent}</a>
    //                 <ul class="game_details ${response[i]._id}">
    //                     <li>Points: ${bs.points}</li>
    //                     <li>2 point attempts:: ${bs.twoPointAttempts}</li>
    //                     <li>2 point made:: ${bs.twoPointMade}</li>
    //                     <li>2 point percent:: ${twoPointPercentage}</li>
    //                     <li>3 point attempts:: ${bs.threePointAttempts}</li>
    //                     <li>3 point made:: ${bs.threePointMade}</li>
    //                     <li>3 point percent:: ${threePointPercentage}</li>
    //                     <li>Free throw attempts: ${bs.freeThrowAttempts}</li>
    //                     <li>Free throw made: ${bs.freeThrowMade}</li>
    //                     <li>Free throw percent: ${freeThrowPercentage}</li>
    //                     <li>Blocks: ${bs.blocks}</li>
    //                     <li>Fouls: ${bs.fouls}</li>
    //                     <li>Steals: ${bs.steals}</li>
    //                 </ul>
    //             </li></ul>`);    
    //         }
    //     },
    //     error: function (xhr, status) {
    //         $('body').append(`${status}`);
    //     }

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
    });
});