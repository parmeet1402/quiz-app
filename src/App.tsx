import React, { useState } from "react";
// Components
import QuestionCard from "./components/QuestionCard";

// utility files
import { fetchQuizQuestions, Difficulty, QuestionState } from "./api";

// Styles
import { GlobalStyle, Wrapper } from "./App.styles";

// Constants
const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    console.log("...");
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const isCorrect = questions[number].correct_answer === answer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      const answerObject = {
        question: questions[number].question,
        answer,
        correct: isCorrect,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestionCount = number + 1;

    if (nextQuestionCount === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestionCount);
    }
  };

  const isStartVisible = gameOver || userAnswers.length === TOTAL_QUESTIONS;
  const isScoreVisible = !gameOver;
  const isLoadingVisible = loading;
  const isQuestionCardVisible = !loading && !gameOver;
  const isNextQuestionVisible =
    !loading &&
    !gameOver &&
    userAnswers.length === number + 1 &&
    number !== TOTAL_QUESTIONS - 1;

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {isStartVisible ? (
          <button className="start" onClick={startTrivia}>
            start
          </button>
        ) : null}
        {isScoreVisible ? <p className="score">Score:{score}</p> : null}
        {isLoadingVisible ? <p>Loading Questions...</p> : null}
        {isQuestionCardVisible ? (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        ) : null}
        {isNextQuestionVisible ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
