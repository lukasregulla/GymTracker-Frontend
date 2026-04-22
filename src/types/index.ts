export interface ExerciseDto {
  id: number
  name: string
  muscleGroup: string
  notes: string
  personalBest: number | null
}

export interface ExerciseProgressDto {
  exerciseId: number
  exerciseName: string
  personalBest: number
  history: ProgressPointDto[]
}

export interface ProgressPointDto {
  date: string
  bestWeight: number
  totalReps: number
  totalSets: number
}

export interface TemplateDto {
  id: number
  name: string
  description: string | null
  dayOfWeek: string | null
}

export interface TemplateDetailDto extends TemplateDto {
  exercises: TemplateExerciseDto[]
}

export interface TemplateExerciseDto {
  templateExerciseId: number
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  orderIndex: number
  defaultSets: number
  defaultReps: number
}

export interface SessionDto {
  id: number
  name: string | null
  scheduledDate: string | null
  isCompleted: boolean
  completedAt: string | null
  notes: string | null
  templateId: number | null
  templateName: string | null
  sessionType: string
}

export interface SessionDetailDto extends SessionDto {
  exercises: SessionExerciseDto[]
}

export interface SessionExerciseDto {
  sessionExerciseId: number
  exerciseId: number
  exerciseName: string
  muscleGroup: string | null
  orderIndex: number
  sets: SetDto[]
}

export interface SetDto {
  id: number
  setNumber: number
  weightKg: number
  reps: number
  isPersonalBest: boolean
  loggedAt: string
}

export interface WeeklyDashboardDto {
  weekStart: string
  weekEnd: string
  totalScheduled: number
  totalCompleted: number
  sessions: SessionDto[]
}

export interface RunSessionDto {
  id: number
  name: string | null
  scheduledDate: string | null
  completedAt: string | null
  isCompleted: boolean
  notes: string
  distanceKm: number
  durationSeconds: number
  averagePaceSecondsPerKm: number
  runType: string | null
}
