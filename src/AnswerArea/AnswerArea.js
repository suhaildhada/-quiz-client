import React, { useEffect, useState } from "react";

function AnswerArea({
  index,
  ans,
  options,
  onNextQuestion,
  questionNumber,
  onAnswerSelected,
}) {
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [nextQuestionTimeRemaining, setNextQuestionTimeRemaining] = useState(3);

  useEffect(() => {
    let newShuffledOptions = options.slice();
    let currentIndex = newShuffledOptions.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [newShuffledOptions[currentIndex], newShuffledOptions[randomIndex]] = [
        newShuffledOptions[randomIndex],
        newShuffledOptions[currentIndex],
      ];
    }
    setShuffledOptions(newShuffledOptions);
  }, [options]);

  useEffect(() => {
    setSelectedAnswer("");
    setNextQuestionTimeRemaining(3);
  }, [index]);

  useEffect(() => {
    if (
      (!selectedAnswer || selectedAnswer !== ans) &&
      nextQuestionTimeRemaining > 0
    ) {
      return;
    }

    let questionTimerId = setTimeout(() => {
      setNextQuestionTimeRemaining((remaining) => {
        return remaining - 1;
      });
    }, 1000);

    return () => clearTimeout(questionTimerId);
  }, [selectedAnswer, nextQuestionTimeRemaining]);

  useEffect(() => {
    if (!selectedAnswer) {
      return;
    }
    const timerId = setTimeout(() => {
      if (selectedAnswer === ans) {
        onNextQuestion();
      }
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [selectedAnswer, ans]);

  function renderOptions() {
    return (
      shuffledOptions &&
      shuffledOptions.map((option, i) => (
        <div
          key={i}
          className={`answer ${
            selectedAnswer ? (option === ans ? "correctAns" : "wrongAns") : ""
          }`}
          onClick={() => handleOnClick(option)}
        >
          <h2>{option}</h2>
        </div>
      ))
    );
  }

  function handleOnClick(option) {
    if (!selectedAnswer) {
      setSelectedAnswer(option);
      onAnswerSelected(option);
      //api call for answer checking
    }
  }

  return (
    <>
      <div className="answer-grid-container">{renderOptions()}</div>;
      {selectedAnswer ? (
        <p className="result">
          {selectedAnswer === ans
            ? `Correct Answer! Next question in ${nextQuestionTimeRemaining}.`
            : "Wrong Answer :("}
        </p>
      ) : null}
    </>
  );
}

export default AnswerArea;
