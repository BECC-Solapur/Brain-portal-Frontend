import type { CounsellorReport, StudentAssessment, StudentParentReport } from './types';

const defaults = {
  strengths: ['तार्किक विचारशक्ती', 'सातत्यपूर्ण प्रयत्न', 'सहकार्याची वृत्ती', 'सर्जनशील समस्या निराकरण'],
  growth: ['वर्गात आत्मविश्वासाने मत मांडणे', 'परीक्षेचा ताण नियोजित पद्धतीने हाताळणे', 'मोठ्या कामाची लहान टप्प्यांत सुरुवात करणे']
};

const safeList = (items: string[] | undefined, fallback: string[], count = 4) =>
  (items?.length ? items : fallback).slice(0, count);

const translatedRecommendations = (
  assessment: StudentAssessment,
  group: 'forStudent' | 'forTeacher' | 'forParent' | 'forCounselor'
) => assessment.aiInsights.marathi?.recommendations?.[group]?.map((item) => item.recommendation).filter(Boolean) || [];

export function buildMarathiStudentReport(assessment: StudentAssessment): StudentParentReport {
  const { aiInsights, studentDetails } = assessment;
  const mr = aiInsights.marathi;
  const name = studentDetails.name;
  const strengths = safeList(mr?.topStrengths, defaults.strengths);
  const growthAreas = safeList(mr?.topGrowthAreas, defaults.growth, 3);
  const parentTips = translatedRecommendations(assessment, 'forParent');

  return {
    aboutYou: mr?.summary || `${name}, तुम्ही जिज्ञासू, विचारशील आणि सक्षम विद्यार्थी आहात. शिकताना तुम्ही प्रामाणिक प्रयत्न करता, जबाबदारीने काम पूर्ण करता आणि इतरांशी सहकार्याने वागता.`,
    yourStrengths: strengths.map((title, index) => ({
      title,
      explanation: index === 0
        ? 'ही क्षमता तुम्हाला नवीन संकल्पना समजून घेऊन योग्य निष्कर्षापर्यंत पोहोचण्यास मदत करते.'
        : 'ही तुमची महत्त्वाची जमेची बाजू आहे आणि अभ्यासासोबत दैनंदिन जीवनातही उपयोगी पडते.',
      practicalExample: index % 2 === 0
        ? 'अवघड प्रश्न समोर आल्यावर तुम्ही तो लहान टप्प्यांत विभागून शांतपणे सोडवू शकता.'
        : 'गटकार्यामध्ये स्वतःची जबाबदारी पूर्ण करताना तुम्ही इतरांचे मतही आदराने ऐकता.'
    })),
    yourLearningStyle: {
      howYouLearnBest: mr?.studyHabitAnalysis || 'चित्रे, आकृत्या, उदाहरणे आणि मुद्देसूद नोंदी यांच्या मदतीने तुम्ही अधिक चांगले शिकता. मोठी संकल्पना आधी समजून घेतल्यावर तपशील लक्षात ठेवणे सोपे जाते.',
      studyTips: [
        'प्रत्येक धड्याचा रंगीत मननकाशा किंवा प्रवाहचित्र तयार करा.',
        '२५ मिनिटे एकाग्र अभ्यास करून ५ मिनिटांचा छोटा विराम घ्या.',
        'शिकलेली संकल्पना स्वतःच्या शब्दांत मित्राला किंवा कुटुंबीयाला समजावून सांगा.'
      ],
      revisionSuggestions: [
        'नवीन धडा शिकल्यानंतर २४ तासांच्या आत त्याची उजळणी करा.',
        'परीक्षेपूर्वी फ्लॅशकार्ड किंवा स्वप्रश्नमंजुषेने स्वतःची तयारी तपासा.'
      ],
      memoryImprovementTechniques: [
        'सूत्रे व तारखा लक्षात ठेवण्यासाठी दृश्य संबंध आणि दैनंदिन उदाहरणे वापरा.',
        'संबंधित माहिती लहान गटांत विभागून लक्षात ठेवा.'
      ]
    },
    howYouHandleChallenges: {
      exams: mr?.stressHandling || 'तुम्ही तयारी चांगली करता; परीक्षेपूर्वी ताण जाणवल्यास तीन खोल श्वास घेऊन प्रश्न एकेक करून सोडवा.',
      difficultSituations: 'अडचणीच्या वेळी शांतपणे विचार करणे ही तुमची ताकद आहे. गरज भासल्यास विश्वासू व्यक्तीशी बोलल्याने उपाय लवकर सापडतो.',
      mistakes: 'चूक म्हणजे अपयश नाही; ती पुढील वेळी अधिक चांगले करण्याचा स्पष्ट संकेत आहे.',
      pressure: 'कामे जास्त असतील तर प्राधान्यक्रमाची छोटी यादी करा आणि एका वेळी एकच काम पूर्ण करा.',
      encouragingAdvice: 'तुमच्या तयारीवर विश्वास ठेवा. प्रत्येक प्रामाणिक प्रयत्न तुमचे कौशल्य आणि आत्मविश्वास वाढवतो.'
    },
    areasToImprove: growthAreas.map((growthOpportunity, index) => ({
      growthOpportunity,
      actionableTip: index === 0
        ? 'या आठवड्यात प्रत्येक वर्गात किमान एक प्रश्न विचारा किंवा एक कल्पना मांडण्याचा प्रयत्न करा.'
        : index === 1
          ? 'ताण जाणवल्यावर तीन खोल श्वास घ्या, सकारात्मक स्वसंवाद करा आणि कामाचा पहिला छोटा टप्पा सुरू करा.'
          : 'मोठे काम १० ते १५ मिनिटांच्या लहान टप्प्यांत विभागून पहिला टप्पा आजच पूर्ण करा.'
    })),
    yourFuturePotential: mr?.futureReadiness || `तुमची विचारशक्ती, सर्जनशीलता आणि सातत्य यामुळे ${mr?.careerSuggestion || 'तुमच्या आवडीच्या करिअर क्षेत्रात'} चांगली प्रगती करण्याची क्षमता आहे. विविध विषय, उपक्रम आणि करिअर पर्याय प्रत्यक्ष अनुभवातून शोधत राहा.`,
    tipsForParents: parentTips.length ? parentTips : [
      'फक्त गुणांपेक्षा मुलाच्या प्रयत्नांचे, जिज्ञासेचे आणि सातत्याचे कौतुक करा.',
      'घरी शांत अभ्यासाची जागा द्या आणि खेळ, व्यायाम व विश्रांतीसाठी वेळ ठेवा.',
      'दररोजच्या छोट्या निर्णयांमध्ये मुलाला स्वातंत्र्य देऊन आत्मविश्वास वाढवा.',
      'शाळेचा ताण जाणवल्यास टीका न करता शांतपणे ऐका आणि आश्वस्त करा.'
    ],
    finalEncouragement: 'प्रत्येक विद्यार्थी स्वतःच्या गतीने विकसित होतो. हा अहवाल अंतिम निकाल नसून तुमच्या आजच्या गुणांची ओळख आणि उद्याच्या प्रगतीची दिशा आहे. प्रश्न विचारत राहा, प्रयत्न करत राहा आणि स्वतःच्या प्रगतीचा अभिमान बाळगा!'
  };
}

export function buildMarathiCounsellorReport(assessment: StudentAssessment): CounsellorReport {
  const { aiInsights, studentDetails, growthIndex, date } = assessment;
  const mr = aiInsights.marathi;
  const name = studentDetails.name;
  const strengths = safeList(mr?.topStrengths, defaults.strengths, 5);
  const growthAreas = safeList(mr?.topGrowthAreas, defaults.growth, 3);
  const parentRecommendations = translatedRecommendations(assessment, 'forParent');
  const teacherRecommendations = translatedRecommendations(assessment, 'forTeacher');
  const counsellorRecommendations = translatedRecommendations(assessment, 'forCounselor');

  return {
    studentProfile: { name, age: studentDetails.age, gender: studentDetails.gender, grade: studentDetails.grade, assessmentDate: date, school: studentDetails.school },
    executiveSummary: {
      overallBehaviouralProfile: mr?.summary || `${name} यांची वर्तणूक संतुलित, जबाबदार आणि अभ्यासाभिमुख दिसते. नियोजनबद्ध काम आणि सहकार्य ही ठळक वैशिष्ट्ये आहेत.`,
      emotionalFunctioning: mr?.emotionalStability || 'भावनिक स्थैर्य समाधानकारक असून तणावाच्या प्रसंगी स्व-नियमन कौशल्यांचा नियमित सराव उपयुक्त ठरेल.',
      learningProfile: mr?.studyHabitAnalysis || 'रचनाबद्ध, दृश्य आणि संकल्पनाधारित अध्ययन पद्धतीत विद्यार्थी अधिक चांगली कामगिरी करतो.',
      growthPotential: mr?.futureReadiness || `${growthIndex}% विकास निर्देशांकानुसार पुढील प्रगतीची क्षमता सकारात्मक आहे.`,
      overallObservations: 'स्पष्ट उद्दिष्टे, नियमित अभिप्राय आणि टप्प्याटप्प्याने वाढणारी जबाबदारी दिल्यास विद्यार्थी उत्तम प्रतिसाद देतो.'
    },
    assessmentInterpretation: 'दहा मूल्यमापन क्षेत्रांतील प्रतिसादांचा एकत्रित विचार करून हे निष्कर्ष मांडले आहेत. हा अहवाल विकासात्मक मार्गदर्शनासाठी आहे; वैद्यकीय निदान म्हणून त्याचा वापर करू नये.',
    personalityAnalysis: {
      characteristics: mr?.personalityType || 'विश्लेषक, जबाबदार आणि सहकार्यशील व्यक्तिमत्त्व.', behaviouralTendencies: 'पूर्वतयारी, नियोजन आणि शांतपणे कृती करण्याकडे नैसर्गिक कल.', selfAwareness: 'स्वतःच्या गुणांची आणि सुधारणा क्षेत्रांची जाणीव विकसित होत आहे.', emotionalMaturity: mr?.emotionalStability || 'वयानुरूप भावनिक परिपक्वता दिसते.', adaptability: 'नियोजित बदलांशी चांगले जुळवून घेतो; अचानक बदलांसाठी पूर्वसूचना उपयुक्त.', independence: 'स्वतंत्रपणे अभ्यास करू शकतो; दीर्घ कामांसाठी स्पष्ट टप्पे मदत करतात.', responsibility: 'दिलेली शैक्षणिक व वैयक्तिक जबाबदारी सातत्याने पूर्ण करतो.', socialOrientation: mr?.socialInteraction || 'निवडक पण सकारात्मक सामाजिक सहभाग.'
    },
    emotionalFunctioning: {
      emotionalRegulation: mr?.emotionalStability || 'दैनंदिन शैक्षणिक मागण्यांमध्ये संयम राखतो.', stressTolerance: mr?.stressHandling || 'नियोजित परिस्थितीत ताण सहन करण्याची क्षमता समाधानकारक.', emotionalResilience: 'स्पष्ट अभिप्राय मिळाल्यास अडचणीनंतर पुन्हा प्रयत्न करतो.', selfControl: 'आवेग नियंत्रण आणि वर्गातील शिस्त चांगली.', empathy: 'इतरांच्या दृष्टिकोनाची जाणीव ठेवून सहकार्य करतो.', copingMechanisms: 'शांत चिंतन, नियोजन आणि नोंदींची पुनर्रचना यांचा उपयोग करतो.', emotionalTriggers: 'सार्वजनिक टीका किंवा अस्पष्ट अपेक्षा यामुळे तात्पुरता ताण वाढू शकतो.'
    },
    learningCognitiveProfile: {
      preferredLearningStyle: mr?.studyHabitAnalysis || 'दृश्य, संकल्पनाधारित आणि बहुपद्धती अध्ययन उपयुक्त.', studyBehaviour: 'नियमित सराव आणि नियोजित उजळणीमुळे कामगिरी सुधारते.', attentionPatterns: 'स्वतंत्र कामात लक्ष टिकते; गोंगाटात विचलन होऊ शकते.', informationProcessing: mr?.criticalThinking || 'माहितीचा क्रमवार विचार करून निष्कर्ष काढतो.', curiosity: 'नवीन संकल्पना आणि उपयोजित विषयांविषयी जिज्ञासा.', academicPersistence: 'अवघड विषयावर प्रयत्न सुरू ठेवण्याची क्षमता.', memoryStrategies: 'सारांश, आकृत्या आणि संबंध जोडण्याची पद्धत फायदेशीर.', practicalVsConceptual: 'संकल्पना प्रत्यक्ष उदाहरणांशी जोडल्यास समज अधिक दृढ होते.'
    },
    communicationSocialBehaviour: {
      communicationStyle: mr?.communicationType || 'नम्र, मुद्देसूद आणि रचनात्मक संवाद.', listeningBehaviour: 'उत्तर देण्यापूर्वी लक्षपूर्वक ऐकण्याची सवय.', classroomParticipation: 'आत्मविश्वास असल्यास विचारपूर्ण सहभाग.', peerInteraction: mr?.socialInteraction || 'समवयस्कांशी आदरपूर्ण आणि स्थिर संबंध.', collaboration: mr?.teamBehavior || 'गटात जबाबदारीने काम करून इतरांना मदत करतो.', conflictHandling: 'संघर्षात संवाद आणि सामंजस्याला प्राधान्य.', assertiveness: 'लहान गटात मत मांडतो; सार्वजनिक सादरीकरणात आणखी सराव आवश्यक.'
    },
    leadershipResponsibility: {
      initiative: 'भूमिका स्पष्ट असल्यास पुढाकार घेतो.', accountability: 'चुकीची जबाबदारी स्वीकारून सुधारणा करण्याची तयारी.', teamwork: mr?.teamBehavior || 'समतोल आणि सहकार्यपूर्ण संघकार्य.', decisionMaking: mr?.decisionMakingStyle || 'पर्याय आणि परिणामांचा विचार करून निर्णय.', leadershipReadiness: mr?.leadershipType || 'सहकार्यशील नेतृत्वाची चांगली क्षमता.'
    },
    motivationGoalOrientation: {
      intrinsicMotivation: mr?.motivationPattern || 'समज, कौशल्य आणि वैयक्तिक प्रगतीतून प्रेरणा.', extrinsicMotivation: 'योग्य कौतुक व स्पष्ट टप्पे प्रगतीस मदत करतात.', achievementOrientation: 'दर्जेदार काम आणि वैयक्तिक उत्कृष्टतेकडे कल.', consistency: 'दैनंदिन कामात सातत्य.', persistence: 'मार्गदर्शनानंतर पुन्हा प्रयत्न करण्याची वृत्ती.', selfDiscipline: 'अभ्यासाचे वेळापत्रक पाळण्याची क्षमता.'
    },
    decisionMakingCriticalThinking: {
      reasoning: mr?.criticalThinking || 'रचनाबद्ध परिस्थितीत चांगली तार्किक विचारशक्ती.', planning: 'टप्प्याटप्प्याने कृती आराखडा तयार करू शकतो.', judgment: mr?.decisionMakingStyle || 'विचारपूर्वक आणि जोखमीची जाणीव ठेवून निर्णय.', riskAwareness: 'अनिश्चिततेत सावध पर्याय निवडण्याकडे कल.', problemSolvingStyle: mr?.problemSolving || 'मोठी समस्या लहान भागांत विभागून उपाय शोधतो.'
    },
    creativityInnovation: {
      curiosity: 'नवीन कल्पना व तंत्रज्ञान शोधण्याची उत्सुकता.', imagination: 'लवचिक कामात स्वतंत्र कल्पना सुचवतो.', ideaGeneration: 'निर्णयापूर्वी अनेक पर्याय निर्माण करू शकतो.', flexibility: 'नवीन पुराव्यानुसार विचार बदलण्याची तयारी.', innovationPotential: mr?.innovationLevel || 'उपयोजित नवकल्पना आणि समस्या निराकरणाची सकारात्मक क्षमता.'
    },
    careerDevelopmentReadiness: {
      careerAwareness: 'आधुनिक करिअर मार्ग आणि आवश्यक कौशल्यांची जाणीव विकसित होत आहे.', occupationalInterests: mr?.careerSuggestion || 'विश्लेषण, रचना, तंत्रज्ञान आणि उपयोजित क्षेत्रांत रस.', futurePlanning: mr?.futureReadiness || 'शालेय विषयांना भविष्यातील पर्यायांशी जोडण्याची तयारी.', readinessForExploration: 'कार्यशाळा, क्षेत्रभेटी आणि करिअर संवादांसाठी चांगली तयारी.', recommendedDomains: [mr?.predictions?.careerCluster, mr?.careerSuggestion, 'तंत्रज्ञान, रचना व उपयोजित विज्ञान', 'व्यवस्थापन, संशोधन व सामाजिक नवकल्पना'].filter(Boolean) as string[]
    },
    strengths: strengths.map((characteristic) => ({ characteristic, whyItMatters: 'ही क्षमता शैक्षणिक प्रगती, आत्मविश्वास आणि दीर्घकालीन विकासासाठी महत्त्वाची आहे.' })),
    developmentAreas: growthAreas.map((area) => ({ area, whyItMatters: 'पुढील शैक्षणिक आणि वैयक्तिक विकासासाठी हे कौशल्य महत्त्वाचे आहे.', educationalImpact: 'या क्षेत्राकडे दुर्लक्ष झाल्यास सहभाग किंवा कामगिरीत तात्पुरती मर्यादा जाणवू शकते.', improvementStrategy: 'लहान, मोजता येणारे साप्ताहिक उद्दिष्ट ठरवून नियमित अभिप्रायासह सराव करावा.' })),
    behaviouralObservations: {
      classroom: 'लक्षपूर्वक, शिस्तबद्ध आणि आदरयुक्त सहभाग.', groupActivities: 'कामाची विभागणी आणि अंतिम मुदत पाळणारा विश्वासू सहकारी.', examinations: 'पद्धतशीर प्रयत्न; सुरुवातीचा ताण श्वसन व सरावाने कमी होतो.', competitiveSituations: 'इतरांशी आक्रमक तुलना न करता वैयक्तिक प्रगतीवर भर.', homeEnvironment: 'शांत, नियोजित अभ्यासजागा आणि प्रयत्नांचे कौतुक उपयुक्त.'
    },
    riskIndicators: [mr?.stressHandling || 'परीक्षेच्या काळात सौम्य ताण जाणवू शकतो.', 'सार्वजनिकपणे मत मांडण्यातील संकोचामुळे प्रत्यक्ष क्षमतेपेक्षा सहभाग कमी दिसू शकतो.'],
    counsellingRecommendations: {
      priorityDiscussionTopics: counsellorRecommendations.length ? counsellorRecommendations : ['अडचणींकडे विकासाची संधी म्हणून पाहणे.', 'स्वतःचे मत आत्मविश्वासाने मांडण्याचा सराव.', 'क्षमता व आवडींशी जुळणाऱ्या करिअर पर्यायांचा शोध.'],
      confidenceBuildingStrategies: ['साप्ताहिक यश व प्रयत्नांची नोंद ठेवावी.', 'लहान गटात नियोजित बोलण्याची संधी द्यावी.'],
      behaviouralCoachingIdeas: ['काम सुरू करण्यासाठी “पहिली ५ मिनिटे” नियम वापरावा.', 'आदरपूर्वक ठाम संवादाचे भूमिकानाट्य करावे.'],
      emotionalRegulationTechniques: ['परीक्षेपूर्वी संथ श्वसनाचा सराव करावा.', 'अभ्यासाच्या काळात हालचाल व विश्रांतीचे नियोजन करावे.'],
      academicSupportSuggestions: ['गुंतागुंतीच्या विषयांसाठी मननकाशे वापरावेत.', 'दर दोन आठवड्यांनी संकल्पना उजळणीचे नियोजन करावे.']
    },
    parentRecommendations: parentRecommendations.length ? parentRecommendations : ['गुणांपेक्षा प्रयत्न, पद्धत आणि सातत्याचे कौतुक करा.', 'शांत अभ्यासजागा आणि पुरेशी विश्रांती द्या.', 'भविष्यातील आवडींवर दबावमुक्त संवाद साधा.', 'वयानुरूप स्वतंत्र निर्णय घेण्याची संधी द्या.'],
    teacherRecommendations: teacherRecommendations.length ? teacherRecommendations : ['मोठ्या कामांसाठी स्पष्ट निकष आणि टप्पे द्या.', 'सहायक पद्धतीने वर्गात बोलण्याची संधी द्या.', 'गटकार्यामध्ये समन्वयाची लहान भूमिका द्या.'],
    longTermDevelopmentPlan: {
      month1To2: 'ताण नियमन, नियमित अभ्यासलय आणि वेळबद्ध सरावावर लक्ष केंद्रित करावे.', month3To4: 'वर्गातील लहान नेतृत्व भूमिका घ्याव्यात आणि दोन करिअरविषयक सत्रांत सहभागी व्हावे.', month5To6: 'सादरीकरण, प्रकल्प किंवा स्पर्धेत सहभाग घेऊन आत्मविश्वास आणि करिअर दृष्टी विस्तारावी.'
    }
  };
}
