import { useState, useEffect } from "react";
import _ from "lodash";

function App() {
  const API_base = "http://localhost:3001";
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [popupActive, setPopupActive] = useState("false");
  // console.log(todos, newTodo, popupActive);

  useEffect(() => {
    fetch(API_base + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
        // console.log(todos);
      })
      .catch((err) => console.error("Error: " + err));
  }, []);

  const completeTask = async (id) => {
    console.log("event detected");
    let data = await fetch(API_base + "/todos/complete/" + id);
    data = await data.json();
    setTodos(
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.completed = data.completed;
        }
        return todo;
      })
    );
    console.log(todos);
  };

  const handleDelete = async (id) => {
    try {
      let data = await fetch(API_base + "/todos/delete/" + id, {
        method: "DELETE",
      });
      data = await data.json();
      setTodos(
        todos.filter((todo) => {
          return todo._id !== data._id;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const addNew = async (e) => {
    console.log("newTodo is: " + newTodo);
    e.preventDefault();
    console.log("handling new item addition");
    let bodyPart = JSON.stringify({ text: newTodo });
    console.log("bodyPart is " + bodyPart);

    let data = await fetch(API_base + "/todos/new", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: bodyPart,
    });

    data = await data.json();
    const temp = todos;
    temp.push(data);
    setTodos(temp);

    setNewTodo("");
    setPopupActive(false);
  };

  return (
    <div className="App">
      <h1>Welcome, Selva</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.completed ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTask(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => handleDelete(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>
      {popupActive === true ? (
        <div className="popup">
          <div
            className="popup-close-btn"
            onClick={() => setPopupActive(false)}
          >
            X
          </div>
          <form>
            <div>
              <label>ADD ITEM</label>
              <input
                className="popup-input"
                type="text"
                value={newTodo}
                onChange={(e) => {
                  e.preventDefault();
                  setNewTodo(e.target.value);
                }}
                placeholder="Eg. Get milk"
              />
            </div>
            <button className="add-btn" type="submit" onClick={addNew}>
              Add
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
      <div className="popup-btn" onClick={() => setPopupActive(true)}>
        +
      </div>
    </div>
  );
}

export default App;
