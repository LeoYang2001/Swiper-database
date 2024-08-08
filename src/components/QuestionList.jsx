import React, { useEffect, useState } from "react";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase";
import './QuestionList.css'; // Import the CSS file

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [localQuestions, setLocalQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      const questionsCollection = collection(db, "cards");
      const querySnapshot = await getDocs(questionsCollection);
      const questionsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(questionsArray);
      setLocalQuestions(questionsArray); // Set local state to match the initial fetch
    };

    fetchQuestions();
  }, []);

  const handleDelete = (id) => {
    setLocalQuestions(localQuestions.filter(question => question.id !== id));
  };

  const handleUpdate = (id, newContent) => {
    setLocalQuestions(localQuestions.map(question =>
      question.id === id ? { ...question, content: newContent } : question
    ));
  };

  const handleAdd = (newContent) => {
    const newQuestion = { id: Date.now().toString(), content: newContent }; // Using timestamp as a temporary ID
    setLocalQuestions([newQuestion, ...localQuestions ]);
  };

  const handleSave = async () => {
    setIsSaving(true)
    const batch = writeBatch(db);

    // Handle deletions by checking which questions were removed from the original list
    questions.forEach((originalQuestion) => {
      if (!localQuestions.find(question => question.id === originalQuestion.id)) {
        const questionDoc = doc(db, "cards", originalQuestion.id);
        batch.delete(questionDoc);
      }
    });

    // Handle updates and additions
    localQuestions.forEach((question) => {
      const questionDoc = doc(db, "cards", question.id);
      if (questions.find(q => q.id === question.id)) {
        // Existing question, update
        batch.update(questionDoc, { content: question.content });
      } else {
        // New question, add
        batch.set(questionDoc, { content: question.content });
      }
    });

    // Commit the batch to Firebase
    await batch.commit();
    console.log("Changes saved to Firestore");
    setIsSaving(false)

  };

  return (
    <div className="container ">
      <h2 className=" font-bold text-2xl my-4">Database</h2>
      <div className=" flex flex-row justify-between mt-4 ">
      <button className="add-button" onClick={() => handleAdd("New Question")}>Add Question</button>
      <button className="save-button" onClick={handleSave}>
        {
          isSaving ? 'Saving...' : 'Save'
        }
      </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {localQuestions.map(question => (
            <tr key={question.id}>
              <td>
                <input
                  type="text"
                  value={question.content}
                  onChange={(e) => handleUpdate(question.id, e.target.value)}
                />
              </td>
              <td className="flex justify-center items-center">
                <button onClick={() => handleDelete(question.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
};

export default QuestionList;
