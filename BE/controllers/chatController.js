const axios = require("axios");

/**
 * Proxy chat messages to a third-party AI API
 * @route POST /api/chat
 * @access Public
 */
const proxyChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // For this example, we'll use OpenAI's API
    // In a real application, you might use different APIs based on configuration
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "AI API key is not configured",
      });
    }

    // Make a request to the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for a visa services platform.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the AI's response
    const aiResponse = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
      },
    });
  } catch (error) {
    console.error("Error proxying chat:", error);
    res.status(500).json({
      success: false,
      message: "Error communicating with AI service",
      error: error.message,
    });
  }
};

module.exports = {
  proxyChat,
};
