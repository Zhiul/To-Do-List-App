export const projectCreate = (() => {
  const defaultSection = () => {
    const tasks = [];
    const completedTasks = [];
    return { tasks, completedTasks };
  };

  const newProject = (title, color) => {
    const section = defaultSection();
    const sections = [section];
    const comments = [];
    return {
      title, color, sections, comments,
    };
  };

  const newSection = (title) => {
    const tasks = [];
    const completedTasks = [];
    const expanded = true;
    return {
      title, tasks, completedTasks, expanded,
    };
  };

  const newTask = (title, description, dueDate, priority) => {
    const completed = false;
    const creationDate = new Date();
    const todayID = '';
    const overdueID = '';
    return {
      title,
      description,
      dueDate,
      priority,
      completed,
      creationDate,
      todayID,
      overdueID,
    };
  };

  const newComment = (content) => {
    const date = new Date();
    return { content, date };
  };

  return {
    defaultSection, newSection, newTask, newProject, newComment,
  };
})();

export let toDoProjects;

const initializeToDoProjects = (() => {
  const savedToDoProjects = JSON.parse(localStorage.getItem('toDoProjects'));

  if (savedToDoProjects !== null) {
    toDoProjects = savedToDoProjects;
  } else {
    toDoProjects = (() => {
      const inbox = (() => {
        const title = 'Inbox';
        const section = projectCreate.defaultSection();
        const sections = [section];
        const comments = [];
        return { title, sections, comments };
      })();

      const today = (() => {
        const tasks = [];
        const overdueTasks = [];
        return { tasks, overdueTasks };
      })();

      const projects = [inbox];

      return { projects, today };
    })();
  }
})();

export function addTodayTask(task) {
  const { overdueID } = task;
  if (overdueID !== '') {
    deleteOverdueTask(overdueID);
  }

  const taskIndex = getNewTodayTaskID(task);
  task.todayID = taskIndex;
  toDoProjects.today.tasks.splice(taskIndex, 0, task);
  updateTodayTasksIndixes();
}

export function updateTodayTasksIndixes() {
  toDoProjects.today.tasks.forEach((task) => {
    task.todayID = toDoProjects.today.tasks.indexOf(task);
  });
}

export function updateOverdueTasksIndixes() {
  toDoProjects.today.overdueTasks.forEach((task) => {
    task.overdueID = toDoProjects.today.overdueTasks.indexOf(task);
  });
}

export function deleteTodayTask(todayID) {
  toDoProjects.today.tasks[todayID].todayID = '';
  toDoProjects.today.tasks.splice(todayID, 1);
  updateTodayTasksIndixes();
}

export function deleteOverdueTask(overdueID) {
  toDoProjects.today.overdueTasks[overdueID].overdueID = '';
  toDoProjects.today.overdueTasks.splice(overdueID, 1);
  updateOverdueTasksIndixes();
}

export function getNewTodayTaskID(task) {
  const firstGreaterDate = (todayTask) => todayTask.dueDate > task.dueDate
    || todayTask.creationDate > task.creationDate;
  let taskIndex = toDoProjects.today.tasks.findIndex(firstGreaterDate);
  if (taskIndex === -1) {
    taskIndex = toDoProjects.today.tasks.length;
  }

  return taskIndex;
}

export function getNewOverdueTaskID(task) {
  const { overdueTasks } = toDoProjects.today;

  const firstGreaterDuedate = (overdueTask) => overdueTask.dueDate > task.dueDate
    || (overdueTask.dueDate.startOf('day').ts === task.dueDate.startOf('day').ts
      && overdueTask.creationDate < task.creationDate);

  let taskIndex = overdueTasks.findIndex(firstGreaterDuedate);

  if (taskIndex === -1) {
    taskIndex = overdueTasks.length;
  }

  return taskIndex;
}

export function saveToDoProjects() {
  localStorage.setItem('toDoProjects', JSON.stringify(toDoProjects));
}
