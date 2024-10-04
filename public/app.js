let currentBlockIndex = 0; // To keep track of the current block
let currentExerciseIndex = 0; // To keep track of the current exercise within a block
let currentRound = 1; // To keep track of the current round within a block
let workoutData = null;
let timerInterval = null; // For rest timer

// Function to load workout based on week and day selection
function loadWorkout() {
  const week = document.getElementById('week').value;
  const day = document.getElementById('day').value;

  fetch(`/workout-data?week=${week}&day=${day}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      workoutData = data;
      currentBlockIndex = 0;
      currentExerciseIndex = 0;
      currentRound = 1; // Start at round 1
      displayExercise();
    });
}

// Function to display the current exercise details and play video
function displayExercise() {
  const block = workoutData[currentBlockIndex];
  const exercise = block.exercises[currentExerciseIndex];

  // Update video source
  const video = document.getElementById('workout-video');
  const videoSource = document.getElementById('video-source');
  videoSource.src = exercise.videoUrl;
  video.load(); // Reload video

  // Update exercise details
  document.getElementById('block-name').textContent = `Block: ${block.block}`;
  document.getElementById('exercise-name').textContent = `Exercise: ${exercise.name}`;
  document.getElementById('round-info').textContent = `Rounds: ${block.rounds}`;
  document.getElementById('reps-info').textContent = `Reps: ${exercise.reps}`;

  // Update the round indicator
  document.getElementById('round-indicator').textContent = `Round: ${currentRound}`;
}

// Function to move to the next exercise
function nextExercise() {
  const block = workoutData[currentBlockIndex];

  // Move to the next exercise within the block
  if (currentExerciseIndex < block.exercises.length - 1) {
    currentExerciseIndex++;
    displayExercise(); // Display the next exercise
  } else if (currentRound < block.rounds) {
    // If current block has more rounds, reset exercise index and increment the round
    currentRound++;
    currentExerciseIndex = 0;
    displayExercise();
  } else if (currentBlockIndex < workoutData.length - 1) {
    // If current block is done, move to the next block
    currentBlockIndex++;
    currentExerciseIndex = 0;
    currentRound = 1; // Reset to round 1 for the new block
    displayExercise();
  }
}

// Function to move to the previous exercise
function prevExercise() {
  if (currentExerciseIndex > 0) {
    currentExerciseIndex--;
    displayExercise(); // Move to the previous exercise
  } else if (currentRound > 1) {
    // If we are not in the first round, go to the previous round and last exercise of that round
    currentRound--;
    currentExerciseIndex = workoutData[currentBlockIndex].exercises.length - 1;
    displayExercise();
  } else if (currentBlockIndex > 0) {
    // Move to the previous block if we are at the first exercise and first round of current block
    currentBlockIndex--;
    const block = workoutData[currentBlockIndex];
    currentRound = block.rounds;
    currentExerciseIndex = block.exercises.length - 1;
    displayExercise();
  }
}