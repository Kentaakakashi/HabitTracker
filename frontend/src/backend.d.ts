import type { Principal } from "@dfinity/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LogEntry {
    value: string;
    date: Time;
    habitId: bigint;
    notes: string;
}
export type Time = bigint;
export interface Habit {
    id: bigint;
    icon: number;
    habitType: HabitType;
    name: string;
    createdAt: Time;
    color: string;
    unit: string;
    target: bigint;
    frequency: Frequency;
}
export interface Theme {
    backgroundColor: string;
    borderRadius: BorderRadius;
    primaryColor: string;
    accentColor: string;
    cardStyle: CardStyle;
}
export enum BorderRadius {
    none = "none",
    pill = "pill",
    large = "large",
    small = "small"
}
export enum CardStyle {
    shadow = "shadow",
    flat = "flat",
    glass = "glass"
}
export enum Frequency {
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export enum HabitType {
    text = "text",
    boolean_ = "boolean",
    numeric = "numeric"
}
export interface backendInterface {
    addLogEntry(habitId: bigint, date: Time, value: string, notes: string): Promise<void>;
    createHabit(name: string, habitType: HabitType, unit: string, icon: number, color: string, target: bigint, frequency: Frequency): Promise<bigint>;
    deleteHabit(id: bigint): Promise<void>;
    deleteLogEntry(habitId: bigint, date: Time): Promise<void>;
    getAllHabits(): Promise<Array<Habit>>;
    getHabit(id: bigint): Promise<Habit>;
    getLogEntriesByDateRange(startDate: Time, endDate: Time): Promise<Array<LogEntry>>;
    getLogEntriesByHabitAndDateRange(habitId: bigint, startDate: Time, endDate: Time): Promise<Array<LogEntry>>;
    getLogEntriesForHabit(habitId: bigint): Promise<Array<LogEntry>>;
    getTheme(): Promise<Theme | null>;
    saveTheme(newTheme: Theme): Promise<void>;
    updateHabit(id: bigint, name: string, unit: string, icon: number, color: string, target: bigint, frequency: Frequency): Promise<void>;
}
