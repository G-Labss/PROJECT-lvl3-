import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GOLD } from '../constants';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                backdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#111111',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.75rem',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '1.5rem',
                        borderBottom: `1px solid #1e1e1e`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#111111',
                        borderRadius: '0.75rem 0.75rem 0 0',
                    }}
                >
                    <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#f0f0f0', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '1px solid #2a2a2a',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            borderRadius: '0.375rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                    >
                        <X size={18} color="#777" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
