import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  calculateScores,
  calculateGrowthIndex,
  generateLocalPsychometrics,
  generateGeminiPsychometrics
} from '@/persona-ai/assessmentEngine';
import { AIInsights, StudentAssessment } from '@/persona-ai/types';

// Initialize Gemini Client safely from GEMINI_API_KEY
function getGeminiClient(): GoogleGenAI | null {
  let geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  geminiKey = geminiKey.trim();
  if (
    (geminiKey.startsWith('"') && geminiKey.endsWith('"')) ||
    (geminiKey.startsWith("'") && geminiKey.endsWith("'"))
  ) {
    geminiKey = geminiKey.substring(1, geminiKey.length - 1).trim();
  }

  if (!geminiKey || geminiKey === 'MY_GEMINI_API_KEY' || geminiKey === 'undefined') {
    return null;
  }

  try {
    return new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('[Gemini Init Error] Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generatePsychometricsWithRetryAndFallback(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string; grade: string },
  answersTextSummary: string,
  geminiClient: any,
  maxRetries = 2
): Promise<AIInsights> {
  let attempt = 0;
  let lastError: any = null;

  while (attempt <= maxRetries) {
    try {
      console.log(`[Gemini Attempt ${attempt + 1}/${maxRetries + 1}] Invoking Gemini AI for ${studentDetails.name}...`);
      const insights = await generateGeminiPsychometrics(scores, studentDetails, answersTextSummary, geminiClient);
      console.log(`[Gemini Success] Successfully generated psychometrics with Gemini AI for ${studentDetails.name}`);
      return insights;
    } catch (err: any) {
      attempt++;
      lastError = err;
      console.error(`[Gemini Error] Attempt ${attempt} failed for ${studentDetails.name}:`, err.message || err);
      if (attempt <= maxRetries) {
        const waitTime = attempt * 1500; // Exponential backoff: 1.5s, 3s
        console.log(`[Gemini Retry] Retrying in ${waitTime}ms...`);
        await delay(waitTime);
      }
    }
  }

  throw new Error(lastError ? (lastError.message || JSON.stringify(lastError)) : 'Gemini AI failed to respond after retries.');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, answers, studentDetails } = body;

    if (!studentId || !answers || !Array.isArray(answers) || !studentDetails) {
      return NextResponse.json(
        { error: 'Missing assessment payload data (studentId, answers, studentDetails required).' },
        { status: 400 }
      );
    }

    console.log(`[Assessment Evaluation] Processing psychometric evaluation for ${studentDetails.name} (ID: ${studentId})`);

    const scores = calculateScores(answers);
    const growthIndex = calculateGrowthIndex(scores);

    const answersTextSummary = answers.map((ans: any, idx: number) => {
      return `Q${idx + 1}: Category: ${ans.category}, Score: ${ans.score}/4`;
    }).join('\n');

    let aiInsights: AIInsights;
    let usedLocalFallback = false;

    const ai = getGeminiClient();

    if (ai) {
      try {
        aiInsights = await generatePsychometricsWithRetryAndFallback(
          scores,
          {
            name: studentDetails.name,
            age: parseInt(String(studentDetails.age), 10) || 16,
            gender: studentDetails.gender || 'Male',
            grade: studentDetails.grade || studentDetails.className || 'Grade 10'
          },
          answersTextSummary,
          ai
        );
      } catch (err: any) {
        console.warn('[Gemini AI Warning] Live evaluation failed. Falling back to local counselor synthesis engine:', err.message || err);
        aiInsights = generateLocalPsychometrics(scores, {
          name: studentDetails.name,
          age: parseInt(String(studentDetails.age), 10) || 16,
          gender: studentDetails.gender || 'Male'
        });
        usedLocalFallback = true;
      }
    } else {
      console.log('[Gemini Config] GEMINI_API_KEY not configured or empty. Using local clinical counselor engine.');
      aiInsights = generateLocalPsychometrics(scores, {
        name: studentDetails.name,
        age: parseInt(String(studentDetails.age), 10) || 16,
        gender: studentDetails.gender || 'Male'
      });
      usedLocalFallback = true;
    }

    const assessmentId = `assess_${Date.now()}`;
    const assessment: StudentAssessment = {
      id: assessmentId,
      studentId,
      studentDetails: {
        name: studentDetails.name,
        age: parseInt(String(studentDetails.age), 10) || 16,
        gender: studentDetails.gender || 'Male',
        grade: studentDetails.grade || studentDetails.className || 'Grade 10',
        section: studentDetails.section || 'A',
        school: studentDetails.school || 'Brain Academy'
      },
      answers,
      scores,
      growthIndex,
      date: new Date().toISOString().split('T')[0],
      aiInsights
    };

    return NextResponse.json({
      success: true,
      assessment,
      usedLocalFallback,
      source: usedLocalFallback ? 'local' : 'gemini'
    });
  } catch (error: any) {
    console.error('[Assessment Submit Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while processing assessment.' },
      { status: 500 }
    );
  }
}
