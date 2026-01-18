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
            
            // Add "Add New Player" option at the end
            $('#player-select').append(`<option value="__new__">+ Add New Player</option>`);
            
            $('#loader').hide();
            $('#game-form-container').show();
        },
        error: function(xhr, status) {
            $('#loader').hide();
            showError('Failed to load player names. Please refresh the page.');
        }
    });
    
    // Handle player selection change
    $('#player-select').on('change', function() {
        const selectedValue = $(this).val();
        
        if (selectedValue === '__new__') {
            // Show new player input field
            $('#new-player-input').show();
            $('#new-player-name').attr('required', true);
            $('#player-select').removeAttr('required');
        } else {
            // Hide new player input field
            $('#new-player-input').hide();
            $('#new-player-name').removeAttr('required').val('');
            $('#player-select').attr('required', true);
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
            
            // Trigger input event on made field to update points scored
            madeInput.trigger('input');
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
    
    // Calculate and display points scored
    function updatePointsScored() {
        const twoPointMade = parseInt($('#two-point-made').val()) || 0;
        const threePointMade = parseInt($('#three-point-made').val()) || 0;
        const freeThrowMade = parseInt($('#free-throw-made').val()) || 0;
        
        const pointsScored = (twoPointMade * 2) + (threePointMade * 3) + freeThrowMade;
        $('#points-scored').text(pointsScored);
    }
    
    // Calculate and display 2-pointer summary
    function updateTwoPointSummary() {
        const made = parseInt($('#two-point-made').val()) || 0;
        const attempts = parseInt($('#two-point-attempts').val()) || 0;
        
        let percentage = 0;
        if (attempts > 0) {
            percentage = Math.round((made / attempts) * 100);
        }
        
        $('#two-point-summary').text(`${made} for ${attempts}, ${percentage}%`);
    }
    
    // Calculate and display 3-pointer summary
    function updateThreePointSummary() {
        const made = parseInt($('#three-point-made').val()) || 0;
        const attempts = parseInt($('#three-point-attempts').val()) || 0;
        
        let percentage = 0;
        if (attempts > 0) {
            percentage = Math.round((made / attempts) * 100);
        }
        
        $('#three-point-summary').text(`${made} for ${attempts}, ${percentage}%`);
    }
    
    // Calculate and display free throw summary
    function updateFreeThrowSummary() {
        const made = parseInt($('#free-throw-made').val()) || 0;
        const attempts = parseInt($('#free-throw-attempts').val()) || 0;
        
        let percentage = 0;
        if (attempts > 0) {
            percentage = Math.round((made / attempts) * 100);
        }
        
        $('#free-throw-summary').text(`${made} for ${attempts}, ${percentage}%`);
    }
    
    // Update points scored when any shooting stat changes
    $('#two-point-made, #three-point-made, #free-throw-made').on('input', function() {
        updatePointsScored();
    });
    
    // Update 2-pointer summary when made or attempts changes
    $('#two-point-made, #two-point-attempts').on('input', function() {
        updateTwoPointSummary();
    });
    
    // Update 3-pointer summary when made or attempts changes
    $('#three-point-made, #three-point-attempts').on('input', function() {
        updateThreePointSummary();
    });
    
    // Update free throw summary when made or attempts changes
    $('#free-throw-made, #free-throw-attempts').on('input', function() {
        updateFreeThrowSummary();
    });
    
    // Initialize on page load
    updatePointsScored();
    updateTwoPointSummary();
    updateThreePointSummary();
    updateFreeThrowSummary();
    
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
        
        // Get player name - use new player name if that option was selected
        let playerName = $('#player-select').val();
        if (playerName === '__new__') {
            playerName = $('#new-player-name').val().trim();
            if (!playerName) {
                showError('Please enter a player name.');
                return;
            }
        }
        
        const gameData = {
            player: playerName,
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
        
        // Build statline string for SMS format
        const twoPointMissed = parseInt($('#two-point-attempts').val()) - twoPointMade;
        const threePointMissed = parseInt($('#three-point-attempts').val()) - threePointMade;
        const freeThrowMissed = parseInt($('#free-throw-attempts').val()) - freeThrowMade;
        
        let statline = '';
        
        // Add 2-pointers made (each as '2')
        statline += '2'.repeat(twoPointMade);
        
        // Add 2-pointers missed (each as '-2')
        statline += '-2'.repeat(twoPointMissed);
        
        // Add 3-pointers made (each as '3')
        statline += '3'.repeat(threePointMade);
        
        // Add 3-pointers missed (each as '-3')
        statline += '-3'.repeat(threePointMissed);
        
        // Add free throws made (each as '1')
        statline += '1'.repeat(freeThrowMade);
        
        // Add free throws missed (each as '-1')
        statline += '-1'.repeat(freeThrowMissed);
        
        // Add other stats
        statline += 'a'.repeat(parseInt($('#assists').val()) || 0);
        statline += 'r'.repeat(parseInt($('#rebounds').val()) || 0);
        statline += 's'.repeat(parseInt($('#steals').val()) || 0);
        statline += 'b'.repeat(parseInt($('#blocks').val()) || 0);
        statline += 't'.repeat(parseInt($('#turnovers').val()) || 0);
        statline += 'f'.repeat(parseInt($('#fouls').val()) || 0);
        
        // Format: yyyy-mm-dd:PlayerName:Opponent:Statline
        const smsBody = `${$('#date-played').val()}:${playerName}:${$('#opponent').val()}:${statline}`;
        
        console.log('SMS format body:', smsBody);
        
        // Disable submit button to prevent multiple submissions
        const submitButton = $('.btn-submit');
        const originalButtonHtml = submitButton.html();
        submitButton.prop('disabled', true).html('<span class="submit-icon">⏳</span> Saving...');
        
        // Submit to API with x-www-form-urlencoded format
        $.ajax({
            url: 'https://statchomper.herokuapp.com/sms-basketball',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: $.param({ Body: smsBody }),
            success: function(response) {
                console.log('Game added successfully:', response);
                // Store player name in sessionStorage for one-time use
                sessionStorage.setItem('expandPlayer', playerName);
                // Redirect to home page
                window.location.href = 'home.html';
            },
            error: function(xhr, status, error) {
                // Re-enable submit button on error
                submitButton.prop('disabled', false).html(originalButtonHtml);
                
                console.error('Error adding game:', xhr, status, error);
                console.error('Response text:', xhr.responseText);
                console.error('Status code:', xhr.status);
                
                let errorMsg = 'Failed to add game. ';
                if (xhr.responseText) {
                    errorMsg += xhr.responseText;
                } else if (xhr.status === 404) {
                    errorMsg += 'Endpoint not found (404).';
                } else if (xhr.status === 0) {
                    errorMsg += 'Network error - please check your connection.';
                } else {
                    errorMsg += 'Please try again.';
                }
                
                showError(errorMsg);
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
    
    // Set today's date as default (using local timezone)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayLocal = `${year}-${month}-${day}`;
    $('#date-played').val(todayLocal);
});
