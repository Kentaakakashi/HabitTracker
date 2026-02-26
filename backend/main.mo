import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat8 "mo:core/Nat8";

actor {
  public type HabitType = {
    #numeric;
    #boolean;
    #text;
  };

  public type Frequency = {
    #daily;
    #weekly;
    #monthly;
  };

  public type Habit = {
    id : Nat;
    name : Text;
    habitType : HabitType;
    unit : Text;
    icon : Nat8;
    color : Text;
    target : Nat;
    frequency : Frequency;
    createdAt : Time.Time;
  };

  module Habit {
    public func compare(h1 : Habit, h2 : Habit) : Order.Order {
      Nat.compare(h1.id, h2.id);
    };
  };

  public type LogEntry = {
    habitId : Nat;
    date : Time.Time;
    value : Text;
    notes : Text;
  };

  public type Streak = {
    current : Nat;
    longest : Nat;
  };

  public type Theme = {
    primaryColor : Text;
    backgroundColor : Text;
    accentColor : Text;
    cardStyle : CardStyle;
    borderRadius : BorderRadius;
  };

  public type CardStyle = {
    #flat;
    #glass;
    #shadow;
  };

  public type BorderRadius = {
    #none;
    #small;
    #large;
    #pill;
  };

  var nextHabitId = 0;

  let habits = Map.empty<Nat, Habit>();
  let logEntries = List.empty<LogEntry>();

  var theme : ?Theme = null;

  // Habits
  public shared ({ caller }) func createHabit(name : Text, habitType : HabitType, unit : Text, icon : Nat8, color : Text, target : Nat, frequency : Frequency) : async Nat {
    let habit : Habit = {
      id = nextHabitId;
      name;
      habitType;
      unit;
      icon;
      color;
      target;
      frequency;
      createdAt = Time.now();
    };
    habits.add(nextHabitId, habit);
    nextHabitId += 1;
    habit.id;
  };

  public shared ({ caller }) func updateHabit(id : Nat, name : Text, unit : Text, icon : Nat8, color : Text, target : Nat, frequency : Frequency) : async () {
    switch (habits.get(id)) {
      case (null) { Runtime.trap("Habit not found") };
      case (?habit) {
        let updated : Habit = {
          id;
          name;
          habitType = habit.habitType;
          unit;
          icon;
          color;
          target;
          frequency;
          createdAt = habit.createdAt;
        };
        habits.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteHabit(id : Nat) : async () {
    habits.remove(id);
    let filtered = logEntries.filter(func(entry) { entry.habitId != id });
    logEntries.clear();
    logEntries.addAll(filtered.values());
  };

  public query ({ caller }) func getHabit(id : Nat) : async Habit {
    switch (habits.get(id)) {
      case (null) { Runtime.trap("Habit not found") };
      case (?habit) { habit };
    };
  };

  public query ({ caller }) func getAllHabits() : async [Habit] {
    habits.values().toArray().sort();
  };

  // Log Entries
  public shared ({ caller }) func addLogEntry(habitId : Nat, date : Time.Time, value : Text, notes : Text) : async () {
    switch (habits.get(habitId)) {
      case (null) { Runtime.trap("Habit not found") };
      case (_) {
        let entry : LogEntry = {
          habitId;
          date;
          value;
          notes;
        };
        logEntries.add(entry);
      };
    };
  };

  public shared ({ caller }) func deleteLogEntry(habitId : Nat, date : Time.Time) : async () {
    switch (habits.get(habitId)) {
      case (null) { Runtime.trap("Habit not found") };
      case (_) {
        let filtered = logEntries.filter(func(entry) { entry.habitId != habitId or entry.date != date });
        logEntries.clear();
        logEntries.addAll(filtered.values());
      };
    };
  };

  public query ({ caller }) func getLogEntriesForHabit(habitId : Nat) : async [LogEntry] {
    logEntries.filter(func(entry) { entry.habitId == habitId }).toArray();
  };

  public query ({ caller }) func getLogEntriesByDateRange(startDate : Time.Time, endDate : Time.Time) : async [LogEntry] {
    logEntries.filter(func(entry) { entry.date >= startDate and entry.date <= endDate }).toArray();
  };

  public query ({ caller }) func getLogEntriesByHabitAndDateRange(habitId : Nat, startDate : Time.Time, endDate : Time.Time) : async [LogEntry] {
    switch (habits.get(habitId)) {
      case (null) { Runtime.trap("Habit not found") };
      case (_) {
        logEntries.filter(func(entry) { entry.habitId == habitId and entry.date >= startDate and entry.date <= endDate }).toArray();
      };
    };
  };

  // Theme
  public shared ({ caller }) func saveTheme(newTheme : Theme) : async () {
    theme := ?newTheme;
  };

  public query ({ caller }) func getTheme() : async ?Theme {
    theme;
  };
};
