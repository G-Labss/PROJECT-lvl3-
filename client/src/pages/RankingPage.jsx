import React, { useState, useEffect, useMemo } from "react";
import { Trophy, TrendingUp, Award, Medal, Search } from "lucide-react";
import { bookingAPI } from "../services/api";
import { GOLD, NTRP_LEVELS } from "../constants";

const MEDAL_COLORS = [GOLD, "#9ca3af", "#cd7f32"];
const getMedalColor = (i) => MEDAL_COLORS[i] ?? "#444";

const RankingPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lessons");

  useEffect(() => {
    bookingAPI
      .getRankings()
      .then((res) => setStudents(res.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = students.filter((s) =>
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (sortBy === "ntrp")
      list.sort((a, b) => (b.ntrpRating ?? 0) - (a.ntrpRating ?? 0));
    if (sortBy === "lessons")
      list.sort((a, b) => b.totalLessons - a.totalLessons);
    return list;
  }, [students, searchTerm, sortBy]);

  const topRated = [...students].sort(
    (a, b) => (b.ntrpRating ?? 0) - (a.ntrpRating ?? 0),
  )[0];
  const mostDedicated = [...students].sort(
    (a, b) => b.totalLessons - a.totalLessons,
  )[0];
  const mostImproved = [...students].sort(
    (a, b) => b.totalLessons - a.totalLessons,
  )[1];

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Trophy
          size={56}
          color={GOLD}
          style={{ display: "block", margin: "0 auto 1rem" }}
        />
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "#f0f0f0",
          }}
        >
          Student Rankings
        </h1>
        <p style={{ color: "#666", fontSize: "1.0625rem" }}>
          Celebrating our students' progress and achievements
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: "250px",
            maxWidth: "400px",
          }}
        >
          <Search
            size={16}
            color="#555"
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <label
            style={{
              fontWeight: 500,
              color: "#888",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
            }}
          >
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ minWidth: "150px" }}
          >
            <option value="ntrp">NTRP Rating</option>
            <option value="lessons">Lessons Taken</option>
          </select>
        </div>
      </div>

      <div
        style={{ marginBottom: "1rem", color: "#555", fontSize: "0.875rem" }}
      >
        Showing {filtered.length} of {students.length} students
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: "auto", padding: 0 }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#555" }}>
            Loading rankings...
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "500px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #1e1e1e",
                  backgroundColor: "#0d0d0d",
                }}
              >
                {["Rank", "Student", "Lessons Taken", "NTRP Rating"].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "1rem 1.25rem",
                        textAlign: i <= 1 ? "left" : "center",
                        fontWeight: 600,
                        color: "#666",
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#555",
                    }}
                  >
                    {students.length === 0
                      ? "No completed lessons yet."
                      : `No students matching "${searchTerm}"`}
                  </td>
                </tr>
              ) : (
                filtered.map((student, index) => (
                  <tr
                    key={student._id}
                    style={{
                      borderBottom: "1px solid #1a1a1a",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#161616";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {index < 3 ? (
                        <Medal
                          size={24}
                          color={getMedalColor(index)}
                          fill={getMedalColor(index)}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#555",
                          }}
                        >
                          #{index + 1}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.25rem",
                        fontWeight: 500,
                        color: "#e0e0e0",
                      }}
                    >
                      {student.studentName}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.25rem",
                        textAlign: "center",
                        color: "#777",
                        fontWeight: 500,
                      }}
                    >
                      {student.totalLessons}
                    </td>
                    <td
                      style={{ padding: "1rem 1.25rem", textAlign: "center" }}
                    >
                      {student.ntrpRating != null ? (
                        <span
                          style={{
                            backgroundColor: "rgba(201,168,76,0.1)",
                            color: GOLD,
                            padding: "0.3rem 0.75rem",
                            borderRadius: "9999px",
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                            border: "1px solid rgba(201,168,76,0.2)",
                          }}
                        >
                          {student.ntrpRating} NTRP
                        </span>
                      ) : (
                        <span style={{ color: "#444" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Achievement Cards */}
      {students.length > 0 && (
        <div className="grid grid-3" style={{ marginTop: "3rem" }}>
          {[
            {
              icon: Trophy,
              label: "Highest NTRP",
              color: GOLD,
              student: topRated,
              stat: topRated?.ntrpRating ? `${topRated.ntrpRating} NTRP` : "—",
            },
            {
              icon: Award,
              label: "Most Dedicated",
              color: "#818cf8",
              student: mostDedicated,
              stat: `${mostDedicated?.totalLessons} lessons`,
            },
            {
              icon: TrendingUp,
              label: "Most Improved",
              color: "#4ade80",
              student: mostImproved,
              stat: mostImproved ? `${mostImproved.totalLessons} lessons` : "—",
            },
          ].map(({ icon: Icon, label, color, student, stat }) => (
            <div
              key={label}
              className="card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <Icon
                size={40}
                color={color}
                style={{ display: "block", margin: "0 auto 1rem" }}
              />
              <h3
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </h3>
              <p
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "#f0f0f0",
                  marginBottom: "0.25rem",
                }}
              >
                {student?.studentName || "—"}
              </p>
              <p style={{ color: "#555", fontSize: "0.875rem" }}>{stat}</p>
            </div>
          ))}
        </div>
      )}

      {/* NTRP Info */}
      <div
        className="card"
        style={{ marginTop: "3rem", borderColor: "rgba(201,168,76,0.2)" }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: GOLD,
          }}
        >
          About NTRP Ratings
        </h3>
        <p
          style={{
            color: "#666",
            lineHeight: 1.7,
            marginBottom: "1.25rem",
            fontSize: "0.9rem",
          }}
        >
          The National Tennis Rating Program (NTRP) objectively measures playing
          ability from 1.0 (beginner) to 7.0 (world class).
        </p>
        <div className="grid grid-2" style={{ gap: "1rem" }}>
          {NTRP_LEVELS.map(({ range, label, desc }) => (
            <div key={range}>
              <strong
                style={{
                  color: "#c0c0c0",
                  display: "block",
                  marginBottom: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                {range}: {label}
              </strong>
              <p style={{ fontSize: "0.8125rem", color: "#555" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
