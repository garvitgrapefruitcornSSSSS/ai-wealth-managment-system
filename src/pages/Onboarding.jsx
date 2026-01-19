// src/pages/Onboarding.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveUserProfile } from "../services/firestoreService";
import "../styles/Onboarding.css";

const Onboarding = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    income: "",
    expenses: "",
    emi: "",
    shortTermGoals: "",
    longTermGoals: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      return setError("Please enter your name");
    }

    const income = parseFloat(formData.income);
    const expenses = parseFloat(formData.expenses);
    const emi = parseFloat(formData.emi);

    if (isNaN(income) || income < 0) {
      return setError("Please enter a valid income amount");
    }

    if (isNaN(expenses) || expenses < 0) {
      return setError("Please enter a valid expenses amount");
    }

    if (isNaN(emi) || emi < 0) {
      return setError("Please enter a valid EMI amount");
    }

    if (expenses + emi > income) {
      return setError("Warning: Your expenses + EMI exceed your income!");
    }

    try {
      setError("");
      setLoading(true);

      // Prepare data for Firestore
      const profileData = {
        name: formData.name.trim(),
        email: currentUser.email,
        income: income,
        expenses: expenses,
        emi: emi,
        shortTermGoals: formData.shortTermGoals.trim(),
        longTermGoals: formData.longTermGoals.trim(),
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      await saveUserProfile(currentUser.uid, profileData);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error("Onboarding error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h2>Complete Your Financial Profile</h2>
        <p className="onboarding-subtitle">
          Help us understand your finances to provide personalized AI advice
        </p>

        {error && <div className="error-message">{error}</div>}

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
              placeholder="e.g., 10000 (Enter 0 if none)"
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
              placeholder="e.g., Buy a car, Save for vacation, Emergency fund"
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
              placeholder="e.g., Retirement planning, Buy a house, Children's education"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="onboarding-button"
            disabled={loading}
          >
            {loading ? "Saving Profile..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
