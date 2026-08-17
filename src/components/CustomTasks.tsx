import { useState } from "react";
import type { CustomTask } from "../types/DailyRecord";

interface CustomTasksProps {
  tasks: CustomTask[];
  onChange: (tasks: CustomTask[]) => void;
}

export function CustomTasks({ tasks, onChange }: CustomTasksProps) {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(10);

  const addTask = () => {
    const trimmed = title.trim();
    const points = Math.max(0, Math.floor(Number(xp) || 0));
    if (!trimmed || points <= 0) return;

    onChange([
      ...tasks,
      {
        id: createId(),
        title: trimmed,
        xp: points,
        done: false,
      },
    ]);
    setTitle("");
    setXp(10);
  };

  const updateTask = (id: string, patch: Partial<CustomTask>) => {
    onChange(tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };

  const removeTask = (id: string) => {
    onChange(tasks.filter((task) => task.id !== id));
  };

  return (
    <section className="customTasks" aria-labelledby="custom-tasks-title">
      <div className="customTasks__header">
        <div>
          <h3 id="custom-tasks-title">Custom tasks</h3>
          <p>Add one-off work for this day.</p>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="customTaskList">
          {tasks.map((task) => (
            <div className={`customTaskRow ${task.done ? "customTaskRow--done" : ""}`} key={task.id}>
              <label className="customTaskCheck">
                <span className="checkboxWrap">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(event) => updateTask(task.id, { done: event.target.checked })}
                  />
                  <span className="checkboxGlyph" aria-hidden="true" />
                </span>
                <span>
                  {task.title} <span className="xpTag">(+{task.xp})</span>
                </span>
              </label>
              <button type="button" className="textButton" onClick={() => removeTask(task.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="customTaskForm">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addTask();
          }}
          placeholder="Task name"
          aria-label="Custom task name"
        />
        <input
          type="number"
          min="1"
          value={xp}
          onChange={(event) => setXp(Number(event.target.value))}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Custom task XP"
        />
        <button type="button" onClick={addTask}>
          Add
        </button>
      </div>
    </section>
  );
}

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
