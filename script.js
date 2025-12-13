$(document).ready(function(){
    const url = 'https://statchomper.herokuapp.com/basketball-statlines?sort=player';
    $.ajax({
        url,
        type: "GET",
        crossDomain: true,
        success: function (response) {
            let curPlayer;
            for (let i = 0; i < response.length; i++){
                const bs = response[i].boxScore.game;
                if (curPlayer !== response[i].player){
                    console.log(curPlayer);
                    curPlayer = response[i].player;
                    $(`body`).append(`<a href="#" id="${curPlayer}" class="player">${curPlayer}</a>`);    
                    $(`body`).append(`<table id="${curPlayer}_stats" class="table table-striped"></table>`);  
                    $(`#${curPlayer}_stats`).append(`<thead>
                        <tr>
                        <th>Date</th>
                        <th>Points</th>
                        <th>Rebounds</th>
                        <th>Assists</th>
                        <th>Blocks</th>
                        <th>Fouls</th>
                        <th>Steals</th>
                        <th>Turnovers</th>
                        <th>Twopointers</th>
                        <th>Threepointers</th>
                        <th>Freethrows</th>
                        </tr>
                        </thead><tbody></tbody>`);  
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
                $(`#${curPlayer}_stats`).append(`<tr>
                    <td>${response[i].datePlayed} vs. ${opponent}</td>
                    <td>${bs.points}</td>
                    <td>${bs.rebounds}</td>
                    <td>${bs.assists}</td>
                    <td>${bs.blocks}</td>
                    <td>${bs.fouls}</td>
                    <td>${bs.steals}</td>
                    <td>${bs.turnovers}</td>
                    <td>${bs.twoPointMade} for ${bs.twoPointAttempts} (${twoPointPercentage})</td>
                    <td>${bs.threePointMade} for ${bs.threePointAttempts} (${threePointPercentage})</td>
                    <td>${bs.freeThrowMade} for ${bs.freeThrowAttempts} (${freeThrowPercentage})</td>`
                );    
            }
            $('#loader').hide();
        },
        error: function (xhr, status) {
            $('body').append(`${status}`);
        }
    });

    $(document).on( 'click', '.player', function(e) {
        console.log(this.id);
        $(`#${this.id}_stats`).toggle();
        e.preventDefault();
    });
});