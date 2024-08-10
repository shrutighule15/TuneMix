document.addEventListener("DOMContentLoaded", () => {
  const music = new Audio();
  let currentSongIndex = 0;
  let songs = [];

  // Initial state: play button visible, pause button hidden
  document.querySelector(".play").style.display = "inline-block";
  document.querySelector(".pause").style.display = "none";

  // Fetch the songs data from the JSON file
  fetch("songs.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched songs data:", data);
      songs = data;
      if (songs.length > 0) {
        updateFooter(songs[0]);
      } else {
        console.error("No songs available.");
      }
    })
    .catch((error) => console.error("Error fetching songs data:", error));

  // Function to play a song
  function playSong(songIndex) {
    currentSongIndex = songIndex;
    const selectedSong = songs[songIndex];

    if (!selectedSong) {
      console.error("Selected song is undefined:", songIndex);
      return;
    }

    console.log("Playing song:", selectedSong);

    music.src = selectedSong.audio; // Set audio source
    music.preload = "auto"; // Preload audio for faster playback
    music
      .play()
      .then(() => {
        updateFooter(selectedSong); // Update footer with current song details
        document.querySelector(".play").style.display = "none";
        document.querySelector(".pause").style.display = "inline-block";
      })
      .catch((error) => {
        console.error("Error playing the song:", error);
      });

    // Update the duration when metadata is loaded
    music.addEventListener("loadedmetadata", () => {
      document.querySelector(".end-duration").textContent = formatTime(
        music.duration
      );
    });
  }

  // Function to update footer with song information
  function updateFooter(song) {
    const songNameElem = document.querySelector(".footer-song-name");
    const posterElem = document.querySelector(".footer-poster");
    const startDurationElem = document.querySelector(".start-duration");
    const endDurationElem = document.querySelector(".end-duration");

    console.log("Updating footer with song:", song);

    if (songNameElem && posterElem && startDurationElem && endDurationElem) {
      songNameElem.textContent = song.songName || "Unknown Song Name";
      posterElem.src = song.poster || "path/to/default-image.jpg"; // Use the song's poster or a default image
      startDurationElem.textContent = "00:00"; // Reset start duration
    } else {
      console.error("Footer elements not found.");
    }
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
  // Play button functionality
  document.querySelector(".play").addEventListener("click", () => {
    if (songs.length > 0) {
      if (music.paused) {
        music.play(); // Resume the current song from the paused position
        document.querySelector(".play").style.display = "none";
        document.querySelector(".pause").style.display = "inline-block";
      } else {
        playSong(currentSongIndex); // Play the current song from the beginning
      }
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
    });
  } else {
    console.error("Volume slider not found.");
  }

  // Handle music end event to reset the play/pause button
  music.addEventListener("ended", () => {
    document.querySelector(".play").style.display = "inline-block";
    document.querySelector(".pause").style.display = "none";

    // Play the next song automatically
    if (currentSongIndex < songs.length - 1) {
      playSong(currentSongIndex + 1);
    } else {
      playSong(0); // Loop back to the first song if it was the last one
    }
  });
});
