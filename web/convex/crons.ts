import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Pair players every 5 seconds
crons.interval(
  "pair players",
  { seconds: 5 },
  internal.matchmaking.pairPlayers,
  {}
);

// Update match timers every minute
crons.interval(
  "update timers",
  { seconds: 60 },
  internal.matches.updateMatchTimers
);

export default crons;
