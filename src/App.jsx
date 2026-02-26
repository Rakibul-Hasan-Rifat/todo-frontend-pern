import axios from "axios";
import { BACKEND_URL } from "./api.js";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { CiEdit, CiTrash } from "react-icons/ci";
import { IoMdAdd, IoMdDoneAll } from "react-icons/io";

function App() {

  const [todos, setTodos] = useState([]);
  const [hasDone, setHasDone] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editingTodo, setEditingTodo] = useState("");
  const [description, setDescription] = useState("");

  const getTodos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/todos`);
      setTodos(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getTodos();
  }, [editedText, editingTodo, description])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/todos/create`, {
        description, completed: hasDone
      })
      toast.success('Successfully the todo added!')
      setDescription("");
      getTodos()
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleUpdate = async (todo) => {
    // console.log(id, editedText, hasDone);
    try {
      await axios.put(`${BACKEND_URL}/todos/${todo.todoid}`, {
        description: editedText || todo.description,
        completed: hasDone,
      });
      toast.success("The todo has been updated successfully!")
      setEditingTodo("");
      getTodos();
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteTodo = async (id) => {
    console.log(id)
    try {
      await axios.delete(`${BACKEND_URL}/todos/${id}`)
      toast.success('Successfully deleted!')
      getTodos();
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
        <div className="w-full max-w-lg bg-gray-50 text-center rounded-xl shadow-xl p-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 p-3">PERN TODO APP</h1>
          <form onSubmit={handleFormSubmit} className="py-3 flex gap-2 md:gap-0 justify-center items-center flex-col md:flex-row">
            <input
              required
              type="text"
              name="description"
              value={description}
              placeholder="What needs to be done"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full md:w-3/4 max-w-sm text-gray-700 font-semibold px-4 py-2 shadow-xl rounded-lg md:rounded-r-none border border-gray-200 outline-0"
            />
            <button className="w-full md:w-1/4 max-w-sm flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white md:text-2xl shadow-xl px-4 py-2 rounded-lg md:rounded-l-none font-medium cursor-pointer">
              <IoMdAdd />
              <span className='md:hidden'>Add Task</span>
            </button>
          </form>
          <div className="h-[300px] my-5 py-3 flex flex-col items-start gap-1 rounded-lg overflow-auto">
            {
              todos.length < 1 ? (
                <h4 className="w-full text-center text-2xl text-gray-400 font-semibold">No todo is available 😒</h4>
              ) : (
                todos?.map(todo => (
                  <>
                    {
                      editingTodo === todo.todoid ? (
                        <div className="w-full py-3 flex gap-2 md:gap-0 justify-center items-center flex-col md:flex-row">
                          <input
                            required
                            type="text"
                            name="description"
                            value={editedText}
                            placeholder="What needs to be done"
                            onChange={(e) => setEditedText(e.target.value)}
                            className="flex-1 text-gray-700 font-semibold px-4 py-2 shadow rounded-lg md:rounded-r-none border border-gray-200 outline-0"
                          />
                          <button onClick={() => handleUpdate(todo)} className="flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white md:text-2xl shadow px-4 py-2 rounded-lg md:rounded-l-none font-medium cursor-pointer">
                            <CiEdit />
                            <span className='md:hidden'>Update Task</span>
                          </button>
                        </div>
                      ) : (
                        <div key={todo.todoid} className="w-full max-w-lg mx-auto flex gap-2 justify-between items-center px-4 py-2 shadow rounded">
                          <div className="flex gap-2 items-center">
                            <button onClick={() => { setHasDone(true); handleUpdate(todo) }} className={`w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-green-500 cursor-pointer ${todo.completed ? "bg-green-500 text-white border-green-500" : ""}`}>{todo.completed && <IoMdDoneAll size={14} />}</button>
                            <p className="font-semibold text-sm">{todo.description}</p>
                          </div>
                          <div className="flex gap-1 justify-center items-center">
                            <button onClick={() => { setEditingTodo(todo.todoid); setEditedText(todo.description); }} className="p-1 rounded-md text-lg text-green-500 shadow border border-gray-200 cursor-pointer duration-300 hover:text-white hover:bg-green-500"><CiEdit /></button>
                            <button onClick={() => handleDeleteTodo(todo.todoid)} className="p-1 rounded-md text-lg text-red-500 shadow border border-gray-200 cursor-pointer duration-300 hover:text-white hover:bg-red-500"><CiTrash /></button>
                          </div>
                        </div>
                      )
                    }
                  </>
                ))
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
