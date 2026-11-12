import Link from 'next/link';
import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';
import { METHODOLOGY_CAPABILITY_ROWS } from '@/lib/frontierRegistry';
import { DATA_LAST_UPDATED_LABEL, DATA_SOURCES, SITE_TITLE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Methodology | ${SITE_TITLE}`,
  description: 'Plain-language explanation of the simple 1-10 AI job-risk score used in AI INDEX.'
};

const faqItems = [
  {
    question: 'Is this a prediction of layoffs?',
    answer: 'No. It is a comparison index. It shows which jobs and tasks look more exposed to AI right now under one shared framework.'
  },
  {
    question: 'What does the 1-10 score mean?',
    answer: 'It is a simple public score derived from a deeper internal comparison model. Higher numbers mean more of the listed work already looks exposed to AI.'
  },
  {
    question: 'What do the task labels mean?',
    answer: '"At risk now" means the task already looks exposed to current AI systems. "Not yet" means it still looks more human-led for now.'
  },
  {
    question: 'Why might a role still be marked safer for now?',
    answer: 'Some jobs still rely more heavily on trust, judgment, regulation, physical work, or live human interaction.'
  }
] as const;

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <section className="osca-section rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#fff7ed_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <Link
          href="/"
          className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          Back to index
        </Link>
        <h1 className="mt-5 font-serif-display text-[42px] leading-[0.96] text-slate-900 sm:text-[58px]">Methodology</h1>
        <p className="mt-4 max-w-[760px] text-[16px] leading-8 text-slate-600">
          AI INDEX is a simple job-risk index. It helps compare Australian occupations under the same AI lens, then shows which listed tasks already look exposed and which still look human-led.
        </p>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Last updated {DATA_LAST_UPDATED_LABEL}</div>
      </section>

      <section className="osca-section mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">What the score means</div>
          <p className="mt-3 text-[15px] leading-8 text-slate-700">
            Each occupation keeps its internal comparison score, but the public app now shows a simple <strong>1-10</strong> version. Higher numbers mean more listed work already looks exposed to AI.
          </p>
          <div className="mt-5 rounded-[18px] border border-slate-200 bg-slate-50 p-4 text-[14px] leading-7 text-slate-700">
            <div>1-4: Safer for now</div>
            <div className="mt-2">5-10: At risk</div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">What the task labels mean</div>
          <p className="mt-3 text-[15px] leading-8 text-slate-700">
            The task view is intentionally simple. It splits each listed task into the two plain-language buckets shown in the product.
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-[18px] border border-rose-200 bg-rose-50 p-4 text-[14px] leading-7 text-slate-700">At risk now: the task already looks exposed to AI.</div>
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-4 text-[14px] leading-7 text-slate-700">Not yet: the task still looks more human-led for now.</div>
          </div>
        </div>
      </section>

      <section className="osca-section mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">How the app is built</div>
        <ul className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700">
          <li>Occupation titles, descriptions, and task lists come from the ABS OSCA occupation dataset.</li>
          <li>Tasks are assessed against the current internal AI capability model and current public AI tool stack.</li>
          <li>The public app collapses that deeper model into a simple score and simple task labels.</li>
          <li>The result is directional. It is built for comparison, not prediction.</li>
        </ul>
      </section>

      <section className="osca-section mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Current AI tools and models</div>
        <p className="mt-3 max-w-[760px] text-[15px] leading-8 text-slate-700">
          The task model is checked against the current public AI stack. This list is the live reference layer behind the tool and model chips you see in the app.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {METHODOLOGY_CAPABILITY_ROWS.map((row) => (
            <div key={row.capability} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-[14px] font-medium text-slate-900">{row.label}</div>
              <p className="mt-2 text-[13px] leading-7 text-slate-600">{row.coverage}</p>
              <div className="mt-3 text-[13px] leading-7 text-slate-700">{row.tools}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="osca-section mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Data sources</div>
        <ul className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700">
          {DATA_SOURCES.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </section>

      <section className="osca-section mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">FAQ</div>
        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-[15px] font-medium text-slate-900">{item.question}</summary>
              <p className="mt-3 text-[14px] leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
