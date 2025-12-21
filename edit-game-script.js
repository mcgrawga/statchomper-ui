$(document).ready(function() {
    const url = 'https://statchomper.herokuapp.com/basketball-statlines?sort=player';
    
    // Get game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        showError('No game ID provided. Redirecting to home...');
        setTimeout(() => window.location.href = 'home.html', 2000);
        return;
    }
    
    $('#game-id').val(gameId);
    
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
            
            // Now load the specific game data
            loadGameData(gameId);
        },
        error: function(xhr, status) {
            $('#loader').hide();
            showError('Failed to load player names. Please refresh the page.');
        }
    });
    
    // Load existing game data
    function loadGameData(gameId) {
        $.ajax({
            url: `https://statchomper.herokuapp.com/basketball-statline/${gameId}`,
            type: 'GET',
            crossDomain: true,
            success: function(game) {
                console.log('Loaded game data:', game);
                
                // Populate player
                $('#player-select').val(game.player);
                
                // Populate date
                $('#date-played').val(game.datePlayed);
                
                // Populate opponent
                $('#opponent').val(game.opponent);
                
                // Populate shooting stats
                const bs = game.boxScore;
                $('#two-point-made').val(bs.twoPointMade || 0);
                $('#two-point-attempts').val(bs.twoPointAttempts || 0);
                $('#three-point-made').val(bs.threePointMade || 0);
                $('#three-point-attempts').val(bs.threePointAttempts || 0);
                $('#free-throw-made').val(bs.freeThrowMade || 0);
                $('#free-throw-attempts').val(bs.freeThrowAttempts || 0);
                
                // Populate other stats
                $('#rebounds').val(bs.rebounds || 0);
                $('#assists').val(bs.assists || 0);
                $('#steals').val(bs.steals || 0);
                $('#blocks').val(bs.blocks || 0);
                $('#turnovers').val(bs.turnovers || 0);
                $('#fouls').val(bs.fouls || 0);
                
                // Trigger updates for summary
                updatePointsScored();
                updateTwoPointSummary();
                updateThreePointSummary();
                updateFreeThrowSummary();
                
                // Hide loader and show form
                $('#loader').hide();
                $('#game-form-container').show();
            },
            error: function(xhr, status, error) {
                console.error('Error loading game:', xhr, status, error);
                $('#loader').hide();
                showError('Failed to load game data. Redirecting to home...');
                setTimeout(() => window.location.href = 'home.html', 2000);
            }
        });
    }
    
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
        
        // Get player name - use new player name if that option was selected
        let playerName = $('#player-select').val();
        if (playerName === '__new__') {
            playerName = $('#new-player-name').val().trim();
            if (!playerName) {
                showError('Please enter a player name.');
                return;
            }
        }
        
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
        submitButton.prop('disabled', true);
        
        // Submit to API with x-www-form-urlencoded format using PUT
        $.ajax({
            url: `https://statchomper.herokuapp.com/sms-basketball/${gameId}`,
            type: 'PUT',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'json',
            headers: {
                'Accept': 'application/json'
            },
            data: $.param({ Body: smsBody }),
            success: function(response) {
                console.log('Game updated successfully:', response);
                showSuccess();
                setTimeout(function() {
                    // Store player name in sessionStorage for one-time use
                    sessionStorage.setItem('expandPlayer', playerName);
                    // Redirect to home page
                    window.location.href = 'home.html';
                }, 2000);
            },
            error: function(xhr, status, error) {
                // Re-enable submit button on error
                submitButton.prop('disabled', false);
                
                console.error('Error updating game:', xhr, status, error);
                console.error('Response text:', xhr.responseText);
                console.error('Status code:', xhr.status);
                
                let errorMsg = 'Failed to update game. ';
                if (xhr.responseText) {
                    errorMsg += xhr.responseText;
                } else if (xhr.status === 404) {
                    errorMsg += 'Game not found (404).';
                } else if (xhr.status === 0) {
                    errorMsg += 'Network error - please check your connection.';
                } else {
                    errorMsg += 'Please try again.';
                }
                
                showError(errorMsg);
            }
        });
    });
    
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
});
