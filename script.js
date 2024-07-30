document.addEventListener("DOMContentLoaded", () => {
  const music = new Audio();
  let currentSongIndex = 0;
  let songs = [];

  // Initial state: play button visible, pause button hidden
  document.querySelector(".play").style.display = "inline-block";
  document.querySelector(".pause").style.display = "none";

  // Fetch the songs data from the JSON file
  fetch("songs.json") // Replace with the correct path to your songs.json
    .then((response) => response.json())
    .then((data) => {
      songs = data;
      // Optionally set the footer with the first song's details
      if (songs.length > 0) {
        updateFooter(songs[0]);
        // Automatically play the first song
      }
    })
    .catch((error) => console.error("Error fetching songs data:", error));

  // Function to play a song
  function playSong(songIndex) {
    currentSongIndex = songIndex;
    const selectedSong = songs[songIndex];
    music.src = selectedSong.Audio;
    music
      .play()
      .then(() => {
        updateFooter(selectedSong);
        // Set play button to be hidden and pause button to be visible
        document.querySelector(".play").style.display = "none";
        document.querySelector(".pause").style.display = "inline-block";
      })
      .catch((error) => {
        console.error("Error playing the song:", error);
      });
  }

  // Function to update footer with song information
  function updateFooter(song) {
    document.querySelector(".footer-song-name").textContent = song.songName;
    document.querySelector(".music-playing-footer img").src = song.poster;
    document.querySelector(".start-duration").textContent = "00:00";
    music.addEventListener("loadedmetadata", () => {
      const duration = formatTime(music.duration);
      document.querySelector(".end-duration").textContent = duration;
    });
  }

  // Function to format time in mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Play the song when poster is clicked
  Array.from(document.getElementsByClassName("song-inline")).forEach(
    (element, i) => {
      element.addEventListener("click", () => playSong(i));
    }
  );
  // Control buttons functionality
  document.querySelector(".play").addEventListener("click", () => {
    if (songs.length > 0) {
      playSong(currentSongIndex); // Play the current song or default to the first song
    }
  });

  document.querySelector(".pause").addEventListener("click", () => {
    if (!music.paused) {
      music.pause();
      document.querySelector(".play").style.display = "inline-block";
      document.querySelector(".pause").style.display = "none";
    }
  });

  document.querySelector(".forward").addEventListener("click", () => {
    if (currentSongIndex < songs.length - 1) {
      playSong(currentSongIndex + 1);
    } else {
      playSong(0);
    }
  });

  document.querySelector(".backward").addEventListener("click", () => {
    if (currentSongIndex > 0) {
      playSong(currentSongIndex - 1);
    } else {
      playSong(songs.length - 1);
    }
  });

  document.querySelector(".repeat").addEventListener("click", () => {
    music.currentTime = 0;
    music.play();
  });

  document.querySelector(".shuffle").addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(randomIndex);
  });

  music.addEventListener("timeupdate", () => {
    const currentTime = formatTime(music.currentTime);
    document.querySelector(".start-duration").textContent = currentTime;
  });

  // Volume slider functionality
  const volumeSlider = document.querySelector(".volume-slider");

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (event) => {
      const volume = parseFloat(event.target.value);
      music.volume = volume; // Update the volume based on slider value

      // Optionally, you can change volume appearance or add other feedback here
    });
  } else {
    console.error("Volume slider not found.");
  }

  // Handle music end event to reset the play/pause button
  music.addEventListener("ended", () => {
    document.querySelector(".play").style.display = "inline-block";
    document.querySelector(".pause").style.display = "none";
  });
});
