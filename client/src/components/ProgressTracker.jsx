import React, { useState, useEffect, useCallback } from 'react';
import { progressAPI, bookingAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { GOLD } from '../constants';
import {
    TrendingUp, FileText, Trophy, ChevronRight, ChevronLeft,
    Plus, Trash2, User, Activity, Target,
} from 'lucide-react';

const STROKES = [
    { key: 'forehand',   label: 'Forehand' },
    { key: 'backhand',   label: 'Backhand' },
    { key: 'serve',      label: 'Serve' },
    { key: 'volley',     label: 'Volley' },
    { key: 'footwork',   label: 'Footwork' },
    { key: 'mentalGame', label: 'Mental Game' },
];

const MILESTONE_ICONS = {
    'First Session': '🎾',
    '5 Sessions': '⭐',
    '10 Sessions': '🏅',
    '25 Sessions': '🥈',
    '50 Sessions': '🏆',
};

// ── Mini bar chart for NTRP history ──────────────────────────────────────────
const NtrpChart = ({ history }) => {
    if (!history || history.length === 0) {
        return <p style={{ color: '#555', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>No NTRP entries yet.</p>;
    }
    const min = 1;
    const max = 7;
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', minWidth: `${sorted.length * 44}px`, height: '100px', padding: '0 0.25rem' }}>
                {sorted.map((entry, i) => {
                    const pct = ((entry.rating - min) / (max - min)) * 100;
                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 36px', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.7rem', color: GOLD, fontWeight: 600 }}>{entry.rating}</span>
                            <div style={{ width: '100%', height: `${Math.max(pct, 8)}px`, backgroundColor: `rgba(201,168,76,${0.3 + (pct / 100) * 0.7})`, borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
                            <span style={{ fontSize: '0.6rem', color: '#555', writingMode: 'vertical-rl', transform: 'rotate(180deg)', marginTop: '0.25rem' }}>
                                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Stroke rating bar ─────────────────────────────────────────────────────────
const StrokeBar = ({ label, value, onChange, readOnly }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <span style={{ width: '100px', fontSize: '0.8125rem', color: '#aaa', flexShrink: 0 }}>{label}</span>
        <div style={{ flex: 1, display: 'flex', gap: '0.25rem' }}>
            {[...Array(10)].map((_, i) => {
                const filled = i < value;
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={readOnly}
                        onClick={() => !readOnly && onChange(i + 1)}
                        style={{
                            flex: 1,
                            height: '10px',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: readOnly ? 'default' : 'pointer',
                            backgroundColor: filled
                                ? i < 4 ? '#c9a84c66' : i < 7 ? GOLD : '#e8c96a'
                                : '#1e1e1e',
                            transition: 'background-color 0.15s',
                        }}
                    />
                );
            })}
        </div>
        <span style={{ width: '24px', textAlign: 'right', fontSize: '0.875rem', color: value > 0 ? GOLD : '#555', fontWeight: 600 }}>{value > 0 ? value : '–'}</span>
    </div>
);

// ── Student detail panel ──────────────────────────────────────────────────────
const StudentDetail = ({ student, onBack }) => {
    const toast = useToast();
    const email = student.studentEmail;

    const [progress, setProgress]       = useState(null);
    const [sessionCount, setSessionCount] = useState(0);
    const [loading, setLoading]         = useState(true);
    const [activeSection, setActiveSection] = useState('strokes');

    const [strokes, setStrokes]         = useState({ forehand: 0, backhand: 0, serve: 0, volley: 0, footwork: 0, mentalGame: 0 });
    const [savingStrokes, setSavingStrokes] = useState(false);

    const [noteText, setNoteText]       = useState('');
    const [addingNote, setAddingNote]   = useState(false);

    const [ntrpRating, setNtrpRating]   = useState('');
    const [ntrpNote, setNtrpNote]       = useState('');
    const [addingNtrp, setAddingNtrp]   = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await progressAPI.get(email);
            setSessionCount(res.sessionCount || 0);
            if (res.data) {
                setProgress(res.data);
                setStrokes(res.data.strokeRatings || strokes);
            }
        } catch {
            toast('Failed to load progress', 'error');
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => { load(); }, [load]);

    const handleSaveStrokes = async () => {
        setSavingStrokes(true);
        try {
            const res = await progressAPI.upsert(email, { studentName: student.studentName, strokeRatings: strokes });
            setProgress(res.data);
            setSessionCount(res.sessionCount || 0);
            toast('Stroke ratings saved', 'success');
        } catch {
            toast('Failed to save', 'error');
        } finally {
            setSavingStrokes(false);
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setAddingNote(true);
        try {
            const res = await progressAPI.addNote(email, noteText);
            setProgress(res.data);
            setNoteText('');
            toast('Note added', 'success');
        } catch {
            toast('Failed to add note', 'error');
        } finally {
            setAddingNote(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const res = await progressAPI.deleteNote(email, noteId);
            setProgress(res.data);
            toast('Note deleted', 'success');
        } catch {
            toast('Failed to delete note', 'error');
        }
    };

    const handleAddNtrp = async () => {
        const r = parseFloat(ntrpRating);
        if (!r || r < 1 || r > 7) return toast('Enter a valid NTRP rating (1.0–7.0)', 'error');
        setAddingNtrp(true);
        try {
            const res = await progressAPI.addNtrp(email, r, ntrpNote);
            setProgress(res.data);
            setSessionCount(res.sessionCount || 0);
            setNtrpRating('');
            setNtrpNote('');
            toast('NTRP entry added', 'success');
        } catch {
            toast('Failed to add NTRP entry', 'error');
        } finally {
            setAddingNtrp(false);
        }
    };

    const sections = [
        { id: 'strokes',    label: 'Strokes',    icon: Activity },
        { id: 'ntrp',       label: 'NTRP',       icon: TrendingUp },
        { id: 'notes',      label: 'Notes',      icon: FileText },
        { id: 'milestones', label: 'Milestones', icon: Trophy },
    ];

    return (
        <div>
            {/* Back + header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button type="button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid #2a2a2a', borderRadius: '0.375rem', color: '#888', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8125rem' }}>
                    <ChevronLeft size={14} /> Back
                </button>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#f0f0f0' }}>{student.studentName}</h2>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#555' }}>{email} · {sessionCount} paid session{sessionCount !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Milestones strip */}
            {progress?.milestones?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {progress.milestones.map((m, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', backgroundColor: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.25)`, borderRadius: '999px', fontSize: '0.75rem', color: GOLD }}>
                            {MILESTONE_ICONS[m.name] || '🎾'} {m.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Section tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1e1e1e', marginBottom: '1.5rem', gap: 0 }}>
                {sections.map(s => (
                    <button key={s.id} type="button" onClick={() => setActiveSection(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeSection === s.id ? `2px solid ${GOLD}` : '2px solid transparent', color: activeSection === s.id ? GOLD : '#555', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: activeSection === s.id ? 600 : 400, whiteSpace: 'nowrap' }}>
                        <s.icon size={15} /> {s.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading…</p>
            ) : (
                <>
                    {/* ── Strokes ── */}
                    {activeSection === 'strokes' && (
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <p style={{ color: '#666', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>Click the bars to set a rating from 1–10 for each stroke.</p>
                            {STROKES.map(s => (
                                <StrokeBar key={s.key} label={s.label} value={strokes[s.key] || 0} onChange={v => setStrokes(prev => ({ ...prev, [s.key]: v }))} />
                            ))}
                            <button type="button" className="btn btn-primary" onClick={handleSaveStrokes} disabled={savingStrokes} style={{ marginTop: '1rem' }}>
                                {savingStrokes ? 'Saving…' : 'Save Ratings'}
                            </button>
                        </div>
                    )}

                    {/* ── NTRP ── */}
                    {activeSection === 'ntrp' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>NTRP History</h3>
                                <NtrpChart history={progress?.ntrpHistory} />
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Log New Rating</h3>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.35rem' }}>NTRP Rating</label>
                                        <input type="number" min="1" max="7" step="0.5" value={ntrpRating} onChange={e => setNtrpRating(e.target.value)} placeholder="e.g. 3.5" className="form-input" style={{ width: '110px' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: '180px' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.35rem' }}>Note (optional)</label>
                                        <input type="text" value={ntrpNote} onChange={e => setNtrpNote(e.target.value)} placeholder="e.g. Improved serve" className="form-input" />
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={handleAddNtrp} disabled={addingNtrp}>
                                        {addingNtrp ? 'Adding…' : 'Add Entry'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Notes ── */}
                    {activeSection === 'notes' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Add Session Note</h3>
                                <textarea
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                    placeholder="e.g. Great improvement on second serve — keep working on toss height."
                                    rows={3}
                                    className="form-input"
                                    style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                                <button type="button" className="btn btn-primary" onClick={handleAddNote} disabled={addingNote || !noteText.trim()} style={{ marginTop: '0.75rem' }}>
                                    {addingNote ? 'Adding…' : 'Add Note'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(!progress?.notes || progress.notes.length === 0) ? (
                                    <p style={{ color: '#555', textAlign: 'center', padding: '1.5rem' }}>No notes yet.</p>
                                ) : progress.notes.map(n => (
                                    <div key={n._id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid #1e1e1e' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, color: '#d0d0d0', fontSize: '0.9rem', lineHeight: 1.6 }}>{n.text}</p>
                                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#555' }}>
                                                {new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <button type="button" onClick={() => handleDeleteNote(n._id)} style={{ padding: '0.35rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.375rem', cursor: 'pointer', flexShrink: 0 }}>
                                            <Trash2 size={14} color="#ef4444" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Milestones ── */}
                    {activeSection === 'milestones' && (
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <p style={{ color: '#666', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>Milestones are awarded automatically based on paid session count.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { name: 'First Session', sessions: 1 },
                                    { name: '5 Sessions',    sessions: 5 },
                                    { name: '10 Sessions',   sessions: 10 },
                                    { name: '25 Sessions',   sessions: 25 },
                                    { name: '50 Sessions',   sessions: 50 },
                                ].map(m => {
                                    const achieved = progress?.milestones?.some(ms => ms.name === m.name);
                                    const achievedDate = progress?.milestones?.find(ms => ms.name === m.name)?.achievedAt;
                                    return (
                                        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: achieved ? 'rgba(201,168,76,0.06)' : '#0d0d0d', border: `1px solid ${achieved ? 'rgba(201,168,76,0.25)' : '#1a1a1a'}`, borderRadius: '0.5rem' }}>
                                            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{achieved ? MILESTONE_ICONS[m.name] : '⬜'}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: 600, color: achieved ? GOLD : '#555', fontSize: '0.9rem' }}>{m.name}</p>
                                                {achievedDate && <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>Achieved {new Date(achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: achieved ? GOLD : '#444', fontWeight: 500 }}>{sessionCount}/{m.sessions}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// ── Main tab component ────────────────────────────────────────────────────────
const ProgressTracker = () => {
    const toast = useToast();
    const [students, setStudents]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [selected, setSelected]       = useState(null);
    const [search, setSearch]           = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await bookingAPI.getRankings();
                setStudents(res.data || res || []);
            } catch {
                toast('Failed to load students', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (selected) return <StudentDetail student={selected} onBack={() => setSelected(null)} />;

    const filtered = students.filter(s =>
        s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        s.studentEmail?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#e0e0e0', marginBottom: '0.25rem' }}>Student Progress</h2>
                <p style={{ color: '#555', fontSize: '0.875rem' }}>Select a student to log stroke ratings, NTRP history, session notes, and milestones.</p>
            </div>

            <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
                style={{ maxWidth: '360px', marginBottom: '1.25rem' }}
            />

            {loading ? (
                <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>Loading students…</p>
            ) : filtered.length === 0 ? (
                <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>No students found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {filtered.map((s, i) => (
                        <button
                            key={s.studentEmail}
                            type="button"
                            onClick={() => setSelected(s)}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <User size={18} color={GOLD} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontWeight: 600, color: '#e0e0e0', fontSize: '0.9375rem' }}>{s.studentName}</p>
                                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#555' }}>{s.studentEmail}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessions</p>
                                    <p style={{ margin: 0, fontWeight: 700, color: GOLD, fontSize: '1rem' }}>{s.totalSessions}</p>
                                </div>
                                {s.ntrpRating > 0 && (
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>NTRP</p>
                                        <p style={{ margin: 0, fontWeight: 700, color: '#e0e0e0', fontSize: '1rem' }}>{s.ntrpRating}</p>
                                    </div>
                                )}
                                <ChevronRight size={18} color="#444" />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;
