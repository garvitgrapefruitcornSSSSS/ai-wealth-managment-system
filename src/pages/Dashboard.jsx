// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/firestoreService";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await getUserProfile(currentUser.uid);

        if (!profile) {
          // User hasn't completed onboarding
          navigate("/onboarding");
          return;
        }

        setUserData(profile);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  // Calculate financial metrics
  const calculateMetrics = () => {
    if (!userData) return null;

    const savings = userData.income - userData.expenses - userData.emi;
    const savingsRate = ((savings / userData.income) * 100).toFixed(1);
    const expenseRatio = ((userData.expenses / userData.income) * 100).toFixed(
      1,
    );
    const emiRatio = ((userData.emi / userData.income) * 100).toFixed(1);

    return {
      savings,
      savingsRate,
      expenseRatio,
      emiRatio,
    };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="loading">Loading your financial data...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  const metrics = calculateMetrics();

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Welcome back, {userData.name}! 👋</h2>
          <p>Here's your financial overview</p>
        </div>

        {/* Financial Summary Cards */}
        <div className="metrics-grid">
          {/* Monthly Income */}
          <div className="metric-card income">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Monthly Income</h3>
              <p className="metric-value">
                ₹{userData.income.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="metric-card expenses">
            <div className="metric-icon">💸</div>
            <div className="metric-content">
              <h3>Monthly Expenses</h3>
              <p className="metric-value">
                ₹{userData.expenses.toLocaleString()}
              </p>
              <p className="metric-detail">{metrics.expenseRatio}% of income</p>
            </div>
          </div>

          {/* EMI/Loans */}
          <div className="metric-card emi">
            <div className="metric-icon">🏦</div>
            <div className="metric-content">
              <h3>Monthly EMI</h3>
              <p className="metric-value">₹{userData.emi.toLocaleString()}</p>
              <p className="metric-detail">{metrics.emiRatio}% of income</p>
            </div>
          </div>

          {/* Monthly Savings */}
          <div
            className={`metric-card savings ${metrics.savings < 0 ? "negative" : ""}`}
          >
            <div className="metric-icon">
              {metrics.savings >= 0 ? "✅" : "⚠️"}
            </div>
            <div className="metric-content">
              <h3>Monthly Savings</h3>
              <p className="metric-value">
                ₹{metrics.savings.toLocaleString()}
              </p>
              <p className="metric-detail">
                {metrics.savings >= 0
                  ? `${metrics.savingsRate}% savings rate`
                  : "Overspending!"}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Goals Section */}
        <div className="goals-section">
          <h3>Your Financial Goals</h3>

          <div className="goals-grid">
            {/* Short-term Goals */}
            <div className="goal-card">
              <h4>🎯 Short-term Goals (1-3 years)</h4>
              <p>{userData.shortTermGoals || "No goals set yet"}</p>
            </div>

            {/* Long-term Goals */}
            <div className="goal-card">
              <h4>🚀 Long-term Goals (5+ years)</h4>
              <p>{userData.longTermGoals || "No goals set yet"}</p>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="insights-section">
          <h3>Quick Insights</h3>
          <div className="insight-list">
            {metrics.savings >= 0 ? (
              <div className="insight-item positive">
                ✅ Great! You're saving {metrics.savingsRate}% of your income
              </div>
            ) : (
              <div className="insight-item negative">
                ⚠️ Warning: Your expenses exceed your income by ₹
                {Math.abs(metrics.savings).toLocaleString()}
              </div>
            )}

            {metrics.expenseRatio > 70 && (
              <div className="insight-item warning">
                💡 Your expense ratio is {metrics.expenseRatio}%. Consider
                reducing non-essential spending.
              </div>
            )}

            {metrics.emiRatio > 40 && (
              <div className="insight-item warning">
                💡 Your EMI is {metrics.emiRatio}% of income. Experts recommend
                keeping it below 40%.
              </div>
            )}

            {metrics.savingsRate >= 20 && (
              <div className="insight-item positive">
                🎉 Excellent savings rate! You're on track for your financial
                goals.
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="dashboard-actions">
          <button onClick={() => navigate("/chat")} className="chat-cta">
            💬 Get AI Financial Advice
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
