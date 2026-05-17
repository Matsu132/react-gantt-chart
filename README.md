# react-gantt-chart

[![npm version](https://badge.fury.io/js/react-gantt-chart.svg)](https://badge.fury.io/js/react-gantt-chart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The ultimate high-performance, flexible Gantt chart component for modern React.**

`react-gantt-chart` is an ultra-lightweight, high-performance Gantt chart library designed to run **smoothly at 60fps** even when managing large-scale projects with over 10,000 tasks.

Built with a custom **Zero Dependency** architecture, it avoids heavy third-party libraries. By incorporating advanced rendering optimization via Virtual DOM (Virtualization) and native scrolling for seamless horizontal scroll synchronization, it overturns the common perception of Gantt chart libraries as being "heavy", "slow", and "clunky".

---

## 🌟 Why choose `react-gantt-chart`?

- **⚡ Groundbreaking Performance**: Automatically removes off-screen elements from the DOM. Even with tens of thousands of tasks, it only renders the few dozen rows visible on the screen, resulting in zero latency.
- **🎮 Intuitive Interactions**: Seamlessly modify task duration (slide), resize, and update progress rates using drag-and-drop mouse operations.
- **📱 Perfect Scroll Synchronization**: The task tree on the left and the timeline on the right are perfectly synchronized pixel by pixel. No matter how fast you scroll, there is no misalignment or delay.
- **🛠 Flexible Customization**: Highly extensible to fit your project's needs, including custom label formatters, arbitrary locale support (fully supports `en-US`, `ja-JP`, etc.), and task-specific styling.
- **🔒 Type-Safe Reliability (TypeScript)**: Built entirely in TypeScript, ensuring a robust design and allowing you to develop safely with powerful IDE auto-completion support.

---

## 📦 Installation

```bash
npm install react-gantt-chart
```

or

```bash
yarn add react-gantt-chart
```

---

## 🔌 Quick Start

```tsx
import React, { useState } from "react";
import { Gantt, ViewMode, Task } from "react-gantt-chart";
import "react-gantt-chart/dist/style.css";

const initialTasks: Task[] = [
  {
    id: "project-1",
    name: "Product Development Project",
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 15),
    type: "project",
    progress: 45,
    displayOrder: 1,
    hideChildren: false,
  },
  {
    id: "task-1-1",
    name: "Requirement Definition & Design",
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 5),
    type: "task",
    progress: 80,
    project: "project-1",
    displayOrder: 2,
  },
  {
    id: "task-1-2",
    name: "Frontend Development",
    start: new Date(2026, 4, 6),
    end: new Date(2026, 4, 12),
    type: "task",
    progress: 30,
    project: "project-1",
    dependencies: ["task-1-1"],
    displayOrder: 3,
  },
  {
    id: "milestone-1",
    name: "Alpha Release",
    start: new Date(2026, 4, 15),
    end: new Date(2026, 4, 15),
    type: "milestone",
    progress: 0,
    project: "project-1",
    dependencies: ["task-1-2"],
    displayOrder: 4,
  },
];

export const MyGanttChart = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);

  const handleDateChange = (updatedTask: Task, _children: Task[]) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleProgressChange = (updatedTask: Task, _children: Task[]) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t));
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Gantt
        tasks={tasks}
        viewMode={view}
        locale="en-US"
        ganttHeight={500}
        onDateChange={handleDateChange}
        onProgressChange={handleProgressChange}
        onExpanderClick={handleExpanderClick}
      />
    </div>
  );
};
```

---

## 🛠️ API Reference

### `Gantt` Component Props

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tasks` | `Task[]` | **Required** | The array of tasks to display |
| `viewMode` | `ViewMode` | `ViewMode.Day` | The time scale of the calendar (display unit) |
| `locale` | `string` | `"en-GB"` | Localization string. E.g., `"en-US"`, `"ja-JP"` |
| `ganttHeight` | `number` | `0` (Auto) | The total height of the Gantt chart (px) |
| `rowHeight` | `number` | `50` | The height per task row (px) |
| `headerHeight` | `number` | `50` | The height of the calendar and table headers (px) |
| `columnWidth` | `number` | *Depends on ViewMode* | The width per date column (px) |
| `listCellWidth` | `string` | `"155px"` | The total width of the task list on the left |
| `barFill` | `number` | `60` | The vertical ratio of the task bar relative to the row height (%) |
| `barCornerRadius` | `number` | `3` | The border-radius of the task bar (px) |
| `handleWidth` | `number` | `8` | The width of the left/right drag detection area for resizing (px) |
| `fontFamily` | `string` | `"Arial, ..."` | The font family for the entire chart |
| `fontSize` | `string` | `"14px"` | The font size for the entire chart |
| `rtl` | `boolean` | `false` | Enable Right-to-Left (RTL) layout rendering |
| `todayColor` | `string` | `"rgba(...)"` | The background color of the grid representing "today" |

### Event Handlers

| Event Name | Signature | Description |
| :--- | :--- | :--- |
| `onDateChange` | `(task: Task, children: Task[]) => void \| Promise<void>` | Called when a task period change (drag/resize) is completed |
| `onProgressChange` | `(task: Task, children: Task[]) => void \| Promise<void>` | Called when the progress handle is dragged |
| `onExpanderClick` | `(task: Task) => void` | Called when the expand/collapse icon of a project is clicked |
| `onSelect` | `(task: Task, isSelected: boolean) => void` | Called when a task is clicked and its selection state changes |
| `onDoubleClick` | `(task: Task) => void` | Called when a task is double-clicked |
| `onClick` | `(task: Task) => void` | Called when a task is single-clicked |
| `onDelete` | `(task: Task) => void` | Called when a task deletion action occurs |

---

## 🎨 Styling Customization

Each `Task` object can have a `styles` property, allowing you to define individual color designs for each task.

```typescript
export interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  type: TaskType;       // 'task' | 'project' | 'milestone'
  progress: number;     // 0 - 100
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  // ...
}
```

---

## 📄 License

MIT
