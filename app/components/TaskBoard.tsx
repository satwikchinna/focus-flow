"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "../types";
import {
	Clock,
	Music2,
	Volume2,
	VolumeX,
	Play,
	Pause,
	SkipForward,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { musicTracks } from "../data/music";
import clsx from "clsx";

interface TaskBoardProps {
	tasks: Task[];
	timeLimit: number;
	onTaskUpdate: (taskId: string, newStatus: Task["status"]) => void;
	// Removed musicGenre prop to manage it internally
}

const COLUMNS = ["new", "inProgress", "finished"] as const;

const genreList = Object.keys(musicTracks) as Array<keyof typeof musicTracks>;

/**
 * Timer Component
 * Displays the remaining time in a digital clock format with smooth animations.
 */
const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<div className="flex items-center gap-2 animate-pulse">
			<Clock className="w-6 h-6 text-gray-700 dark:text-gray-300" />
			<span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				{formatTime(timeLeft)}
			</span>
		</div>
	);
};

/**
 * MusicControls Component
 * Provides refined controls for playing/pausing music, adjusting volume, and skipping genres.
 */
const MusicControls: React.FC<{
	isPlaying: boolean;
	togglePlayPause: () => void;
	volume: number;
	handleVolumeChange: (newVolume: number[]) => void;
	skipGenre: () => void;
	musicGenre: string;
}> = ({
	isPlaying,
	togglePlayPause,
	volume,
	handleVolumeChange,
	skipGenre,
	musicGenre,
}) => (
	<div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-4xl mx-auto">
		<div className="flex items-center gap-4">
			<Button
				variant="outline"
				size="icon"
				onClick={togglePlayPause}
				className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				aria-label={isPlaying ? "Pause Music" : "Play Music"}
			>
				{isPlaying ? (
					<Pause className="h-5 w-5 text-gray-700 dark:text-gray-300" />
				) : (
					<Play className="h-5 w-5 text-gray-700 dark:text-gray-300" />
				)}
			</Button>
			<Button
				variant="outline"
				size="icon"
				onClick={skipGenre}
				className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				aria-label="Skip Music Genre"
			>
				<SkipForward className="h-5 w-5 text-gray-700 dark:text-gray-300" />
			</Button>
			<div className="flex items-center gap-2">
				{volume === 0 ? (
					<VolumeX className="h-5 w-5 text-gray-700 dark:text-gray-300" />
				) : (
					<Volume2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
				)}
				<Slider
					className="w-32"
					value={[volume]}
					max={1}
					step={0.01}
					onValueChange={handleVolumeChange}
				/>
			</div>
		</div>
		<Badge variant="secondary" className="text-sm capitalize">
			{musicGenre}
		</Badge>
	</div>
);

export default function TaskBoard({
	tasks,
	timeLimit,
	onTaskUpdate,
}: TaskBoardProps) {
	const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const [currentGenreIndex, setCurrentGenreIndex] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const currentGenre = genreList[currentGenreIndex];

	// Initialize audio only once when component mounts
	useEffect(() => {
		const audio = new Audio();
		audio.src = musicTracks[currentGenre];
		audio.loop = true;
		audio.volume = volume;
		audioRef.current = audio;
		audio.play().catch((error) => {
			console.error("Audio playback error:", error);
		});

		// Cleanup on unmount
		return () => {
			audio.pause();
			audio.src = "";
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array ensures this runs once

	// Update audio source when music genre changes
	useEffect(() => {
		if (audioRef.current) {
			const wasPlaying = !audioRef.current.paused;
			audioRef.current.src = musicTracks[currentGenre];
			audioRef.current.load(); // Load the new source
			if (wasPlaying) {
				audioRef.current.play().catch((error) => {
					console.error("Audio playback error:", error);
					setIsPlaying(false);
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentGenre]);

	// Handle volume changes
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	// Handle play/pause
	useEffect(() => {
		if (!audioRef.current) return;

		const playAudio = async () => {
			try {
				if (isPlaying) {
					await audioRef.current?.play();
				} else {
					audioRef.current?.pause();
				}
			} catch (error) {
				console.error("Audio playback error:", error);
				setIsPlaying(false);
			}
		};

		playAudio();
	}, [isPlaying]);

	// Timer countdown
	useEffect(() => {
		if (timeLeft === 0) return; // Stop timer at 0
		const timer = setInterval(() => {
			setTimeLeft((prev) => Math.max(0, prev - 1));
		}, 1000);
		return () => clearInterval(timer);
	}, [timeLeft]);

	const togglePlayPause = () => {
		setIsPlaying((prev) => !prev);
	};

	const handleVolumeChange = (newVolume: number[]) => {
		setVolume(newVolume[0]);
	};

	const skipGenre = () => {
		setCurrentGenreIndex((prevIndex) => (prevIndex + 1) % genreList.length);
	};

	return (
		<div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
			{/* Header Section */}
			<div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
				<div className="flex items-center gap-3">
					<Clock className="w-6 h-6 text-gray-700 dark:text-gray-300" />
					<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
						Task Board
					</h1>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col flex-1 p-8 overflow-auto">
				{/* Timer Section */}
				<div className="flex justify-center mb-8">
					<Timer timeLeft={timeLeft} />
				</div>

				{/* Task Columns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
					{COLUMNS.map((status) => (
						<div key={status} className="space-y-4">
							<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 capitalize">
								{status.replace(/([A-Z])/g, " $1")}
							</h2>
							<div
								className="min-h-[450px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-inner transition-transform transform hover:scale-105"
								onDragOver={(e) => e.preventDefault()}
								onDrop={(e) => {
									const taskId = e.dataTransfer.getData("taskId");
									onTaskUpdate(taskId, status);
								}}
							>
								{tasks
									.filter((task) => task.status === status)
									.map((task) => (
										<Card
											key={task.id}
											draggable
											onDragStart={(e) =>
												e.dataTransfer.setData("taskId", task.id)
											}
											className={clsx(
												"p-4 mb-4 cursor-move rounded-lg shadow-md bg-white dark:bg-gray-800 transition-transform transform hover:translate-y-1 hover:shadow-lg"
											)}
										>
											<h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
												{task.title}
											</h3>
										</Card>
									))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Music Controls Section */}
			<div className="p-6 bg-white dark:bg-gray-800 shadow-md">
				<MusicControls
					isPlaying={isPlaying}
					togglePlayPause={togglePlayPause}
					volume={volume}
					handleVolumeChange={handleVolumeChange}
					skipGenre={skipGenre}
					musicGenre={currentGenre}
				/>
			</div>
		</div>
	);
}
