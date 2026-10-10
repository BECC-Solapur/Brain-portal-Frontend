
export interface CounsellorReport {
  studentProfile: {
    name: string;
    age: number;
    gender: string;
    grade: string;
    assessmentDate: string;
    school?: string;
  };
  executiveSummary: {
    overallBehaviouralProfile: string;
    emotionalFunctioning: string;
    learningProfile: string;
    growthPotential: string;
    overallObservations: string;
  };
  assessmentInterpretation: string;
  personalityAnalysis: {
    characteristics: string;
    behaviouralTendencies: string;
    selfAwareness: string;
    emotionalMaturity: string;
    adaptability: string;
    independence: string;
    responsibility: string;
    socialOrientation: string;
  };
  emotionalFunctioning: {
    emotionalRegulation: string;
    stressTolerance: string;
    emotionalResilience: string;
    selfControl: string;
    empathy: string;
    copingMechanisms: string;
    emotionalTriggers: string;
  };
  learningCognitiveProfile: {
    preferredLearningStyle: string;
    studyBehaviour: string;
    attentionPatterns: string;
    informationProcessing: string;
    curiosity: string;
    academicPersistence: string;
    memoryStrategies: string;
    practicalVsConceptual: string;
  };
  communicationSocialBehaviour: {
    communicationStyle: string;
    listeningBehaviour: string;
    classroomParticipation: string;
    peerInteraction: string;
    collaboration: string;
    conflictHandling: string;
    assertiveness: string;
  };
  leadershipResponsibility: {
    initiative: string;
    accountability: string;
    teamwork: string;
    decisionMaking: string;
    leadershipReadiness: string;
  };
  motivationGoalOrientation: {
    intrinsicMotivation: string;
    extrinsicMotivation: string;
    achievementOrientation: string;
    consistency: string;
    persistence: string;
    selfDiscipline: string;
  };
  decisionMakingCriticalThinking: {
    reasoning: string;
    planning: string;
    judgment: string;
    riskAwareness: string;
    problemSolvingStyle: string;
  };
  creativityInnovation: {
    curiosity: string;
    imagination: string;
    ideaGeneration: string;
    flexibility: string;
    innovationPotential: string;
  };
  careerDevelopmentReadiness: {
    careerAwareness: string;
    occupationalInterests: string;
    futurePlanning: string;
    readinessForExploration: string;
    recommendedDomains: string[];
  };
  strengths: { characteristic: string; whyItMatters: string }[];
  developmentAreas: { area: string; whyItMatters: string; educationalImpact: string; improvementStrategy: string }[];
  behaviouralObservations: {
    classroom: string;
    groupActivities: string;
    examinations: string;
    competitiveSituations: string;
    homeEnvironment: string;
  };
  riskIndicators: string[];
  counsellingRecommendations: {
    priorityDiscussionTopics: string[];
    confidenceBuildingStrategies: string[];
    behaviouralCoachingIdeas: string[];
    emotionalRegulationTechniques: string[];
    academicSupportSuggestions: string[];
  };
  parentRecommendations: string[];
  teacherRecommendations: string[];
  longTermDevelopmentPlan: {
    month1To2: string;
    month3To4: string;
    month5To6: string;
  };
}

export interface StudentParentReport {
  aboutYou: string;
  yourStrengths: {
    title: string;
    explanation: string;
    practicalExample: string;
  }[];
  yourLearningStyle: {
    howYouLearnBest: string;
    studyTips: string[];
    revisionSuggestions: string[];
    memoryImprovementTechniques: string[];
  };
  howYouHandleChallenges: {
    exams: string;
    difficultSituations: string;
    mistakes: string;
    pressure: string;
    encouragingAdvice: string;
  };
  areasToImprove: {
    growthOpportunity: string;
    actionableTip: string;
  }[];
  yourFuturePotential: string;
  tipsForParents: string[];
  finalEncouragement: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Student' | 'Teacher' | 'Parent' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  school?: string;
  childId?: string; // For Parent to link to their child's student ID
  className?: string; // For Student / Teacher
  section?: string; // For Student / Teacher
  age?: number;
  gender?: string;
  createdAt?: string;
}

export interface Question {
  id: number;
  category: string;
  questionText: string;
  questionTextMarathi?: string;
  options: {
    text: string;
    textMarathi?: string;
    score: number; // 1 to 4
  }[];
}

export interface AssessmentAnswer {
  questionId: number;
  category: string;
  score: number; // 1 to 4
}

export interface RecommendationItem {
  recommendation: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  expectedOutcome: string;
  timeline: string;
}

export interface AIInsights {
  summary: string;
  personalityType: string;
  communicationType: string;
  leadershipType: string;
  careerSuggestion: string;
  topStrengths: string[];
  topGrowthAreas: string[];
  studyHabitAnalysis: string;
  stressHandling: string;
  decisionMakingStyle: string;
  emotionalStability: string;
  motivationPattern: string;
  teamBehavior: string;
  criticalThinking: string;
  problemSolving: string;
  innovationLevel: string;
  socialInteraction: string;
  futureReadiness: string;
  riskIndicator: 'Low' | 'Medium' | 'High';
  recommendations: {
    forStudent: RecommendationItem[];
    forTeacher: RecommendationItem[];
    forParent: RecommendationItem[];
    forCounselor: RecommendationItem[];
    forSchool: RecommendationItem[];
    forCareer: RecommendationItem[];
  };
  predictions: {
    futureLeadership: number; // 0 - 100
    careerCluster: string;
    learningRisk: 'Low' | 'Medium' | 'High';
    confidenceRisk: 'Low' | 'Medium' | 'High';
    stressRisk: 'Low' | 'Medium' | 'High';
    communicationRisk: 'Low' | 'Medium' | 'High';
    academicReadiness: number; // 0 - 100
    careerReadinessScore: number; // 0 - 100
    improvementProbability: number; // 0 - 100
  };
  marathi?: {
    summary: string;
    personalityType: string;
    communicationType: string;
    leadershipType: string;
    careerSuggestion: string;
    topStrengths: string[];
    topGrowthAreas: string[];
    studyHabitAnalysis: string;
    stressHandling: string;
    decisionMakingStyle: string;
    emotionalStability: string;
    motivationPattern: string;
    teamBehavior: string;
    criticalThinking: string;
    problemSolving: string;
    innovationLevel: string;
    socialInteraction: string;
    futureReadiness: string;
    recommendations: {
      forStudent: RecommendationItem[];
      forTeacher: RecommendationItem[];
      forParent: RecommendationItem[];
      forCounselor: RecommendationItem[];
      forSchool: RecommendationItem[];
      forCareer: RecommendationItem[];
    };
    predictions?: {
      careerCluster: string;
    };
    counsellorReport?: CounsellorReport;
    studentReport?: StudentParentReport;
  };
  counsellorReport?: CounsellorReport;
  studentReport?: StudentParentReport;
  isFallback?: boolean;
}

export interface StudentAssessment {
  id: string;
  studentId: string;
  studentDetails: {
    name: string;
    age: number;
    gender: string;
    grade: string;
    section: string;
    school: string;
  };
  answers: AssessmentAnswer[];
  scores: {
    [category: string]: number; // Category scores scaled from 0 to 100
  };
  growthIndex: number; // Overall weighted growth index (0 - 100)
  date: string; // YYYY-MM-DD
  aiInsights: AIInsights;
}

export interface ClassPerformance {
  className: string;
  section: string;
  averageGrowthIndex: number;
  totalStudents: number;
  completedAssessments: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
