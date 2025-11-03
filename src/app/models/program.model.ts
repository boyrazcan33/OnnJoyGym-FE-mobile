export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface DayProgram {
  dayName: string;
  exercises: Exercise[];
}

export interface WeeklyProgram {
  clubName: string;
  level: string;
  goal: string;
  days: DayProgram[];
}
