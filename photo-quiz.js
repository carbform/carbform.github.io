let quizSteps;
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

function showStep(index) {
  quizSteps.forEach((step, i) => {
    step.style.display = (i === index) ? 'block' : 'none'; // Show only the current step
  });
  // Ensure score container is hidden when showing a question
  const scoreContainer = document.getElementById('score-container');
  if (scoreContainer) {
      scoreContainer.style.display = 'none';
  }
}

function revealPhotoAndStartTimer(photoId, timerId, captionId) {
  console.log("Attempting to reveal photo:", photoId, "and caption:", captionId);
  const photo = document.getElementById(photoId);
  const timerElement = document.getElementById(timerId);
  const caption = document.getElementById(captionId); // Find caption by ID
  console.log("Photo element found:", photo);
  console.log("Caption element found:", caption);

  if (!photo || !timerElement || !caption) { // Check caption exists too
      console.error("Photo, Timer, or Caption element not found for:", photoId, timerId, captionId);
      return;
  }

  // Reveal photo and caption using only inline styles
  console.log("Photo display BEFORE:", photo.style.display);
  photo.style.setProperty('display', 'block', 'important'); 
  photo.style.setProperty('visibility', 'visible', 'important');
  photo.style.setProperty('opacity', '1', 'important');
  console.log("Photo display AFTER:", photo.style.display);
  console.log("Photo visibility AFTER:", photo.style.visibility);
  console.log("Photo opacity AFTER:", photo.style.opacity);

  console.log("Caption display BEFORE:", caption.style.display);
  caption.style.display = 'block';
  console.log("Caption display AFTER:", caption.style.display);
  

  // Show and spin timer
  timerElement.style.display = 'inline-block';
  timerElement.classList.add('fa-spin');

  // Start timer to proceed to next question
  setTimeout(() => {
    console.log("Timer finished for:", photoId, "Hiding elements.");
    timerElement.classList.remove('fa-spin');
    timerElement.style.display = 'none';
    // Reset styles when hiding
    photo.style.display = 'none'; 
    photo.style.visibility = ''; // Reset to default
    photo.style.opacity = ''; // Reset to default
    caption.style.display = 'none'; // Hide caption again
    nextQuestion(); // Move to the next question
  }, 7000); // 7 seconds
}

function checkAnswer(inputId, correctAnswer, photoId, timerId, captionId) {
  const answer = document.getElementById(inputId).value.trim();
  const inputElement = document.getElementById(inputId);
  // Find the button associated with this input within the current step
  const currentStep = quizSteps[currentQuestionIndex];
  const button = currentStep.querySelector(`button[onclick*="'${inputId}'"]`);

  if (answer === correctAnswer) {
    score++; // Increment score
    inputElement.disabled = true;
    if(button) button.disabled = true; // Disable button as well
    revealPhotoAndStartTimer(photoId, timerId, captionId); // Pass captionId
  } else {
    alert('Incorrect answer. Please try again.');
    // Do not proceed on incorrect answer
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    showStep(currentQuestionIndex);
  } else {
    displayScore();
  }
}

function displayScore() {
    // Hide the last question step
    if(currentQuestionIndex > 0) { 
         quizSteps[currentQuestionIndex - 1].style.display = 'none';
    } else if (quizSteps.length > 0) {
         quizSteps[0].style.display = 'none'; 
    }

  const scoreContainer = document.getElementById('score-container');
  if (scoreContainer) {
    scoreContainer.innerHTML = `
      <h2 style="font-family: dotfont; font-size: x-large; color: inherit;">Quiz Complete!</h2>
      <p style="font-family: lettera; font-size: large; color: inherit;">Your Score: ${score} / ${totalQuestions}</p>
    `;
    scoreContainer.style.display = 'block'; 
    scoreContainer.style.textAlign = 'center'; 
  } else {
      console.error("Score container not found!");
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  quizSteps = document.querySelectorAll('.quiz-step'); 
  totalQuestions = quizSteps.length;

  if (totalQuestions > 0) {
       quizSteps.forEach(step => step.style.display = 'none');
       showStep(0);

       // Initial hide for photos, captions (by ID), and timers within all steps
       quizSteps.forEach((step, index) => {
           step.querySelectorAll('.hidden-photo').forEach(photo => {
               photo.style.display = 'none';
           });
           // Hide caption by ID if it exists in this step
           const caption = step.querySelector('#caption' + (index + 1)); 
           if (caption) {
               caption.style.display = 'none';
           }
           step.querySelectorAll('.timer-icon').forEach(timer => {
               timer.style.display = 'none';
           });
       });

  } else {
      console.warn("No quiz steps found!");
      displayScore(); 
  }

  const scoreContainer = document.getElementById('score-container');
  if (scoreContainer) {
      scoreContainer.style.display = 'none';
  }
});