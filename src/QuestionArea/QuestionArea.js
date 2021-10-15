import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AnswerArea from "../AnswerArea/AnswerArea";
import easy from "../quiz-questions/easy";
import medium from "../quiz-questions/medium";
import hard from "../quiz-questions/hard";

function QuestionArea() {
  const [questionSet, setQuestionSet] = useState(easy);
  const [index, setIndex] = useState(0);
  const questionsRef = useRef(new Set());
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timer, setTimer] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (questionNumber === 6) {
      setQuestionSet(medium);
    }
    if (questionNumber === 11) {
      setQuestionSet(hard);
    }
  }, [questionNumber]);

  useEffect(() => {
    let prefix = "easy-";
    if (questionNumber > 5) {
      prefix = "medium-";
    }
    if (questionNumber > 10) {
      prefix = "hard-";
    }
    let randomQuestion = Math.floor(Math.random() * questionSet.length);
    while (questionsRef.current.has(prefix + randomQuestion)) {
      randomQuestion = Math.floor(Math.random() * questionSet.length);
    }
    questionsRef.current.add(prefix + randomQuestion);
    setIndex(randomQuestion);
  }, [questionNumber, questionSet]);

  useEffect(() => {
    if (timer === 0) {
      setIsGameOver(true);
      return;
    }

    if (!timerActive) {
      return;
    }

    const questionTime = setTimeout(() => {
      setTimer((timer) => {
        return timer - 1;
      });
    }, 1000);
    return () => clearTimeout(questionTime);
  }, [timer, timerActive]);

  function renderAnswer(index) {
    return (
      <AnswerArea
        index={index}
        onNextQuestion={onNextQuestion}
        questionNumber={questionNumber}
        ans={questionSet[index]?.ans || ""}
        options={questionSet[index]?.options || []}
        onAnswerSelected={onAnswerSelected}
      />
    );
  }

  function onNextQuestion() {
    //api call for question
    setTimerActive(true);
    setTimer(30);
    setQuestionNumber((questionNumber) => {
      return questionNumber + 1;
    });
  }

  function onAnswerSelected(option) {
    setTimerActive(false);
    if (option !== questionSet[index]?.ans) {
      setTimeout(() => {
        setIsGameOver(true);
      }, 3000);
    }
  }

  function renderQuestion() {
    return (
      <>
        <div className="flex-container">
          <h1 className="timer">{timer}</h1>
          <h1 className="question-area">
            {questionNumber}: {questionSet[index]?.question || ""}
          </h1>
        </div>
        <span>{renderAnswer(index)}</span>
      </>
    );
  }

  function restartGame() {
    setQuestionSet(easy);
    setIndex(0);
    questionsRef.current.clear();
    setQuestionNumber(1);
    setTimerActive(true);
    setTimer(30);
    setIsGameOver(false);
  }

  function renderGameOver() {
    return (
      <>
        <div className="game-over-msg-container">
          <h2 className="time-ran-out-msg">Game Over!</h2>
        </div>
        <div className="game-over-btn-container">
          <button className="btn" onClick={restartGame}>
            Play Again!
          </button>
        </div>
      </>
    );
  }

  return <>{isGameOver ? renderGameOver() : renderQuestion()}</>;
}

export default QuestionArea;
