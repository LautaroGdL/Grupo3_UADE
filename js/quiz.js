//Definicion de las Preguntas
const questions = [
    {
        image: '../images/quiz/canguro.png',
        options: ['Canguro', 'Elefante', 'Gorila'],
        correctAnswer: 'Canguro'
    },
    {
        image: '../images/quiz/elefante.png',
        options: ['Gorila', 'Elefante', 'Jirafa'],
        correctAnswer: 'Elefante'
    },
    {
        image: '../images/quiz/gorila.png',
        options: ['Canguro', 'Gorila', 'Jirafa'],
        correctAnswer: 'Gorila'
    },
    {
        image: '../images/quiz/jirafa.png',
        options: ['Canguro', 'Jirafa', 'Panda'],
        correctAnswer: 'Jirafa'
    },
    {
        image: '../images/quiz/leon.png',
        options: ['Tigre', 'Leon', 'Rinoceronte'],
        correctAnswer: 'Leon'
    },
    {
        image: '../images/quiz/panda.png',
        options: ['Leon', 'Panda', 'Rinoceronte'],
        correctAnswer: 'Panda'
    },
    {
        image: '../images/quiz/rinoceronte.png',
        options: ['Tigre', 'Panda', 'Rinoceronte'],
        correctAnswer: 'Rinoceronte'
    },
    {
        image: '../images/quiz/tigre.png',
        options: ['Tigre', 'Gorila', 'Jirafa'],
        correctAnswer: 'Tigre'
    }
];


//Variables para el Estado del Juego de preguntas
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('nextButton');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');

// Mostrar la primera pregunta al cargar la página
showQuestion();

//Mostrar una pregunta/Imagen; Mostrar opciones
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = `<img src="${currentQuestion.image}" alt="Animal">`;

    optionsElement.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            optionElement.classList.add('selected');
            checkAnswer(option);
        });
        optionsElement.appendChild(optionElement);
    });
}

//Extrae el texto de la opción seleccionada; luego llama a la función checkAnswer(selectedOption) 

function optionClickHandler() {
    const selectedOption = this.textContent;
    checkAnswer(selectedOption);
}

//Verificacion de Respuesta V o F; Actualiza puntaje; Muestra mensaje de resultado; Actualiza la interfaz del cuestionario.
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const options = optionsElement.querySelectorAll('.option');

    options.forEach(option => {
        option.removeEventListener('click', optionClickHandler);
        if (option.textContent === currentQuestion.correctAnswer) {
            option.classList.add('correct');
        } else if (option.textContent === selectedOption) {
            option.classList.add('selected');
        } else {
            option.classList.add('incorrect');
        }
    });

    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
        scoreElement.textContent = `Puntaje: ${score}`; // Actualizamos el puntaje
        resultElement.textContent = '¡Respuesta correcta!';
    } else {
        score = Math.max(0, score - 1); // Restamos un punto si la respuesta es incorrecta
        scoreElement.textContent = `Puntaje: ${score}`; // Actualizamos el puntaje
        resultElement.innerHTML = `Respuesta incorrecta. La respuesta correcta es <span class="correct-answer">${currentQuestion.correctAnswer}</span>`;
    }
    nextButton.disabled = false;
}

//Muestra la siguiente pregunta
function showNextQuestion() {
    const options = optionsElement.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        resultElement.textContent = '';
        nextButton.disabled = true;
        options.forEach(option => {
            option.addEventListener('click', optionClickHandler);
        });
    } else {
        endGame();
    }
}

//Funcion activada alfinal del juego
function endGame() {
    questionElement.textContent = '';
    optionsElement.textContent = '';
    nextButton.style.display = 'none';
    restartButton.style.display = 'block';
    resultElement.textContent = `Fin del juego. Puntuación final: ${score} / ${questions.length}`;
    document.getElementById('instruction').style.display='none';
//***************************************************************************************************************** */
    let endgameImage = '';
    let endgameText = '';

    if (score >= 0 && score <= 4) {
        endgameImage = '../images/low_score_image.png';
        endgameText = 'Sabes poco de animales. Deberías aprender mas!';
    } else if (score >= 5 && score <= 6) {
        endgameImage = 'quizimg/medium_score_image.png';
        endgameText = 'Buen nivel de conocimiento. Si bien, siempre esta bueno conocer mas animales';
    } else if (score >= 7 && score <= 8) {
        endgameImage = 'quizimg/high_score_image.png';
        endgameText = '¡Excelente trabajo! Sabes muchisimo sobre';
    }

    resultElement.innerHTML = `
        <div class="endgame-content">
            <img src="${endgameImage}" alt="Resultado final" class="endgame-image">
            <div class="endgame-text">${endgameText}</div>
        </div>
        Fin del juego. Puntuación final: ${score} / ${questions.length}
    `;
//*****************************************************************************************************************
}


//Funcion del reinicio del juego
function restartGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = 'Puntaje: 0'; // Reiniciamos el puntaje
    showQuestion();
    resultElement.textContent = '';
    nextButton.style.display = 'block';
    restartButton.style.display = 'none';
}


// Agregar eventos click a los botones
nextButton.addEventListener('click', showNextQuestion);
restartButton.addEventListener('click', restartGame);