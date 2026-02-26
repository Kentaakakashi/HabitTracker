# Specification

## Summary
**Goal:** Build HabitFlow, a full-featured habit tracking web app with a Motoko backend and a rich, animated frontend supporting multiple visual themes.

**Planned changes:**

### Backend (Motoko actor)
- Store habit definitions (id, name, type, unit, icon, color, target, frequency)
- Store daily log entries (habitId, date, value, notes)
- Calculate and return current streak and longest streak per habit
- Persist and retrieve user theme preference
- Expose CRUD endpoints for habits, log entries, and theme preference
- Query log entries by date range for analytics

### Habit Types
- Eight built-in habit types: Water, Calories, Exercise, Weight, Sleep, Study, Pills, To-Dos
- Each type has default unit, icon, and a type-appropriate input control (slider, number input, checkbox, task list, etc.)
- Pills type uses checkbox-style completion; To-Dos type supports adding, completing, and removing tasks

### Custom Habit Builder
- Modal/page to create a custom habit with name, unit label, icon (preset set), color, daily target, and input type (numeric, boolean, text)
- Custom habits appear alongside built-in habits and support edit/delete

### Dashboard
- Habit cards with animated circular progress rings showing today's value vs. target
- Ring animates on load and on value update; distinct color when target is met; percentage label inside ring
- Staggered Framer Motion entry animations for habit cards

### Streak & Heatmap
- Current and longest streak displayed on each habit card
- GitHub-style 365-day contribution heatmap per habit (color intensity based on value vs. target), accessible from habit detail view

### Analytics Page
- Selectable habit view with a 30-day daily value line/bar chart, weekly average bar chart, and goal completion rate stat card
- Built with Recharts; responsive on mobile

### Theme System
- Five pre-built themes: Minimal, Glassmorphism, Neon Dark, Nature, Retro
- Each theme defines color palette, border radii, card styles, and typography weight
- Glassmorphism uses backdrop-blur and semi-transparent cards; Neon Dark uses dark backgrounds with glowing accents
- Theme switcher in settings panel; change applied globally without page reload; persisted via backend

### Custom Theme Builder
- Color pickers for primary, background, and accent colors
- Card style (flat/glass/shadow) and border radius (none/small/large/pill) selectors
- Live preview; saved custom theme appears as a selectable option

### Animations (Framer Motion)
- Smooth page/view transitions
- Staggered habit card entry on dashboard load
- Progress ring draw animation on mount and update
- Celebratory micro-animation (confetti or pulse) on daily goal completion
- Log entry submission confirmation animation
- Reduced-motion preference respected

### Layout & Navigation
- Default Minimal theme (off-white/charcoal, clean cards, bold sans-serif) on first load
- Fixed bottom tab bar on mobile; left sidebar on desktop

**User-visible outcome:** Users can track multiple habits across eight built-in types or custom types, log daily values, view animated progress rings and streaks, explore analytics charts and a yearly heatmap, and personalize the app with five distinct themes or a fully custom theme — all persisted on-chain without login.
