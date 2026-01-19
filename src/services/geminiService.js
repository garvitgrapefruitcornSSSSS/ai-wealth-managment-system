// src/services/geminiService.js

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Generate AI response based on user's financial context
 * @param {string} userMessage - User's question
 * @param {object} userProfile - User's financial data
 * @param {array} chatHistory - Previous conversation (optional)
 * @returns {Promise<string>} AI response
 */
export const generateAIResponse = async (
  userMessage,
  userProfile,
  chatHistory = [],
) => {
  try {
    // Calculate savings
    const savings = userProfile.income - userProfile.expenses - userProfile.emi;
    const savingsRate = ((savings / userProfile.income) * 100).toFixed(1);

    // Build context-aware system prompt
    const systemContext = `You are a professional and empathetic wealth management advisor specializing in personal finance for Indian users. Your goal is to provide practical, actionable financial advice.

User's Financial Profile:
- Name: ${userProfile.name}
- Monthly Income: ₹${userProfile.income.toLocaleString()}
- Monthly Expenses: ₹${userProfile.expenses.toLocaleString()}
- Monthly EMI/Loans: ₹${userProfile.emi.toLocaleString()}
- Monthly Savings: ₹${savings.toLocaleString()} (${savingsRate}% savings rate)
- Short-term Goals (1-3 years): ${userProfile.shortTermGoals || "Not specified"}
- Long-term Goals (5+ years): ${userProfile.longTermGoals || "Not specified"}

Guidelines:
1. Always reference their actual financial numbers when giving advice
2. Be encouraging and positive while being realistic
3. Provide specific, actionable steps they can take
4. Consider their goals when making recommendations
5. Use Indian financial context (INR, Indian investment options, tax laws)
6. Keep responses concise but comprehensive (200-300 words ideal)
7. Use emojis sparingly for friendliness

Now respond to their question with personalized advice based on their profile.`;

    // Build conversation history for context
    let conversationText = systemContext + "\n\n";

    // Add previous messages for context (last 5 messages only to stay within token limits)
    const recentHistory = chatHistory.slice(-5);
    recentHistory.forEach((msg) => {
      conversationText += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.text}\n\n`;
    });

    // Add current message
    conversationText += `User: ${userMessage}\n\nAssistant:`;

    // Prepare API request
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: conversationText,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    // Make API call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Extract AI response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};

/**
 * Validate Gemini API key is configured
 * @returns {boolean} True if API key exists
 */
export const isGeminiConfigured = () => {
  return !!GEMINI_API_KEY && GEMINI_API_KEY !== "undefined";
};
