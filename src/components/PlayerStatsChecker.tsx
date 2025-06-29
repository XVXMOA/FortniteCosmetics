import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface PlayerStatsCheckerProps {
  onBack: () => void;
}

export const PlayerStatsChecker = ({ onBack }: PlayerStatsCheckerProps) => {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setStats(null);
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(username)}`,
        {
          headers: {
            Authorization: "55ce6bdf-632d-42ec-912d-3656f1a3324b"
          }
        }
      );
      const data = await response.json();
      if (data.status === 200 && data.data) {
        setStats(data.data);
      } else {
        setError(data.error || "Player not found.");
      }
    } catch (err) {
      setError("Failed to fetch stats. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format minutes played
  function formatMinutes(minutes: number): string {
    if (!minutes || isNaN(minutes)) return "-";
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    const days = hours / 24;
    if (days < 7) return `${days.toFixed(1)} days`;
    const weeks = days / 7;
    if (weeks < 4) return `${weeks.toFixed(1)} weeks`;
    const months = days / 30.44;
    return `${months.toFixed(1)} months`;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-slate-900 rounded-2xl shadow-lg border border-purple-700">
      <Button onClick={onBack} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">Back</Button>
      <h2 className="text-2xl font-bold text-white mb-4">Player Stats Checker</h2>
      <form onSubmit={fetchStats} className="flex gap-2 mb-6">
        <Input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter Epic Games username"
          className="flex-1"
          required
        />
        <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-orange-500">Check</Button>
      </form>
      {loading && <LoadingSpinner />}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {stats && (
        <div className="space-y-6">
          {/* Main Info Box */}
          <div className="bg-slate-800 rounded-xl p-6 text-white border border-purple-700 shadow-lg">
            <h3 className="text-xl font-bold mb-2">{stats.account.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">🎚️ Level</p>
                <p className="font-semibold">{stats.battlePass.level}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">🏆 Wins</p>
                <p className="font-semibold">{stats.stats.all.overall.wins}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">🎮 Matches</p>
                <p className="font-semibold">{stats.stats.all.overall.matches}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">🔫 Kills</p>
                <p className="font-semibold">{stats.stats.all.overall.kills}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">⚔️ K/D</p>
                <p className="font-semibold">{stats.stats.all.overall.kd}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">🥇 Win %</p>
                <p className="font-semibold">{stats.stats.all.overall.winRate}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">🔟 Top 10</p>
                <p className="font-semibold">{stats.stats.all.overall.top10}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">2️⃣5️⃣ Top 25</p>
                <p className="font-semibold">{stats.stats.all.overall.top25}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">📈 Score</p>
                <p className="font-semibold">{stats.stats.all.overall.score}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">⏱️ Time Played</p>
                <p className="font-semibold">{formatMinutes(stats.stats.all.overall.minutesPlayed)}</p>
              </div>
            </div>
          </div>

          {/* Solo Stats */}
          {stats.stats.all.solo && (
            <div className="bg-slate-800 rounded-xl p-6 text-white border border-blue-700 shadow-lg">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">🥷 Solo Mode</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">🏆 Wins</p>
                  <p className="font-semibold">{stats.stats.all.solo.wins}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🎮 Matches</p>
                  <p className="font-semibold">{stats.stats.all.solo.matches}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🔫 Kills</p>
                  <p className="font-semibold">{stats.stats.all.solo.kills}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">⚔️ K/D</p>
                  <p className="font-semibold">{stats.stats.all.solo.kd}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🥇 Win %</p>
                  <p className="font-semibold">{stats.stats.all.solo.winRate}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🔟 Top 10</p>
                  <p className="font-semibold">{stats.stats.all.solo.top10}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">📈 Score</p>
                  <p className="font-semibold">{stats.stats.all.solo.score}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">⏱️ Time Played</p>
                  <p className="font-semibold">{formatMinutes(stats.stats.all.solo.minutesPlayed)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Duo Stats */}
          {stats.stats.all.duo && (
            <div className="bg-slate-800 rounded-xl p-6 text-white border border-green-700 shadow-lg">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">🧑‍🤝‍🧑 Duo Mode</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">🏆 Wins</p>
                  <p className="font-semibold">{stats.stats.all.duo.wins}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🎮 Matches</p>
                  <p className="font-semibold">{stats.stats.all.duo.matches}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🔫 Kills</p>
                  <p className="font-semibold">{stats.stats.all.duo.kills}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">⚔️ K/D</p>
                  <p className="font-semibold">{stats.stats.all.duo.kd}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🥇 Win %</p>
                  <p className="font-semibold">{stats.stats.all.duo.winRate}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🔟 Top 5</p>
                  <p className="font-semibold">{stats.stats.all.duo.top5}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">📈 Score</p>
                  <p className="font-semibold">{stats.stats.all.duo.score}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">⏱️ Time Played</p>
                  <p className="font-semibold">{formatMinutes(stats.stats.all.duo.minutesPlayed)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Squad Stats */}
          {stats.stats.all.squad && (
            <div className="bg-slate-800 rounded-xl p-6 text-white border border-yellow-700 shadow-lg">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">🪖 Squad Mode</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">🏆 Wins</p>
                  <p className="font-semibold">{stats.stats.all.squad.wins}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🎮 Matches</p>
                  <p className="font-semibold">{stats.stats.all.squad.matches}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🔫 Kills</p>
                  <p className="font-semibold">{stats.stats.all.squad.kills}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">⚔️ K/D</p>
                  <p className="font-semibold">{stats.stats.all.squad.kd}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🥇 Win %</p>
                  <p className="font-semibold">{stats.stats.all.squad.winRate}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">🔟 Top 3</p>
                  <p className="font-semibold">{stats.stats.all.squad.top3}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">📈 Score</p>
                  <p className="font-semibold">{stats.stats.all.squad.score}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">⏱️ Time Played</p>
                  <p className="font-semibold">{formatMinutes(stats.stats.all.squad.minutesPlayed)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 