import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI (optional)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!openai) {
      // Fallback to mock responses if OpenAI not configured
      const mockResponse = getMockAIResponse(message);
      return res.json({
        status: 'success',
        data: {
          response: mockResponse,
          isMock: true
        }
      });
    }
    
    // Real OpenAI integration
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI health assistant for emergency situations. 
          Provide helpful, accurate medical information but always recommend 
          consulting healthcare professionals for serious issues. 
          For emergencies, always advise calling 911 immediately.
          Be empathetic, clear, and professional.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const response = completion.choices[0].message.content;
    
    res.json({
      status: 'success',
      data: {
        response,
        isMock: false
      }
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback to mock response
    const mockResponse = getMockAIResponse(req.body.message);
    res.json({
      status: 'success',
      data: {
        response: mockResponse,
        isMock: true,
        error: 'Using fallback response'
      }
    });
  }
});

// Mock AI responses (fallback)
function getMockAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('911')) {
    return "I understand this is an emergency. Please remain calm. Call 911 immediately and provide your exact location. While waiting for help, can you tell me more about the situation so I can provide guidance?";
  } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
    return "I'm sorry you're experiencing pain. Can you describe the location and intensity of the pain? Is it sharp, dull, or throbbing? For severe or sudden pain, please seek immediate medical attention.";
  } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return "For fever management: rest, drink plenty of fluids, and consider taking acetaminophen if appropriate. If fever is above 103°F (39.4°C) or lasts more than 3 days, or if you have other severe symptoms, seek medical attention.";
  } else if (lowerMessage.includes('allergy') || lowerMessage.includes('reaction')) {
    return "If you're experiencing severe allergic reaction symptoms like difficulty breathing, swelling of face/throat, or dizziness, this is a medical emergency. Use an epinephrine auto-injector if available and call 911 immediately.";
  } else if (lowerMessage.includes('heart') || lowerMessage.includes('chest')) {
    return "Chest pain or heart-related symptoms should always be taken seriously. Please call 911 immediately. While waiting, sit down and try to remain calm. Do not drive yourself to the hospital.";
  } else {
    return "Thank you for sharing this information. I'm here to help with health guidance. For personalized medical advice, please consult with a healthcare professional. Would you like me to help you find nearby medical resources or provide first aid information?";
  }
}

export default router;