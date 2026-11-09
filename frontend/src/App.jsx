import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editInput, setEditInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_BASE}/tasks`)
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async () => {
    if (!input.trim()) return
    try {
      const { data } = await axios.post(`${API_BASE}/tasks`, { text: input.trim() })
      setTasks([...tasks, data])
      setInput('')
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id)
    try {
      const { data } = await axios.put(`${API_BASE}/tasks/${id}`, { completed: !task.completed })
      setTasks(tasks.map(t => t.id === id ? data : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditInput(task.text)
  }

  const saveEdit = async (id) => {
    if (!editInput.trim()) return
    try {
      const { data } = await axios.put(`${API_BASE}/tasks/${id}`, { text: editInput.trim() })
      setTasks(tasks.map(t => t.id === id ? data : t))
      setEditingId(null)
      setEditInput('')
    } catch (err) {
      setError(err.message)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditInput('')
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Task Manager</h1>
        {error && <div className="error">{error}</div>}
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            disabled={loading}
          />
          <button onClick={addTask} disabled={loading || !input.trim()}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        <ul className="task-list">
          {tasks.length === 0 ? (
            <li className="empty">No tasks yet. Add one above!</li>
          ) : (
            tasks.map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                {editingId === task.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(task.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <label className="task-item">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                      />
                      <span>{task.text}</span>
                    </label>
                    <div className="task-actions">
                      <button onClick={() => startEdit(task)}>Edit</button>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
        <div className="stats">
          <span>Total: {tasks.length}</span>
          <span>Completed: {tasks.filter(t => t.completed).length}</span>
          <span>Pending: {tasks.filter(t => !t.completed).length}</span>
        </div>
      </div>
    </div>
  )
}

export default App