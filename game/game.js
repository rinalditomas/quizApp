//selection of elements that are used 
const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll("#choise-text"));
const progressText = document.querySelector("#progress-text");
const scoreText = document.querySelector("#score");
const progressBar = document.querySelector("#progress-bar-full");
const image = document.querySelector("#question-image");
const startBtn = document.querySelector(".btn");
const truefalse = Array.from(document.querySelectorAll(".truefalse"));
const checkBtn = document.querySelector("#check");
const loader = document.querySelector(".loader");
const answerContainer = document.querySelector(".answers");

//creating variables that are used later
let currentQuestion = {};
let availableQuestions = [];
let acceptingAnswers = true;
let totalScore = 0;
let questionCounter = 0;
let selectedAnswer = [];
let counter = 0;

//create true element 
const truty = document.createElement("p");
truty.id = "true";
truty.className = "truefalse";
truty.setAttribute("data-id", "true");
truty.innerText = "True";
truty.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoise = e.target;
    selectedChoise.style.backgroundColor = "orange";
    selectedAnswer = selectedChoise.dataset["id"];
});


// create false element
const falsy = document.createElement("p");
falsy.id = "false";
falsy.className = "truefalse";
falsy.setAttribute("data-id", "false");
falsy.innerText = "False";
falsy.addEventListener("click", (e) => {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;
  const selectedChoise = e.target;
  selectedChoise.style.backgroundColor = "orange";
  selectedAnswer = selectedChoise.dataset["id"];
});

//event listener that onload show the img of the question and hidde the loader
image.addEventListener("load", () => {
  loader.style.display = "none";
  image.style.display = "block";
});

//request the information from the API and save it inside 'availableQuestions' variable
//trigger the function to start the game
const getQuestions = () => {
  fetch("https://proto.io/en/jobs/candidate-exercise/quiz.json")
    .then((res) => res.json())
    .then((data) =>
      data.questions.forEach((question) => availableQuestions.push(question))
    )
    .then(() => {
      questionCounter = 0;
      totalScore = 0;
      getNewQuestion();
    });
};

const getNewQuestion = async () => {
//check if there are still available questions. If not, calculate the score in % and save it in localStorage
    if (availableQuestions.length === counter) {
        let maxScore = 0;
        availableQuestions.forEach(
        (question) => (maxScore = maxScore + question.points)
        );
        let porcentageScore = Math.round((totalScore / maxScore) * 100);
        localStorage.setItem("finalScore", porcentageScore);
        return window.location.assign("/result/result.html");
    }

    //every time this function starts, it set the parameters in 0
  answerContainer.innerHTML = "";
  checkBtn.disabled = false;
  selectedAnswer = [];
  
    //populate with information the header of the app
  progressText.innerText = `Question ${counter+1} of ${availableQuestions.length}`;
  progressBar.style.width = `${((counter+1) / availableQuestions.length) * 100}%`;

    //select the current question using the counter, and populate the app with the info
    //from the API
  currentQuestion = availableQuestions[counter];
  const {possible_answers,question_type,img,title} = currentQuestion
  image.src = await img;
  question.innerText = await title;

    //if the question type is truefalse, it shows the true and false elements created before
  if (question_type === "truefalse") {
    const divTrue = document.createElement("div");
    const divFalse = document.createElement("div");
    divTrue.className = "choice-container";
    divFalse.className = "choice-container";

    divTrue.appendChild(truty);
    divFalse.appendChild(falsy);

    answerContainer.appendChild(divTrue);
    answerContainer.appendChild(divFalse);
  }
  //if the question type is other than truefalse, it creates a choice for every posible answer that the 
  //currentQuestion indicates.
  else {
    possible_answers.forEach((ans) => {
        const {a_id, caption} = ans
        
      let div = document.createElement("div");
      div.className = "choice-container";
      div.id = `answer${a_id}`;
      let p = `<p class="choise-text" id='${a_id}'  data-id='${a_id}'>${caption}</p>`;
      div.innerHTML = p;
      answerContainer.appendChild(div);

      //event listener to change the color and save the information  of the selected choice 
    
      div.addEventListener("click", (e) => {

        if (question_type === "multiplechoice-multiple") {
          const selectedChoise = e.target;
          selectedChoise.style.backgroundColor = "orange";
          selectedAnswer = [
            ...selectedAnswer,
            Number(selectedChoise.dataset["id"]),
          ];
        }
        if (question_type === "multiplechoice-single") {
          if (!acceptingAnswers) return;
          acceptingAnswers = false;
          const selectedChoise = e.target;
          selectedChoise.style.backgroundColor = "orange";
          selectedAnswer = selectedChoise.dataset["id"];
        }
      });
    });
  }

  acceptingAnswers = true;
};

//function to check if two arrays are equals
function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

//function trigger when the 'check answer' btn is clicked.
const checkAnswer = () => {
    
    const {question_type,correct_answer, points} = currentQuestion
    
    //color the correct answers and add the points if the answer is correct
    if (question_type === "multiplechoice-multiple") {

        correct_answer.forEach((ans) => {
        let answer = document.getElementById(`${ans}`);
        answer.style.backgroundColor = "#6EFF70";
        });
        if (arrayEquals(correct_answer, selectedAnswer.sort()))
        totalScore = totalScore + points;
    } else {

    let correctAnswer = correct_answer;
    let answer = document.getElementById(correctAnswer);
    answer.style.backgroundColor = "#6EFF70";

    if (question_type === "truefalse") {
      if (selectedAnswer === correct_answer.toString())
        totalScore = totalScore + points;
    }
    if (question_type === "multiplechoice-single") {
      if (selectedAnswer == correct_answer)
        totalScore = totalScore + points;
    }
  }
    acceptingAnswers = true;
    checkBtn.disabled = true;
    scoreText.innerText = totalScore;
  // color all the choices back to default color, hide the img, show the loader, add 1 to the counter to
  //iterate throw availableQuestions array and trigger getNewQuestion function to go to the next question.
  setTimeout(() => {
    if (question_type === "truefalse") {
      truefalse.forEach((opt) => {
        opt.style.backgroundColor = "#0096FF";
      });
    } else {
      choices.forEach((choice) => {
        choice.style.backgroundColor = "#0096FF";
      });
    }
    loader.style.display = "block";
    image.style.display = "none";
    counter++;
    getNewQuestion();
  }, 3000);
};
