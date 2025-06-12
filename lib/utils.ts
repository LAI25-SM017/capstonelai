import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Subject mapping
const subjects = [
  "Business Finance",
  "Graphic Design",
  "Web Development",
  "Musical Instruments",
];

export const subjectToNum: Record<string, number> = Object.fromEntries(
  subjects.map((subject, index) => [subject, index + 1])
);

export const subjectToWord: Record<number, string> = Object.fromEntries(
  subjects.map((subject, index) => [index + 1, subject])
);

// Level mapping
const levels = [
  "Beginner Level",
  "Intermediate Level",
  "Expert Level",
  "All Levels"
];

export const levelToNum: Record<string, number> = Object.fromEntries(
  levels.map((level, index) => [level, index + 1])
);

export const levelToWord: Record<number, string> = Object.fromEntries(
  levels.map((level, index) => [index + 1, level])
);
