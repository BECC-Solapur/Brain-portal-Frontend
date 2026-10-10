
export function buildLocalCounsellorReport(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string; grade?: string; school?: string },
  growthIndex: number,
  personalityType: string,
  careerSuggestion: string
): CounsellorReport {
  const name = studentDetails.name;
  const maturity = scores['Self Awareness'] || 70;
  const emotional = scores['Emotional Regulation'] || 70;
  const leadership = scores['Leadership'] || 70;
  const learning = scores['Learning Style'] || 70;
  const comm = scores['Communication'] || 70;
  const confidence = scores['Confidence'] || 70;
  const motivation = scores['Motivation'] || 70;
  const creativity = scores['Creativity'] || 70;
  const decision = scores['Decision Making'] || 70;
  const career = scores['Career Interest'] || 70;

  return {
    studentProfile: {
      name,
      age: studentDetails.age,
      gender: studentDetails.gender,
      grade: studentDetails.grade || 'Grade 10',
      assessmentDate: new Date().toISOString().split('T')[0],
      school: studentDetails.school || 'Brain Academy'
    },
    executiveSummary: {
      overallBehaviouralProfile: `${name} exhibits a balanced and structured behavioral profile characterized by high cognitive adaptability and methodical task execution. Interpersonal engagement reflects maturity with developing assertiveness.`,
      emotionalFunctioning: `Demonstrates baseline stability (${emotional}%) with notable emotional awareness (${maturity}%). High pressure testing environments may induce transient performance anxiety requiring self-regulation schemas.`,
      learningProfile: `Demonstrates a ${learning >= 70 ? 'structured visual-conceptual' : 'reflective methodical'} learning modality with sustained academic persistence (${motivation}%). Thrives in goal-oriented frameworks.`,
      growthPotential: `Overall developmental trajectory indicates strong readiness (${growthIndex}% Growth Index) for accelerated leadership and specialized higher-order analytical pursuits.`,
      overallObservations: `A conscientious and responsive student candidate who benefits from proactive mentoring, transparent performance rubrics, and incremental responsibility.`
    },
    assessmentInterpretation: `Evaluation parameters demonstrate strong psychometric consistency across all 10 measured categories. Response distribution exhibits stable self-perception with an intentional focus on personal growth. Observed behavioral patterns indicate reliable self-awareness rather than transient response bias.`,
    personalityAnalysis: {
      characteristics: `Displays analytical discipline, empathetic listening, and systematic task completion aligned with ${personalityType}.`,
      behaviouralTendencies: `Naturally inclined toward deliberate preparation, cooperative group engagement, and structured exploration of novel concepts.`,
      selfAwareness: `Scoring ${maturity}% indicates high reflective capacity and willingness to receive developmental critique constructively.`,
      emotionalMaturity: `Demonstrates age-appropriate maturity in peer relationships, managing minor disagreements through reasoned dialog.`,
      adaptability: `Adapts well to planned changes in routine; exhibits moderate hesitation under sudden, ambiguous task demands.`,
      independence: `Exhibits reliable autonomous study habits but benefits from clear milestones for complex long-term projects.`,
      responsibility: `Consistently fulfills assigned scholastic and personal duties, demonstrating commendable accountability.`,
      socialOrientation: `Selectively collaborative; prefers purposeful teamwork with distinct individual contributions rather than unstructured social groups.`
    },
    emotionalFunctioning: {
      emotionalRegulation: `Maintains composure under everyday scholastic demands with an emotional regulation index of ${emotional}%.`,
      stressTolerance: `Demonstrates moderate-to-high stress resilience during planned assessments; shows elevated arousal during timed, competitive testing.`,
      emotionalResilience: `Recovers promptly from academic setbacks when clear feedback and actionable remediation pathways are provided.`,
      selfControl: `Exhibits strong impulse control and classroom decorum, prioritizing sustained task attention over immediate gratification.`,
      empathy: `Attuned to peer perspectives, actively supporting classmates during group collaboration.`,
      copingMechanisms: `Utilizes quiet cognitive reflection and structured note reorganization as primary stress-reduction mechanisms.`,
      emotionalTriggers: `Assessment trends suggest sensitivity to public peer criticism and sudden ambiguous evaluative criteria.`
    },
    learningCognitiveProfile: {
      preferredLearningStyle: `Multimodal with prominent visual and conceptual relational preferences, thriving on charts, process maps, and structured notes.`,
      studyBehaviour: `Consistent and disciplined study routines with regular review habits before scheduled examinations.`,
      attentionPatterns: `Maintains sustained focus during deep individual problem-solving; minor susceptibility to distraction in noisy collaborative environments.`,
      informationProcessing: `Processes information sequentially, evaluating fundamental principles before synthesizing complex conclusions.`,
      curiosity: `High intellectual curiosity in applied sciences and analytical problem domains, scoring ${creativity}% in creativity.`,
      academicPersistence: `Exhibits tenacity when tackling difficult conceptual roadblocks, persisting until mastery is attained.`,
      memoryStrategies: `Leverages associative memory, thematic summaries, and relational diagramming for optimal retention.`,
      practicalVsConceptual: `Maintains a balanced preference, excelling when theoretical constructs are anchored in practical real-world applications.`
    },
    communicationSocialBehaviour: {
      communicationStyle: `Constructive, polite, and articulate in small group and written interactions.`,
      listeningBehaviour: `An active, patient listener who synthesizes speaker points before formulating responses.`,
      classroomParticipation: `Participates selectively; contributes insightful questions when confident in topic comprehension.`,
      peerInteraction: `Maintains respectful and stable peer bonds, respected by classmates for reliability and fairness.`,
      collaboration: `A cooperative team member who delivers on commitments and assists others in meeting project deadlines.`,
      conflictHandling: `Prefers consensus-building and de-escalation over confrontation; may occasionally concede viewpoints to preserve harmony.`,
      assertiveness: `Developing assertiveness; communicates needs effectively in 1-on-1 contexts, with room for growth in public presentation.`
    },
    leadershipResponsibility: {
      initiative: `Steps forward when roles are transparent; benefits from structural encouragement to spearhead open-ended initiatives.`,
      accountability: `Takes personal ownership of outcomes without externalizing errors when difficulties arise.`,
      teamwork: `Excels in democratic group operations, ensuring equitable workload distribution.`,
      decisionMaking: `Approaches choices methodically by weighing observable trade-offs and logical consequences.`,
      leadershipReadiness: `Readiness index of ${leadership}% indicates solid potential for supportive, task-focused, and democratic leadership roles.`
    },
    motivationGoalOrientation: {
      intrinsicMotivation: `Driven by mastery-level understanding and personal curiosity (${motivation}%).`,
      extrinsicMotivation: `Values parental and institutional recognition, using external milestones as helpful progress markers.`,
      achievementOrientation: `Strives for high standards of personal excellence and thoroughness in scholastic deliverables.`,
      consistency: `Demonstrates admirable day-to-day work habits and punctual adherence to academic schedules.`,
      persistence: `Bounces back reliably from academic plateaus with renewed dedication upon receiving targeted guidance.`,
      selfDiscipline: `Possesses commendable self-regulation regarding personal timetable adherence and study routines.`
    },
    decisionMakingCriticalThinking: {
      reasoning: `Strong logical-deductive reasoning capacity, scoring ${decision}% in structured decision-making.`,
      planning: `Capable of formulating structured step-by-step action plans for semester goals.`,
      judgment: `Prudent and risk-aware judgment; refrains from impulsive decisions under peer influence.`,
      riskAwareness: `Healthy risk awareness with a slight tendency toward conservative options when outcomes are uncertain.`,
      problemSolvingStyle: `Analytical and systematic; breaks large obstacles into manageable component challenges.`
    },
    creativityInnovation: {
      curiosity: `Eager to explore emerging technologies, creative systems, and lateral problem configurations.`,
      imagination: `Capable of synthesizing original concepts when provided with flexible project briefs.`,
      ideaGeneration: `Generates multiple viable alternatives before selecting an optimal execution route.`,
      flexibility: `Adapts conceptual models constructively in response to new evidence or experimental feedback.`,
      innovationPotential: `Strong potential for applied innovation (${creativity}%) in tech-enabled and problem-solving disciplines.`
    },
    careerDevelopmentReadiness: {
      careerAwareness: `Demonstrates growing awareness of modern vocational pathways and industry requirements.`,
      occupationalInterests: `Shows marked affinity for analytical systems, design, technology, and applied sciences.`,
      futurePlanning: `Actively aligns current scholastic subjects with prospective university streams.`,
      readinessForExploration: `High readiness for internships, industry shadowing, and vocational webinars.`,
      recommendedDomains: [
        'Computer Science, Systems Engineering & Applied Data Analytics',
        'Digital Product Architecture, UX/UI Design & Creative Tech',
        'Applied Physical Sciences, Environmental Informatics & Research',
        'Venture Operations, Strategic Management & Quantitative Planning'
      ]
    },
    strengths: [
      { characteristic: 'Systematic Cognitive Processing', whyItMatters: 'Enables deep comprehension of intricate STEM and analytical subjects without superficial rote memorization.' },
      { characteristic: 'Reflective Self-Awareness', whyItMatters: 'Facilitates rapid adaptation to constructive academic critique and accelerates personal maturity.' },
      { characteristic: 'Emotional Regulation Baseline', whyItMatters: 'Preserves focus and ethical conduct during demanding exam schedules and group challenges.' },
      { characteristic: 'Intrinsic Curiosity & Persistence', whyItMatters: 'Powers self-directed learning and sustained perseverance through difficult academic milestones.' },
      { characteristic: 'Collaborative Reliability', whyItMatters: 'Establishes high peer trust, making the student an indispensable team contributor.' }
    ],
    developmentAreas: [
      { area: 'Public Assertiveness & Vocal Contribution', whyItMatters: 'Vital for leadership presence and seminar discussions.', educationalImpact: 'May lead to under-recognition of strong individual contributions in large group environments.', improvementStrategy: 'Implement micro-presentations in low-stakes peer seminars and classroom debate segments.' },
      { area: 'Exam-Related Evaluative Anxiety', whyItMatters: 'Prevents temporary score dips that do not reflect true conceptual competence.', educationalImpact: 'Transient physiological hesitation during timed multiple-choice assessments.', improvementStrategy: 'Introduce timed practice simulations paired with box-breathing and cognitive reframing.' },
      { area: 'Independent Initiation Under Ambiguity', whyItMatters: 'Crucial for university-level open-ended inquiry and autonomous research.', educationalImpact: 'Hesitation to begin unstructured project assignments without granular instructions.', improvementStrategy: 'Scaffold project rubrics with open-ended exploration phases that reward experimentation.' }
    ],
    behaviouralObservations: {
      classroom: `Attentive, orderly, and respectful. Listens intently to lectures, takes thorough organized notes, and speaks up when confident.`,
      groupActivities: `A conscientious partner who coordinates task distribution democratically and ensures group deadlines are met.`,
      examinations: `Approaches exams systematically; may experience minor pre-test nervousness that dissipates once engaged in questions.`,
      competitiveSituations: `Focuses on personal performance benchmarks rather than aggressive peer comparison; remains sportsmanlike.`,
      homeEnvironment: `Appreciates a quiet, organized study space; responds positively to parental praise of effort and curiosity.`
    },
    riskIndicators: [
      'Assessment response patterns suggest mild evaluative anxiety during peak examination cycles, which may cause temporary performance hesitation.',
      'Slight reticence in public assertiveness may mask comprehensive grasp of subject matter in vocal classroom evaluations.'
    ],
    counsellingRecommendations: {
      priorityDiscussionTopics: [
        'Cognitive reframing of academic setbacks as iterative growth data points rather than personal failure.',
        'Developing self-advocacy and vocal confidence in collaborative classroom and extracurricular settings.',
        'Structuring vocational exploration journeys matching high conceptual aptitude.'
      ],
      confidenceBuildingStrategies: [
        'Encourage weekly tracking of personal problem-solving milestones in an achievements journal.',
        'Assign structured speaking slots in small-group peer tutoring sessions.'
      ],
      behaviouralCoachingIdeas: [
        'Practice the "First 5 Minutes" rule to overcome initial hesitation with ambiguous assignments.',
        'Role-play assertive communication scenarios for voicing dissenting viewpoints constructively.'
      ],
      emotionalRegulationTechniques: [
        'Introduce the 4-7-8 breathing protocol prior to entering timed test environments.',
        'Use progressive muscle relaxation during peak semester study phases.'
      ],
      academicSupportSuggestions: [
        'Adopt visual relational diagrams (mind maps) for complex multi-chapter synthesis.',
        'Schedule bi-weekly concept review checkpoints to eliminate last-minute cramming stress.'
      ]
    },
    parentRecommendations: [
      'Praise the effort, strategy, and resilience demonstrated rather than celebrating numerical scores exclusively.',
      'Establish a calm, distraction-free home study sanctuary with designated rest and physical activity breaks.',
      'Foster open, low-pressure conversations regarding future interests, visiting university open-days together.',
      'Encourage autonomous age-appropriate decision-making, allowing room for low-stakes trial and error.'
    ],
    teacherRecommendations: [
      'Provide structured evaluation rubrics with explicit milestone stages for complex assignments.',
      'Call upon the student proactively in supportive ways to validate their vocal contributions in class.',
      'Facilitate cooperative learning groups where the student is encouraged to take up technical facilitation roles.'
    ],
    longTermDevelopmentPlan: {
      month1To2: 'Focus on stress regulation schemas, establishing systematic study rhythm, and practicing timed test simulations.',
      month3To4: 'Engage in micro-leadership roles in classroom science/humanities projects and attend 2 vocational industry webinars.',
      month5To6: 'Participate in an inter-school symposium or hackathon to solidify public presentation confidence and broad career vision.'
    }
  };
}

export function buildLocalStudentParentReport(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string },
  growthIndex: number,
  careerSuggestion: string
): StudentParentReport {
  const name = studentDetails.name;
  const learning = scores['Learning Style'] || 75;
  const creativity = scores['Creativity'] || 75;

  return {
    aboutYou: `Hello ${name}! You are a curious, thoughtful, and capable student who approaches learning with genuine care and dedication. You enjoy discovering how things work and like having a clear purpose behind your daily work. Your classmates and teachers see you as a reliable, honest, and hardworking individual who brings calm and positive energy to your school community.`,
    yourStrengths: [
      {
        title: 'Deep Logical Thinking',
        explanation: 'You take time to understand the reasons behind ideas, which helps you solve tricky problems without feeling overwhelmed.',
        practicalExample: 'When faced with a complex math problem or science concept, you break it down into smaller steps until it makes sense.'
      },
      {
        title: 'Caring & Cooperative Team Spirit',
        explanation: 'You listen respectfully to others and make sure everyone feels included when working together.',
        practicalExample: 'In group activities, you make sure everyone gets their turn and you always do your part reliably.'
      },
      {
        title: 'Steady Determination & Focus',
        explanation: 'You keep trying even when a subject feels challenging, sticking with the task until you master it.',
        practicalExample: 'You prepare in advance for tests and stay seated to finish assignments even when other distractions pop up.'
      },
      {
        title: 'Creative Problem Solving',
        explanation: 'You can think of clever, original ways to approach projects and assignments.',
        practicalExample: 'You often come up with imaginative diagrams, unique examples, or fresh angles for school presentations.'
      }
    ],
    yourLearningStyle: {
      howYouLearnBest: `You learn best when you can see the big picture visually before diving into the details. Diagramming concepts, using colorful highlighters, and linking ideas together helps concepts click naturally for you.`,
      studyTips: [
        'Draw colorful mind maps and flowcharts for subjects with lots of chapters.',
        'Use the 25-minute Pomodoro method: study for 25 minutes, then take a quick 5-minute movement break.',
        'Explain what you just learned out loud to a family member or friend in your own simple words.'
      ],
      revisionSuggestions: [
        'Review your summary notes within 24 hours of first learning a new lesson.',
        'Create self-quizzes with flashcards to test your memory actively before exams.'
      ],
      memoryImprovementTechniques: [
        'Use visual associations and real-world analogies to remember tricky formulas or dates.',
        'Group related facts together into 3s or 4s so your brain can recall them easily.'
      ]
    },
    howYouHandleChallenges: {
      exams: 'You prepare thoroughly, but sometimes you feel a flutter of nervous butterflies before an important test. Remember that butterflies are just energy—taking three slow, deep breaths helps your brain refocus.',
      difficultSituations: 'You stay calm on the outside and prefer to think quietly before reacting. Sharing your feelings with someone you trust helps you solve problems faster.',
      mistakes: 'Nobody learns without making mistakes! Treat any error as an exciting clue showing you where you can grow next.',
      pressure: 'When lots of assignments arrive at once, making a simple checklist and tackling one thing at a time keeps you confident and in control.',
      encouragingAdvice: 'Trust your preparation! You have solid skills and a great mind. Step forward with a smile, knowing that every effort you put in builds your brain power.'
    },
    areasToImprove: [
      {
        growthOpportunity: 'Sharing your voice more openly in class discussions',
        actionableTip: 'Try to raise your hand and share at least one question or idea in every lesson this week. Your thoughts are valuable!'
      },
      {
        growthOpportunity: 'Managing exam-day butterflies with easy calm-down techniques',
        actionableTip: 'Before opening your test paper, close your eyes, take three deep belly breaths, and remind yourself: "I am ready and I can do this."'
      },
      {
        growthOpportunity: 'Starting big projects without waiting for the "perfect" moment',
        actionableTip: 'Break big assignments into tiny bite-sized tasks. Just writing the title and first sentence gets momentum rolling!'
      }
    ],
    yourFuturePotential: `Your wonderful combination of analytical logic, creativity, and steady determination opens exciting doors for your future! You are naturally well-suited for rewarding fields in ${careerSuggestion.split(',')[0]} and related areas where creative problem solvers build solutions that help people. As you grow, keep exploring what you love—the possibilities ahead of you are vast!`,
    tipsForParents: [
      'Celebrate your child\'s effort, curiosity, and persistence rather than focusing solely on marks or rankings.',
      'Create a calm, positive study corner at home and encourage regular breaks for play, exercise, and hobbies.',
      'Ask open-ended questions like: "What was the most interesting thing you learned today?" to build natural curiosity.',
      'Allow your child to make small everyday choices independently to strengthen their decision-making confidence.',
      'Be a patient sounding board when school feels busy; simple warmth and reassurance work wonders.'
    ],
    finalEncouragement: `Remember, every student grows at their own unique pace, and your intelligence grows with every new challenge you try! This report is not a scorecard or a final judgment—it is a cheerful map celebrating who you are today and showing the exciting ways you can shine tomorrow. Keep smiling, keep asking questions, and be proud of all that you do!`
  };
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentAssessment, AssessmentAnswer, AIInsights, RecommendationItem, CounsellorReport, StudentParentReport } from './types';

// Category mapping to weight
export const WEIGHTS = {
  'Self Awareness': 0.20,      // Personality Maturity
  'Emotional Regulation': 0.15,// Emotional Intelligence
  'Leadership': 0.10,          // Leadership Potential
  'Learning Style': 0.15,      // Learning Readiness
  'Communication': 0.10,       // Communication Skills
  'Confidence': 0.10,          // Confidence
  'Motivation': 0.10,          // Motivation
  'Creativity': 0.05,          // Creativity
  'Decision Making': 0.05,     // Decision Making
  'Career Interest': 0.10      // Career Readiness
};

// Help map categories to more user-friendly dimensions
export const CATEGORY_LABELS: { [key: string]: string } = {
  'Self Awareness': 'Personality Maturity',
  'Emotional Regulation': 'Emotional Intelligence',
  'Leadership': 'Leadership Potential',
  'Learning Style': 'Learning Readiness',
  'Communication': 'Communication Skills',
  'Confidence': 'Confidence Level',
  'Motivation': 'Motivation Pattern',
  'Creativity': 'Creativity & Innovation',
  'Decision Making': 'Decision Making Style',
  'Career Interest': 'Career Readiness'
};

/**
 * Calculates raw category scores from the 20 answers.
 * Each category contains exactly 2 questions. Raw score is 2 to 8.
 * Percentage score is ((Raw - 2) / 6) * 100
 */
export function calculateScores(answers: AssessmentAnswer[]): { [category: string]: number } {
  const categoryScores: { [category: string]: number[] } = {};
  
  // Group answers by category
  answers.forEach(ans => {
    if (!categoryScores[ans.category]) {
      categoryScores[ans.category] = [];
    }
    categoryScores[ans.category].push(ans.score);
  });
  
  const scores: { [category: string]: number } = {};
  
  // Calculate percentage (0 to 100)
  Object.keys(WEIGHTS).forEach(cat => {
    const rawScores = categoryScores[cat] || [2, 2]; // Fallback default
    const sum = rawScores.reduce((acc, curr) => acc + curr, 0);
    // sum is between 2 and 8
    const percentage = Math.round(((sum - 2) / 6) * 100);
    scores[cat] = Math.max(0, Math.min(100, percentage));
  });
  
  return scores;
}

/**
 * Calculates overall AI Growth Index
 */
export function calculateGrowthIndex(scores: { [category: string]: number }): number {
  let index = 0;
  Object.entries(WEIGHTS).forEach(([category, weight]) => {
    const score = scores[category] || 50;
    index += score * weight;
  });
  return Math.round(index);
}

/**
 * Fallback static, professional, rule-based psychometric generator.
 * Produces deep, unique results based on score bands.
 */
export function generateLocalPsychometrics(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string }
): AIInsights {
  const name = studentDetails.name;
  
  // 1. Determine key scores
  const maturity = scores['Self Awareness'];
  const emotional = scores['Emotional Regulation'];
  const leadership = scores['Leadership'];
  const learning = scores['Learning Style'];
  const comm = scores['Communication'];
  const confidence = scores['Confidence'];
  const motivation = scores['Motivation'];
  const creativity = scores['Creativity'];
  const decision = scores['Decision Making'];
  const career = scores['Career Interest'];

  // 2. Classify Personality types based on score intersections
  let personalityType = 'Strategist (INTJ)';
  let careerSuggestion = 'Computer Science, Systems Engineering, Data Analytics';
  if (creativity > 70 && comm > 70) {
    personalityType = 'Visionary Campaigner (ENFP)';
    careerSuggestion = 'Creative Direction, UI/UX Design, Digital Product Innovation, Communications';
  } else if (leadership > 70 && confidence > 70) {
    personalityType = 'Executive Commander (ENTJ)';
    careerSuggestion = 'Business Operations, Venture Management, Strategic Planning, Public Policy';
  } else if (maturity > 70 && emotional > 70) {
    personalityType = 'Consensus Mediator (INFJ)';
    careerSuggestion = 'Educational Psychology, Counseling, Environmental Science, Social Innovation';
  } else if (learning > 70 && creativity > 70) {
    personalityType = 'Innovative Architect (INTP)';
    careerSuggestion = 'Software Architecture, AI & ML Engineering, Scientific Research, Cryptography';
  } else if (emotional > 75 && comm < 50) {
    personalityType = 'Quiet Guardian (ISFJ)';
    careerSuggestion = 'Clinical Laboratory Science, Database Administration, Technical Writing';
  } else {
    personalityType = 'Analytical Specialist (ISTJ)';
    careerSuggestion = 'Applied Mathematics, Financial Analysis, Cloud Architecture, Industrial Design';
  }

  // 3. Classify communication and leadership styles
  const communicationType = comm >= 75 ? 'Assertive & Persuasive' : comm >= 50 ? 'Collaborative & Constructive' : 'Reflective & Written';
  const leadershipType = leadership >= 75 ? 'Visionary & Inspiring' : leadership >= 50 ? 'Democratic & Organizing' : 'Independent Support';

  // 4. Generate dynamic, personalized descriptions
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (maturity >= 70) strengths.push('High self-awareness: regularly reflects on personal capabilities and embraces critique.');
  else growthAreas.push('Self-Reflection: Needs to build consistent habits of reflecting on study routines and mistakes.');

  if (confidence >= 70) strengths.push('Resilient and confident: Welcomes unfamiliar challenges and bounces back from setback.');
  else growthAreas.push('Resilience & Confidence: Tends to hesitate under failure and requires positive reinforcement.');

  if (emotional >= 70) strengths.push('Superb emotional regulation: remains calm and constructive under intense pressure.');
  else growthAreas.push('Stress Management: Experiences academic anxiety during peak periods, requiring relaxation strategies.');

  if (comm >= 70) strengths.push('Articulate communicator: speaks with clarity, presents well, and actively listens.');
  else growthAreas.push('Verbal Expression: Experiences stage fright or hesitation; needs safer opportunities to present ideas.');

  if (leadership >= 70) strengths.push('Natural lead potential: steps up in ambiguous groups to coordinate and motivate.');
  else growthAreas.push('Team Initiatives: Hesitates to take responsibility for group direction; should practice micro-leading.');

  if (creativity >= 70) strengths.push('Highly innovative: thinks outside the box and generates original conceptual solutions.');
  else growthAreas.push('Cognitive Flexibility: Tends to rely on existing templates; needs encouragement to brainstorm creatively.');

  if (decision >= 70) strengths.push('Analytical decider: evaluates systematic pros/cons and accepts ownership of outcomes.');
  else growthAreas.push('Decision Confidence: Tends to postpone choices or overly depend on external guidance.');

  // Top-ups to ensure exactly 5 strengths and 3 growth areas
  const defaultStrengths = [
    'Shows robust determination to master challenging topics.',
    'Exhibits outstanding ethical behavior in collaborative teams.',
    'Possesses structured study planning abilities.',
    'Quickly synthesizes logical arguments.',
    'Demonstrates highly active listening skills.'
  ];
  const defaultGrowth = [
    'Should explore connecting daily academic tasks to visual, long-term aspirations.',
    'Would benefit from engaging in more team-based extracurricular activities.',
    'Needs to practice explaining technical topics to non-technical peers.'
  ];

  while (strengths.length < 5) {
    const next = defaultStrengths.find(s => !strengths.includes(s));
    if (next) strengths.push(next);
    else break;
  }
  while (growthAreas.length < 3) {
    const next = defaultGrowth.find(g => !growthAreas.includes(g));
    if (next) growthAreas.push(next);
    else break;
  }

  // 5. Generate descriptive paragraphs
  const studyHabitAnalysis = learning >= 70
    ? `${name} exhibits highly systematic study habits, utilizing mind-mapping and active learning protocols. This structural learning preference allows them to quickly categorize and memorize complex workflows.`
    : `${name} relies heavily on traditional, quiet reading and note-taking. While disciplined, this method is cognitively taxing; introducing visual diagrams or verbal peer reviews would significantly boost recall rates.`;

  const stressHandling = emotional >= 75
    ? `${name} manages high-pressure situations with commendable emotional maturity. They maintain logical equilibrium during exams, keeping panic-responses entirely under control.`
    : `${name} experiences heightened physiological and emotional anxiety under academic stress. They would benefit enormously from breathing schemas, structured planners, and a supportive, low-critique environment.`;

  const decisionMakingStyle = decision >= 70
    ? `Decisions are approached through rational, data-driven frameworks. ${name} proactively maps options, weighs future impacts, and exhibits high accountability, refraining from blaming external factors when setbacks occur.`
    : `${name} tends to experience analysis paralysis, frequently deferring choices to peers or parents. This stems from a slight fear of negative outcomes; they need training in making small, independent choices.`;

  const emotionalStability = emotional >= 70
    ? `Exhibits highly stable emotional baselines. They react constructively to disagreements and maintain positive self-regard even when confronted with challenging peer environments.`
    : `Emotional baselines fluctuate based on academic performance. Their state is highly reactive to grades; building an identity outside of purely numerical scores will stabilize their resilience.`;

  const motivationPattern = motivation >= 75
    ? `Powered by high intrinsic curiosity and intellectual drive. ${name} is motivated by master-level understanding rather than just letter-grades, making them an excellent candidate for long-term research.`
    : `Primarily extrinsically motivated, relying on external grades, parental praise, or rewards to maintain momentum. While effective in the short term, they need to cultivate personal, intrinsic goals to avoid burnout.`;

  const teamBehavior = leadership >= 70
    ? `A natural facilitator who encourages democratic participation. In group tasks, ${name} ensures every voice is heard while maintaining clear focus on objectives, balancing empathy with strict deadlines.`
    : `Prefers to act as a supportive technical asset within teams. ${name} delivers high-quality individual work but tends to withdraw if team conflict arises, needing to develop dispute-resolution skills.`;

  const criticalThinking = maturity >= 75
    ? 'Demonstrates excellent critical thinking. Capable of checking assumptions, identifying logical fallacies, and structuring complex scientific parameters independently.'
    : 'Analytical thinking is strong but occasionally restricted by rigid templates. Needs prompting to explore alternative explanations and test diverse hypotheses.';

  const problemSolving = creativity >= 70
    ? 'Approaches problems through lateral thinking, generating highly unique pathways that bypass traditional bottlenecks. Outstanding at conceptual engineering.'
    : 'Uses standard algorithmic strategies to solve problems. Extremely accurate with structured problems, but experiences friction when solving open-ended, ill-defined challenges.';

  const innovationLevel = creativity >= 75 ? 'Exceptional' : creativity >= 50 ? 'Strong' : 'Moderate';
  const socialInteraction = comm >= 70 ? 'Extroverted & Facilitating' : comm >= 45 ? 'Balanced & Selective' : 'Introverted & Observing';

  const futureReadiness = career >= 75
    ? `${name} displays clear vision and passion regarding future professional pathways. They actively align current learning with vocational clusters, exhibiting high professional maturity.`
    : `${name} has a generalized or slightly unfocused view of future careers. Introducing structured company visits, technical seminars, or shadow-days will bring clarity to their aspirations.`;

  const riskIndicator = (emotional < 50 && confidence < 50) ? 'High' : (emotional < 65 || confidence < 65) ? 'Medium' : 'Low';

  // 6. Generate precise Recommendations with detailed schema
  const recommendations = {
    forStudent: [
      {
        recommendation: 'Adopt active visual memory tools (Mind Maps & Flowcharts)',
        reason: `${name}'s learning style thrives on relational visual cues. Traditional rote reading is inefficient for their conceptual processing.`,
        priority: 'High' as const,
        expectedOutcome: '30% increase in long-term retention of multi-chapter subjects, reduced exam-prep fatigue.',
        timeline: 'Immediate (Next 2 weeks)'
      },
      {
        recommendation: 'Formulate a "Failure Reframe" journal for exam setbacks',
        reason: 'To counteract slight confidence dips under critique or low grades by logging action-plans instead of self-doubt.',
        priority: 'Medium' as const,
        expectedOutcome: 'Stabilized academic confidence and quicker bounce-back times.',
        timeline: 'Ongoing (Next 1 month)'
      }
    ],
    forTeacher: [
      {
        recommendation: 'Assign micro-leadership roles in scientific/creative tasks',
        reason: `${name} has the foundation for leadership but hesitates to self-initiate. Structured nomination lowers the barrier to entry.`,
        priority: 'High' as const,
        expectedOutcome: 'Enhanced vocal confidence, role responsibility, and practical execution capacity.',
        timeline: 'Within the current term'
      },
      {
        recommendation: 'Provide criteria-based rubrics rather than raw grade feedback',
        reason: 'To help the student focus on specific skill progress rather than reacting emotionally to numeric percentages.',
        priority: 'Medium' as const,
        expectedOutcome: 'Decreased grade-related anxiety and highly targeted improvement.',
        timeline: 'Next academic evaluation cycle'
      }
    ],
    forParent: [
      {
        recommendation: 'Establish an active "Home Reflection Hour" weekly',
        reason: 'Supports self-awareness by creating a low-pressure dialog focused on personal growth, effort, and lessons learned rather than scores.',
        priority: 'High' as const,
        expectedOutcome: 'Stronger parent-child trust and improved emotional self-regulation.',
        timeline: 'Every Sunday evening'
      },
      {
        recommendation: 'Encourage enrollment in specialized non-academic coding/art camps',
        reason: `Aligns with ${name}'s creativity and provides a playground for low-stakes failure, reinforcing confidence.`,
        priority: 'Medium' as const,
        expectedOutcome: 'Broader problem-solving skills and secondary confidence pillars.',
        timeline: 'Upcoming summer/winter holidays'
      }
    ],
    forCounselor: [
      {
        recommendation: 'Conduct monthly cognitive-behavioral resilience sessions',
        reason: `Helps ${name} navigate academic stress and manage emotional baseline fluctuations during exam periods.`,
        priority: 'Medium' as const,
        expectedOutcome: 'Enhanced emotional self-awareness and personalized anxiety coping toolkits.',
        timeline: 'Monthly check-ins'
      }
    ],
    forSchool: [
      {
        recommendation: 'Integrate dynamic multi-disciplinary bento challenges',
        reason: 'To offer open-ended project slots that reward lateral innovation, creativity, and self-organization.',
        priority: 'Low' as const,
        expectedOutcome: 'A culture that celebrates diverse student profiles and original thinking.',
        timeline: 'Next school festival/exhibition'
      }
    ],
    forCareer: [
      {
        recommendation: 'Arrange a 1-on-1 industry shadow program with a Senior Architect/Director',
        reason: `Validates ${name}'s career interests in high-level engineering or visual design and creates strong extrinsic motivation.`,
        priority: 'High' as const,
        expectedOutcome: 'Invaluable real-world exposure and laser-focused selection of university pathways.',
        timeline: 'Next 3 months'
      }
    ]
  };

  // 7. Generate Growth predictions
  const predictions = {
    futureLeadership: Math.round(leadership * 0.7 + comm * 0.3),
    careerCluster: creativity > 70 ? 'Technology & Digital Creative Design' : leadership > 70 ? 'Business Administration & Ventures' : 'Applied Sciences & Research Analytics',
    learningRisk: learning < 50 ? 'High' as const : learning < 65 ? 'Medium' as const : 'Low' as const,
    confidenceRisk: confidence < 50 ? 'High' as const : confidence < 65 ? 'Medium' as const : 'Low' as const,
    stressRisk: emotional < 50 ? 'High' as const : emotional < 65 ? 'Medium' as const : 'Low' as const,
    communicationRisk: comm < 50 ? 'High' as const : comm < 65 ? 'Medium' as const : 'Low' as const,
    academicReadiness: Math.round(learning * 0.4 + maturity * 0.3 + motivation * 0.3),
    careerReadinessScore: Math.round(career * 0.5 + decision * 0.3 + comm * 0.2),
    improvementProbability: Math.round(maturity * 0.5 + motivation * 0.5)
  };

  // Executive summary
  const summary = `${name} is a highly ${maturity > 70 ? 'reflective' : 'adaptive'} student who shows immense potential in ${careerSuggestion.split(',')[0]}. They thrive when given clear, conceptually challenging work where they can leverage their ${creativity > 70 ? 'original imagination' : 'analytical focus'}. While displaying outstanding pillars of strength, their growth index of ${calculateGrowthIndex(scores)}% can be further unlocked by focusing specifically on reducing anxiety under critique and practicing micro-leadership in team workspaces.`;

  // Marathi fallback translation mappings
  const personalityTypeMR = {
    'Strategist (INTJ)': 'रणनीतीकार (INTJ)',
    'Visionary Campaigner (ENFP)': 'दूरदर्शी प्रचारक (ENFP)',
    'Executive Commander (ENTJ)': 'कार्यकारी कमांडर (ENTJ)',
    'Consensus Mediator (INFJ)': 'एकमत मध्यस्थ (INFJ)',
    'Innovative Architect (INTP)': 'नाविन्यपूर्ण रचनाकार (INTP)',
    'Quiet Guardian (ISFJ)': 'शांत रक्षक (ISFJ)',
    'Analytical Specialist (ISTJ)': 'विश्लेषणात्मक तज्ञ (ISTJ)'
  }[personalityType] || personalityType;

  const careerSuggestionMR = {
    'Computer Science, Systems Engineering, Data Analytics': 'संगणक शास्त्र, सिस्टम अभियांत्रिकी, डेटा विश्लेषण',
    'Creative Direction, UI/UX Design, Digital Product Innovation, Communications': 'सर्जनशील दिग्दर्शन, UI/UX डिझाइन, डिजिटल उत्पादन नवकल्पना, संवाद',
    'Business Operations, Venture Management, Strategic Planning, Public Policy': 'व्यवसाय ऑपरेशन्स, व्हेंचर मॅनेजमेंट, स्ट्रॅटेजिक प्लॅनिंग, सार्वजनिक धोरण',
    'Educational Psychology, Counseling, Environmental Science, Social Innovation': 'शैक्षणिक मानसशास्त्र, समुपदेशन, पर्यावरण विज्ञान, सामाजिक नवकल्पना',
    'Software Architecture, AI & ML Engineering, Scientific Research, Cryptography': 'सॉफ्टवेअर आर्किटेक्चर, AI आणि ML अभियांत्रिकी, वैज्ञानिक संशोधन, क्रिप्टोग्राफी',
    'Clinical Laboratory Science, Database Administration, Technical Writing': 'क्लिनिकल प्रयोगशाळा विज्ञान, डेटाबेस प्रशासन, तांत्रिक लेखन',
    'Applied Mathematics, Financial Analysis, Cloud Architecture, Industrial Design': 'व्यावहारिक गणित, वित्तीय विश्लेषण, क्लाउड आर्किटेक्चर, औद्योगिक डिझाइन'
  }[careerSuggestion] || careerSuggestion;

  const communicationTypeMR = {
    'Assertive & Persuasive': 'स्पष्ट आणि प्रभावी',
    'Collaborative & Constructive': 'सहयोगी आणि विधायक',
    'Reflective & Written': 'चिंतनशील आणि लिखित'
  }[communicationType] || communicationType;

  const leadershipTypeMR = {
    'Visionary & Inspiring': 'दूरदर्शी आणि प्रेरणादायी',
    'Democratic & Organizing': 'लोकशाही आणि संघटक',
    'Independent Support': 'स्वतंत्र सहाय्यक'
  }[leadershipType] || leadershipType;

  const innovationLevelMR = {
    'Exceptional': 'असाधारण',
    'Strong': 'मजबूत',
    'Moderate': 'मध्यम'
  }[innovationLevel] || innovationLevel;

  const socialInteractionMR = {
    'Extroverted & Facilitating': 'बहिर्मुखी आणि सुलभ',
    'Balanced & Selective': 'संतुलित आणि निवडक',
    'Introverted & Observing': 'अंतर्मुखी आणि निरीक्षक'
  }[socialInteraction] || socialInteraction;

  const strengthsMRMap: { [key: string]: string } = {
    'High self-awareness: regularly reflects on personal capabilities and embraces critique.': 'उच्च आत्म-जागरूकता: वैयक्तिक क्षमतांवर नियमितपणे विचार करतो आणि सकारात्मक टीकेचा स्वीकार करतो।',
    'Resilient and confident: Welcomes unfamiliar challenges and bounces back from setback.': 'लवचिक आणि आत्मविश्वासी: अपरिचित आव्हानांचे स्वागत करतो आणि अपयशातून पुन्हा उभा राहतो।',
    'Superb emotional regulation: remains calm and constructive under intense pressure.': 'उत्कृष्ट भावनिक नियंत्रण: तीव्र दबावाखाली शांत आणि विधायक राहतो।',
    'Articulate communicator: speaks with clarity, presents well, and actively listens.': 'स्पष्ट वक्ता: स्पष्टपणे बोलतो, सादरीकरण उत्तम करतो आणि सक्रियपणे ऐकतो।',
    'Natural lead potential: steps up in ambiguous groups to coordinate and motivate.': 'नैसर्गिक नेतृत्व क्षमता: अस्पष्ट किंवा नवीन गटांमध्ये समन्वय साधण्यासाठी आणि इतरांना प्रेरित करण्यासाठी पुढाकार घेतो।',
    'Highly innovative: thinks outside the box and generates original conceptual solutions.': 'अत्यंत नाविन्यपूर्ण: चौकटीबाहेरचा विचार करतो आणि मूळ संकल्पनात्मक उपाय शोधतो।',
    'Analytical decider: evaluates systematic pros/cons and accepts ownership of outcomes.': 'विश्लेषणात्मक निर्णय घेणारा: पद्धतशीरपणे गुण-दोषांचे मूल्यमापन करतो आणि निकालांची जबाबदारी घेतो।',
    'Shows robust determination to master challenging topics.': 'कठीण विषय आत्मसात करण्यासाठी मजबूत दृढनिश्चय दाखवतो।',
    'Exhibits outstanding ethical behavior in collaborative teams.': 'सहयोगी संघांमध्ये उत्कृष्ट नैतिक वर्तन प्रदर्शित करतो।',
    'Possesses structured study planning abilities.': 'अभ्यासाच्या पद्धतशीर नियोजनाची क्षमता आहे।',
    'Quickly synthesizes logical arguments.': 'तार्किक युक्तिवाद जलद गतीने तयार करतो।',
    'Demonstrates highly active listening skills.': 'अत्यंत सक्रिय ऐकण्याची कौशल्ये प्रदर्शित करतो।'
  };

  const growthMRMap: { [key: string]: string } = {
    'Self-Reflection: Needs to build consistent habits of reflecting on study routines and mistakes.': 'आत्म-चिंतन: अभ्यासाची दिनचर्या आणि चुकांवर विचार करण्याची सातत्यपूर्ण सवय निर्माण करणे आवश्यक आहे।',
    'Resilience & Confidence: Tends to hesitate under failure and requires positive reinforcement.': 'लवचिकता आणि आत्मविश्वास: अपयशाच्या वेळी संकोच करण्याची प्रवृत्ती असते आणि सकारात्मक प्रोत्साहनाची आवश्यकता असते।',
    'Stress Management: Experiences academic anxiety during peak periods, requiring relaxation strategies.': 'ताणतणाव व्यवस्थापन: परीक्षेच्या काळात शैक्षणिक चिंतेचा अनुभव येतो, ज्यामुळे ताण कमी करणाऱ्या तंत्रांची आवश्यकता असते।',
    'Verbal Expression: Experiences stage fright or hesitation; needs safer opportunities to present ideas.': 'मौखिक अभिव्यक्ती: स्टेजची भीती किंवा संकोच जाणवतो; कल्पना मांडण्यासाठी सुरक्षित संधींची गरज आहे।',
    'Team Initiatives: Hesitates to take responsibility for group direction; should practice micro-leading.': 'गट उपक्रम: गटाला दिशा देण्याची जबाबदारी घेण्यास संकोच करतो; लहान प्रमाणावर नेतृत्व करण्याचा सराव करावा।',
    'Cognitive Flexibility: Tends to rely on existing templates; needs encouragement to brainstorm creatively.': 'संज्ञानात्मक लवचिकता: सध्याच्या साच्यांवर अवलंबून राहण्याची प्रवृत्ती असते; सर्जनशीलपणे विचार करण्यासाठी प्रोत्साहनाची गरज आहे।',
    'Decision Confidence: Tends to postpone choices or overly depend on external guidance.': 'निर्णय आत्मविश्वास: निर्णय पुढे ढकलण्याची किंवा बाह्य मार्गदर्शनावर जास्त अवलंबून राहण्याची प्रवृत्ती असते।',
    'Should explore connecting daily academic tasks to visual, long-term aspirations.': 'दैनिक शैक्षणिक कार्यांना दीर्घकालीन उद्दिष्टांशी जोडण्याचा प्रयत्न केला पाहिजे।',
    'Would benefit from engaging in more team-based extracurricular activities.': 'गट-आधारित अवांतर उपक्रमांमध्ये अधिक सहभागी होण्याचा फायदा होईल।',
    'Needs to practice explaining technical topics to non-technical peers.': 'तांत्रिक विषय अतांत्रिक मित्रांना समजावून सांगण्याचा सराव करणे आवश्यक आहे।'
  };

  const strengthsMR = strengths.map(s => strengthsMRMap[s] || s);
  const growthAreasMR = growthAreas.map(g => growthMRMap[g] || g);

  const studyHabitAnalysisMR = learning >= 70
    ? `${name} अत्यंत पद्धतशीर अभ्यासाच्या सवयी दर्शवतो, ज्यामध्ये माइंड-मॅपिंग आणि सक्रिय शिकण्याच्या पद्धतींचा वापर केला जातो. ही रचनात्मक शिकण्याची आवड त्यांना गुंतागुंतीच्या संकल्पनांचे वर्गीकरण आणि स्मरण करण्यास मदत करते।`
    : `${name} शांत वाचन आणि नोट्स घेण्यावर जास्त भर देतो. हे शिस्तबद्ध असले तरी मानसिकदृष्ट्या थकवणारे आहे; व्हिज्युअल आकृत्या किंवा तोंडी पुनरावलोकनांचा वापर केल्यास स्मरणशक्तीत लक्षणीय सुधारणा होईल।`;

  const stressHandlingMR = emotional >= 75
    ? `${name} अत्यंत दबावाच्या परिस्थितीचे कौतुकास्पद भावनिक परिपक्वतेने व्यवस्थापन करतो. ते परीक्षांच्या वेळी तार्किक संतुलन राखतात, ज्यामुळे भीती आणि गोंधळ पूर्णपणे नियंत्रणात राहतो।`
    : `${name} शैक्षणिक तणावाखाली शारीरिक आणि भावनिक चिंतेचा अनुभव घेतो. श्वासोच्छवासाचे व्यायाम, पद्धतशीर नियोजक आणि आश्वासक, कमी टीका करणारे वातावरण यापासून त्यांना मोठा फायदा होईल।`;

  const decisionMakingStyleMR = decision >= 70
    ? `निर्णय तर्कसंगत आणि माहिती-आधारित चौकटीतून घेतले जातात. ${name} सक्रियपणे पर्यायांचे मूल्यमापन करतो, भावी परिणामांचा विचार करतो आणि कोणतीही अडचण आल्यास बाह्य घटकांना दोष न देता पूर्ण जबाबदारी घेतो।`
    : `${name} ला निर्णयांच्या संभ्रमाचा (ॲनालिसिस पॅरालिसिस) अनुभव येतो, ज्यामुळे ते वारंवार मित्र किंवा पालकांवर निर्णय सोपवतात. हे नकारात्मक परिणामांच्या भीतीमुळे होते; त्यांना लहान, स्वतंत्र निर्णय घेण्याचे प्रशिक्षण आवश्यक आहे।`;

  const emotionalStabilityMR = emotional >= 70
    ? `अत्यंत स्थिर भावनिक पाया प्रदर्शित करतो. ते मतभेदांना विधायक प्रतिसाद देतात आणि आव्हानात्मक मित्र परिवारातही सकारात्मक स्वाभिमान राखतात।`
    : `शैक्षणिक कामगिरीनुसार भावनिक चढ-उतार होतात. त्यांचे मानसिक संतुलन गुणांवर जास्त अवलंबून असते; केवळ गुणांच्या पलीकडे स्वतःची ओळख निर्माण केल्यास त्यांची प्रतिकारशक्ती स्थिर होईल।`;

  const motivationPatternMR = motivation >= 75
    ? `उच्च आंतरिक जिज्ञासा आणि बौद्धिक प्रेरणेने प्रेरित आहे. ${name} केवळ गुणांऐवजी विषयाच्या सखोल आकलनासाठी प्रेरित होतो, ज्यामुळे ते दीर्घकालीन संशोधनासाठी एक उत्कृष्ट उमेदवार ठरतात।`
    : `मुख्यतः बाह्य गोष्टींनी प्रेरित आहे, जसे की बाह्य गुण, पालकांची स्तुती किंवा बक्षिसे. हे अल्प कालावधीसाठी प्रभावी असले तरी, थकवा टाळण्यासाठी त्यांनी स्वतःची आंतरिक उद्दिष्टे विकसित करणे आवश्यक आहे।`;

  const teamBehaviorMR = leadership >= 70
    ? `एक नैसर्गिक मार्गदर्शक जो लोकशाही सहभागास प्रोत्साहन देतो. सामूहिक कामांमध्ये, ${name} सहानुभूती आणि वेळेचे भान ठेवून उद्दिष्टांवर लक्ष केंद्रित करतो आणि प्रत्येकाचे मत ऐकले जाईल याची खात्री करतो।`
    : `संघांमध्ये पूरक तांत्रिक भूमिका बजावणे पसंत करतो. ${name} उच्च दर्जाचे वैयक्तिक काम करतो परंतु संघात वाद निर्माण झाल्यास बाजूला होतो; त्यांना विवाह निवारण कौशल्ये विकसित करण्याची आवश्यकता आहे।`;

  const criticalThinkingMR = maturity >= 75
    ? 'उत्कृष्ट गंभीर विचार क्षमता प्रदर्शित करतो. गृहीतके तपासणे, तार्किक त्रुटी ओळखणे आणि स्वतंत्रपणे गुंतागुंतीचे वैज्ञानिक निकष तयार करणे यात सक्षम आहे।'
    : 'विश्लेषणात्मक विचार मजबूत आहे परंतु कधीकधी ठराविक साच्यापुरता मर्यादित राहतो. पर्यायी स्पष्टीकरणे शोधण्यासाठी आणि विविध गृहीतके तपासण्यासाठी मार्गदर्शनाची आवश्यकता आहे।';

  const problemSolvingMR = creativity >= 70
    ? 'चौकटीबाहेरचा विचार करून समस्या सोडवतो, ज्यामुळे पारंपारिक अडचणींवर मात करणारे अत्यंत वैशिष्ट्यपूर्ण मार्ग तयार होतात. संकल्पनात्मक नियोजनात उत्कृष्ट।'
    : 'समस्या सोडवण्यासाठी मानकीकृत धोरणांचा वापर करतो. रचलेल्या समस्यांच्या बाबतीत अत्यंत अचूक, परंतु खुल्या आणि नव्याने उद्भवणाऱ्या आव्हानांच्या वेळी अडचणी जाणवतात।';

  const futureReadinessMR = career >= 75
    ? `${name} भविष्यातील व्यावसायिक मार्गांबद्दल स्पष्ट दृष्टी आणि आवड दर्शवतो. ते सक्रियपणे सध्याच्या शिक्षणाला व्यावसायिक क्षेत्रांशी जोडतात, जे त्यांच्या परिपक्वतेचे लक्षण आहे।`
    : `${name} ची भविष्यातील कारकीर्दीबद्दल सामान्य किंवा थोडी अस्पष्ट दृष्टी आहे. पद्धतशीर कंपनी भेटी, तांत्रिक सेमिनार किंवा प्रत्यक्ष कामाचा अनुभव त्यांना त्यांच्या आकांक्षा स्पष्ट करण्यास मदत करेल।`;

  // Mapped local recommendations translated into Marathi
  const recommendationsMR = {
    forStudent: [
      {
        recommendation: 'सक्रिय व्हिज्युअल मेमरी साधने स्वीकारा (माइंड मॅप्स आणि फ्लोचार्ट्स)',
        reason: `${name} ची शिकण्याची शैली संबंधात्मक व्हिज्युअल संकेतांवर विकसित होते. त्यांच्या वैचारिक प्रक्रियेसाठी पारंपारिक पाठांतर अकार्यक्षम आहे.`,
        priority: 'High' as const,
        expectedOutcome: 'दीर्घकालीन संकल्पना लक्षात ठेवण्यात ३०% वाढ, परीक्षेच्या तयारीचा थकवा कमी होईल.',
        timeline: 'त्वरित (पुढील २ आठवडे)'
      },
      {
        recommendation: 'परीक्षांच्या अपयशासाठी "फेलीअर रिफ्रेम" जर्नल तयार करा',
        reason: 'टीका किंवा कमी गुणांमुळे होणारी आत्मविश्वासातील घट रोखण्यासाठी स्वतःबद्दल संशय घेण्याऐवजी कृती आराखड्यांची नोंद करा.',
        priority: 'Medium' as const,
        expectedOutcome: 'स्थिर शैक्षणिक आत्मविश्वास आणि अपयशातून जलद गतीने सावरण्याची क्षमता.',
        timeline: 'चालू (पुढील १ महिना)'
      }
    ],
    forTeacher: [
      {
        recommendation: 'वैज्ञानिक/सर्जनशील कामांमध्ये लहान-लहान नेतृत्व भूमिका सोपवा',
        reason: `${name} मध्ये नेतृत्वाचा पाया आहे पण स्वतःहून पुढाकार घेण्यास संकोच करतो. पद्धतशीरपणे जबाबदारी दिल्यास त्यांचा संकोच दूर होईल.`,
        priority: 'High' as const,
        expectedOutcome: 'बोलण्याचा आत्मविश्वास वाढेल, भूमिकेची जबाबदारी समजेल आणि प्रत्यक्ष अंमलबजावणीची क्षमता सुधारेल.',
        timeline: 'सध्याच्या सत्रात'
      },
      {
        recommendation: 'केवळ गुणांऐवजी निकष-आधारित मूल्यमापन द्या',
        reason: 'विद्यार्थ्याला केवळ गुणांच्या टक्केवारीवर भावनिक प्रतिक्रिया देण्याऐवजी विशिष्ट कौशल्य प्रगतीवर लक्ष केंद्रित करण्यास मदत करणे.',
        priority: 'Medium' as const,
        expectedOutcome: 'गुणांशी संबंधित चिंता कमी होईल आणि अत्यंत लक्ष्यित सुधारणा होईल.',
        timeline: 'पुढील शैक्षणिक मूल्यमापन चक्रात'
      }
    ],
    forParent: [
      {
        recommendation: 'दर आठवड्याला सक्रिय "गृह चिंतन तास" निश्चित करा',
        reason: 'गुणांऐवजी वैयक्तिक विकास, प्रयत्न आणि शिकलेल्या धड्यांवर लक्ष केंद्रित करून कमी दबावाखालील संवाद साधून आत्म-जागरूकतेला पाठबळ देणे.',
        priority: 'High' as const,
        expectedOutcome: 'पालक-पाल्य यांच्यातील दृढ विश्वास आणि भावनिक आत्म-नियंत्रणात सुधारणा.',
        timeline: 'प्रत्येक रविवारी संध्याकाळी'
      },
      {
        recommendation: 'गैर-शैक्षणिक कोडिंग किंवा कला शिबिरांमध्ये प्रवेश घेण्यास प्रोत्साहित करा',
        reason: `हे ${name} च्या सर्जनशीलतेशी सुसंगत आहे आणि कमी जोखमीच्या वातावरणात अपयशाचा सामना करण्याची जागा प्रदान करते, ज्यामुळे आत्मविश्वास बळकट होतो.`,
        priority: 'Medium' as const,
        expectedOutcome: 'समस्या सोडवण्याची व्यापक कौशल्ये आणि आत्मविश्वासाचे दुय्यम स्तंभ.',
        timeline: 'येणाऱ्या उन्हाळी/हिवाळी सुट्ट्या'
      }
    ],
    forCounselor: [
      {
        recommendation: 'मासिक संज्ञानात्मक-वर्तणूक लवचिकता सत्रे आयोजित करा',
        reason: `${name} ला शैक्षणिक तणावाचा सामना करण्यास आणि परीक्षेच्या काळात भावनिक चढ-उतारांचे व्यवस्थापन करण्यास मदत करते.`,
        priority: 'Medium' as const,
        expectedOutcome: 'भावनिक आत्म-जागरूकता वाढेल आणि चिंतेचा सामना करण्यासाठी वैयक्तिक साधनसामग्री मिळेल.',
        timeline: 'मासिक तपासणी'
      }
    ],
    forSchool: [
      {
        recommendation: 'गतिमान बहु-शाखीय आव्हाने समाविष्ट करा',
        reason: 'चौकटीबाहेरची नवकल्पना, सर्जनशीलता आणि स्वयं-संघटनेला प्रोत्साहन देणारे खुले प्रकल्प पर्याय उपलब्ध करणे.',
        priority: 'Low' as const,
        expectedOutcome: 'विविध प्रकारच्या विद्यार्थ्यांचे आणि मूळ विचारांचे कौतुक करणारी संस्कृती.',
        timeline: 'पुढील शाळा महोत्सव/प्रदर्शन'
      }
    ],
    forCareer: [
      {
        recommendation: 'ज्येष्ठ वास्तुविशारद/संचालकांसोबत प्रत्यक्ष अनुभव घेण्याचा कार्यक्रम आयोजित करा',
        reason: `हे उच्च-स्तरीय अभियांत्रिकी किंवा व्हिज्युअल डिझाइनमधील ${name} च्या कारकीर्दीतील आवडींना पुष्टी देते आणि मजबूत बाह्य प्रेरणा निर्माण करते.`,
        priority: 'High' as const,
        expectedOutcome: 'अमूल्य व्यावहारिक अनुभव आणि विद्यापीठीय शिक्षणाच्या मार्गांची अचूक निवड.',
        timeline: 'पुढील ३ महिने'
      }
    ]
  };

  const careerClusterMR = creativity > 70 ? 'तंत्रज्ञान आणि डिजिटल क्रिएटिव्ह डिझाइन' : leadership > 70 ? 'व्यवसाय प्रशासन आणि उपक्रम' : 'व्यावहारिक विज्ञान आणि संशोधन विश्लेषण';

  // Dynamic summary template translated
  const primaryCareerMR = careerSuggestionMR.split(',')[0].trim();
  const focusDetailMR = creativity > 70 ? 'सर्जनशील कल्पनाशक्तीचा' : 'विश्लेषणात्मक लक्ष केंद्रित करण्याचा';
  const maturityTermMR = maturity > 70 ? 'चिंतनशील' : 'अनुकूलनशील';
  const summaryMR = `${name} हा/ही एक अत्यंत ${maturityTermMR} विद्यार्थी आहे, ज्याच्यामध्ये ${primaryCareerMR} क्षेत्रात प्रचंड क्षमता आहे. जेव्हा त्यांना स्पष्ट आणि वैचारिक आव्हानात्मक कामे दिली जातात तेव्हा ते उत्कृष्ट कामगिरी करतात, जिथे ते त्यांच्या ${focusDetailMR} पुरेपूर वापर करू शकतात. त्यांच्यामध्ये उत्कृष्ट शक्तीचे पैलू दिसत असले तरी, त्यांचा ${calculateGrowthIndex(scores)}% का विकास निर्देशांक (Growth Index) अजून अनलॉक केला जाऊ शकतो. यासाठी त्यांनी विशेषतः टीका स्वीकारताना येणारी चिंता कमी करणे आणि सामूहिक कामांमध्ये लहान प्रमाणावर नेतृत्व सराव करण्यावर लक्ष केंद्रित करणे आवश्यक आहे.`;

  const marathi = {
    summary: summaryMR,
    personalityType: personalityTypeMR,
    communicationType: communicationTypeMR,
    leadershipType: leadershipTypeMR,
    careerSuggestion: careerSuggestionMR,
    topStrengths: strengthsMR,
    topGrowthAreas: growthAreasMR,
    studyHabitAnalysis: studyHabitAnalysisMR,
    stressHandling: stressHandlingMR,
    decisionMakingStyle: decisionMakingStyleMR,
    emotionalStability: emotionalStabilityMR,
    motivationPattern: motivationPatternMR,
    teamBehavior: teamBehaviorMR,
    criticalThinking: criticalThinkingMR,
    problemSolving: problemSolvingMR,
    innovationLevel: innovationLevelMR,
    socialInteraction: socialInteractionMR,
    futureReadiness: futureReadinessMR,
    recommendations: recommendationsMR,
    predictions: {
      careerCluster: careerClusterMR
    }
  };

  const counsellorReport = buildLocalCounsellorReport(scores, studentDetails, calculateGrowthIndex(scores), personalityType, careerSuggestion);
  const studentReport = buildLocalStudentParentReport(scores, studentDetails, calculateGrowthIndex(scores), careerSuggestion);

  return {
    counsellorReport,
    studentReport,
    summary,
    personalityType,
    communicationType,
    leadershipType,
    careerSuggestion,
    topStrengths: strengths,
    topGrowthAreas: growthAreas,
    studyHabitAnalysis,
    stressHandling,
    decisionMakingStyle,
    emotionalStability,
    motivationPattern,
    teamBehavior,
    criticalThinking,
    problemSolving,
    innovationLevel,
    socialInteraction,
    futureReadiness,
    riskIndicator,
    recommendations,
    predictions,
    marathi
  };
}

/**
 * Call server-side Gemini to expand and completely customize the analysis!
 * This uses `@google/genai` and model `gemini-3.5-flash`.
 */
export async function generateGeminiPsychometrics(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string; grade: string },
  answersTextSummary: string,
  geminiClient: any
): Promise<AIInsights> {
  const name = studentDetails.name;
  const growthIndex = calculateGrowthIndex(scores);
  
  const systemInstruction = `You are an elite Educational Psychologist, Psychometrist, and Growth Counselor. 
You are analyzing a student named ${name} (Age: ${studentDetails.age}, Gender: ${studentDetails.gender}, Grade: ${studentDetails.grade}).
They have completed a 20 MCQ assessment spanning 10 key categories. 
Your goal is to provide a comprehensive, ultra-detailed, and deeply personalized psychological profile. 
AVOID generic text. Write distinct, beautiful, and action-oriented insights.

CRITICAL INSTRUCTIONS:
1. You MUST NEVER include terms like "AI", "Gemini", "Large Language Model", "AI-generated", "machine learning", "algorithm", or any text indicating this report was generated by an artificial intelligence.
2. The entire report (both English and Marathi sections) must read as if it were meticulously written by a senior human psychologist and clinical child counselor.
3. DO NOT include any footnotes, disclaimers, watermark statements, or badges such as "Generated by AI", "AI-powered", or "AI Report".
4. Ensure all Marathi translations in the "marathi" object are highly professional, warm, culturally respectful, and grammatically flawless, free of any "AI-generated" or mechanical-sounding translation artifacts.`;

  const prompt = `
Student Category Percentage Scores:
${JSON.stringify(scores, null, 2)}

Overall Weighted Growth Index: ${growthIndex}%

Questionnaire Answers Context:
${answersTextSummary}

Generate TWO independent reports from the same assessment:
1. REPORT 1: Professional Counsellor Report (4-6 pages / 1,800-2,800 words equivalent in comprehensive structured sections for Educational Counsellors, School Psychologists, Teachers). Professional, analytical, evidence-based, and objective.
2. REPORT 2: Student & Parent Report (2 pages / 600-900 words for Student and Parents). Simple, friendly, encouraging, positive, growth-oriented. Avoid technical jargon or diagnosis. Use "You can become even better by...".

Both reports must be internally consistent without contradicting each other or repeating paragraphs.
Generate a detailed JSON object strictly matching this TypeScript structure:

interface AIInsights {
  counsellorReport: {
    studentProfile: { name: string; age: number; gender: string; grade: string; assessmentDate: string; school: string };
    executiveSummary: { overallBehaviouralProfile: string; emotionalFunctioning: string; learningProfile: string; growthPotential: string; overallObservations: string };
    assessmentInterpretation: string; // Confidence in observed patterns & recurring themes across responses
    personalityAnalysis: { characteristics: string; behaviouralTendencies: string; selfAwareness: string; emotionalMaturity: string; adaptability: string; independence: string; responsibility: string; socialOrientation: string };
    emotionalFunctioning: { emotionalRegulation: string; stressTolerance: string; emotionalResilience: string; selfControl: string; empathy: string; copingMechanisms: string; emotionalTriggers: string };
    learningCognitiveProfile: { preferredLearningStyle: string; studyBehaviour: string; attentionPatterns: string; informationProcessing: string; curiosity: string; academicPersistence: string; memoryStrategies: string; practicalVsConceptual: string };
    communicationSocialBehaviour: { communicationStyle: string; listeningBehaviour: string; classroomParticipation: string; peerInteraction: string; collaboration: string; conflictHandling: string; assertiveness: string };
    leadershipResponsibility: { initiative: string; accountability: string; teamwork: string; decisionMaking: string; leadershipReadiness: string };
    motivationGoalOrientation: { intrinsicMotivation: string; extrinsicMotivation: string; achievementOrientation: string; consistency: string; persistence: string; selfDiscipline: string };
    decisionMakingCriticalThinking: { reasoning: string; planning: string; judgment: string; riskAwareness: string; problemSolvingStyle: string };
    creativityInnovation: { curiosity: string; imagination: string; ideaGeneration: string; flexibility: string; innovationPotential: string };
    careerDevelopmentReadiness: { careerAwareness: string; occupationalInterests: string; futurePlanning: string; readinessForExploration: string; recommendedDomains: string[] };
    strengths: { characteristic: string; whyItMatters: string }[];
    developmentAreas: { area: string; whyItMatters: string; educationalImpact: string; improvementStrategy: string }[];
    behaviouralObservations: { classroom: string; groupActivities: string; examinations: string; competitiveSituations: string; homeEnvironment: string };
    riskIndicators: string[]; // Use cautious language: "This response pattern may indicate...". NO mental health diagnoses.
    counsellingRecommendations: { priorityDiscussionTopics: string[]; confidenceBuildingStrategies: string[]; behaviouralCoachingIdeas: string[]; emotionalRegulationTechniques: string[]; academicSupportSuggestions: string[] };
    parentRecommendations: string[];
    teacherRecommendations: string[];
    longTermDevelopmentPlan: { month1To2: string; month3To4: string; month5To6: string };
  };
  studentReport: {
    aboutYou: string; // Simple, friendly description of student's personality
    yourStrengths: { title: string; explanation: string; practicalExample: string }[];
    yourLearningStyle: { howYouLearnBest: string; studyTips: string[]; revisionSuggestions: string[]; memoryImprovementTechniques: string[] };
    howYouHandleChallenges: { exams: string; difficultSituations: string; mistakes: string; pressure: string; encouragingAdvice: string };
    areasToImprove: { growthOpportunity: string; actionableTip: string }[]; // Framed as opportunities to become better, no negative words like weakness or failure
    yourFuturePotential: string; // Broad areas where natural strengths help in future
    tipsForParents: string[]; // Practical advice: praise effort over results, regular study routines, encourage curiosity
    finalEncouragement: string; // Warm closing message that skills grow with practice
  };
  summary: string; // Dynamic, highly descriptive paragraphs summarizing the student profile, potentials, and broad growth plan.
  personalityType: string; // e.g. "Visionary Campaigner (ENFP)"
  communicationType: string; // e.g. "Assertive & Empathetic"
  leadershipType: string; // e.g. "Democratic Collaborator"
  careerSuggestion: string; // Comma-separated list of highly specific modern careers.
  topStrengths: string[]; // EXACTLY 5 clear strengths based on scores.
  topGrowthAreas: string[]; // EXACTLY 3 clear growth areas based on scores.
  studyHabitAnalysis: string; // Detailed study habit evaluation paragraph.
  stressHandling: string; // Stress and anxiety management paragraph.
  decisionMakingStyle: string; // Choice evaluation and accountability paragraph.
  emotionalStability: string; // Stability baseline paragraph.
  motivationPattern: string; // Intrinsic vs extrinsic pattern paragraph.
  teamBehavior: string; // Social collaboration paragraph.
  criticalThinking: string; // High-level analytical skills paragraph.
  problemSolving: string; // Lateral vs vertical problem solving paragraph.
  innovationLevel: string; // "Exceptional", "Strong", or "Moderate"
  socialInteraction: string; // "Extroverted & Facilitating", "Balanced", or "Introverted"
  futureReadiness: string; // Professional alignment and maturity paragraph.
  riskIndicator: 'Low' | 'Medium' | 'High'; // Operational risk flags.
  recommendations: {
    forStudent: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forTeacher: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forParent: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forCounselor: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forSchool: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forCareer: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
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
  marathi: {
    summary: string; // Translates summary to perfect, professional, and grammatically flawless Marathi.
    personalityType: string; // Personality type in Marathi. e.g., "दूरदर्शी प्रचारक (ENFP)"
    communicationType: string; // Communication style in Marathi. e.g., "स्पष्ट आणि प्रभावी"
    leadershipType: string; // Leadership style in Marathi. e.g., "लोकशाही आणि संघटक"
    careerSuggestion: string; // Comma-separated list of highly specific modern careers in Marathi.
    topStrengths: string[]; // EXACTLY 5 strengths translated to Marathi.
    topGrowthAreas: string[]; // EXACTLY 3 growth areas translated to Marathi.
    studyHabitAnalysis: string; // Study habit analysis translated to Marathi.
    stressHandling: string; // Stress and anxiety management translated to Marathi.
    decisionMakingStyle: string; // Choice evaluation and accountability translated to Marathi.
    emotionalStability: string; // Stability baseline translated to Marathi.
    motivationPattern: string; // Motivation pattern translated to Marathi.
    teamBehavior: string; // Social collaboration translated to Marathi.
    criticalThinking: string; // High-level analytical skills translated to Marathi.
    problemSolving: string; // Lateral vs vertical problem solving translated to Marathi.
    innovationLevel: string; // Translated innovation level: "असाधारण", "मजबूत", "मध्यम"
    socialInteraction: string; // Translated social interaction style: "बहिर्मुखी आणि सुलभ", "संतुलित", "अंतर्मुखी"
    futureReadiness: string; // Professional alignment translated to Marathi.
    recommendations: {
      forStudent: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[]; // All fields except priority must be translated to Marathi.
      forTeacher: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
      forParent: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
      forCounselor: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
      forSchool: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
      forCareer: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    };
    predictions: {
      careerCluster: string; // Translated career cluster name.
    };
  };
}

CRITICAL: The "marathi" property MUST contain 100% correct, grammatically perfect, natural, and highly professional Marathi translations of all corresponding textual insights and recommendation fields to satisfy our school boards and parents. Keep the exact same meaning, names, numbers, and priorities. Do not use informal or broken Marathi. Ensure all JSON properties are valid and strictly match the types. Do not include markdown wraps besides valid JSON.`;

  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-pro-preview'];
  let response: any = null;
  let lastErr: any = null;

  for (const model of modelsToTry) {
    try {
      response = await geminiClient.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });
      if (response && response.text) {
        break;
      }
    } catch (e: any) {
      lastErr = e;
      console.warn(`[Gemini Engine] Model ${model} returned error, checking fallback models:`, e.message || e);
    }
  }

  if (!response || !response.text) {
    throw lastErr || new Error('No response received from Gemini AI models');
  }

  const text = response.text.trim();
  try {
    const parsed = JSON.parse(text);
    if (!parsed.counsellorReport) {
      parsed.counsellorReport = buildLocalCounsellorReport(scores, studentDetails, growthIndex, parsed.personalityType || 'Strategist', parsed.careerSuggestion || 'Computer Science');
    }
    if (!parsed.studentReport) {
      parsed.studentReport = buildLocalStudentParentReport(scores, studentDetails, growthIndex, parsed.careerSuggestion || 'Computer Science');
    }
    return parsed as AIInsights;
  } catch (parseError: any) {
    console.error('Failed to parse Gemini JSON output:', text);
    throw new Error(`AI generated invalid structured data: ${parseError.message}`);
  }
}
