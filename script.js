	// Script
    document.addEventListener('DOMContentLoaded', () => {
        // Get the wrapper.
            const block = document.querySelector('.q-and-a');
    
        // Get the video wrapper.
            const video = block.querySelector('.q-and-a__video');
            let player = null;
    
            // Initiate the video player.
            if (video) {
                player = new Plyr(video.querySelector('video'), {
                    active: true,
                    hideControls: true,
                });
            }
    
        /* 
         * Get all the buttons. Maybe ideally this would create an array with the      * index and the data-video attribute.
         */
            const buttonWrap = block.querySelector('.q-and-a__video-buttons');
            const buttons = buttonWrap ? Array.from(buttonWrap.querySelectorAll('.progress-btn')) : null;
        let currentIndex;
        
        /*
         * Events to trigger while playing.
         * Grab the player duration - unavailable until the video plays. 
         */
        player.on('playing', () => {
          duration = player.duration;
    
          /*
           * While playing, get the current time / duration. This gives a
           * percentage complete - ex. .45
           * Multiply that by 100 to get the percentage in a form we can 
           * attach to a clip-path. 
           * Set that number to the css variable. 
           * Do this as in interval to reduce the number of calls - maybe this
           * could be better.
           */
          btnProgress = setInterval(() => {
            currentTime = player.currentTime;
            const float = (currentTime / duration).toFixed(2);
            const progress = `${float * 100}%`;
            buttons[currentIndex].style.setProperty('--progress-width', progress);
          }, 300);
        });
    
        /*
         * Video end events. Clear the interval. Reset times. 
         * Get the current button index - maybe if my button array was set up
         * better, I could already have this instead of looping again. 
         * Get the next video. If we're on the last video, get the 1st video.
         */
        player.on('ended', () => {
          clearInterval(btnProgress);
          duration = 0;
          currentTime = 0;
    
          if (currentIndex === buttons.length - 1) {
            currentIndex = 0;
          } else {
            currentIndex++;
          }
    
          setTimeout(() => {
            buttons[currentIndex].click();
          }, 1000);
        });
    
        /* 
         * Handle the video events on play.
         * Includes starting the video on click, 
         * moving the progress bar in the button while playing,
         * and the ending event that autoplays the next video. 
         */
            const handleProgress = (player, btn) => {
                if (!player || !btn) {
                    return;
                }
    
          /*
           * Remove active class from all buttons.
           * Should prevent progress bar showing on buttons other than that
           * which is attached to the current video.
           */
                buttons.forEach((button) => {
                    button.classList.remove('active');
            button.style.setProperty('--progress-width', 0);
                });
          
          // Set current element to active.
                btn.classList.add('active');
          
          // Play the video.
          player.on('ready', function() {
            player.play();
          });
            };
    
            if (buttonWrap && player) {
          /*
           * Add a click event to each button that swaps out the video src
           * and starts the play events on the new video.
           */
                buttons.forEach((button) => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
              currentIndex = buttons.indexOf(button);
                        player.stop();
                        player.source = {
                            type: 'video',
                            sources: [
                                {
                                    src: button.getAttribute('data-video'),
                                },
                            ],
                        };
                        handleProgress(player, button);
                    });
                });
            }
        });