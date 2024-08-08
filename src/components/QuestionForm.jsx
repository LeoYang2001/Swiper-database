import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const QuestionForm = ({ existingQuestion, onSave }) => {
  const [title, setTitle] = useState(existingQuestion ? existingQuestion.title : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingQuestion) {
      // Update existing question
      const questionDoc = doc(db, "cards", existingQuestion.id);
      await updateDoc(questionDoc, { title });
    } else {
      // Add new question
      await addDoc(collection(db, "cards"), { title });
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Question title"
      />
      <button type="submit">{existingQuestion ? "Update" : "Add"} Question</button>
    </form>
  );
};

export default QuestionForm;
