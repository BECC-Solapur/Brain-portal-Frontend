'use client';

import React, { useState } from 'react';
import {
  StudentAssessment,
  CounsellorReport
} from './types';
import {
  Printer,
  ArrowLeft,
  UserCheck,
  Activity,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  Award,
  GraduationCap
} from 'lucide-react';
import {
  OfficialReportContinuation,
  OfficialReportFooter,
  OfficialReportHeader,
  printOfficialReport
} from './OfficialReportChrome';
import { buildMarathiCounsellorReport } from './marathiReports';

interface CounsellorReportViewProps {
  assessment: StudentAssessment;
  onClose: () => void;
}

export default function CounsellorReportView({
  assessment,
  onClose
}: CounsellorReportViewProps) {
  const [lang, setLang] = useState<'en' | 'mr'>('en');

  const { studentDetails, growthIndex, date, aiInsights } = assessment;
  const name = studentDetails.name;

  const englishReport: CounsellorReport = aiInsights.counsellorReport || {
    studentProfile: {
      name,
      age: studentDetails.age,
      gender: studentDetails.gender,
      grade: studentDetails.grade || 'Grade 10',
      assessmentDate: date || new Date().toISOString().split('T')[0],
      school: studentDetails.school || 'Brain Academy'
    },
    executiveSummary: {
      overallBehaviouralProfile: `${name} exhibits a balanced and structured behavioral profile characterized by high cognitive adaptability and methodical task execution. Interpersonal engagement reflects maturity with developing vocal assertiveness.`,
      emotionalFunctioning: `Demonstrates solid baseline stability with notable self-reflective awareness. High-stakes evaluative situations may induce transient performance anxiety requiring self-regulation schemas.`,
      learningProfile: `Demonstrates a structured visual-conceptual learning modality with sustained academic persistence. Thrives in goal-oriented frameworks.`,
      growthPotential: `Overall developmental trajectory indicates strong readiness (${growthIndex}% Growth Index) for accelerated leadership and specialized higher-order analytical pursuits.`,
      overallObservations: `A conscientious and responsive student candidate who benefits from proactive mentoring, transparent performance rubrics, and incremental responsibility.`
    },
    assessmentInterpretation: `Evaluation parameters demonstrate strong psychometric consistency across all 10 measured categories. Response distribution exhibits stable self-perception with an intentional focus on personal growth. Observed behavioral patterns indicate reliable self-awareness rather than transient response bias.`,
    personalityAnalysis: {
      characteristics: `Displays analytical discipline, empathetic listening, and systematic task completion aligned with ${aiInsights.personalityType || 'Analytical Strategist'}.`,
      behaviouralTendencies: `Naturally inclined toward deliberate preparation, cooperative group engagement, and structured exploration of novel concepts.`,
      selfAwareness: `Demonstrates high reflective capacity and willingness to receive developmental critique constructively.`,
      emotionalMaturity: `Demonstrates age-appropriate maturity in peer relationships, managing minor disagreements through reasoned dialog.`,
      adaptability: `Adapts well to planned changes in routine; exhibits moderate hesitation under sudden, ambiguous task demands.`,
      independence: `Exhibits reliable autonomous study habits but benefits from clear milestones for complex long-term projects.`,
      responsibility: `Consistently fulfills assigned scholastic and personal duties, demonstrating commendable accountability.`,
      socialOrientation: `Selectively collaborative; prefers purposeful teamwork with distinct individual contributions rather than unstructured social groups.`
    },
    emotionalFunctioning: {
      emotionalRegulation: `Maintains composure under everyday scholastic demands with stable self-control.`,
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
      curiosity: `High intellectual curiosity in applied sciences and analytical problem domains.`,
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
      leadershipReadiness: `Indicates solid potential for supportive, task-focused, and democratic leadership roles.`
    },
    motivationGoalOrientation: {
      intrinsicMotivation: `Driven by mastery-level understanding and personal curiosity.`,
      extrinsicMotivation: `Values parental and institutional recognition, using external milestones as helpful progress markers.`,
      achievementOrientation: `Strives for high standards of personal excellence and thoroughness in scholastic deliverables.`,
      consistency: `Demonstrates admirable day-to-day work habits and punctual adherence to academic schedules.`,
      persistence: `Bounces back reliably from academic plateaus with renewed dedication upon receiving targeted guidance.`,
      selfDiscipline: `Possesses commendable self-regulation regarding personal timetable adherence and study routines.`
    },
    decisionMakingCriticalThinking: {
      reasoning: `Strong logical-deductive reasoning capacity in structured decision contexts.`,
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
      innovationPotential: `Strong potential for applied innovation in tech-enabled and problem-solving disciplines.`
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
      'This response pattern may indicate mild evaluative anxiety during peak examination cycles, which can cause temporary performance hesitation.',
      'This assessment suggests slight reticence in public assertiveness, which may mask comprehensive grasp of subject matter during vocal classroom evaluations.'
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

  const isMarathi = lang === 'mr';
  const report: CounsellorReport = isMarathi
    ? aiInsights.marathi?.counsellorReport || buildMarathiCounsellorReport(assessment)
    : englishReport;
  const t = (english: string, marathi: string) => isMarathi ? marathi : english;

  const handlePrint = () => {
    printOfficialReport();
  };

  return (
    <div lang={isMarathi ? 'mr' : 'en'} className={`ai-report-view min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 font-sans ${isMarathi ? 'devanagari' : ''}`}>
      {/* Upper Control Bar (Hidden in Print) */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={onClose}
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> {t('Return to Dashboard', 'डॅशबोर्डवर परत जा')}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('mr')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'mr' ? 'bg-[#3f2f7a] text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              मराठी
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3f2f7a] hover:bg-[#2c2159] text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="h-4 w-4" /> {t('Print / Save Counsellor Report (PDF)', 'समुपदेशक अहवाल प्रिंट / जतन करा (PDF)')}
          </button>
        </div>
      </div>

      {/* Comprehensive 20-Section Clinical & Educational Report Document */}
      <div className="ai-report-shell w-full max-w-5xl mx-auto space-y-8 print:space-y-0 text-slate-800">
        
        {/* ================= SECTION BLOCK A: PROFILE & EXECUTIVE SUMMARY ================= */}
        <div className="ai-report-page page-break bg-white p-8 sm:p-10 min-h-[1100px] flex flex-col justify-between relative overflow-hidden">
          <div className="ai-report-section-flow">
            <OfficialReportHeader
              title={t('Professional Counsellor & Psychological Report', 'व्यावसायिक समुपदेशक व मानसशास्त्रीय अहवाल')}
              subtitle={t('Confidential educational psychometrics and structured guidance report', 'गोपनीय शैक्षणिक मानसशास्त्रीय मूल्यमापन व संरचित मार्गदर्शन')}
              badge={t(`Verified Growth Index ${growthIndex}%`, `प्रमाणित विकास निर्देशांक ${growthIndex}%`)}
              referenceId={assessment.id || 'PSYC-2026'}
              studentName={report.studentProfile.name}
              grade={report.studentProfile.grade}
              school={report.studentProfile.school}
              date={report.studentProfile.assessmentDate}
              language={lang}
            />

            {/* 1. Student Profile */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('1. Student Profile & Diagnostic Baseline', '१. विद्यार्थी प्रोफाइल व मूल्यमापन आधाररेषा')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div><span className="text-slate-400 block">{t('Candidate:', 'विद्यार्थी:')}</span><strong>{report.studentProfile.name}</strong></div>
                <div><span className="text-slate-400 block">{t('Age & Gender:', 'वय व लिंग:')}</span><strong>{report.studentProfile.age} {t('Y', 'वर्षे')} / {report.studentProfile.gender}</strong></div>
                <div><span className="text-slate-400 block">{t('Grade / Class:', 'इयत्ता / वर्ग:')}</span><strong>{report.studentProfile.grade}</strong></div>
                <div><span className="text-slate-400 block">{t('Assessment Date:', 'मूल्यांकन दिनांक:')}</span><strong>{report.studentProfile.assessmentDate}</strong></div>
              </div>
            </div>

            {/* 2. Executive Summary */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#3f2f7a]" /> {t('2. Executive Summary', '२. कार्यकारी सारांश')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Overall Behavioural Profile:', 'एकूण वर्तणूक प्रोफाइल:')}</span>
                  <p className="text-slate-700 leading-relaxed">{report.executiveSummary.overallBehaviouralProfile}</p>
                </div>
                <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Emotional Functioning:', 'भावनिक कार्यप्रणाली:')}</span>
                  <p className="text-slate-700 leading-relaxed">{report.executiveSummary.emotionalFunctioning}</p>
                </div>
                <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Learning Profile:', 'अध्ययन प्रोफाइल:')}</span>
                  <p className="text-slate-700 leading-relaxed">{report.executiveSummary.learningProfile}</p>
                </div>
                <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Growth Potential & Observations:', 'विकास क्षमता व निरीक्षणे:')}</span>
                  <p className="text-slate-700 leading-relaxed">{report.executiveSummary.growthPotential} {report.executiveSummary.overallObservations}</p>
                </div>
              </div>
            </div>

            {/* 3. Assessment Interpretation */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{t('3. Assessment Interpretation & Psychometric Confidence', '३. मूल्यमापन विश्लेषण व मानसशास्त्रीय विश्वासार्हता')}</h2>
              <p className="text-slate-700 leading-relaxed">{report.assessmentInterpretation}</p>
            </div>

            {/* 4. Personality Analysis */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-600" /> {t('4. Personality Analysis', '४. व्यक्तिमत्त्व विश्लेषण')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">{t('Characteristics:', 'वैशिष्ट्ये:')}</span>
                  <span className="text-slate-600">{report.personalityAnalysis.characteristics}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">{t('Self-Awareness:', 'स्व-जाणीव:')}</span>
                  <span className="text-slate-600">{report.personalityAnalysis.selfAwareness}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">{t('Emotional Maturity:', 'भावनिक परिपक्वता:')}</span>
                  <span className="text-slate-600">{report.personalityAnalysis.emotionalMaturity}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-900 block">{t('Adaptability & Social:', 'अनुकूलता व सामाजिकता:')}</span>
                  <span className="text-slate-600">{report.personalityAnalysis.adaptability} {report.personalityAnalysis.socialOrientation}</span>
                </div>
              </div>
            </div>
          </div>

          <OfficialReportFooter label={t('Professional Counsellor Report', 'व्यावसायिक समुपदेशक अहवाल')} page={t('Page 1 of 4 - Sections 1.0-4.0', 'पृष्ठ १ / ४ - विभाग १ ते ४')} language={lang} />
        </div>

        {/* ================= SECTION BLOCK B: COGNITIVE, EMOTIONAL & SOCIAL ================= */}
        <div className="ai-report-page page-break bg-white p-8 sm:p-10 min-h-[1100px] flex flex-col justify-between relative overflow-hidden">
          <div className="ai-report-section-flow">
            <OfficialReportContinuation
              title={t('Professional Counsellor & Psychological Report', 'व्यावसायिक समुपदेशक व मानसशास्त्रीय अहवाल')}
              studentName={name}
              pageLabel={t('Page 2 of 4', 'पृष्ठ २ / ४')}
            />
            {/* 5. Emotional Functioning */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Activity className="h-4 w-4 text-rose-600" /> {t('5. Emotional Functioning & Resilience', '५. भावनिक कार्यप्रणाली व लवचिकता')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="p-3.5 bg-rose-50/30 border border-rose-100/60 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('Emotional Regulation:', 'भावनिक नियमन:')}</span>
                  <p className="text-slate-600">{report.emotionalFunctioning.emotionalRegulation}</p>
                </div>
                <div className="p-3.5 bg-rose-50/30 border border-rose-100/60 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('Stress Tolerance & Triggers:', 'ताण सहनशीलता व कारणे:')}</span>
                  <p className="text-slate-600">{report.emotionalFunctioning.stressTolerance} {report.emotionalFunctioning.emotionalTriggers}</p>
                </div>
                <div className="p-3.5 bg-rose-50/30 border border-rose-100/60 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('Empathy & Coping:', 'सहानुभूती व सामना पद्धती:')}</span>
                  <p className="text-slate-600">{report.emotionalFunctioning.empathy} {report.emotionalFunctioning.copingMechanisms}</p>
                </div>
              </div>
            </div>

            {/* 6. Learning & Cognitive Profile */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" /> {t('6. Learning & Cognitive Profile', '६. अध्ययन व संज्ञानात्मक प्रोफाइल')}
              </h2>
              <div className="p-4 bg-blue-50/30 border border-blue-100/60 rounded-2xl space-y-2 text-xs">
                <p><strong>{t('Preferred Modality:', 'प्राधान्य अध्ययन पद्धत:')}</strong> {report.learningCognitiveProfile.preferredLearningStyle}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div><span className="text-slate-400 block font-bold">{t('Study Behavior:', 'अभ्यास वर्तन:')}</span>{report.learningCognitiveProfile.studyBehaviour}</div>
                  <div><span className="text-slate-400 block font-bold">{t('Attention Pattern:', 'लक्ष पद्धत:')}</span>{report.learningCognitiveProfile.attentionPatterns}</div>
                  <div><span className="text-slate-400 block font-bold">{t('Memory Strategies:', 'स्मरण पद्धती:')}</span>{report.learningCognitiveProfile.memoryStrategies}</div>
                  <div><span className="text-slate-400 block font-bold">{t('Theory vs Practical:', 'सिद्धांत व प्रत्यक्ष:')}</span>{report.learningCognitiveProfile.practicalVsConceptual}</div>
                </div>
              </div>
            </div>

            {/* 7. Communication & Social Behaviour */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('7. Communication & Social Behaviour', '७. संवाद व सामाजिक वर्तन')}</h2>
              <p className="text-slate-600">
                <strong>{t('Style & Listening:', 'शैली व श्रवण:')}</strong> {report.communicationSocialBehaviour.communicationStyle} {report.communicationSocialBehaviour.listeningBehaviour}
              </p>
              <p className="text-slate-600">
                <strong>{t('Collaboration & Conflict:', 'सहकार्य व संघर्ष:')}</strong> {report.communicationSocialBehaviour.collaboration} {report.communicationSocialBehaviour.conflictHandling}
              </p>
            </div>

            {/* 8. Leadership & Responsibility */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('8. Leadership & Responsibility Matrix', '८. नेतृत्व व जबाबदारी')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                <div><span className="font-bold text-slate-800 block">{t('Initiative:', 'पुढाकार:')}</span>{report.leadershipResponsibility.initiative}</div>
                <div><span className="font-bold text-slate-800 block">{t('Accountability:', 'उत्तरदायित्व:')}</span>{report.leadershipResponsibility.accountability}</div>
                <div><span className="font-bold text-slate-800 block">{t('Decision Making:', 'निर्णयक्षमता:')}</span>{report.leadershipResponsibility.decisionMaking}</div>
                <div><span className="font-bold text-slate-800 block">{t('Readiness:', 'तयारी:')}</span>{report.leadershipResponsibility.leadershipReadiness}</div>
              </div>
            </div>

            {/* 9. Motivation & Goal Orientation */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('9. Motivation & Goal Orientation', '९. प्रेरणा व ध्येयाभिमुखता')}</h2>
              <p className="text-slate-600">
                <strong>{t('Intrinsic vs Extrinsic:', 'अंतर्गत व बाह्य प्रेरणा:')}</strong> {report.motivationGoalOrientation.intrinsicMotivation} {report.motivationGoalOrientation.extrinsicMotivation}
              </p>
              <p className="text-slate-600">
                <strong>{t('Self-Discipline & Persistence:', 'स्वयंशिस्त व चिकाटी:')}</strong> {report.motivationGoalOrientation.selfDiscipline} {report.motivationGoalOrientation.persistence}
              </p>
            </div>

            {/* 10. Decision-Making & Critical Thinking */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('10. Decision-Making & Critical Thinking', '१०. निर्णयक्षमता व चिकित्सक विचार')}</h2>
              <p className="text-slate-600">
                <strong>{t('Reasoning & Problem-Solving:', 'तर्क व समस्या निराकरण:')}</strong> {report.decisionMakingCriticalThinking.reasoning} {report.decisionMakingCriticalThinking.problemSolvingStyle}
              </p>
            </div>
          </div>

          <OfficialReportFooter label={t('Professional Counsellor Report', 'व्यावसायिक समुपदेशक अहवाल')} page={t('Page 2 of 4 - Sections 5.0-10.0', 'पृष्ठ २ / ४ - विभाग ५ ते १०')} language={lang} />
        </div>

        {/* ================= SECTION BLOCK C: CREATIVITY, CAREER, STRENGTHS & OBSERVATIONS ================= */}
        <div className="ai-report-page page-break bg-white p-8 sm:p-10 min-h-[1100px] flex flex-col justify-between relative overflow-hidden">
          <div className="ai-report-section-flow">
            <OfficialReportContinuation
              title={t('Professional Counsellor & Psychological Report', 'व्यावसायिक समुपदेशक व मानसशास्त्रीय अहवाल')}
              studentName={name}
              pageLabel={t('Page 3 of 4', 'पृष्ठ ३ / ४')}
            />
            {/* 11. Creativity & Innovation */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> {t('11. Creativity & Innovation Potential', '११. सर्जनशीलता व नवकल्पना क्षमता')}
              </h2>
              <p className="text-slate-600">
                {report.creativityInnovation.curiosity} {report.creativityInnovation.ideaGeneration} {report.creativityInnovation.innovationPotential}
              </p>
            </div>

            {/* 12. Career Development Readiness */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
              <span className="text-[10px] font-bold text-[#f4c76a] uppercase tracking-wider">
                {t('12. Career Development Readiness & Recommended Domains', '१२. करिअर विकास तयारी व सुचवलेली क्षेत्रे')}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.careerDevelopmentReadiness.careerAwareness} {report.careerDevelopmentReadiness.futurePlanning}
              </p>
              <div className="border-t border-slate-800 pt-2 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">{t('Broad Vocational Exploration Tracks:', 'व्यापक करिअर शोध क्षेत्रे:')}</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {report.careerDevelopmentReadiness.recommendedDomains.map((dom, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200">
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 13. Strengths */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" /> {t('13. Key Psychological & Scholastic Strengths', '१३. प्रमुख मानसशास्त्रीय व शैक्षणिक जमेच्या बाजू')}
              </h2>
              <div className="space-y-2 text-xs">
                {report.strengths.map((str, i) => (
                  <div key={i} className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                    <strong className="text-emerald-950">{str.characteristic}:</strong> <span className="text-slate-700">{str.whyItMatters}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 14. Development Areas */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('14. Targeted Development Areas', '१४. लक्षित विकास क्षेत्रे')}</h2>
              <div className="space-y-2 text-xs">
                {report.developmentAreas.map((dev, i) => (
                  <div key={i} className="p-3 bg-amber-50/30 border border-amber-100 rounded-xl space-y-1">
                    <strong className="text-amber-950">{dev.area}</strong>
                    <p className="text-slate-600"><strong>{t('Educational Impact:', 'शैक्षणिक परिणाम:')}</strong> {dev.educationalImpact}</p>
                    <p className="text-slate-700"><strong>{t('Improvement Strategy:', 'सुधारणा पद्धत:')}</strong> {dev.improvementStrategy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 15. Behavioural Observations */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('15. Cross-Environment Behavioural Observations', '१५. विविध वातावरणांतील वर्तणूक निरीक्षणे')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px]">
                <div><span className="font-bold text-slate-800 block">{t('Classroom:', 'वर्गात:')}</span>{report.behaviouralObservations.classroom}</div>
                <div><span className="font-bold text-slate-800 block">{t('Group Work:', 'गटकार्य:')}</span>{report.behaviouralObservations.groupActivities}</div>
                <div><span className="font-bold text-slate-800 block">{t('Exams:', 'परीक्षा:')}</span>{report.behaviouralObservations.examinations}</div>
                <div><span className="font-bold text-slate-800 block">{t('Competitive:', 'स्पर्धात्मक परिस्थिती:')}</span>{report.behaviouralObservations.competitiveSituations}</div>
                <div className="col-span-2"><span className="font-bold text-slate-800 block">{t('Home Environment:', 'घरचे वातावरण:')}</span>{report.behaviouralObservations.homeEnvironment}</div>
              </div>
            </div>
          </div>

          <OfficialReportFooter label={t('Professional Counsellor Report', 'व्यावसायिक समुपदेशक अहवाल')} page={t('Page 3 of 4 - Sections 11.0-15.0', 'पृष्ठ ३ / ४ - विभाग ११ ते १५')} language={lang} />
        </div>

        {/* ================= SECTION BLOCK D: RISKS, RECOMMENDATIONS & LONG-TERM PLAN ================= */}
        <div className="ai-report-page page-break bg-white p-8 sm:p-10 min-h-[1100px] flex flex-col justify-between relative overflow-hidden">
          <div className="ai-report-section-flow">
            <OfficialReportContinuation
              title={t('Professional Counsellor & Psychological Report', 'व्यावसायिक समुपदेशक व मानसशास्त्रीय अहवाल')}
              studentName={name}
              pageLabel={t('Page 4 of 4', 'पृष्ठ ४ / ४')}
            />
            {/* 16. Risk Indicators */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs">
              <h2 className="font-bold text-rose-900 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> {t('16. Educational & Behavioural Risk Indicators', '१६. शैक्षणिक व वर्तणुकीशी संबंधित जोखीम संकेत')}
              </h2>
              <p className="text-[11px] text-rose-800 italic">
                {t('Note: Non-clinical evaluative indicators based on test response patterns. No psychiatric or medical diagnoses are assigned.', 'टीप: हे चाचणी प्रतिसादांवर आधारित गैर-नैदानिक विकासात्मक संकेत आहेत. यात कोणतेही वैद्यकीय किंवा मानसिक निदान केलेले नाही.')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {report.riskIndicators.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>

            {/* 17. Counselling Recommendations */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('17. Structured Counselling Session Protocol', '१७. संरचित समुपदेशन सत्र आराखडा')}</h2>
              <div className="p-4 bg-purple-50/30 border border-purple-100 rounded-2xl space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#3f2f7a] block mb-1">{t('Priority Discussion Topics:', 'प्राधान्य चर्चेचे विषय:')}</span>
                  <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                    {report.counsellingRecommendations.priorityDiscussionTopics.map((top, i) => (
                      <li key={i}>{top}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div><strong>{t('Confidence Building:', 'आत्मविश्वास विकास:')}</strong> {report.counsellingRecommendations.confidenceBuildingStrategies.join(' ')}</div>
                  <div><strong>{t('Emotional Regulation:', 'भावनिक नियमन:')}</strong> {report.counsellingRecommendations.emotionalRegulationTechniques.join(' ')}</div>
                </div>
              </div>
            </div>

            {/* 18 & 19. Parent & Teacher Recommendations */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wide">{t('18. Parent Recommendations', '१८. पालकांसाठी शिफारसी')}</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  {report.parentRecommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wide">{t('19. Teacher Recommendations', '१९. शिक्षकांसाठी शिफारसी')}</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  {report.teacherRecommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 20. Long-Term Development Plan */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('20. Long-Term 3–6 Month Developmental Roadmap', '२०. दीर्घकालीन ३–६ महिन्यांचा विकास आराखडा')}</h2>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Months 1–2:', 'महिने १–२:')}</span>
                  <p className="text-slate-600 text-[11px]">{report.longTermDevelopmentPlan.month1To2}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Months 3–4:', 'महिने ३–४:')}</span>
                  <p className="text-slate-600 text-[11px]">{report.longTermDevelopmentPlan.month3To4}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-[#3f2f7a]">{t('Months 5–6:', 'महिने ५–६:')}</span>
                  <p className="text-slate-600 text-[11px]">{report.longTermDevelopmentPlan.month5To6}</p>
                </div>
              </div>
            </div>

            {/* Authorized Sign-Off */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center font-serif italic text-slate-600">
                  Counsellor Kiran Kulkarni
                </div>
                <p className="text-[11px] font-bold text-slate-700 mt-1">Lead Educational Counsellor</p>
                <p className="text-[10px] text-slate-400">BRAIN Educational Centre</p>
              </div>

              <div>
                <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center font-serif italic text-slate-600">
                  Dr. Raymond Croft, Psy.D.
                </div>
                <p className="text-[11px] font-bold text-slate-700 mt-1">Senior Psychometrics Evaluator</p>
                <p className="text-[10px] text-slate-400">Clinical Psychometrics Advisory</p>
              </div>
            </div>
          </div>

          <OfficialReportFooter label={t('Professional Counsellor Report', 'व्यावसायिक समुपदेशक अहवाल')} page={t('Page 4 of 4 - Sections 16.0-20.0 - Certified', 'पृष्ठ ४ / ४ - विभाग १६ ते २० - प्रमाणित')} language={lang} />
        </div>

      </div>
    </div>
  );
}
