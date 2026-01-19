// src/pages/Profile.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/firestoreService';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    income: '',
    expenses: '',
    emi: '',
    shortTermGoals: '',
    longTermGoals: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(currentUser.uid);
        
        if (profile) {
          const data = {
            name: profile.name || '',
            income: profile.income || '',
            expenses: profile.expenses || '',
            emi: profile.emi || '',
            shortTermGoals: profile.shortTermGoals || '',
            longTermGoals: profile.longTermGoals || ''
          };
          setFormData(data);
          setOriginalData(data);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  // Check if form has changes
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      return setError('Please enter your name');
    }

    const income = parseFloat(formData.income);
    const expenses = parseFloat(formData.expenses);
    const emi = parseFloat(formData.emi);

    if (isNaN(income) || income < 0) {
      return setError('Please enter a valid income amount');
    }

    if (isNaN(expenses) || expenses < 0) {
      return setError('Please enter a valid expenses amount');
    }

    if (isNaN(emi) || emi < 0) {
      return setError('Please enter a valid EMI amount');
    }

    try {
      setSaving(true);
      setError('');

      const updatedData = {
        name: formData.name.trim(),
        income: income,
        expenses: expenses,
        emi: emi,
        shortTermGoals: formData.shortTermGoals.trim(),
        longTermGoals: formData.longTermGoals.trim()
      };

      await updateUserProfile(currentUser.uid, updatedData);
      
      setOriginalData(formData);
      setSuccess('Profile updated successfully! 🎉');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Reset form to original values
  const handleReset = () => {
    setFormData(originalData);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="loading">Loading your profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h2>Edit Your Profile</h2>
          <p>Update your financial information</p>
        </div>

        <div className="profile-card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="readonly-input"
              />
              <small>Email cannot be changed</small>
            </div>

            {/* Monthly Income */}
            <div className="form-group">
              <label>Monthly Income (₹) *</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                placeholder="e.g., 50000"
                min="0"
                step="1000"
                required
              />
            </div>

            {/* Monthly Expenses */}
            <div className="form-group">
              <label>Monthly Expenses (₹) *</label>
              <input
                type="number"
                name="expenses"
                value={formData.expenses}
                onChange={handleChange}
                placeholder="e.g., 30000"
                min="0"
                step="1000"
                required
              />
            </div>

            {/* EMI/Loans */}
            <div className="form-group">
              <label>Monthly EMI / Loan Payments (₹) *</label>
              <input
                type="number"
                name="emi"
                value={formData.emi}
                onChange={handleChange}
                placeholder="e.g., 10000"
                min="0"
                step="1000"
                required
              />
            </div>

            {/* Short-term Goals */}
            <div className="form-group">
              <label>Short-term Financial Goals (1-3 years)</label>
              <textarea
                name="shortTermGoals"
                value={formData.shortTermGoals}
                onChange={handleChange}
                placeholder="e.g., Buy a car, Save for vacation"
                rows="3"
              />
            </div>

            {/* Long-term Goals */}
            <div className="form-group">
              <label>Long-term Financial Goals (5+ years)</label>
              <textarea
                name="longTermGoals"
                value={formData.longTermGoals}
                onChange={handleChange}
                placeholder="e.g., Retirement, Buy a house"
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleReset}
                className="reset-button"
                disabled={!hasChanges() || saving}
              >
                Reset Changes
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={!hasChanges() || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;