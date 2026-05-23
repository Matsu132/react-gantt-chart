# @matsu1321/react-gantt-chart

[![npm version](https://badge.fury.io/js/%40matsu1321%2Freact-gantt-chart.svg)](https://badge.fury.io/js/%40matsu1321%2Freact-gantt-chart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](#english) | [日本語](#japanese)**

---

<a id="english"></a>

## 🚀 @matsu1321/react-gantt-chart

**The ultimate high-performance, flexible Gantt chart component for modern React.**

A zero-dependency, ultra-lightweight Gantt chart library that runs **smoothly at 60fps** even with large-scale projects of over 10,000 tasks.

Built with a custom **Zero Dependency** architecture, it incorporates **vertical virtual scrolling (Virtualization)** and **jitter-free horizontal scroll synchronization**, eliminating all performance degradation regardless of task count.

---

### 🌟 Features

- **⚡ Groundbreaking Performance (Virtualization)**: Automatically removes off-screen elements from the DOM. Even with 10,000+ tasks, only the visible rows are rendered — zero latency.
- **🔄 Jitter-free Horizontal Scroll**: Uses a single scroll container with `position: sticky` on the calendar header, completely eliminating the 2-frame delay caused by state-based sync. Smooth even with massive data.
- **↕️ Perfect Bidirectional Scroll Sync**: Left task-name table and right timeline scroll in perfect pixel-level sync with no desync or delay.
- **📐 High-precision Linear Interpolation**: Pixel-perfect coordinate calculation that is unaffected by column-width or month-day differences, with full Daylight Saving Time (DST) support.
- **🎮 Intuitive Drag & Drop**: Modify task duration (slide), resize, and update progress rates with natural mouse operations.
- **📅 Rich View Modes**: Switch between Hour / QuarterDay / HalfDay / Day / Week / Month / Year views.
- **🌍 Localization Support**: Calendar headers and tooltips can be displayed in any locale such as `ja-JP`.
- **🔒 Type-Safe (TypeScript)**: Fully written in TypeScript with bundled type definitions (`.d.ts`).

---

### 📦 Installation

```bash
npm install @matsu1321/react-gantt-chart
```

or

```bash
yarn add @matsu1321/react-gantt-chart
```

---

### 🔌 Quick Start

```tsx
import React, { useState } from 'react';
import { Gantt, ViewMode, Task } from '@matsu1321/react-gantt-chart';
import '@matsu1321/react-gantt-chart/dist/style.css';

const initialTasks: Task[] = [
  {
    id: 'project-1',
    name: 'Product Development Project',
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 15),
    type: 'project',
    progress: 45,
    displayOrder: 1,
    hideChildren: false,
  },
  {
    id: 'task-1-1',
    name: 'Requirement Definition & Design',
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 5),
    type: 'task',
    progress: 80,
    project: 'project-1',
    displayOrder: 2,
  },
  {
    id: 'task-1-2',
    name: 'Frontend Development',
    start: new Date(2026, 4, 6),
    end: new Date(2026, 4, 12),
    type: 'task',
    progress: 30,
    project: 'project-1',
    dependencies: ['task-1-1'],
    displayOrder: 3,
  },
  {
    id: 'milestone-1',
    name: 'Alpha Release',
    start: new Date(2026, 4, 15),
    end: new Date(2026, 4, 15),
    type: 'milestone',
    progress: 0,
    project: 'project-1',
    dependencies: ['task-1-2'],
    displayOrder: 4,
  },
];

export const MyGanttChart = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);

  const handleDateChange = (updatedTask: Task, _children: Task[]) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleProgressChange = (updatedTask: Task, _children: Task[]) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t)),
    );
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
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

### 🛠️ API Reference

#### `Task` Interface

| Property | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | ✅ | Unique identifier for the task |
| `name` | `string` | ✅ | Display name of the task |
| `start` | `Date` | ✅ | Start date of the task |
| `end` | `Date` | ✅ | End date of the task |
| `type` | `'task' \| 'project' \| 'milestone'` | ✅ | Task type |
| `progress` | `number` | ✅ | Progress percentage (0–100) |
| `displayOrder` | `number` | | Display order index |
| `project` | `string` | | Parent project ID |
| `dependencies` | `string[]` | | Array of dependency task IDs |
| `hideChildren` | `boolean` | | Whether to collapse child tasks (for `project` type) |
| `isDisabled` | `boolean` | | Disables all interactions for this task |
| `styles` | `TaskStyles` | | Per-task color customization (see [Styling](#styling)) |

#### `ViewMode` Enum

```ts
enum ViewMode {
  Hour       = "Hour",
  QuarterDay = "Quarter Day",
  HalfDay    = "Half Day",
  Day        = "Day",
  Week       = "Week",
  Month      = "Month",
  Year       = "Year",
}
```

#### `Gantt` Component Props

**Display Options**

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tasks` | `Task[]` | **Required** | Array of tasks to display |
| `viewMode` | `ViewMode` | `ViewMode.Day` | Calendar time scale |
| `locale` | `string` | `"en-GB"` | Locale string (e.g., `"en-US"`, `"ja-JP"`) |
| `ganttHeight` | `number \| string` | `0` (auto) | Total height of the Gantt chart (px or CSS string) |
| `rowHeight` | `number` | `50` | Height per task row (px) |
| `headerHeight` | `number` | `50` | Height of calendar and table headers (px) |
| `columnWidth` | `number` | *ViewMode dependent* | Width per date column (px) |
| `listCellWidth` | `string` | `"155px"` | Width of the left task-name list |
| `rtl` | `boolean` | `false` | Enable Right-to-Left (RTL) layout |
| `viewDate` | `Date` | | Date to scroll the calendar to on mount |
| `preStepsCount` | `number` | | Number of column steps to prepend before the first task |

**Styling Options**

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `barFill` | `number` | `60` | Task bar height ratio relative to row height (%) |
| `barCornerRadius` | `number` | `3` | Task bar border-radius (px) |
| `handleWidth` | `number` | `8` | Drag-handle detection width for resizing (px) |
| `fontFamily` | `string` | `"Arial, ..."` | Font family for the entire chart |
| `fontSize` | `string` | `"14px"` | Font size for the entire chart |
| `todayColor` | `string` | `"rgba(...)"` | Background color of the "today" grid column |
| `arrowColor` | `string` | | Color of dependency arrows |
| `arrowIndent` | `number` | | Indent of dependency arrows (px) |
| `barProgressColor` | `string` | | Progress fill color for task bars |
| `barProgressSelectedColor` | `string` | | Progress fill color when a task bar is selected |
| `barBackgroundColor` | `string` | | Background color of task bars |
| `barBackgroundSelectedColor` | `string` | | Background color when a task bar is selected |
| `projectProgressColor` | `string` | | Progress fill color for project bars |
| `projectProgressSelectedColor` | `string` | | Progress fill color when a project bar is selected |
| `projectBackgroundColor` | `string` | | Background color of project bars |
| `projectBackgroundSelectedColor` | `string` | | Background color when a project bar is selected |
| `milestoneBackgroundColor` | `string` | | Background color of milestones |
| `milestoneBackgroundSelectedColor` | `string` | | Background color when a milestone is selected |

**Event Handlers**

| Event | Signature | Description |
| :--- | :--- | :--- |
| `onDateChange` | `(task: Task, children: Task[]) => void \| boolean \| Promise<void \| boolean>` | Fired when a task's period is changed by dragging or resizing. Return `false` to undo. |
| `onProgressChange` | `(task: Task, children: Task[]) => void \| boolean \| Promise<void \| boolean>` | Fired when the progress handle is dragged. Return `false` to undo. |
| `onExpanderClick` | `(task: Task) => void` | Fired when a project's expand/collapse icon is clicked |
| `onSelect` | `(task: Task, isSelected: boolean) => void` | Fired when a task is clicked and its selection state changes |
| `onDoubleClick` | `(task: Task) => void` | Fired when a task is double-clicked |
| `onClick` | `(task: Task) => void` | Fired when a task is single-clicked |
| `onDelete` | `(task: Task) => void \| boolean \| Promise<void \| boolean>` | Fired when a task deletion is triggered. Return `false` to undo. |
| `timeStep` | `number` | Time step in milliseconds applied when dragging a task |

**Custom Render Props**

| Property | Type | Description |
| :--- | :--- | :--- |
| `calendarTopHeaderFormat` | `(date: Date, viewMode: ViewMode) => string` | Custom formatter for the top row of the calendar header |
| `calendarBottomHeaderFormat` | `(date: Date, viewMode: ViewMode) => string` | Custom formatter for the bottom row of the calendar header |
| `TooltipContent` | `React.FC<{ task, fontSize, fontFamily }>` | Custom tooltip component shown on task hover |
| `TaskListHeader` | `React.FC<{ headerHeight, rowWidth, fontFamily, fontSize }>` | Custom component for the task list header |
| `TaskListTable` | `React.FC<{ rowHeight, rowWidth, fontFamily, fontSize, locale, tasks, selectedTaskId, setSelectedTask, onExpanderClick }>` | Custom component for the task list rows |

---

<a id="styling"></a>

### 🎨 Styling Customization

#### Per-Task Styles

Each `Task` object accepts a `styles` property for individual color overrides:

```typescript
const myTask: Task = {
  id: 'task-1',
  name: 'Custom Styled Task',
  start: new Date(2026, 4, 1),
  end: new Date(2026, 4, 10),
  type: 'task',
  progress: 60,
  styles: {
    backgroundColor: '#4f46e5',
    backgroundSelectedColor: '#6366f1',
    progressColor: '#a5b4fc',
    progressSelectedColor: '#c7d2fe',
  },
};
```

#### Custom CSS

Import the base stylesheet and override CSS custom properties or class names as needed:

```tsx
import '@matsu1321/react-gantt-chart/dist/style.css';
```

---

### 📄 License

MIT

---
---

<a id="japanese"></a>

## 🚀 @matsu1321/react-gantt-chart（日本語）

10,000件以上の大規模タスクを登録しても **60fps で快適かつ滑らかに動作する、React 向け超軽量・高性能ガントチャートコンポーネントライブラリ** です。

ゼロ依存・完全独自実装のコアアーキテクチャに、**垂直仮想スクロール（Virtualization）** と **ガタつきのない横スクロール同期** を組み込み、膨大なタスクが登録されても一切のパフォーマンス劣化がありません。

---

### 🌟 主な特徴

- **⚡ 圧倒的なパフォーマンス (Virtualization)**: 画面外の要素を DOM から自動排除し、常に表示領域内の数十行のみを描画。10,000件以上のタスクでも遅延ゼロ。
- **🔄 ガタつきのない横スクロール**: カレンダーヘッダーに `position: sticky` を採用した単一スクロールコンテナ構造により、state 経由の2フレーム遅延を完全排除。大量データでも滑らか。
- **↕️ 滑らかな双方向スクロール同期**: 左側のタスク名テーブルと右側のタイムラインの縦スクロールをピクセル単位で完全に同期連動。
- **📐 高精度な線形補間配置**: 日付列幅・月日数の違いに左右されないピクセルパーフェクトな座標計算（サマータイム対応）。
- **🎮 ドラッグ＆ドロップインタラクション**: 期間の移動（スライド）、伸縮（リサイズ）、進捗率の変更をマウス操作で直感的に操作可能。
- **📅 豊富なビューモード**: 時間 / 6時間 / 半日 / 日 / 週 / 月 / 年 の切り替えに対応。
- **🌍 ローカライズ対応**: カレンダー日付ヘッダーやツールチップを `ja-JP` など任意のロケールで表示可能。
- **🔒 型安全な設計 (TypeScript)**: TypeScript で完全記述されており、型定義ファイル（`.d.ts`）を同梱。

---

### 📦 インストール

```bash
npm install @matsu1321/react-gantt-chart
```

または

```bash
yarn add @matsu1321/react-gantt-chart
```

---

### 🔌 クイックスタート

```tsx
import React, { useState } from 'react';
import { Gantt, ViewMode, Task } from '@matsu1321/react-gantt-chart';
import '@matsu1321/react-gantt-chart/dist/style.css';

const initialTasks: Task[] = [
  {
    id: 'project-1',
    name: '製品開発プロジェクト',
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 15),
    type: 'project',
    progress: 45,
    displayOrder: 1,
    hideChildren: false,
  },
  {
    id: 'task-1-1',
    name: '要件定義・設計',
    start: new Date(2026, 4, 1),
    end: new Date(2026, 4, 5),
    type: 'task',
    progress: 80,
    project: 'project-1',
    displayOrder: 2,
  },
  {
    id: 'task-1-2',
    name: 'フロントエンド開発',
    start: new Date(2026, 4, 6),
    end: new Date(2026, 4, 12),
    type: 'task',
    progress: 30,
    project: 'project-1',
    dependencies: ['task-1-1'],
    displayOrder: 3,
  },
  {
    id: 'milestone-1',
    name: 'アルファ版リリース',
    start: new Date(2026, 4, 15),
    end: new Date(2026, 4, 15),
    type: 'milestone',
    progress: 0,
    project: 'project-1',
    dependencies: ['task-1-2'],
    displayOrder: 4,
  },
];

export const MyGanttChart = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);

  const handleDateChange = (updatedTask: Task, _children: Task[]) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleProgressChange = (updatedTask: Task, _children: Task[]) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t)),
    );
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Gantt
        tasks={tasks}
        viewMode={view}
        locale="ja-JP"
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

### 🛠️ API リファレンス

#### `Task` インターフェース

| プロパティ名 | 型 | 必須 | 説明 |
| :--- | :--- | :---: | :--- |
| `id` | `string` | ✅ | タスクの一意識別子 |
| `name` | `string` | ✅ | タスクの表示名 |
| `start` | `Date` | ✅ | タスクの開始日 |
| `end` | `Date` | ✅ | タスクの終了日 |
| `type` | `'task' \| 'project' \| 'milestone'` | ✅ | タスクの種別 |
| `progress` | `number` | ✅ | 進捗率（0〜100） |
| `displayOrder` | `number` | | 表示順のインデックス |
| `project` | `string` | | 親プロジェクトのID |
| `dependencies` | `string[]` | | 依存するタスクIDの配列 |
| `hideChildren` | `boolean` | | 子タスクを折りたたむか（`project` 型のみ） |
| `isDisabled` | `boolean` | | このタスクのすべてのインタラクションを無効化する |
| `styles` | `TaskStyles` | | タスクごとの個別カラー設定（[スタイリング](#styling-ja) 参照） |

#### `ViewMode` 列挙型

```ts
enum ViewMode {
  Hour       = "Hour",       // 時間
  QuarterDay = "Quarter Day", // 6時間
  HalfDay    = "Half Day",   // 半日
  Day        = "Day",        // 日
  Week       = "Week",       // 週
  Month      = "Month",      // 月
  Year       = "Year",       // 年
}
```

#### `Gantt` コンポーネント Props

**表示設定**

| プロパティ名 | 型 | デフォルト値 | 説明 |
| :--- | :--- | :--- | :--- |
| `tasks` | `Task[]` | **必須** | 表示対象のタスク配列 |
| `viewMode` | `ViewMode` | `ViewMode.Day` | カレンダーのタイムスケール（表示単位） |
| `locale` | `string` | `"en-GB"` | ローカライズ設定。日本語表示は `"ja-JP"` を指定 |
| `ganttHeight` | `number \| string` | `0`（自動） | ガントチャート全体の高さ（px または CSS 文字列） |
| `rowHeight` | `number` | `50` | タスク行あたりの高さ（px） |
| `headerHeight` | `number` | `50` | カレンダーヘッダーの高さ（px） |
| `columnWidth` | `number` | *ViewMode 依存* | 日付列あたりの幅（px） |
| `listCellWidth` | `string` | `"155px"` | 左側タスク名リスト全体の横幅 |
| `rtl` | `boolean` | `false` | 右から左（RTL）レイアウト表示 |
| `viewDate` | `Date` | | マウント時にスクロールする日付 |
| `preStepsCount` | `number` | | 最初のタスクの前に追加する列ステップ数 |

**スタイリング設定**

| プロパティ名 | 型 | デフォルト値 | 説明 |
| :--- | :--- | :--- | :--- |
| `barFill` | `number` | `60` | 行高さに対してタスクバーが占める縦幅の割合 (%) |
| `barCornerRadius` | `number` | `3` | タスクバーの角丸半径（px） |
| `handleWidth` | `number` | `8` | リサイズ操作時の左右ドラッグ検出幅（px） |
| `fontFamily` | `string` | `"Arial, ..."` | チャート全体のフォントファミリー |
| `fontSize` | `string` | `"14px"` | チャート全体のフォントサイズ |
| `todayColor` | `string` | `"rgba(...)"` | 「今日」の日付列を示すグリッド背景色 |
| `arrowColor` | `string` | | 依存関係矢印の色 |
| `arrowIndent` | `number` | | 依存関係矢印のインデント（px） |
| `barProgressColor` | `string` | | タスクバーの進捗塗りつぶし色 |
| `barProgressSelectedColor` | `string` | | 選択時のタスクバー進捗塗りつぶし色 |
| `barBackgroundColor` | `string` | | タスクバーの背景色 |
| `barBackgroundSelectedColor` | `string` | | 選択時のタスクバー背景色 |
| `projectProgressColor` | `string` | | プロジェクトバーの進捗塗りつぶし色 |
| `projectProgressSelectedColor` | `string` | | 選択時のプロジェクトバー進捗塗りつぶし色 |
| `projectBackgroundColor` | `string` | | プロジェクトバーの背景色 |
| `projectBackgroundSelectedColor` | `string` | | 選択時のプロジェクトバー背景色 |
| `milestoneBackgroundColor` | `string` | | マイルストーンの背景色 |
| `milestoneBackgroundSelectedColor` | `string` | | 選択時のマイルストーン背景色 |

**イベントハンドラー**

| イベント名 | シグネチャ | 説明 |
| :--- | :--- | :--- |
| `onDateChange` | `(task: Task, children: Task[]) => void \| boolean \| Promise<void \| boolean>` | ドラッグによるタスク期間変更・リサイズが完了したときに呼ばれます。`false` を返すと操作を取り消します |
| `onProgressChange` | `(task: Task, children: Task[]) => void \| boolean \| Promise<void \| boolean>` | 進捗率変更ハンドルをドラッグしたときに呼ばれます。`false` を返すと操作を取り消します |
| `onExpanderClick` | `(task: Task) => void` | プロジェクトの展開・縮小アイコンをクリックしたときに呼ばれます |
| `onSelect` | `(task: Task, isSelected: boolean) => void` | タスクをクリックして選択状態が切り替わったときに呼ばれます |
| `onDoubleClick` | `(task: Task) => void` | タスクをダブルクリックしたときに呼ばれます |
| `onClick` | `(task: Task) => void` | タスクをシングルクリックしたときに呼ばれます |
| `onDelete` | `(task: Task) => void \| boolean \| Promise<void \| boolean>` | タスクの削除操作が行われたときに呼ばれます。`false` を返すと操作を取り消します |
| `timeStep` | `number` | タスクをドラッグ操作する際の時間ステップ（ミリ秒） |

**カスタムレンダリング Props**

| プロパティ名 | 型 | 説明 |
| :--- | :--- | :--- |
| `calendarTopHeaderFormat` | `(date: Date, viewMode: ViewMode) => string` | カレンダーヘッダー上段の日付表示をカスタムするフォーマッター |
| `calendarBottomHeaderFormat` | `(date: Date, viewMode: ViewMode) => string` | カレンダーヘッダー下段の日付表示をカスタムするフォーマッター |
| `TooltipContent` | `React.FC<{ task, fontSize, fontFamily }>` | タスクホバー時に表示されるカスタムツールチップコンポーネント |
| `TaskListHeader` | `React.FC<{ headerHeight, rowWidth, fontFamily, fontSize }>` | タスクリストのヘッダーをカスタムするコンポーネント |
| `TaskListTable` | `React.FC<{ rowHeight, rowWidth, fontFamily, fontSize, locale, tasks, selectedTaskId, setSelectedTask, onExpanderClick }>` | タスクリストの行をカスタムするコンポーネント |

---

<a id="styling-ja"></a>

### 🎨 スタイリングのカスタマイズ

#### タスクごとのスタイル設定

各タスクオブジェクト（`Task`）には `styles` プロパティを設定でき、タスクごとに個別のカラーデザインを定義できます。

```typescript
const myTask: Task = {
  id: 'task-1',
  name: 'カスタムスタイルタスク',
  start: new Date(2026, 4, 1),
  end: new Date(2026, 4, 10),
  type: 'task',
  progress: 60,
  styles: {
    backgroundColor: '#4f46e5',
    backgroundSelectedColor: '#6366f1',
    progressColor: '#a5b4fc',
    progressSelectedColor: '#c7d2fe',
  },
};
```

#### カスタム CSS

ベーススタイルシートをインポートした上で、CSS カスタムプロパティやクラス名をオーバーライドしてください。

```tsx
import '@matsu1321/react-gantt-chart/dist/style.css';
```

---

### 📄 ライセンス

MIT
