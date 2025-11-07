export interface WeeklyProgramDTO {
  weekNumber: number;
  weekRange: string;
  mainExercise: string;
  sets: number;
  reps: string;
  intensity: string;
  frequency: string;
  accessories: string[];
  description: string;
  recommendedWeightMin: number;
  recommendedWeightMax: number;
  isLocked: boolean;
  isCompleted: boolean;
}
