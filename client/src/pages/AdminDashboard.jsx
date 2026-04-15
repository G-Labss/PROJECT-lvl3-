import React, { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../utils/formatters';
import { useAppContext } from '../context/useAppContext';
import { useToast } from '../context/ToastContext';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Plus,
    Edit,
    Trash2,
    TrendingUp,
    DollarSign,
    CalendarDays,
    ClipboardList,
    RefreshCw,
    MapPin,
    X,
} from 'lucide-react';
import AvailabilityManager from '../components/AvailabilityManager';
import ProgressTracker from '../components/ProgressTracker';
import { bookingAPI } from '../services/api';
import { Check, Star } from 'lucide-react';
import { GOLD } from '../constants';
import { testimonialAPI } from '../services/api';

const AdminDashboard = () => {
    const { state } = useAppContext();
    const { lessons, users } = state;
    const [activeTab, setActiveTab] = useState('overview');

    const totalLessons = lessons?.length || 0;
    const totalStudents = users?.length || 0;
    const totalRevenue = lessons?.reduce((sum, lesson) => sum + lesson.price, 0) || 0;
    const averagePrice = totalLessons > 0 ? Math.round(totalRevenue / totalLessons) : 0;

    const stats = [
        { icon: BookOpen, label: 'Total Lessons', value: totalLessons },
        { icon: Users, label: 'Total Students', value: totalStudents },
        { icon: DollarSign, label: 'Average Price', value: `$${averagePrice}` },
        { icon: TrendingUp, label: 'Total Revenue', value: `$${totalRevenue}` },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'lessons', label: 'Manage Lessons', icon: BookOpen },
        { id: 'bookings', label: 'Bookings', icon: ClipboardList },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'schedule', label: 'Schedule', icon: CalendarDays },
        { id: 'service-area', label: 'Service Area', icon: MapPin },
        { id: 'testimonials', label: 'Testimonials', icon: Star },
        { id: 'progress', label: 'Progress', icon: TrendingUp },
    ];

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#0a0a0a' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '2rem 1rem' }}>
                <div className="container">
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#f0f0f0',
                        marginBottom: '0.25rem',
                        fontFamily: "'Playfair Display', serif",
                    }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ color: '#555', fontSize: '0.9375rem' }}>
                        Manage your tennis coaching business
                    </p>
                </div>
            </div>

            {/* Tab Bar */}
            <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '0', padding: '0 1rem', overflowX: 'auto' }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem 1.25rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? `2px solid ${GOLD}` : '2px solid transparent',
                                    color: activeTab === tab.id ? GOLD : '#555',
                                    fontWeight: activeTab === tab.id ? 600 : 400,
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 0.2s',
                                }}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {activeTab === 'overview' && <OverviewTab stats={stats} lessons={lessons} setActiveTab={setActiveTab} />}
                {activeTab === 'lessons' && <LessonsTab />}
                {activeTab === 'bookings' && <BookingsTab />}
                {activeTab === 'students' && <StudentsTab users={users} />}
                {activeTab === 'schedule' && <AvailabilityManager />}
                {activeTab === 'service-area' && <ServiceAreaTab />}
                {activeTab === 'testimonials' && <TestimonialsTab />}
                {activeTab === 'progress' && <ProgressTracker />}
            </div>
        </div>
    );
};

const OverviewTab = ({ stats, lessons, setActiveTab }) => (
    <div>
        <div className="grid grid-2" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
            {stats.map((stat, index) => (
                <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <stat.icon size={26} color={GOLD} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f0f0f0', fontFamily: "'Playfair Display', serif" }}>
                            {stat.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
            <div className="card">
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.25rem', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Recent Lessons
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {lessons?.slice(0, 4).map((lesson) => (
                        <div key={lesson._id} style={{
                            padding: '0.875rem 1rem',
                            backgroundColor: '#0d0d0d',
                            borderRadius: '0.5rem',
                            border: '1px solid #1a1a1a',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div>
                                <div style={{ fontWeight: 500, color: '#e0e0e0', fontSize: '0.9rem' }}>{lesson.title}</div>
                                <div style={{ fontSize: '0.8125rem', color: '#555', marginTop: '0.125rem' }}>{lesson.level}</div>
                            </div>
                            <span style={{ fontWeight: 700, color: GOLD, fontSize: '0.9375rem' }}>${lesson.price}</span>
                        </div>
                    )) || <p style={{ color: '#555', fontSize: '0.875rem' }}>No lessons yet</p>}
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.25rem', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        type="button"
                        className="btn btn-primary"
                        style={{ justifyContent: 'flex-start', gap: '0.75rem' }}
                        onClick={() => setActiveTab('lessons')}
                    >
                        <Plus size={18} />
                        Create New Lesson
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', gap: '0.75rem' }}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <ClipboardList size={18} />
                        View Bookings
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', gap: '0.75rem' }}
                        onClick={() => setActiveTab('schedule')}
                    >
                        <CalendarDays size={18} />
                        Manage Schedule
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const LessonsTab = () => {
    const { state, addLesson, updateLesson, deleteLesson } = useAppContext();
    const toast = useToast();
    const { lessons } = state;
    const [isCreating, setIsCreating] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await deleteLesson(id);
                toast('Lesson deleted', 'success');
            } catch (error) {
                toast('Error deleting lesson: ' + error.message, 'error');
            }
        }
    };

    const handleSave = async (lessonData) => {
        try {
            if (editingLesson) {
                await updateLesson(editingLesson._id, lessonData);
                toast('Lesson updated successfully', 'success');
            } else {
                await addLesson(lessonData);
                toast('Lesson created successfully', 'success');
            }
            setIsCreating(false);
            setEditingLesson(null);
        } catch (error) {
            toast('Error: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e0e0e0' }}>
                    All Lessons <span style={{ color: '#555', fontWeight: 400 }}>({lessons?.length || 0})</span>
                </h2>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsCreating(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} />
                    Add Lesson
                </button>
            </div>

            {(isCreating || editingLesson) && (
                <LessonForm
                    lesson={editingLesson}
                    onClose={() => { setIsCreating(false); setEditingLesson(null); }}
                    onSave={handleSave}
                />
            )}

            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1e1e1e', backgroundColor: '#0d0d0d' }}>
                            {['Title', 'Level', 'Duration', 'Price', 'Max Students', 'Actions'].map((h, i) => (
                                <th key={h} style={{
                                    padding: '0.875rem 1.25rem',
                                    textAlign: i >= 2 && i <= 4 ? 'center' : i === 5 ? 'right' : 'left',
                                    fontWeight: 600,
                                    color: '#555',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {lessons?.length > 0 ? lessons.map((lesson) => (
                            <tr
                                key={lesson._id}
                                style={{ borderBottom: '1px solid #1a1a1a', transition: 'background-color 0.15s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#161616'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                <td style={{ padding: '1rem 1.25rem' }}>
                                    <div style={{ fontWeight: 500, color: '#e0e0e0', fontSize: '0.9rem' }}>{lesson.title}</div>
                                    <div style={{ fontSize: '0.8125rem', color: '#555', marginTop: '0.125rem' }}>
                                        {lesson.description?.substring(0, 50)}...
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.25rem' }}>
                                    <span style={{
                                        backgroundColor: 'rgba(201,168,76,0.1)',
                                        color: GOLD,
                                        border: '1px solid rgba(201,168,76,0.25)',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}>
                                        {lesson.level}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', color: '#777', fontSize: '0.875rem' }}>
                                    {lesson.duration} min
                                </td>
                                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 700, color: GOLD }}>
                                    ${lesson.price}
                                </td>
                                <td style={{ padding: '1rem 1.25rem', textAlign: 'center', color: '#777', fontSize: '0.875rem' }}>
                                    {lesson.maxStudents}
                                </td>
                                <td style={{ padding: '1rem 1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            type="button"
                                            onClick={() => setEditingLesson(lesson)}
                                            style={{
                                                padding: '0.4rem',
                                                backgroundColor: 'rgba(201,168,76,0.08)',
                                                border: '1px solid rgba(201,168,76,0.2)',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'border-color 0.15s',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; }}
                                        >
                                            <Edit size={16} color={GOLD} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(lesson._id)}
                                            style={{
                                                padding: '0.4rem',
                                                backgroundColor: 'rgba(239,68,68,0.08)',
                                                border: '1px solid rgba(239,68,68,0.2)',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'border-color 0.15s',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                                        >
                                            <Trash2 size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>
                                    No lessons found. Create your first lesson.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const LessonForm = ({ lesson, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        description: lesson?.description || '',
        duration: lesson?.duration || 60,
        price: lesson?.price || 75,
        level: lesson?.level || 'Beginner',
        maxStudents: lesson?.maxStudents || 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem', border: '1px solid rgba(201,168,76,0.2)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {lesson ? 'Edit Lesson' : 'Create New Lesson'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Level *</label>
                        <select
                            className="form-select"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            required
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="All Levels">All Levels</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        required
                    />
                </div>

                <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Duration (min) *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            min="30"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Price ($) *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Max Students *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.maxStudents}
                            onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                        {lesson ? 'Update Lesson' : 'Create Lesson'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const STATUS_COLORS = {
    confirmed: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
    pending: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
};

const BookingsTab = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [markingPaid, setMarkingPaid] = useState(null);
    const [editingNtrp, setEditingNtrp] = useState(null); // studentEmail
    const [ntrpInput, setNtrpInput] = useState('');
    const toast = useToast();

    const handleMarkPaid = async (bookingId) => {
        setMarkingPaid(bookingId);
        try {
            const res = await bookingAPI.markPaid(bookingId);
            setBookings(prev => prev.map(b => b._id === bookingId ? res.data : b));
            toast('Booking marked as paid', 'success');
        } catch (err) {
            toast('Failed to update booking', 'error');
        } finally {
            setMarkingPaid(null);
        }
    };

    const handleSaveNtrp = async (studentEmail) => {
        const rating = parseFloat(ntrpInput);
        if (isNaN(rating) || rating < 1 || rating > 7) {
            toast('Enter a valid NTRP rating (1.0 – 7.0)', 'error');
            return;
        }
        try {
            await bookingAPI.updateStudentNtrp(studentEmail, rating);
            toast('NTRP rating updated', 'success');
            setEditingNtrp(null);
            setNtrpInput('');
        } catch {
            toast('Failed to update NTRP', 'error');
        }
    };

    const loadBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await bookingAPI.getAll();
            setBookings(data.data || data || []);
        } catch (err) {
            setError('Failed to load bookings');
            toast('Failed to load bookings', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e0e0e0' }}>
                    All Bookings <span style={{ color: '#555', fontWeight: 400 }}>({bookings.length})</span>
                </h2>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={loadBookings}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={loading}
                >
                    <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
                    Loading bookings...
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#f87171' }}>
                    {error}
                </div>
            ) : (
                <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e1e1e', backgroundColor: '#0d0d0d' }}>
                                {['Student', 'Lesson', 'Scheduled', 'Amount', 'Payment', 'Status', ''].map((h, i) => (
                                    <th key={h} style={{
                                        padding: '0.875rem 1.25rem',
                                        textAlign: i >= 3 ? 'center' : 'left',
                                        fontWeight: 600,
                                        color: '#555',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? bookings.map((booking) => {
                                const status = booking.paymentStatus || 'pending';
                                const sc = STATUS_COLORS[status] || STATUS_COLORS.pending;
                                return (
                                    <tr
                                        key={booking._id}
                                        style={{ borderBottom: '1px solid #1a1a1a', transition: 'background-color 0.15s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#161616'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontWeight: 500, color: '#e0e0e0', fontSize: '0.9rem' }}>{booking.studentName}</div>
                                            <div style={{ fontSize: '0.8125rem', color: '#555', marginTop: '0.125rem' }}>{booking.studentEmail}</div>
                                            {booking.notes && (
                                                <div style={{
                                                    fontSize: '0.775rem', color: '#666', marginTop: '0.375rem',
                                                    fontStyle: 'italic', maxWidth: '220px',
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }} title={booking.notes}>
                                                    "{booking.notes}"
                                                </div>
                                            )}
                                            {editingNtrp === booking.studentEmail ? (
                                                <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                                    <input
                                                        type="number"
                                                        min="1" max="7" step="0.5"
                                                        placeholder="e.g. 3.5"
                                                        value={ntrpInput}
                                                        onChange={(e) => setNtrpInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNtrp(booking.studentEmail)}
                                                        style={{ width: '72px', padding: '0.25rem 0.5rem', backgroundColor: '#1a1a1a', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.375rem', color: '#e0e0e0', fontSize: '0.8125rem' }}
                                                        autoFocus
                                                    />
                                                    <button type="button" onClick={() => handleSaveNtrp(booking.studentEmail)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.3rem' }}>Save</button>
                                                    <button type="button" onClick={() => { setEditingNtrp(null); setNtrpInput(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.75rem', padding: '0.2rem 0.3rem' }}>✕</button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => { setEditingNtrp(booking.studentEmail); setNtrpInput(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: '0.75rem', marginTop: '0.375rem', padding: 0, display: 'block' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.color = GOLD; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#444'; }}
                                                >
                                                    + Set NTRP
                                                </button>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#aaa', fontSize: '0.875rem' }}>
                                            {booking.lesson?.title || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#aaa', fontSize: '0.875rem' }}>
                                            {booking.scheduledDate ? (
                                                <><div>{formatDate(booking.scheduledDate)}</div>
                                                    <div style={{ color: '#555', fontSize: '0.8rem' }}>{formatTime(booking.scheduledTime)}</div></>
                                            ) : '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center', fontWeight: 700, color: GOLD }}>
                                            ${booking.amount || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center', color: '#777', fontSize: '0.8125rem', textTransform: 'capitalize' }}>
                                            {booking.paymentMethod || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: sc.bg,
                                                color: sc.text,
                                                border: `1px solid ${sc.border}`,
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                textTransform: 'capitalize',
                                            }}>
                                                {status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                                            {status === 'pending' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleMarkPaid(booking._id)}
                                                    disabled={markingPaid === booking._id}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.3rem 0.7rem',
                                                        backgroundColor: 'rgba(34,197,94,0.1)',
                                                        border: '1px solid rgba(34,197,94,0.3)',
                                                        borderRadius: '0.375rem',
                                                        color: '#4ade80',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: markingPaid === booking._id ? 'not-allowed' : 'pointer',
                                                        opacity: markingPaid === booking._id ? 0.6 : 1,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    <Check size={13} />
                                                    {markingPaid === booking._id ? 'Saving...' : 'Mark Paid'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>
                                        No bookings yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

const StudentsTab = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [editingNtrp, setEditingNtrp] = useState(null);
    const [ntrpInput, setNtrpInput] = useState('');
    const [ntrpMap, setNtrpMap] = useState({});
    const toast = useToast();

    useEffect(() => {
        bookingAPI.getAll()
            .then(res => {
                const data = res.data || res || [];
                setBookings(data);
                const map = {};
                data.forEach(b => { if (b.studentNtrp) map[b.studentEmail] = b.studentNtrp; });
                setNtrpMap(map);
            })
            .catch(() => setError('Failed to load students'))
            .finally(() => setLoading(false));
    }, []);

    const students = Object.values(
        bookings.reduce((acc, b) => {
            const key = b.studentEmail;
            if (!acc[key]) {
                acc[key] = { name: b.studentName, email: key, sessions: [], totalPaid: 0 };
            }
            acc[key].sessions.push(b);
            if (b.paymentStatus === 'paid') acc[key].totalPaid += b.amount || 0;
            return acc;
        }, {})
    ).sort((a, b) => b.sessions.length - a.sessions.length);

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleSaveNtrp = async (email) => {
        const rating = parseFloat(ntrpInput);
        if (isNaN(rating) || rating < 1 || rating > 7) {
            toast('Enter a valid NTRP rating (1.0 – 7.0)', 'error');
            return;
        }
        try {
            await bookingAPI.updateStudentNtrp(email, rating);
            setNtrpMap(prev => ({ ...prev, [email]: rating }));
            toast('NTRP updated', 'success');
            setEditingNtrp(null);
            setNtrpInput('');
        } catch {
            toast('Failed to update NTRP', 'error');
        }
    };

    if (loading) return <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>Loading students...</div>;
    if (error) return <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#f87171' }}>{error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e0e0e0' }}>
                    Students <span style={{ color: '#555', fontWeight: 400 }}>({students.length})</span>
                </h2>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '260px' }}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Users size={40} color="#2a2a2a" style={{ display: 'block', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#555' }}>{search ? 'No students match your search.' : 'No students yet.'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map(student => {
                        const ntrp = ntrpMap[student.email];
                        const isExpanded = expanded === student.email;
                        const uniqueLessons = [...new Set(student.sessions.map(s => s.lesson?.title).filter(Boolean))];
                        const lastSession = student.sessions
                            .filter(s => s.createdAt)
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                        return (
                            <div key={student.email} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Student row */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto auto auto auto auto',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    padding: '1.25rem 1.5rem',
                                }}>
                                    {/* Name + email */}
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '0.9375rem' }}>{student.name}</div>
                                        <div style={{ color: '#555', fontSize: '0.8125rem', marginTop: '0.125rem' }}>{student.email}</div>
                                        {uniqueLessons.length > 0 && (
                                            <div style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                {uniqueLessons.join(' · ')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sessions */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.375rem', fontWeight: 700, color: GOLD }}>{student.sessions.length}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>sessions</div>
                                    </div>

                                    {/* Total paid */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#4ade80' }}>${student.totalPaid}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>paid</div>
                                    </div>

                                    {/* NTRP */}
                                    <div style={{ textAlign: 'center', minWidth: '90px' }}>
                                        {editingNtrp === student.email ? (
                                            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                                <input
                                                    type="number" min="1" max="7" step="0.5"
                                                    placeholder="e.g. 3.5"
                                                    value={ntrpInput}
                                                    onChange={e => setNtrpInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleSaveNtrp(student.email)}
                                                    autoFocus
                                                    style={{ width: '60px', padding: '0.25rem 0.4rem', backgroundColor: '#1a1a1a', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: '0.375rem', color: '#e0e0e0', fontSize: '0.8125rem' }}
                                                />
                                                <button type="button" onClick={() => handleSaveNtrp(student.email)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: GOLD, fontSize: '0.75rem', fontWeight: 600 }}>✓</button>
                                                <button type="button" onClick={() => { setEditingNtrp(null); setNtrpInput(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.75rem' }}>✕</button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => { setEditingNtrp(student.email); setNtrpInput(ntrp || ''); }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}
                                            >
                                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: ntrp ? GOLD : '#333' }}>{ntrp ? ntrp.toFixed(1) : '—'}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ntrp</div>
                                            </button>
                                        )}
                                    </div>

                                    {/* Last session */}
                                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                        <div style={{ fontSize: '0.8125rem', color: '#777' }}>
                                            {lastSession ? formatDate(lastSession.createdAt) : '—'}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>last session</div>
                                    </div>

                                    {/* Expand toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setExpanded(isExpanded ? null : student.email)}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #1e1e1e',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                            padding: '0.4rem 0.75rem',
                                            color: isExpanded ? GOLD : '#555',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            transition: 'all 0.15s',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = isExpanded ? GOLD : '#555'; }}
                                    >
                                        {isExpanded ? 'Hide' : 'History'}
                                    </button>
                                </div>

                                {/* Expanded booking history */}
                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid #1a1a1a', backgroundColor: '#0a0a0a', padding: '1rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                                            Booking History
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {student.sessions
                                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                                .map(b => {
                                                    const sc = STATUS_COLORS[b.paymentStatus] || STATUS_COLORS.pending;
                                                    return (
                                                        <div key={b._id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '0.625rem 0.875rem',
                                                            backgroundColor: '#111',
                                                            borderRadius: '0.375rem',
                                                            border: '1px solid #1a1a1a',
                                                        }}>
                                                            <div style={{ color: '#ccc', fontSize: '0.875rem' }}>{b.lesson?.title || '—'}</div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                                <span style={{ color: '#555', fontSize: '0.8125rem' }}>{formatDate(b.createdAt)}</span>
                                                                <span style={{ color: GOLD, fontWeight: 600, fontSize: '0.875rem' }}>${b.amount}</span>
                                                                <span style={{
                                                                    backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                                                                    padding: '0.15rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                                                                }}>
                                                                    {b.paymentStatus}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ServiceAreaTab = () => {
    const { state, updateServiceArea } = useAppContext();
    const toast = useToast();
    const [locations, setLocations] = useState(state.currentUser?.serviceArea || []);
    const [newLocation, setNewLocation] = useState('');
    const [saving, setSaving] = useState(false);

    const addLocation = () => {
        const trimmed = newLocation.trim();
        if (!trimmed || locations.includes(trimmed)) return;
        setLocations([...locations, trimmed]);
        setNewLocation('');
    };

    const removeLocation = (index) => {
        setLocations(locations.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateServiceArea(locations);
            toast('Service area updated', 'success');
        } catch {
            toast('Failed to save service area', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: '640px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e0e0e0', marginBottom: '0.375rem' }}>
                    Service Area
                </h2>
                <p style={{ color: '#555', fontSize: '0.9rem' }}>
                    Add courts and locations where you offer coaching. These appear publicly on the home page.
                </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Lincoln Park Tennis Courts"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                        style={{ flex: 1 }}
                    />
                    <button type="button" className="btn btn-primary" onClick={addLocation} style={{ whiteSpace: 'nowrap' }}>
                        <Plus size={16} />
                        Add
                    </button>
                </div>

                {locations.length === 0 ? (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#444',
                        border: '1px dashed rgba(255,255,255,0.07)',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                    }}>
                        No locations added yet
                    </div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {locations.map((loc, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: '#0d0d0d',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <MapPin size={16} color={GOLD} style={{ flexShrink: 0, opacity: 0.8 }} />
                                <span style={{ flex: 1, color: '#d0d0d0', fontSize: '0.9375rem' }}>{loc}</span>
                                <button
                                    type="button"
                                    onClick={() => removeLocation(i)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', color: '#444' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#444'; }}
                                >
                                    <X size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ width: '100%' }}
                >
                    {saving ? 'Saving...' : 'Save Service Area'}
                </button>
            </div>
        </div>
    );
};

const TestimonialsTab = () => {
    const toast = useToast();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5 });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        testimonialAPI.getAll()
            .then(setTestimonials)
            .catch(() => toast('Failed to load testimonials', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const created = await testimonialAPI.create(form);
            setTestimonials(prev => [...prev, created]);
            setForm({ name: '', role: '', text: '', rating: 5 });
            toast('Testimonial added', 'success');
        } catch {
            toast('Failed to add testimonial', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial?')) return;
        try {
            await testimonialAPI.delete(id);
            setTestimonials(prev => prev.filter(t => t._id !== id));
            toast('Testimonial deleted', 'success');
        } catch {
            toast('Failed to delete testimonial', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e0e0e0', marginBottom: '1.5rem' }}>
                Testimonials <span style={{ color: '#555', fontWeight: 400 }}>({testimonials.length})</span>
            </h2>

            {/* Add form */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(201,168,76,0.2)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                    Add Testimonial
                </h3>
                <form onSubmit={handleAdd}>
                    <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Name *</label>
                            <input type="text" className="form-input" placeholder="e.g. Sarah Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Role *</label>
                            <input type="text" className="form-input" placeholder="e.g. Intermediate Player" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Testimonial Text *</label>
                        <textarea className="form-textarea" rows="3" placeholder="What did they say about your coaching?" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between' }}>
                        <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <label className="form-label" style={{ margin: 0 }}>Rating</label>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem' }}>
                                        <Star size={20} color={GOLD} fill={n <= form.rating ? GOLD : 'none'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Add Testimonial'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ color: '#555', padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : testimonials.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>No testimonials yet. Add one above.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {testimonials.map(t => (
                        <div key={t._id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid #1e1e1e' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                                {t.initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '0.9375rem' }}>{t.name}</span>
                                    <span style={{ color: '#555', fontSize: '0.8125rem' }}>· {t.role}</span>
                                    <div style={{ display: 'flex', gap: '0.15rem', marginLeft: '0.25rem' }}>
                                        {[1,2,3,4,5].map(n => <Star key={n} size={12} color={GOLD} fill={n <= t.rating ? GOLD : 'none'} />)}
                                    </div>
                                </div>
                                <p style={{ color: '#777', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>"{t.text}"</p>
                            </div>
                            <button type="button" onClick={() => handleDelete(t._id)} style={{ padding: '0.4rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'}
                            >
                                <Trash2 size={15} color="#ef4444" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
