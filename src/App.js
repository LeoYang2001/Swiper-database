import React, { useState } from "react";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";


const App = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleEdit = (question) => {
    setSelectedQuestion(question);
  };

 

  return (
    <div>
      <QuestionList onEdit={handleEdit} />
    </div>
  );
};

export default App;
