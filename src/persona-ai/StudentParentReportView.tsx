'use client';

import React, { useState } from 'react';
import {
  StudentAssessment,
  StudentParentReport
} from './types';
import {
  BookOpen,
  Printer,
  ArrowLeft,
  Sparkles,
  Heart,
  Compass,
  Lightbulb,
  CheckCircle2,
  Users,
  Smile
} from 'lucide-react';
import {
  OfficialReportContinuation,
  OfficialReportFooter,
  OfficialReportHeader,
  printOfficialReport
} from './OfficialReportChrome';
import { buildMarathiStudentReport } from './marathiReports';

interface StudentParentReportViewProps {
  assessment: StudentAssessment;
  onClose: () => void;
}

export default function StudentParentReportView({
  assessment,
  onClose
}: StudentParentReportViewProps) {
  const [lang, setLang] = useState<'en' | 'mr'>('en');

  const { studentDetails, growthIndex, date, aiInsights } = assessment;
  const name = studentDetails.name;

  // Use generated report or build fallback
  const englishReport: StudentParentReport = aiInsights.studentReport || {
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
      howYouLearnBest: 'You learn best when you can see the big picture visually before diving into the details. Diagramming concepts, using colorful highlighters, and linking ideas together helps concepts click naturally for you.',
      studyTips: [
        'Draw colorful mind maps and flowcharts for subjects with lots of chapters.',
        'Use the 25-minute study focus interval, followed by a quick 5-minute movement break.',
        'Explain what you just learned out loud to a family member or friend in your own simple words.'
      ],
      revisionSuggestions: [
        'Review your summary notes within 24 hours of first learning a new lesson.',
        'Create self-quizzes with flashcards to test your memory actively before exams.'
      ],
      memoryImprovementTechniques: [
        'Use visual associations and real-world analogies to remember tricky formulas or dates.',
        'Group related facts together into small clusters so your brain can recall them easily.'
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
    yourFuturePotential: `Your wonderful combination of analytical logic, creativity, and steady determination opens exciting doors for your future! You are naturally well-suited for rewarding fields in ${aiInsights.careerSuggestion || 'Computer Science, Systems Engineering & Applied Analytics'} and related areas where creative problem solvers build solutions that help people. As you grow, keep exploring what you love—the possibilities ahead of you are vast!`,
    tipsForParents: [
      'Celebrate your child\'s effort, curiosity, and persistence rather than focusing solely on marks or rankings.',
      'Create a calm, positive study corner at home and encourage regular breaks for play, exercise, and hobbies.',
      'Ask open-ended questions like: "What was the most interesting thing you learned today?" to build natural curiosity.',
      'Allow your child to make small everyday choices independently to strengthen their decision-making confidence.',
      'Be a patient sounding board when school feels busy; simple warmth and reassurance work wonders.'
    ],
    finalEncouragement: 'Remember, every student grows at their own unique pace, and your intelligence grows with every new challenge you try! This report is not a scorecard or a final judgment—it is a cheerful map celebrating who you are today and showing the exciting ways you can shine tomorrow. Keep smiling, keep asking questions, and be proud of all that you do!'
  };

  const isMarathi = lang === 'mr';
  const report: StudentParentReport = isMarathi
    ? aiInsights.marathi?.studentReport || buildMarathiStudentReport(assessment)
    : englishReport;
  const t = (english: string, marathi: string) => isMarathi ? marathi : english;

  const formattedDate = new Date(date).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    printOfficialReport();
  };

  return (
    <div lang={isMarathi ? 'mr' : 'en'} className={`ai-report-view min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 font-sans ${isMarathi ? 'devanagari' : ''}`}>
      {/* Top Action Bar (Hidden during Print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
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
            <Printer className="h-4 w-4" /> {t('Download / Print Report (PDF)', 'अहवाल डाउनलोड / प्रिंट करा (PDF)')}
          </button>
        </div>
      </div>

      {/* Printable Report Document (Clean 2-Page Visual Layout) */}
      <div className="ai-report-shell w-full max-w-4xl mx-auto space-y-8 print:space-y-0 text-slate-800">
        
        {/* ================= PAGE 1 ================= */}
        <div className="ai-report-page ai-report-student-page ai-report-student-page--first page-break bg-white p-8 sm:p-10 min-h-[1100px] flex flex-col justify-between relative overflow-hidden">
          <OfficialReportHeader
            title={t('Personal Growth & Learning Profile', 'वैयक्तिक विकास व अध्ययन प्रोफाइल')}
            subtitle={t('A clear, encouraging guide for the student and family', 'विद्यार्थी आणि कुटुंबासाठी स्पष्ट व प्रोत्साहनपर मार्गदर्शक')}
            badge={t(`Growth Index ${growthIndex}%`, `विकास निर्देशांक ${growthIndex}%`)}
            referenceId={assessment.id || 'AI-CMT-STUDENT'}
            studentName={name}
            grade={studentDetails.grade}
            school={studentDetails.school}
            date={formattedDate}
            language={lang}
          />

          <div className="ai-report-section-flow my-6">
            {/* Section 1: About You */}
            <div className="p-6 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-[#3f2f7a]" />
                <h2 className="text-base font-black text-slate-900">{t('1. About You', '१. तुमच्याबद्दल')}</h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {report.aboutYou}
              </p>
            </div>

            {/* Section 2: Your Strengths */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-black text-slate-900">{t('2. Your Superpowers (Strengths)', '२. तुमच्या जमेच्या बाजू')}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {report.yourStrengths.map((strength, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5">
                    <h3 className="text-xs font-bold text-[#3f2f7a] uppercase tracking-wide flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {strength.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium">{strength.explanation}</p>
                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                      <strong>{t('Everyday Example:', 'दैनंदिन उदाहरण:')}</strong> {strength.practicalExample}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Your Learning Style */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h2 className="text-base font-black text-slate-900">{t('3. How You Learn Best', '३. तुम्ही सर्वोत्तम कसे शिकता')}</h2>
              </div>
              <div className="p-5 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {report.yourLearningStyle.howYouLearnBest}
                </p>
                <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-100/80 space-y-1">
                    <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">{t('Top Study Tips', 'अभ्यासासाठी महत्त्वाच्या सूचना')}</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      {report.yourLearningStyle.studyTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100/80 space-y-1">
                    <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">{t('Revision Suggestions', 'उजळणीसाठी सूचना')}</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      {report.yourLearningStyle.revisionSuggestions.map((rev, i) => (
                        <li key={i}>{rev}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100/80 space-y-1">
                    <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider">{t('Memory Improvement', 'स्मरणशक्ती सुधारणा')}</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      {report.yourLearningStyle.memoryImprovementTechniques.map((mem, i) => (
                        <li key={i}>{mem}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <OfficialReportFooter label={t('BRAIN Educational Counselling - Student & Parent Report', 'BRAIN शैक्षणिक समुपदेशन - विद्यार्थी व पालक अहवाल')} page={t('Page 1 of 2', 'पृष्ठ १ / २')} language={lang} />
        </div>

        {/* ================= PAGE 2 ================= */}
        <div className="ai-report-page ai-report-student-page page-break bg-white p-8 sm:p-10 min-h-[1100px] flex flex-col justify-between relative overflow-hidden">
          <OfficialReportContinuation
            title={t('Student & Parent Personal Development Plan', 'विद्यार्थी व पालक वैयक्तिक विकास आराखडा')}
            studentName={name}
            pageLabel={t('Page 2 of 2', 'पृष्ठ २ / २')}
          />

          <div className="ai-report-section-flow my-6">
            {/* Section 4: How You Handle Challenges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-black text-slate-900">{t('4. How You Handle Challenges', '४. तुम्ही आव्हाने कशी हाताळता')}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('During Exams:', 'परीक्षेदरम्यान:')}</span>
                  <p className="text-slate-600">{report.howYouHandleChallenges.exams}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('Difficult Situations:', 'कठीण परिस्थितीत:')}</span>
                  <p className="text-slate-600">{report.howYouHandleChallenges.difficultSituations}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('Making Mistakes:', 'चुका झाल्यावर:')}</span>
                  <p className="text-slate-600">{report.howYouHandleChallenges.mistakes}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">{t('Handling Pressure:', 'दबाव हाताळताना:')}</span>
                  <p className="text-slate-600">{report.howYouHandleChallenges.pressure}</p>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
                <strong>{t('Encouraging Advice:', 'प्रोत्साहनपर सल्ला:')}</strong> {report.howYouHandleChallenges.encouragingAdvice}
              </div>
            </div>

            {/* Section 5: Areas to Improve */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-black text-slate-900">
                  {t('5. Exciting Opportunities for Growth', '५. विकासाच्या संधी')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('Remember: There are no weaknesses—only exciting new skills waiting to be unlocked!', 'लक्षात ठेवा: कमतरता नसतात—विकसित करण्यासाठी नवीन कौशल्ये असतात!')}
              </p>
              <div className="space-y-2.5">
                {report.areasToImprove.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-950 block">
                      ✨ {t('You can become even better by:', 'तुम्ही आणखी प्रगती करू शकता:')} {item.growthOpportunity}
                    </span>
                    <p className="text-slate-600">
                      <strong>{t('How to do it:', 'हे कसे कराल:')}</strong> {item.actionableTip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Your Future Potential */}
            <div className="p-5 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 border border-purple-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#3f2f7a]" />
                <h2 className="text-base font-black text-slate-900">{t('6. Your Future Potential', '६. तुमची भविष्यातील क्षमता')}</h2>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {report.yourFuturePotential}
              </p>
            </div>

            {/* Section 7: Tips for Parents */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#3f2f7a]" />
                <h2 className="text-base font-black text-slate-900">{t('7. Helpful Tips for Parents', '७. पालकांसाठी उपयुक्त सूचना')}</h2>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                {report.tipsForParents.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="text-[#3f2f7a] font-bold">✔</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 8: Final Encouragement */}
            <div className="p-5 bg-[#3f2f7a] text-white rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-amber-300">
                <Heart className="h-5 w-5 fill-amber-300" />
                <h3 className="text-sm font-black uppercase tracking-wider">{t('8. Final Encouragement', '८. अंतिम प्रोत्साहन')}</h3>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                {report.finalEncouragement}
              </p>
            </div>
          </div>

          <OfficialReportFooter label={t('BRAIN Educational Counselling - Student & Parent Report', 'BRAIN शैक्षणिक समुपदेशन - विद्यार्थी व पालक अहवाल')} page={t('Page 2 of 2 - End of Report', 'पृष्ठ २ / २ - अहवाल समाप्त')} language={lang} />
        </div>

      </div>
    </div>
  );
}
