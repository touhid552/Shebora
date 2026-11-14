import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, ArrowUp, Bot, LoaderCircle, RotateCcw, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';
import { defaultServiceImage, resolveServiceImage } from '../utils/serviceImages.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getServiceStartingOption } from '../../../shared/servicePackages.js';

const exampleProblems = [
  'My AC is not cooling',
  'Water is leaking under my sink',
  'A power socket stopped working',
  'I need a deep clean',
  'My refrigerator is not cold',
  'Paint is peeling off my wall'
];

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi! Describe a home problem and I’ll suggest a matching Shebora service.'
};

export default function AISmartAssistant() {
  const { lang } = useLanguage();
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const requestLock = useRef(false);
  const messageId = useRef(0);
  const retryText = useRef('');

  function addMessage(message) {
    messageId.current += 1;
      setMessages(current => [...current, { ...message, id: `assistant-${messageId.current}` }]);
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  }

  async function getRecommendation(text) {
    const description = text.trim();
    if (!description || requestLock.current) return;

    requestLock.current = true;
    retryText.current = description;
    setLoading(true);
    setError('');
    setProblem('');
    messageId.current += 1;
    setMessages(current => [...current, { id: `user-${messageId.current}`, role: 'user', text: description }]);

    try {
      const result = await api.getAIRecommendation(description);
      addMessage({
        role: 'assistant',
        text: result.recommendation
          ? (result.language === 'bn' ? '\u098f\u0995\u099f\u09bf \u09ae\u09c7\u09b2\u09be\u09a8\u09b8\u0987 \u09b8\u09c7\u09ac\u09be \u09aa\u09c7\u09df\u09c7\u099b\u09bf:' : result.language === 'roman' ? 'Ei service-ti apnar shomoshshay shahajjo korte pare:' : 'I found a service that may help:')
          : (result.message || 'I couldn’t match that to a service. Try another description or choose an example.'),
        reason: result.reason || '',
        advice: result.advice || '',
        recommendation: result.recommendation || null,
        noMatch: !result.recommendation
      });
    } catch (err) {
      const friendlyError = err.message || 'I couldn’t reach the service catalogue. Please try again.';
      setError(friendlyError);
      addMessage({ role: 'assistant', text: 'I couldn’t get a suggestion just now. Please try again.', isError: true });
    } finally {
      requestLock.current = false;
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    getRecommendation(problem);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      getRecommendation(problem);
    }
  }

  function tryAnotherProblem() {
    setProblem('');
    setError('');
    inputRef.current?.focus();
  }

  function resetChat() {
    if (requestLock.current) return;
    setMessages([welcomeMessage]);
    setProblem('');
    setError('');
    retryText.current = '';
    inputRef.current?.focus();
  }

  return (
    <section aria-labelledby="assistant-heading" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm dark:border-emerald-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-emerald-950">
        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-6 lg:p-6">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /></span>
              Shebora Smart Assistant
            </div>
            <h2 id="assistant-heading" className="text-xl font-extrabold leading-tight text-neutral-950 sm:text-2xl dark:text-white">
              Find the right home service
            </h2>
            <p className="mt-1.5 max-w-md text-xs leading-5 text-neutral-600 sm:text-sm dark:text-neutral-300">
              Describe the problem in English, Bangla, or Romanized Bangla.
            </p>

            <div className="mt-3" aria-label="Example problems">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Try an example</p>
              <div className="-mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Example problem suggestions">
                {exampleProblems.map(example => (
                  <button
                    key={example}
                    type="button"
                    disabled={loading}
                    onClick={() => getRecommendation(example)}
                    className="shrink-0 rounded-full border border-emerald-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-neutral-700 transition-colors hover:border-emerald-500 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >{example}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
            <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"><Bot className="h-4 w-4" aria-hidden="true" /></span>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">Service assistant</p>
                  <p className="text-[10px] text-neutral-500">Local service matcher</p>
                </div>
              </div>
              <button type="button" onClick={resetChat} disabled={loading} aria-label="Start a new chat" title="Start a new chat" className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-40 dark:hover:bg-neutral-800">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto bg-neutral-50/70 px-3 py-3 dark:bg-neutral-900/60" aria-live="polite" aria-relevant="additions text">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[92%] ${message.role === 'user' ? '' : 'w-full max-w-[96%]'}`}>
                    <div className={`rounded-xl px-3 py-2 text-xs leading-5 ${message.role === 'user' ? 'rounded-br-sm bg-emerald-700 text-white' : message.isError ? 'border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200' : 'border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'}`}>
                      {message.text}
                    </div>
                    {message.recommendation && (
                      <RecommendationCard recommendation={message.recommendation} explanation={message.reason} advice={message.advice} onTryAnother={tryAnotherProblem} />
                    )}
                    {message.noMatch && (
                      <button type="button" onClick={tryAnotherProblem} className="mt-1 text-[10px] font-bold text-emerald-800 underline underline-offset-2 dark:text-emerald-300">Try another problem</button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-neutral-500" role="status" aria-label="Checking Shebora services">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin text-emerald-700" aria-hidden="true" />
                  Checking the service catalogue…
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-neutral-100 p-2.5 dark:border-neutral-800">
              <label htmlFor="home-problem" className="sr-only">Describe your home service problem</label>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-900">
                <textarea
                  ref={inputRef}
                  id="home-problem"
                  value={problem}
                  onChange={event => setProblem(event.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  rows={1}
                  placeholder="What needs fixing or cleaning?"
                  disabled={loading}
                  className="max-h-24 min-h-9 flex-1 resize-y bg-transparent px-2 py-1.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-60 dark:text-white"
                />
                <button type="submit" disabled={loading || !problem.trim()} aria-label="Send problem description" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
                  {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowUp className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between px-1">
                <span className="text-[9px] text-neutral-400">Ctrl + Enter to send</span>
                <span className="text-[9px] text-neutral-400">{problem.length}/500</span>
              </div>
              {error && (
                <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-red-700 dark:text-red-300" role="alert">
                  <span className="flex min-w-0 items-center gap-1"><AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" /><span className="truncate">{error}</span></span>
                  <button type="button" onClick={() => getRecommendation(retryText.current)} disabled={loading} className="shrink-0 font-bold underline underline-offset-2">Retry</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({ recommendation, explanation, advice, onTryAnother }) {
  const { lang } = useLanguage();
  const startingOption = getServiceStartingOption(recommendation.category, recommendation.basePrice, recommendation.priceUnit);
  const serviceUrl = `/service-details/${encodeURIComponent(recommendation.id)}`;

  return (
    <article className="mt-2 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-neutral-900">
      <div className="flex gap-2.5 p-2.5">
        <Link to={serviceUrl} aria-label={`View ${recommendation.name}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
          <img src={resolveServiceImage(recommendation.image)} alt={recommendation.name} onError={event => { event.currentTarget.src = defaultServiceImage; }} className="h-full w-full object-cover" />
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{recommendation.category}</span>
          <h3 className="text-sm font-extrabold leading-5 text-neutral-900 dark:text-white">{recommendation.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-neutral-600 dark:text-neutral-300">{explanation}</p>
        </div>
      </div>
      {advice && <p className="mx-2.5 mb-2 rounded-lg bg-amber-50 px-2.5 py-2 text-[10px] leading-4 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"><strong>{lang === 'bn' ? '\u098f\u0996\u09a8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af:' : lang === 'en' ? 'For now:' : 'Ekhon:'} </strong>{advice}</p>}
      <div className="flex items-center justify-between gap-2 border-t border-neutral-100 px-2.5 py-2 dark:border-neutral-800">
        <p className="text-[10px] text-neutral-500">{lang === 'bn' ? '\u09b6\u09c1\u09b0\u09c1' : lang === 'en' ? 'Starts at' : 'Shuru'} <strong className="text-sm text-emerald-700 dark:text-emerald-400">{"\u09f3"}{startingOption.price.toLocaleString('en-BD')}</strong><span> / {startingOption.unit}</span></p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onTryAnother} className="text-[10px] font-semibold text-neutral-600 hover:text-emerald-800 dark:text-neutral-300">Try another</button>
          <Link to={serviceUrl} className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
            View Service <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
