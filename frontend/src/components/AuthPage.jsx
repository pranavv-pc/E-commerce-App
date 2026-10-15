import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import ConsentModal from './ConsentModal';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Fake Consent States
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentTelemetry, setConsentTelemetry] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [consentShake, setConsentShake] = useState(false);

  // UI status states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty', color: '#64748b' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: '#f43f5e' };
    if (score <= 3) return { score: 2, text: 'Medium', color: '#f59e0b' };
    return { score: 3, text: 'Strong', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Demo user quick login
  const handleDemoLogin = () => {
    setEmail('demo@store.com');
    setPassword('password123');
    setErrorMsg('');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Client-side validations
    if (!email.trim() || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should contain at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      // Mandatory Fake Consent Validation
      if (!consentAccepted) {
        setConsentShake(true);
        setTimeout(() => setConsentShake(false), 500);
        setErrorMsg('Consent Required: You must accept the statutory terms & privacy agreement to register.');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Attempt backend API call if running
      const endpoint = mode === 'register' ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
      const payload = mode === 'register'
        ? {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          consentAccepted,
          consentTelemetry,
          consentMarketing
        }
        : {
          email: email.trim().toLowerCase(),
          password
        };

      let authSuccess = false;
      let authenticatedUser = null;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          authSuccess = true;
          authenticatedUser = data.user;
        } else {
          const errData = await response.json();
          // If server responded with error
          if (errData?.error) {
            setErrorMsg(errData.error);
            setIsLoading(false);
            return;
          }
        }
      } catch (fetchErr) {
        // Backend not reachable or offline; gracefully fall back to local database
        console.info('Backend unreachable, using local storage authentication mock.');
      }

      // Local fallback logic if backend was not connected
      if (!authSuccess) {
        const storedUsers = JSON.parse(localStorage.getItem('lumina_users') || '[]');

        if (mode === 'register') {
          const userExists = storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (userExists) {
            setErrorMsg('An account with this email already exists.');
            setIsLoading(false);
            return;
          }

          const newUser = {
            id: `usr_${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: 'VIP Member',
            consentAccepted: true,
            consentTimestamp: new Date().toISOString(),
            marketingConsent: consentMarketing
          };

          storedUsers.push(newUser);
          localStorage.setItem('lumina_users', JSON.stringify(storedUsers));
          authenticatedUser = { ...newUser };
          delete authenticatedUser.password;
        } else {
          // Check demo user
          if (email.toLowerCase() === 'demo@store.com' && password === 'password123') {
            authenticatedUser = {
              id: 'usr_demo',
              name: 'Alex Vance',
              email: 'demo@store.com',
              role: 'VIP Gold',
              consentAccepted: true,
              consentTimestamp: new Date().toISOString()
            };
          } else {
            // Check stored users
            const found = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
            if (found) {
              authenticatedUser = { ...found };
              delete authenticatedUser.password;
            } else {
              setErrorMsg('Invalid email or password. You can click "Fill Demo Credentials" below.');
              setIsLoading(false);
              return;
            }
          }
        }
      }

      // Successful auth flow with simulated redirection
      setSuccessMsg(mode === 'register' ? 'Account created & consent registered!' : 'Authenticated successfully!');

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(authenticatedUser);
      }, 900);

    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Decor */}
      <div style={styles.glowOrb1}></div>
      <div style={styles.glowOrb2}></div>

      {/* Main Auth Card Container */}
      <div style={styles.authWrapper} className="animate-fade-in">

        {/* Brand Header */}
        <div style={styles.brandContainer}>
          <div style={styles.brandLogo}>
            <ShoppingBag size={28} color="#fff" />
          </div>
          <div>
            <h1 style={styles.brandTitle}>LUMINA <span style={styles.goldText}>LUXE</span></h1>
            <p style={styles.brandTagline}>Curated Luxury Tech & Bespoke Lifestyle</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            type="button"
            style={{
              ...styles.tabBtn,
              ...(mode === 'login' ? styles.tabBtnActive : {})
            }}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              ...styles.tabBtn,
              ...(mode === 'register' ? styles.tabBtnActive : {})
            }}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div style={styles.alertError} className="animate-fade-in">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={styles.alertSuccess} className="animate-fade-in">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg} Redirecting to store dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Register Name Field */}
          {mode === 'register' && (
            <div style={styles.fieldGroup} className="animate-fade-in">
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} color="#94a3b8" style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  style={styles.forgotLink}
                  onClick={() => alert('Password reset link sent to registered email address (Mock Demo).')}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>

            {/* Password strength bar in register mode */}
            {mode === 'register' && password && (
              <div style={styles.strengthBox} className="animate-fade-in">
                <div style={styles.strengthBarContainer}>
                  <div
                    style={{
                      ...styles.strengthBarFill,
                      width: `${(passwordStrength.score / 3) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span style={{ ...styles.strengthLabel, color: passwordStrength.color }}>
                  Strength: {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          {/* Register Confirm Password Field */}
          {mode === 'register' && (
            <div style={styles.fieldGroup} className="animate-fade-in">
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} color="#94a3b8" style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(confirmPassword && confirmPassword === password ? { borderColor: '#10b981' } : {})
                  }}
                  required
                />
                {confirmPassword && confirmPassword === password && (
                  <Check size={18} color="#10b981" style={{ marginRight: '1rem' }} />
                )}
              </div>
            </div>
          )}

          {/* --- FAKE CONSENT ACCEPT FORM (REGISTER ONLY) --- */}
          {mode === 'register' && (
            <div
              style={{
                ...styles.consentCard,
                ...(consentShake ? { animation: 'shake 0.4s ease-in-out' } : {}),
                ...(consentAccepted ? styles.consentCardAccepted : {})
              }}
              className="animate-fade-in"
            >
              <div style={styles.consentHeader}>
                <div style={styles.shieldBadge}>
                  <ShieldCheck size={16} color={consentAccepted ? '#10b981' : '#6366f1'} />
                  <span>Mandatory Consent & Agreement</span>
                </div>
                <button
                  type="button"
                  style={styles.reviewModalLink}
                  onClick={() => setIsConsentModalOpen(true)}
                >
                  <span>Review Policy</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* Primary Consent Checkbox (REQUIRED) */}
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  style={styles.nativeCheckbox}
                />
                <span style={styles.checkboxCustom}>
                  {consentAccepted && <Check size={14} color="#fff" strokeWidth={3} />}
                </span>
                <span style={styles.checkboxText}>
                  <strong>I unconditionally accept</strong> the Terms of Service, Privacy Policy, and E-Commerce End-User Statutory Consent.
                  <span style={styles.requiredPill}>Required</span>
                </span>
              </label>

              {/* Sub-consent 1: Telemetry */}
              <label style={{ ...styles.checkboxLabel, marginTop: '0.4rem' }}>
                <input
                  type="checkbox"
                  checked={consentTelemetry}
                  onChange={(e) => setConsentTelemetry(e.target.checked)}
                  style={styles.nativeCheckbox}
                />
                <span style={styles.checkboxCustom}>
                  {consentTelemetry && <Check size={14} color="#fff" strokeWidth={3} />}
                </span>
                <span style={styles.checkboxSubText}>
                  Consent to AI product recommendation cookies and shopping session telemetry.
                </span>
              </label>

              {/* Sub-consent 2: Marketing */}
              <label style={{ ...styles.checkboxLabel, marginTop: '0.4rem' }}>
                <input
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  style={styles.nativeCheckbox}
                />
                <span style={styles.checkboxCustom}>
                  {consentMarketing && <Check size={14} color="#fff" strokeWidth={3} />}
                </span>
                <span style={styles.checkboxSubText}>
                  Receive early access to limited luxury drops and seasonal discount codes.
                </span>
              </label>
            </div>
          )}

          {/* Remember Me in Login mode */}
          {mode === 'login' && (
            <div style={styles.rememberRow}>
              <label style={styles.simpleCheckLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.nativeCheckbox}
                />
                <span style={styles.checkboxCustom}>
                  {rememberMe && <Check size={14} color="#fff" strokeWidth={3} />}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Remember my session</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.spinnerRow}>
                <div style={styles.spinner}></div>
                <span>Authenticating Credentials...</span>
              </div>
            ) : (
              <div style={styles.submitBtnContent}>
                <span>{mode === 'login' ? 'Sign In to Store' : 'Complete Registration'}</span>
                <ArrowRight size={18} />
              </div>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Pill */}
        {mode === 'login' && (
          <div style={styles.demoBox}>
            <div style={styles.demoHeader}>
              <Sparkles size={16} color="#f59e0b" />
              <span style={styles.demoTitle}>Quick Evaluation Access</span>
            </div>
            <p style={styles.demoDesc}>
              Test with one-click pre-configured credentials:
            </p>
            <button
              type="button"
              style={styles.demoButton}
              onClick={handleDemoLogin}
            >
              Fill Demo Credentials (demo@store.com)
            </button>
          </div>
        )}

        {/* Footer info */}
        <div style={styles.footerNote}>
          <Info size={14} color="#64748b" />
          <span>Secured with 256-bit mock SSL encryption & cookie compliance</span>
        </div>
      </div>

      {/* Consent Review Modal */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onAccept={() => {
          setConsentAccepted(true);
        }}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.25rem',
    position: 'relative',
    overflow: 'hidden'
  },
  glowOrb1: {
    position: 'absolute',
    top: '-15%',
    left: '10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none'
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '-10%',
    right: '10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0) 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none'
  },
  authWrapper: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'rgba(15, 20, 36, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '2.5rem 2.25rem',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(99, 102, 241, 0.15)',
    backdropFilter: 'blur(16px)',
    position: 'relative',
    zIndex: 10
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  brandLogo: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
  },
  brandTitle: {
    fontSize: '1.45rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#ffffff',
    lineHeight: 1.1
  },
  goldText: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  brandTagline: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '3px'
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: '4px',
    borderRadius: '12px',
    marginBottom: '1.75rem',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  tabBtn: {
    flex: 1,
    padding: '0.65rem 1rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#94a3b8',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  tabBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    color: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(99, 102, 241, 0.4)'
  },
  alertError: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: '#fda4af',
    fontSize: '0.84rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem'
  },
  alertSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: '#6ee7b7',
    fontSize: '0.84rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#cbd5e1'
  },
  forgotLink: {
    fontSize: '0.78rem',
    color: '#818cf8',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 25, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '0.78rem 1rem 0.78rem 2.85rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.9rem',
    borderRadius: '12px'
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.9rem',
    padding: '4px',
    color: '#94a3b8'
  },
  strengthBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.35rem'
  },
  strengthBarContainer: {
    flex: 1,
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    marginRight: '0.75rem',
    overflow: 'hidden'
  },
  strengthBarFill: {
    height: '100%',
    transition: 'width 0.3s ease, background-color 0.3s ease'
  },
  strengthLabel: {
    fontSize: '0.74rem',
    fontWeight: 600
  },
  consentCard: {
    backgroundColor: 'rgba(20, 27, 48, 0.55)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.35rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  },
  consentCardAccepted: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.04)'
  },
  consentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '0.55rem'
  },
  shieldBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#cbd5e1'
  },
  reviewModalLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.74rem',
    color: '#818cf8',
    cursor: 'pointer'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
    cursor: 'pointer',
    position: 'relative'
  },
  nativeCheckbox: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none'
  },
  checkboxCustom: {
    width: '18px',
    height: '18px',
    borderRadius: '5px',
    backgroundColor: 'rgba(10, 14, 25, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
    transition: 'all 0.15s ease'
  },
  checkboxText: {
    fontSize: '0.79rem',
    color: '#e2e8f0',
    lineHeight: 1.4
  },
  checkboxSubText: {
    fontSize: '0.74rem',
    color: '#94a3b8',
    lineHeight: 1.35
  },
  requiredPill: {
    display: 'inline-block',
    fontSize: '0.66rem',
    fontWeight: 700,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    color: '#fb7185',
    padding: '1px 6px',
    borderRadius: '6px',
    marginLeft: '6px'
  },
  rememberRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '-0.25rem'
  },
  simpleCheckLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    cursor: 'pointer'
  },
  submitBtn: {
    marginTop: '0.5rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    color: '#ffffff',
    padding: '0.9rem',
    borderRadius: '12px',
    fontSize: '0.94rem',
    fontWeight: 700,
    boxShadow: '0 8px 25px -4px rgba(99, 102, 241, 0.5)',
    transition: 'transform 0.15s, box-shadow 0.15s'
  },
  submitBtnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.65rem'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite'
  },
  demoBox: {
    marginTop: '1.75rem',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    border: '1px dashed rgba(245, 158, 11, 0.3)',
    borderRadius: '12px',
    padding: '0.9rem 1rem'
  },
  demoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    marginBottom: '0.25rem'
  },
  demoTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fbbf24'
  },
  demoDesc: {
    fontSize: '0.74rem',
    color: '#94a3b8',
    marginBottom: '0.6rem'
  },
  demoButton: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#fef3c7',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid rgba(245, 158, 11, 0.3)',
    transition: 'background 0.2s'
  },
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    fontSize: '0.72rem',
    color: '#64748b',
    marginTop: '1.5rem',
    textAlign: 'center'
  }
};
