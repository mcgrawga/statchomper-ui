$(document).ready(function() {
    const url = 'https://statchomper.herokuapp.com/basketball-statlines?sort=player';
    
    // Load player names from API
    $.ajax({
        url,
        type: "GET",
        crossDomain: true,
        success: function(response) {
            // Extract unique player names
            const players = [...new Set(response.map(item => item.player))];
            players.sort();
            
            // Populate player dropdown
            players.forEach(player => {
                $('#player-select').append(`<option value="${player}">${player}</option>`);
            });
            
            $('#loader').hide();
            $('#game-form-container').show();
        },
        error: function(xhr, status) {
            $('#loader').hide();
            showError('Failed to load player names. Please refresh the page.');
        }
    });
    
    // Handle increment button clicks
    $(document).on('click', '.increment-btn', function() {
        const targetId = $(this).data('target');
        const attemptsInput = $(`#${targetId}`);
        const attemptsValue = parseInt(attemptsInput.val()) || 0;
        attemptsInput.val(attemptsValue + 1);
        
        // For shooting stats, also increment the "made" field
        if (targetId.includes('-attempts')) {
            const madeId = targetId.replace('-attempts', '-made');
            const madeInput = $(`#${madeId}`);
            const madeValue = parseInt(madeInput.val()) || 0;
            madeInput.val(madeValue + 1);
        }
        
        // Trigger input event if this is a shooting stat to update percentage
        attemptsInput.trigger('input');
    });
    
    // Handle decrement button clicks - only increments attempts, not made
    $(document).on('click', '.decrement-btn', function() {
        const targetId = $(this).data('target');
        const attemptsInput = $(`#${targetId}`);
        const attemptsValue = parseInt(attemptsInput.val()) || 0;
        attemptsInput.val(attemptsValue + 1);
        
        // Trigger input event if this is a shooting stat to update percentage
        attemptsInput.trigger('input');
    });
    
    // Calculate and display shooting percentages in real-time
    function updatePercentage(madeId, attemptsId, displayId) {
        const made = parseInt($(`#${madeId}`).val()) || 0;
        const attempts = parseInt($(`#${attemptsId}`).val()) || 0;
        
        let percentage = 0;
        if (attempts > 0) {
            percentage = Math.round((made / attempts) * 100);
        }
        
        $(`#${displayId}`).text(`${percentage}%`);
        
        // Validate that made doesn't exceed attempts
        if (made > attempts) {
            $(`#${madeId}`).addClass('invalid');
            return false;
        } else {
            $(`#${madeId}`).removeClass('invalid');
            return true;
        }
    }
    
    // Update 2-pointer percentage
    $('#two-point-made, #two-point-attempts').on('input', function() {
        updatePercentage('two-point-made', 'two-point-attempts', 'two-point-percentage');
    });
    
    // Update 3-pointer percentage
    $('#three-point-made, #three-point-attempts').on('input', function() {
        updatePercentage('three-point-made', 'three-point-attempts', 'three-point-percentage');
    });
    
    // Update free throw percentage
    $('#free-throw-made, #free-throw-attempts').on('input', function() {
        updatePercentage('free-throw-made', 'free-throw-attempts', 'free-throw-percentage');
    });
    
    // Form submission
    $('#game-form').on('submit', function(e) {
        e.preventDefault();
        
        // Validate shooting stats
        const twoPointValid = updatePercentage('two-point-made', 'two-point-attempts', 'two-point-percentage');
        const threePointValid = updatePercentage('three-point-made', 'three-point-attempts', 'three-point-percentage');
        const freeThrowValid = updatePercentage('free-throw-made', 'free-throw-attempts', 'free-throw-percentage');
        
        if (!twoPointValid || !threePointValid || !freeThrowValid) {
            showError('Made shots cannot exceed attempts. Please check your shooting statistics.');
            return;
        }
        
        // Collect form data
        const twoPointMade = parseInt($('#two-point-made').val()) || 0;
        const threePointMade = parseInt($('#three-point-made').val()) || 0;
        const freeThrowMade = parseInt($('#free-throw-made').val()) || 0;
        
        // Calculate total points
        const totalPoints = (twoPointMade * 2) + (threePointMade * 3) + freeThrowMade;
        
        const gameData = {
            player: $('#player-select').val(),
            datePlayed: $('#date-played').val(),
            opponent: $('#opponent').val(),
            boxScore: {
                game: {
                    points: totalPoints,
                    rebounds: parseInt($('#rebounds').val()),
                    assists: parseInt($('#assists').val()),
                    steals: parseInt($('#steals').val()),
                    blocks: parseInt($('#blocks').val()),
                    turnovers: parseInt($('#turnovers').val()),
                    fouls: parseInt($('#fouls').val()),
                    twoPointMade: twoPointMade,
                    twoPointAttempts: parseInt($('#two-point-attempts').val()),
                    threePointMade: threePointMade,
                    threePointAttempts: parseInt($('#three-point-attempts').val()),
                    freeThrowMade: freeThrowMade,
                    freeThrowAttempts: parseInt($('#free-throw-attempts').val())
                }
            }
        };
        
        // Calculate percentages
        const twoPointPercentage = gameData.boxScore.game.twoPointAttempts > 0 
            ? (gameData.boxScore.game.twoPointMade / gameData.boxScore.game.twoPointAttempts) * 100 
            : 0;
        const threePointPercentage = gameData.boxScore.game.threePointAttempts > 0 
            ? (gameData.boxScore.game.threePointMade / gameData.boxScore.game.threePointAttempts) * 100 
            : 0;
        const freeThrowPercentage = gameData.boxScore.game.freeThrowAttempts > 0 
            ? (gameData.boxScore.game.freeThrowMade / gameData.boxScore.game.freeThrowAttempts) * 100 
            : 0;
        
        gameData.boxScore.game.twoPointPercentage = twoPointPercentage;
        gameData.boxScore.game.threePointPercentage = threePointPercentage;
        gameData.boxScore.game.freeThrowPercentage = freeThrowPercentage;
        
        console.log('Submitting game data:', gameData);
        
        // Submit to API
        $.ajax({
            url: 'https://statchomper.herokuapp.com/basketball-statlines',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(gameData),
            success: function(response) {
                console.log('Game added successfully:', response);
                showSuccess();
                setTimeout(function() {
                    // Reset form after 2 seconds
                    resetForm();
                }, 2000);
            },
            error: function(xhr, status, error) {
                console.error('Error adding game:', xhr, status, error);
                showError('Failed to add game. Please try again or check your connection.');
            }
        });
    });
    
    // Reset form button
    $('#reset-form').on('click', function() {
        resetForm();
    });
    
    function resetForm() {
        $('#game-form')[0].reset();
        $('#two-point-percentage').text('0%');
        $('#three-point-percentage').text('0%');
        $('#free-throw-percentage').text('0%');
        $('.invalid').removeClass('invalid');
        hideMessages();
    }
    
    function showSuccess() {
        hideMessages();
        $('#success-message').fadeIn();
        setTimeout(function() {
            $('#success-message').fadeOut();
        }, 3000);
    }
    
    function showError(message) {
        hideMessages();
        $('#error-text').text(message);
        $('#error-message').fadeIn();
        setTimeout(function() {
            $('#error-message').fadeOut();
        }, 5000);
    }
    
    function hideMessages() {
        $('#success-message').hide();
        $('#error-message').hide();
    }
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    $('#date-played').val(today);
});
