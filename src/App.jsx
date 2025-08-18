import {useState} from "react";

function App() {

  const [tasks, setTask] = useState([]);

  const [sortType, setSortType] = useState('date') // Priority
  const [sortOrder, setSortOrder] = useState('asc')

  const [openSection, setOpenSection] = useState(
      {taskList:false,
          tasks:true,
        completedTasks:true,
      }
  );

  function toggleSection(section){
    setOpenSection((prev)=>({
      ...prev,
      [section]: !prev[section],
    }))
  }

  function addTask(task){
    setTask([...tasks, {...task, completed: false, id:Date.now()}]);
  }
 console.log(tasks)

  // console.log(completedTasks);

  function deleteTask(id){
    setTask(tasks.filter(task=>task.id !== id))
  }

  function completeTask(id){
    setTask(tasks.map((task) => (task.id === id ? {...task, completed:true} : task)));
  }

  function sortTask(tasks){
    return tasks.slice().sort((a,b) => {
      if (sortType === 'priority' ) {
        const priorityOrder = {High: 1, NichtBesonders: 2, Niedrig:3};
        return sortOrder === 'asc' ? priorityOrder[a.priority] - priorityOrder[b.priority] :
            priorityOrder[b.priority] - priorityOrder[a.priority];
      }else {
        return sortOrder === 'asc' ? (new Date(a.deadLine) - new Date(b.deadLine)) :
            (new Date(b.deadLine) - new Date(a.deadLine))
      }
    });


  }

  function toggleSortOrder(type){
    if(sortType === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    }else{
      setSortType(type);
      setSortOrder('asc');
    }

  }


  const activeTasks = sortTask(tasks.filter((task) =>!task.completed));
  const completedTasks = tasks.filter((task) =>task.completed);









  return <div className="app">
    <div className="task-container">
      <h1>Task List with Priority</h1>
      <button className={`close-button ${openSection.taskList ? 'open' :''}`}
      onClick={()=>toggleSection('taskList')}
      >
        +
      </button>
      {openSection.taskList && <TaskForm addTask={addTask}/>}
    </div>
    <div className="task-container">
      <h2>Tasks</h2>
      <button className={`close-button ${openSection.tasks ? 'open' :''}`}
              onClick={()=>toggleSection('tasks')}
      >+</button>
      <div className='sort-controls'>
        <button className={`sort-button ${sortType === 'date' ? 'active' : ''}`} onClick={()=> toggleSortOrder('date')}>
          By Date {sortType === 'date' && (sortOrder === 'asc' ? '\u2191' : '\u2193')}
        </button>
        <button className={`sort-button ${sortType === 'priority' ? 'active' : ''}`}  onClick={()=> toggleSortOrder('priority')}>
          By Rate  {sortType === 'priority' && (sortOrder === 'asc' ? '\u2191' : '\u2193')}
        </button>
      </div>
      {openSection.tasks && <TaskList  completeTask={completeTask} deleteTask={deleteTask} activeTasks={activeTasks}/>}
    </div>

    <div className="completed-task-container">
      <h2>Completed Tasks</h2>
      <button className={`close-button ${openSection.completedTasks ? 'open' :''}`}
      onClick={()=>toggleSection('completedTasks')}
      >+</button>
      {openSection.completedTasks && <CompletedTaskList completedTasks={completedTasks}
                                                        deleteTasks={deleteTask}/>}
    </div>
<Footer/>
  </div>;
}


function TaskForm({addTask}){
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Niedrig');
  const [deadLine, setDeadLine] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadLine) {
      addTask({title, priority, deadLine});
      setTitle('');
      setPriority('Niedrig');
      setDeadLine('');
    }
  }

  return <form action='' className="task-form" onSubmit={handleSubmit}>
    <input type='text'
           value={title}
           placeholder={'placeholder'}
           required
           onChange={(e)=>setTitle(e.target.value)}
    />
    <select value={priority}
    onChange={(e)=>setPriority(e.target.value)}
    >
      <option value='High'>High</option>
      <option value='NichtBesonders'> Nicht Besonders</option>
      <option value='Niedrig'>Niedrig</option>
    </select>
    <input type='datetime-local'
           required value={deadLine}
          onChange={(e)=>setDeadLine(e.target.value)}
    />
    <button type='submit'>Add task</button>
  </form>
}

function TaskList({activeTasks, completeTask, deleteTask}){
  return <ul className='task-list'>
    {activeTasks.map((task)=>(<TaskItem
        task={task}
        key={task.id}
        deleteTask={deleteTask}
        completeTask={completeTask}
        />
        ))}

  </ul>
}

function CompletedTaskList({ completedTasks, deleteTasks }){
  return <ul className='completed-task-list'>
    {completedTasks.map((task) => ( <TaskItem
        task={task}
        key={task.id}
        deleteTask={deleteTasks}
    /> ))}
  </ul>
}

function TaskItem({task, completeTask, deleteTask}){
   const {title, priority, deadLine, id} = task;

  return <li className={`task-item ${priority.toLowerCase()}`}>

    <div className='task-info'>
      <div>
        {title} <strong>{priority}</strong>
      </div>

      <div className='task-deadline'>
        Due: {new Date(deadLine).toLocaleString()}

      </div>
    </div>
    <div className='task-buttons'>
      {!task.completed && (
          <button
              className="complete-button"
              onClick={() => completeTask(id)}
          >
            DONE
          </button>
      )}
    <button className="delete-button" onClick={() => deleteTask(id)}>DEL</button>
    </div>
  </li>
}


function Footer(){
  return <footer className='footer'>
    <p>Footer</p>

  </footer>
}

export default App;
