"use client";

import { useState } from "react";
import { Task, MusicGenre } from "./types";
import SetupForm from "./components/SetupForm";
import TaskBoard from "./components/TaskBoard";
import CompletionScreen from "./components/CompletionScreen";
import { musicTracks } from "./data/music";

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [timeLimit, setTimeLimit] = useState(0);
	const [musicGenre, setMusicGenre] = useState<MusicGenre>("lofi");
	const [started, setStarted] = useState(false);
	const [audio] = useState(() => {
		if (typeof Audio !== "undefined") {
			return new Audio();
		}
		return null; // or handle the case where Audio is not available
	});

	const handleStart = (taskList: string[], time: number, genre: MusicGenre) => {
		const newTasks = taskList.map((title) => ({
			id: Math.random().toString(36).substr(2, 9),
			title,
			status: "new" as const,
		}));
		setTasks(newTasks);
		setTimeLimit(time);
		setMusicGenre(genre);
		setStarted(true);
	};

	const handleTaskUpdate = (taskId: string, newStatus: Task["status"]) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, status: newStatus } : task
			)
		);
	};

	const handleRestart = () => {
		setTasks([]);
		setStarted(false);
		audio?.pause();
		audio ? (audio.currentTime = 0) : null;
	};

	const allTasksFinished =
		tasks.length > 0 && tasks.every((task) => task.status === "finished");

	if (!started) {
		return <SetupForm onStart={handleStart} />;
	}

	if (allTasksFinished) {
		return <CompletionScreen onRestart={handleRestart} />;
	}

	return (
		<TaskBoard
			tasks={tasks}
			timeLimit={timeLimit}
			onTaskUpdate={handleTaskUpdate}
		/>
	);
}
