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
                    // Desktop table
                    $(`body`).append(`<div class="table-wrapper"><table id="${curPlayer}_stats" class="table table-striped"></table></div>`);  
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
                    // Mobile cards container
                    $(`body`).append(`<div class="cards-wrapper" id="${curPlayer}_cards"></div>`);
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
                // Add to desktop table
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
                
                // Add mobile card
                $(`#${curPlayer}_cards`).append(`
                    <div class="game-card">
                        <div class="game-header">
                            <div class="game-player">${curPlayer}</div>
                            <div class="game-date">${response[i].datePlayed}</div>
                            <div class="game-opponent">vs. ${opponent}</div>
                        </div>
                        <div class="game-stats">
                            <div class="stat-row">
                                <span class="stat-label">Points</span>
                                <span class="stat-value">${bs.points}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Rebounds</span>
                                <span class="stat-value">${bs.rebounds}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Assists</span>
                                <span class="stat-value">${bs.assists}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Blocks</span>
                                <span class="stat-value">${bs.blocks}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Fouls</span>
                                <span class="stat-value">${bs.fouls}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Steals</span>
                                <span class="stat-value">${bs.steals}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Turnovers</span>
                                <span class="stat-value">${bs.turnovers}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">2-Pointers</span>
                                <span class="stat-value">${bs.twoPointMade}/${bs.twoPointAttempts} (${twoPointPercentage})</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">3-Pointers</span>
                                <span class="stat-value">${bs.threePointMade}/${bs.threePointAttempts} (${threePointPercentage})</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Free Throws</span>
                                <span class="stat-value">${bs.freeThrowMade}/${bs.freeThrowAttempts} (${freeThrowPercentage})</span>
                            </div>
                        </div>
                    </div>
                `);    
            }
            $('#loader').hide();
        },
        error: function (xhr, status) {
            $('body').append(`${status}`);
        }
    });

    $(document).on( 'click', '.player', function(e) {
        console.log(this.id);
        $(`#${this.id}_stats`).closest('.table-wrapper').toggle();
        $(`#${this.id}_cards`).toggle();
        e.preventDefault();
    });
    
    // Enable click-and-drag horizontal scrolling for tables
    let isDown = false;
    let startX;
    let scrollLeft;
    
    $(document).on('mousedown', '.table-wrapper', function(e) {
        isDown = true;
        const wrapper = $(this)[0];
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        $(this).css('cursor', 'grabbing');
    });
    
    $(document).on('mouseleave', '.table-wrapper', function() {
        isDown = false;
        $(this).css('cursor', 'default');
    });
    
    $(document).on('mouseup', '.table-wrapper', function() {
        isDown = false;
        $(this).css('cursor', 'default');
    });
    
    $(document).on('mousemove', '.table-wrapper', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const wrapper = $(this)[0];
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        wrapper.scrollLeft = scrollLeft - walk;
    });
});