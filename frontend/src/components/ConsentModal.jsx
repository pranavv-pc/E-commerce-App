import React from 'react';
import { ShieldCheck, X, FileText, CheckCircle2, Lock, Eye, AlertCircle } from 'lucide-react';

export default function ConsentModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="animate-scale-in">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconCircle}>
              <ShieldCheck size={22} color="#6366f1" />
            </div>
            <div>
              <h3 style={styles.title}>Consent & User Terms Agreement</h3>
              <p style={styles.subtitle}>Mandatory statutory consent for digital account creation</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Notice Banner */}
        <div style={styles.noticeBanner}>
          <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span>
            Please review the following consent terms regarding account privileges, data usage, and e-commerce compliance.
          </span>
        </div>

        {/* Scrollable Terms Content */}
        <div style={styles.contentBody}>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <Lock size={16} color="#06b6d4" />
              <h4 style={styles.sectionTitle}>1. Account Security & Verification</h4>
            </div>
            <p style={styles.text}>
              By creating a LUMINA LUXE member account, you agree to safeguard your credentials and accept sole responsibility for all transactional activities originating under your authenticated identity. Multi-factor verification tokens are cryptographically secured.
            </p>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <Eye size={16} color="#8b5cf6" />
              <h4 style={styles.sectionTitle}>2. Algorithmic Personalization & Cookie Consent</h4>
            </div>
            <p style={styles.text}>
              You consent to the processing of navigational telemetry, catalog dwell times, and shopping preferences to provide bespoke product recommendations, dynamic pricing discounts, and personalized curated drops.
            </p>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <FileText size={16} color="#10b981" />
              <h4 style={styles.sectionTitle}>3. E-Commerce Transactions & Buyer Shield</h4>
            </div>
            <p style={styles.text}>
              All mock credit line settlements, instant checkout tokens, and digital delivery confirmations adhere to international e-commerce standards. Returns are authorized within 30 days of shipment receipt with prepaid courier tracking.
            </p>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <CheckCircle2 size={16} color="#f43f5e" />
              <h4 style={styles.sectionTitle}>4. Member Rights & Opt-Out Guarantee</h4>
            </div>
            <p style={styles.text}>
              You retain full statutory rights to export your profile telemetry or revoke optional promotional dispatch tokens anytime from your member security dashboard.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.acceptBtn}
            onClick={() => {
              onAccept();
              onClose();
            }}
          >
            <CheckCircle2 size={18} />
            <span>I Have Read & Accept Consent</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 8, 16, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1.25rem'
  },
  modal: {
    backgroundColor: '#0f1424',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '620px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
    overflow: 'hidden'
  },
  header: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem'
  },
  iconCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '2px'
  },
  closeBtn: {
    color: '#94a3b8',
    padding: '6px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noticeBanner: {
    margin: '1rem 1.5rem 0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.82rem',
    color: '#fde68a'
  },
  contentBody: {
    padding: '1rem 1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
    lineHeight: 1.6
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.4rem'
  },
  sectionTitle: {
    fontSize: '0.92rem',
    fontWeight: 600,
    color: '#e2e8f0',
    margin: 0
  },
  text: {
    fontSize: '0.82rem',
    color: '#94a3b8'
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    backgroundColor: 'rgba(10, 14, 25, 0.95)'
  },
  cancelBtn: {
    padding: '0.65rem 1.25rem',
    borderRadius: '10px',
    fontSize: '0.88rem',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontWeight: 500
  },
  acceptBtn: {
    padding: '0.65rem 1.4rem',
    borderRadius: '10px',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
};
