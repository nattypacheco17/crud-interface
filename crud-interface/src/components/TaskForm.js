import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = ({ task, onSave }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [done, setDone] = useState(task ? task.done : true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = { title, description, done };

    if (task) {
      // Actualizar tarea existente
      await axios.put(`https://pknxa2sw48.execute-api.us-east-1.amazonaws.com/task/${task.id}`, newTask);
    } else {
      // Crear nueva tarea
      await axios.post("https://pknxa2sw48.execute-api.us-east-1.amazonaws.com/task", newTask);
    }

    onSave();
  }; 

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDone(task.done);
    }
  }, [task]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />
      <label>
        Hecho:
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default TaskForm;
