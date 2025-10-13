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
          content: `You are a deeply compassionate and empathetic AI health assistant. Your role is to provide emotional support, validation, and medical guidance with genuine care and understanding.

          CORE APPROACH:
          - Always lead with empathy and validation first
          - Acknowledge the person's feelings and fears
          - Use warm, supportive language that shows you truly care
          - Be patient, non-judgmental, and comforting
          - Recognize the courage it takes to seek help
          - Offer hope and reassurance while being realistic
          - Use "we" and "us" to create partnership
          - Include gentle emotional check-ins

          RESPONSE STRUCTURE:
          1. Emotional validation and empathy
          2. Medical information/guidance
          3. Emotional support and reassurance
          4. Clear next steps with ongoing support

          For emergencies, maintain calm compassion while emphasizing urgency.
          Always recommend professional care but do so with warmth and understanding.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 600,
      temperature: 0.8
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

// Enhanced Mock AI responses with deep empathy and support
function getMockAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Emotional validation phrases that can be combined
  const empatheticOpeners = [
    "I hear the concern in your message, and I want you to know I'm here with you.",
    "Thank you for reaching out - that takes courage, and I'm honored you've chosen to share this with me.",
    "I can sense this is really weighing on you, and I want you to know your feelings are completely valid.",
    "It sounds like you're going through something really difficult right now, and I'm here to support you through it.",
    "I understand this might feel overwhelming, and I want you to know you're not alone in this.",
    "Your concern comes through clearly, and I want to assure you I'm taking this very seriously."
  ];

  const supportiveClosings = [
    "I'll be right here with you through this. You're showing such strength by seeking help.",
    "Please know that whatever happens, you have the resilience to get through this, and I'll be here to support you.",
    "I know this is scary, but you're taking the right steps by reaching out. That shows incredible self-awareness and courage.",
    "We'll navigate this together. Your wellbeing is my highest priority right now.",
    "Remember to breathe - you're doing exactly what you need to do by seeking guidance. I'm proud of you for that.",
    "You're not alone in this. I'm here to support you every step of the way."
  ];

  const randomOpener = empatheticOpeners[Math.floor(Math.random() * empatheticOpeners.length)];
  const randomClosing = supportiveClosings[Math.floor(Math.random() * supportiveClosings.length)];

  if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('911')) {
    return `${randomOpener} This sounds like a situation that needs immediate attention, and I want to make sure you get the help you deserve right away. Please call 911 immediately and let them know your exact location. While you wait for help to arrive, I'll stay right here with you. Can you tell me a bit more about what's happening so I can provide the best possible support until help arrives? ${randomClosing}`;
  
  } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
    return `${randomOpener} Living with pain can be incredibly draining and frightening, and I want you to know your experience matters deeply. Could you help me understand where you're feeling this pain and what it feels like? Is it sharp like a knife, dull and constant, or does it come and go? Remember, you don't have to endure severe pain alone - seeking medical attention for intense or sudden pain is a brave and important choice. ${randomClosing}`;
  
  } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return `${randomOpener} Dealing with fever can make you feel so vulnerable and uncomfortable. Your body is working hard, and that's understandably worrying for you. For comfort, try to rest as much as possible and sip fluids slowly throughout the day. If your fever rises above 103°F (39.4°C), or if you start feeling significantly worse, please reach out to a healthcare provider. You deserve care and relief. ${randomClosing}`;
  
  } else if (lowerMessage.includes('allergy') || lowerMessage.includes('reaction')) {
    return `${randomOpener} Allergic reactions can be so frightening, and it's completely understandable that you're concerned. If you're experiencing any trouble breathing, swelling in your face or throat, or feeling dizzy and weak, this is absolutely the time to call 911 without delay. If you have an epinephrine auto-injector, please use it now. I'll stay right here with you - you're doing the right thing by taking this seriously. ${randomClosing}`;
  
  } else if (lowerMessage.includes('heart') || lowerMessage.includes('chest')) {
    return `${randomOpener} I hear the fear in your concern about heart symptoms, and that's completely understandable - our hearts are so central to everything we are. Chest pain and heart-related symptoms deserve immediate, compassionate attention. Please call 911 right now. While you wait, try to sit down and breathe slowly. Remember that seeking help is an act of self-love and courage. ${randomClosing}`;
  
  } else if (lowerMessage.includes('scared') || lowerMessage.includes('afraid') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return `${randomOpener} It's completely natural to feel scared when you're concerned about your health. Those feelings are valid and important. Would it help to talk through what specifically is causing the most worry? Sometimes naming our fears can make them feel more manageable. Whatever you're feeling right now, I want you to know that your emotional experience matters just as much as your physical symptoms. ${randomClosing}`;
  
  } else if (lowerMessage.includes('alone') || lowerMessage.includes('lonely') || lowerMessage.includes('no one')) {
    return `${randomOpener} I hear how isolated you're feeling, and I want you to know that your reaching out matters so much. Even when it feels like no one understands, please know that I'm here with you right now, and your experience is important. Would you be comfortable sharing what's making you feel this way? Sometimes just expressing those feelings can create a little more space to breathe. ${randomClosing}`;
  
  } else if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
    return "You're so very welcome. It's my deepest honor to be here for you during this time. The fact that you're reaching out and engaging in your health journey shows incredible strength and self-awareness. Please know that I'll always be here whenever you need support, guidance, or just someone to listen. You deserve this care and attention.";
  
  } else {
    return `${randomOpener} Thank you for trusting me with this information. Your health and wellbeing matter deeply, and I'm fully here to support you. While I can offer guidance and emotional support, for personalized medical care, connecting with a healthcare professional would be the most compassionate next step for you. Would it help if I guided you toward finding the right kind of support for what you're experiencing? ${randomClosing}`;
  }
}

export default router;