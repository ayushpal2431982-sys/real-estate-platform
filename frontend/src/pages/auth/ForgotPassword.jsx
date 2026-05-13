import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { forgotPasswordStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            if (res.data.success) {
                setSuccess("Password reset link sent! Please check your email.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <Navbar />
            <div className={s.centerWrapper}>
                <div className={s.formCard}>
                    <h2 className={s.title}>Forgot Password</h2>
                    <p className={s.subtitle}>
                        Enter your email address to receive a password reset link.
                    </p>
                    {error && <div className={s.errorMessage}>{error}</div>}
                    {success && <div className={s.successMessage}>{success}</div>}
                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                placeholder='name@company.com'
                                required
                                className={s.input}
                            // ✅ readOnly removed
                            />
                        </div>
                        <button className={s.submitButton} type='submit' disabled={isLoading}>
                            {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>
                    <p className={s.footerText}>
                        Remembered your password?{" "}
                        <Link to="/login" className={s.link}>Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;