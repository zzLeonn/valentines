// Remove the "not-loaded" class after 1 second
window.onload = () => {
  setTimeout(() => {
    document.body.classList.remove("not-loaded");
  }, 1000);
};

// Music functionality
const musicFiles = [
  { name: "Falling", file: "music/falling.mp3" },
  { name: "Isekai", file: "music/isekai.mp3" },
  { name: "Petals", file: "music/petals.mp3" }
];

let currentMusicIndex = localStorage.getItem("lastPlayedIndex");
currentMusicIndex = currentMusicIndex ? parseInt(currentMusicIndex) : 0;

const audioElement = document.getElementById("bgMusic");
const songTitleElement = document.getElementById("song-title");

if (!audioElement) {
  console.error("Audio element with ID 'bgMusic' not found.");
} else {
  function updateSong() {
    audioElement.src = musicFiles[currentMusicIndex].file;
    songTitleElement.innerText = `Track: ${musicFiles[currentMusicIndex].name}`;
    localStorage.setItem("lastPlayedIndex", currentMusicIndex);
  }

  // Set initial song and title
  updateSong();

  audioElement.addEventListener("ended", () => {
    currentMusicIndex = (currentMusicIndex + 1) % musicFiles.length;
    updateSong();
    audioElement.play();
  });

  // Ensure autoplay works on first click
  audioElement.volume = 0.5;
  document.addEventListener("click", () => {
    if (audioElement.paused) {
      audioElement.play();
    }
  }, { once: true });
}

// Create fireflies clustered around a center (e.g., the flower's position)
function createFireflies(numFireflies = 20) {
  // Look for an existing container; if not, create one.
  let container = document.querySelector('.fireflies');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('fireflies');
    document.body.appendChild(container);
  }

  // Clear any existing fireflies
  container.innerHTML = "";

  // Define the center (in percentage) for the cluster.
  const centerX = 50; // horizontally centered
  const centerY = 70; // near the flower vertically

  // Create general firefly elements
  for (let i = 0; i < numFireflies; i++) {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');

    // Create a random offset in a circle (max radius in %)
    const maxRadius = 15;
    const radius = Math.random() * maxRadius;
    const angle = Math.random() * 2 * Math.PI;
    const offsetX = radius * Math.cos(angle);
    const offsetY = radius * Math.sin(angle);

    // Calculate final positions (ensuring they remain within 0%-100%)
    let posX = Math.max(0, Math.min(100, centerX + offsetX));
    let posY = Math.max(0, Math.min(100, centerY + offsetY));

    // Randomize animation duration and delay
    const duration = (Math.random() * 3 + 2).toFixed(1) + 's';
    const delay = (Math.random() * 3).toFixed(1) + 's';

    firefly.style.setProperty('--x', `${posX}%`);
    firefly.style.setProperty('--y', `${posY}%`);
    firefly.style.setProperty('--d', duration);
    firefly.style.setProperty('--delay', delay);

    container.appendChild(firefly);
  }

  // Create the special interactive firefly
  const interactiveFirefly = document.createElement('div');
  interactiveFirefly.classList.add('interactive-firefly');
  // Optionally, you can adjust its initial position here
  interactiveFirefly.style.left = '50%';
  interactiveFirefly.style.top = '70%';

  container.appendChild(interactiveFirefly);
}

document.addEventListener('DOMContentLoaded', () => {
  createFireflies(20);

  const interactiveFirefly = document.querySelector('.interactive-firefly');
  const messageDiv = document.querySelector('#message.text');

  if (!interactiveFirefly || !messageDiv) {
    console.error("Elements not found");
    return;
  }

  function getTargetPosition() {
    const messageRect = messageDiv.getBoundingClientRect();
    return {
      x: messageRect.left + messageRect.width/2 - interactiveFirefly.offsetWidth/2,
      y: messageRect.bottom + 70
    };
  }

  setTimeout(() => {
    // Remove initial animation
    interactiveFirefly.style.animation = 'none';
    
    const startRect = interactiveFirefly.getBoundingClientRect();
    const startX = startRect.left;
    const startY = startRect.top;
    const target = getTargetPosition();

    // Create meandering path animation
    const animation = interactiveFirefly.animate([
      { 
        transform: `translate(${0}px, ${0}px)`,
        opacity: 1
      },
      {
        transform: `translate(${40}px, ${-60}px)`, // First drift point
        opacity: 0.8
      },
      {
        transform: `translate(${-30}px, ${-140}px)`, // Second drift point
        opacity: 0.9
      },
      {
        transform: `translate(${target.x - startX}px, ${target.y - startY}px)`, // Final position
        opacity: 1
      }
    ], {
      duration: 32000,
      easing: 'ease-in-out',
      iterations: 1
    });

    // When animation completes
    animation.onfinish = () => {
      interactiveFirefly.style.transform = `translate(${target.x - startX}px, ${target.y - startY}px)`;
    };
  }, 2000);
});

// Typewriter effect for messages
const messages = [
  "Su, my love",
  "Things have been rough the past few months ever since I got back",
  "I know it's just us missing each other",
  "But something that never changed was how much I kept falling each and every day",
  "I love you, I hope someday we can have the life we wish.",
  "Will you be my Valentine?" // This sentence remains visible
];

let index = 0;
let charIndex = 0;
const speed = 50; // Typing speed (ms)
const delayBetweenMessages = 1500; // Delay between messages
const messageContainer = document.querySelector(".text");

function typeWriter() {
  if (index < messages.length) {
    if (charIndex < messages[index].length) {
      messageContainer.innerHTML += messages[index].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, speed);
    } else {
      if (index < messages.length - 1) {
        setTimeout(() => {
          messageContainer.innerHTML = "";
          charIndex = 0;
          index++;
          typeWriter();
        }, delayBetweenMessages);
      }
    }
  }
}

// Start the typewriter effect only after the fade-in animation completes
messageContainer.addEventListener("animationend", function(e) {
  if (e.animationName === "fadeIn") {
    typeWriter();
  }
});
