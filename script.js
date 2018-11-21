$(document).ready(function(){
    const url = 'https://statchomper.herokuapp.com/basketball-statlines';
    $.ajax({
        url,
        type: "GET",
        crossDomain: true,
        success: function (response) {
            for (let i = 0; i < response.length; i++){
                const bs = response[i].boxScore.game;
                $('body').append(`<table id="${response[i]._id}"></table>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id}">
                    <td><a href="#" class="player">${response[i].player}</a></td><td><a href="#" class="player">${response[i].datePlayed}</a></td>
                <td></td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Points: </td><td>${bs.points}</td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point attempts: </td><td>${bs.twoPointAttempts}</td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point made: </td><td>${bs.twoPointMade}</td></tr>`);
                if (bs.twoPointPercentage === 'n/a' || bs.twoPointPercentage === 'NaN' || bs.twoPointPercentage === null){
                    $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point percent: </td><td>n/a</td></tr>`);
                }else{
                    $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>2 point percent: </td><td>${bs.twoPointPercentage}%</td></tr>`);
                }
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point attempts: </td><td>${bs.threePointAttempts}</td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point made: </td><td>${bs.threePointMade}</td></tr>`);
                if (bs.threePointPercentage === 'n/a' || bs.threePointPercentage === 'NaN' || bs.threePointPercentage === null){
                    $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point percent: </td><td>n/a</td></tr>`);
                }else{
                    $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>3 point percent: </td><td>${bs.threePointPercentage}%</td></tr>`);
                }
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw attempts: </td><td>${bs.freeThrowAttempts}</td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw made: </td><td>${bs.freeThrowMade}</td></tr>`);
                if (bs.freeThrowPercentage === 'n/a' || bs.freeThrowPercentage === 'NaN' || bs.freeThrowPercentage === null){
                    $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw percent: </td><td>n/a</td></tr>`);
                }else{
                    $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Free throw percent: </td><td>${bs.freeThrowPercentage}%</td></tr>`);
                }
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Blocks: </td><td>${bs.blocks}</td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Fouls: </td><td>${bs.fouls}</td></tr>`);
                $(`#${response[i]._id}`).append(`<tr class="${response[i]._id} stat"><td></td><td>Steals: </td><td>${bs.steals}</td></tr>`);
            }
        },
        error: function (xhr, status) {
            $('body').append(`${status}`);
        }
    });

    // ON CLICK, HIDE OR SHOW STATS FOR A PLAYER/DATE
    $(document).on( 'click', '.player', function(){
        var className = $(this).closest('tr').attr('class');
        $(`.${className}.stat`).toggle();
        return false;
    });
});