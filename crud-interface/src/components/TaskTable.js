import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskTable.css";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", done: false });
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    axios
      .get("https://pknxa2sw48.execute-api.us-east-1.amazonaws.com/task")
      .then((response) => {
        const taskData = response.data.body ? response.data.body.tasks : [];
        setTasks(taskData);
      })
      .catch((error) => {
        console.error("Error al obtener las tareas:", error);
        setTasks([]);
      });
  }, []);

  const handleAddTask = () => {
    if (editTaskId) {
      handleUpdateTask();
      return;
    }

    const taskToAdd = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      done: newTask.done,
    };

    setTasks((prevTasks) => [...prevTasks, taskToAdd]);
    setNewTask({ title: "", description: "", done: false });

    axios
      .post("https://pknxa2sw48.execute-api.us-east-1.amazonaws.com/task", taskToAdd)
      .then((response) => {
        console.log("Tarea agregada exitosamente", response);
      })
      .catch((error) => {
        console.error("Error al agregar la tarea", error);
      });
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    axios
      .delete(`https://pknxa2sw48.execute-api.us-east-1.amazonaws.com/task/${id}`)
      .then((response) => {
        console.log("Tarea eliminada exitosamente", response);
      })
      .catch((error) => {
        console.error("Error al eliminar la tarea", error);
      });
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setNewTask({ title: task.title, description: task.description, done: task.done });
  };

  const handleUpdateTask = () => {
    const updatedTask = { ...newTask, id: editTaskId };

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === editTaskId ? updatedTask : task))
    );

    setEditTaskId(null);
    setNewTask({ title: "", description: "", done: false });

    axios
      .put(`https://pknxa2sw48.execute-api.us-east-1.amazonaws.com/task/${editTaskId}`, updatedTask)
      .then((response) => {
        console.log("Tarea actualizada exitosamente", response);
      })
      .catch((error) => {
        console.error("Error al actualizar la tarea", error);
      });
  };

  return (
    <div className="task-container">
      <h2 className="task-title">Lista de Tareas</h2>
      <table className="task-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Completada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.done ? "Sí" : "No"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditTask(task)}>
                    Editar
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay tareas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="task-form">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Título"
          className="task-input"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Descripción"
          className="task-input"
        />
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={newTask.done}
            onChange={(e) => setNewTask({ ...newTask, done: e.target.checked })}
          />
          Completada
        </label>
        <button className="add-btn" onClick={handleAddTask}>
          {editTaskId ? "Actualizar Tarea" : "Agregar Tarea"}
        </button>
      </div>
    </div>
  );
};

export default TaskTable;
