import React, {useState} from 'react';
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions } from './API';
import { QuestionState, Difficulty } from './API';
import {GlobalStyle, Wrapper} from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const Total_Questions = 10;

const App = () => {

  const[loading, setLoading] = useState(false);
  const[questions, setQuestions] = useState<QuestionState[]>([]);
  const[number, setNumber] = useState(0);
  const[userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const[score, setScore] = useState(0);
  const[gameOver, setGameOver] = useState(true);

  console.log(questions)

  const startTrivia =async () => {
    setLoading(true);
    setGameOver(false);
    try {
      const newQuestions = await fetchQuizQuestions(
        Total_Questions,
        Difficulty.EASY
      );

      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
    } catch(error) {
      console.error("Failed to start quiz:", error);
      alert("An error occurred while starting the quiz. Please try again later.");
    } finally {
    setLoading(false);
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //Users answer
      const answer = e.currentTarget.value;

      //Check answer against correct answer
      const correct = questions[number].correct_answer === answer;

      //Add score if answer is correct
      if (correct) setScore(prev => prev + 1);

      //Save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion == Total_Questions) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
    <GlobalStyle/>
    <Wrapper className="App">
      <h1> Quiz Application </h1>

      {gameOver || userAnswers.length == Total_Questions ? (
        <button className='start' onClick={startTrivia}> Start game </button>
      ): null}
      
      {!gameOver ? <p className='score'> Score: {score} </p> : null}

      {loading && <p> Loading questions.... </p>}

      {!loading && !gameOver && (
        <QuestionCard
        questionNumber={number + 1}
        totalQuestions={Total_Questions}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
      />
      )}
      
      {!gameOver && !loading &&
      userAnswers.length == number + 1 && 
      number !== Total_Questions - 1 ? (
        <button className='next' onClick={nextQuestion}> Next Question </button>
      ) : null}
    </Wrapper>
    </>
  );
}

export default App;
