import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';

interface InteractiveLearningModuleProps {
  moduleId: string;
  title: string;
  content: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      correct: boolean;
      explanation?: string;
    }>;
  }>;
  onComplete: (score: number) => void;
}

export const InteractiveLearningModule: React.FC<InteractiveLearningModuleProps> = ({
  moduleId,
  title,
  content,
  questions,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { dispatch: notifyDispatch } = useNotifications();

  const handleAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(
      opt => opt.id === selectedAnswers[currentQ.id]
    );

    if (selectedOption?.correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      const finalScore = score + (selectedOption?.correct ? 1 : 0);
      setCompleted(true);
      onComplete(finalScore);

      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          type: 'message',
          title: 'Module Completed',
          message: `You scored ${finalScore} out of ${questions.length} questions correctly!`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium'
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="prose max-w-none mb-6">
          {content}
        </div>
      </motion.div>

      {/* Questions */}
      {!completed && (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Question {currentQuestion + 1}</h3>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <p className="text-gray-900 mb-6">{questions[currentQuestion].question}</p>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => {
              const isSelected = selectedAnswers[questions[currentQuestion].id] === option.id;
              const showResult = showExplanation;
              const isCorrect = option.correct;

              return (
                <button
                  key={option.id}
                  onClick={() => !showExplanation && handleAnswer(questions[currentQuestion].id, option.id)}
                  className={cn(
                    "w-full p-4 text-left rounded-lg transition-colors",
                    isSelected && !showResult && "bg-primary/10 border-primary",
                    showResult && isCorrect && "bg-green-100 border-green-500",
                    showResult && isSelected && !isCorrect && "bg-red-100 border-red-500",
                    !isSelected && !showResult && "bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {showResult && (
                      isCorrect ? (
                        <Icons.CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        isSelected && <Icons.XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                  {showResult && option.explanation && isSelected && (
                    <p className={cn(
                      "mt-2 text-sm",
                      isCorrect ? "text-green-700" : "text-red-700"
                    )}>
                      {option.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            {!showExplanation ? (
              <Button
                onClick={() => setShowExplanation(true)}
                disabled={!selectedAnswers[questions[currentQuestion].id]}
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete'}
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">
            {Math.round(((currentQuestion + (completed ? 1 : 0)) / questions.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentQuestion + (completed ? 1 : 0)) / questions.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Score Display */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Icons.Award className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Module Completed!</h3>
          <p className="text-gray-600 mb-4">
            You scored {score} out of {questions.length} questions correctly.
          </p>
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
            <span className="font-medium text-primary">
              {Math.round((score / questions.length) * 100)}% Accuracy
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};