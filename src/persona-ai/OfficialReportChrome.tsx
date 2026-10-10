import Image from 'next/image';

export function printOfficialReport() {
  const root = document.documentElement;
  const report = document.querySelector<HTMLElement>('.ai-report-view');
  const hiddenSiblings: Element[] = [];
  const printAncestors: Element[] = [];

  if (!report) return;

  let branch: Element = report;
  let parent = branch.parentElement;

  while (parent) {
    parent.classList.add('ai-report-print-ancestor');
    printAncestors.push(parent);

    Array.from(parent.children).forEach((child) => {
      if (child !== branch) {
        child.classList.add('ai-report-print-hidden');
        hiddenSiblings.push(child);
      }
    });
    branch = parent;
    parent = parent.parentElement;
  }

  const cleanup = () => {
    root.classList.remove('ai-report-printing');
    hiddenSiblings.forEach((element) => element.classList.remove('ai-report-print-hidden'));
    printAncestors.forEach((element) => element.classList.remove('ai-report-print-ancestor'));
  };

  root.classList.add('ai-report-printing');
  window.addEventListener('afterprint', cleanup, { once: true });

  try {
    window.print();
  } finally {
    window.setTimeout(cleanup, 1500);
  }
}

interface OfficialReportHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  referenceId: string;
  studentName: string;
  grade?: string;
  school?: string;
  date: string;
  language?: 'en' | 'mr';
}

export function OfficialReportHeader({
  title,
  subtitle,
  badge,
  referenceId,
  studentName,
  grade,
  school,
  date,
  language = 'en'
}: OfficialReportHeaderProps) {
  const mr = language === 'mr';
  const t = (english: string, marathi: string) => mr ? marathi : english;
  return (
    <header className="ai-report-letterhead">
      <div className="ai-report-brand-row">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/brain-logo.svg"
            width={48}
            height={58}
            alt="BRAIN logo"
            className="h-14 w-12 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="ai-report-eyebrow">BRAIN Educational Counselling &amp; Consultancy Center</p>
            <p className="ai-report-brand-name">Disha Career Guidance</p>
            <p className="ai-report-brand-subtitle">{t('AI Career Mapping Test & Student Development Services', 'एआय करिअर मॅपिंग चाचणी व विद्यार्थी विकास सेवा')}</p>
          </div>
        </div>

        <div className="ai-report-contact">
          <strong>{t('Official Assessment Report', 'अधिकृत मूल्यांकन अहवाल')}</strong>
          <span>{t('Confidential student record', 'गोपनीय विद्यार्थी नोंद')}</span>
          <span>{t('Ref:', 'संदर्भ:')} {referenceId}</span>
        </div>
      </div>

      <div className="ai-report-rule">
        <span>{t('Psychometric insight', 'मानसशास्त्रीय अंतर्दृष्टी')}</span>
        <span>{t('Career direction', 'करिअर दिशा')}</span>
        <span>{t('Growth roadmap', 'विकास आराखडा')}</span>
      </div>

      <div className="ai-report-title-row">
        <div>
          <p className="ai-report-kicker">{t('AI CMT RESULT', 'एआय सीएमटी निकाल')}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="ai-report-badge">{badge}</div>
      </div>

      <dl className="ai-report-meta-grid">
        <div><dt>{t('Student', 'विद्यार्थी')}</dt><dd>{studentName}</dd></div>
        <div><dt>{t('Grade', 'इयत्ता')}</dt><dd>{grade || t('Not specified', 'नमूद नाही')}</dd></div>
        <div><dt>{t('School', 'शाळा')}</dt><dd>{school || t('Not specified', 'नमूद नाही')}</dd></div>
        <div><dt>{t('Assessment date', 'मूल्यांकन दिनांक')}</dt><dd>{date}</dd></div>
      </dl>
    </header>
  );
}

export function OfficialReportContinuation({
  title,
  studentName,
  pageLabel
}: {
  title: string;
  studentName: string;
  pageLabel: string;
}) {
  return (
    <header className="ai-report-continuation">
      <div className="flex items-center gap-2.5">
        <Image src="/brain-logo.svg" width={28} height={34} alt="" className="h-8 w-7 object-contain" />
        <div>
          <strong>BRAIN - Disha Career Guidance</strong>
          <span>{title}</span>
        </div>
      </div>
      <div className="text-right">
        <strong>{studentName}</strong>
        <span>{pageLabel}</span>
      </div>
    </header>
  );
}

export function OfficialReportFooter({ label, page, language = 'en' }: { label: string; page: string; language?: 'en' | 'mr' }) {
  return (
    <footer className="ai-report-footer">
      <span>{label} - {language === 'mr' ? 'गोपनीय' : 'Confidential'}</span>
      <span>{page}</span>
    </footer>
  );
}
