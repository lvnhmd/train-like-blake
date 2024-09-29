let currentExerciseIndex = 0;
let workoutData = null;
let timerInterval = null; // For rest timer

// Function to load workout based on week and day selection
function loadWorkout() {
  const week = document.getElementById('week').value;
  const day = document.getElementById('day').value;

  fetch(`/workout-data?week=${week}&day=${day}`)
    .then(response => response.json())
    .then(data => {
      workoutData = data;
      currentExerciseIndex = 0;
      displayExercise();
    });
}

// Function to display the current exercise details and play video
function displayExercise() {
  const exercise = workoutData.exercises[currentExerciseIndex];

  // Update video source
  const video = document.getElementById('workout-video');
  const videoSource = document.getElementById('video-source');
  videoSource.src = exercise.videoUrl;
  video.load(); // Reload video

  // Update exercise details
  document.getElementById('block-name').textContent = `Block: ${workoutData.block}`;
  document.getElementById('exercise-name').textContent = `Exercise: ${exercise.name}`;
  document.getElementById('round-info').textContent = `Rounds: ${exercise.rounds}`;
  document.getElementById('reps-info').textContent = `Reps: ${exercise.reps}`;
}

// Function to handle the rest timer between exercises
function startRestTimer() {
  let timeRemaining = 60; // 1 minute rest
  document.getElementById('reps-info').textContent = `Rest: ${timeRemaining} seconds`;

  timerInterval = setInterval(() => {
    timeRemaining--;
    document.getElementById('reps-info').textContent = `Rest: ${timeRemaining} seconds`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      displayExercise(); // Move to next exercise when timer is over
    }
  }, 1000); // Update every second
}

// Function to move to the next exercise
function nextExercise() {
  if (currentExerciseIndex < workoutData.exercises.length - 1) {
    currentExerciseIndex++;
    
    // Check if rest is required after this exercise
    if (workoutData.exercises[currentExerciseIndex].rest) {
      startRestTimer(); // Start rest timer if rest is needed
    } else {
      displayExercise(); // No rest, move to the next exercise directly
    }
  }
}

// Function to move to the previous exercise
function prevExercise() {
  if (currentExerciseIndex > 0) {
    currentExerciseIndex--;
    clearInterval(timerInterval); // Stop any running rest timer
    displayExercise(); // Move to the previous exercise
  }
}