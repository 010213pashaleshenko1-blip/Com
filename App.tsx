import { useState, useEffect } from 'react';
import { translations, Language } from './translations';

type ModelStatus = 'pending' | 'checking' | 'success' | 'error' | 'quota' | 'not_found' | 'not_real_api' | 'not_allowed';

interface ModelResult {
  model: string;
  status: ModelStatus;
  responseTime?: number;
  error?: string;
}

interface ModelGroup {
  nameKey: string;
  models: string[];
}

const modelGroups: ModelGroup[] = [
  // ===== GPT-5 ОСНОВНЫЕ =====
  {
    nameKey: 'groupGpt5Main',
    models: ['gpt-5', 'gpt-5.1', 'gpt-5.2']
  },
  // ===== GPT-5 CHAT =====
  {
    nameKey: 'groupGpt5Chat',
    models: ['gpt-5-chat', 'gpt-5.1-chat', 'gpt-5.2-chat']
  },
  // ===== GPT-5 УПРОЩЁННЫЕ =====
  {
    nameKey: 'groupGpt5Lite',
    models: ['gpt-5-mini', 'gpt-5-nano']
  },
  // ===== GPT-5 УСИЛЕННЫЕ =====
  {
    nameKey: 'groupGpt5Pro',
    models: ['gpt-5-pro', 'gpt-5.2-pro']
  },
  // ===== GPT-5 CODEX =====
  {
    nameKey: 'groupGpt5Codex',
    models: ['gpt-5-codex', 'gpt-5.1-codex', 'gpt-5.1-codex-max', 'gpt-5.1-codex-mini', 'gpt-5.2-codex', 'gpt-5.3-codex']
  },
  // ===== GPT-4.5 =====
  {
    nameKey: 'groupGpt45',
    models: ['gpt-4.5-preview']
  },
  // ===== GPT-4.1 =====
  {
    nameKey: 'groupGpt41',
    models: ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano']
  },
  // ===== GPT-4 БАЗОВЫЕ =====
  {
    nameKey: 'groupGpt4Base',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-4-turbo-preview']
  },
  // ===== GPT-4o OMNI =====
  {
    nameKey: 'groupGpt4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'chatgpt-4o']
  },
  // ===== GPT-4o AUDIO =====
  {
    nameKey: 'groupGpt4oAudio',
    models: ['gpt-4o-audio', 'gpt-4o-mini-audio']
  },
  // ===== GPT-4o REALTIME =====
  {
    nameKey: 'groupGpt4oRealtime',
    models: ['gpt-4o-realtime', 'gpt-4o-mini-realtime']
  },
  // ===== GPT-4o SEARCH =====
  {
    nameKey: 'groupGpt4oSearch',
    models: ['gpt-4o-search-preview', 'gpt-4o-mini-search-preview']
  },
  // ===== GPT-4o TRANSCRIBE / TTS =====
  {
    nameKey: 'groupGpt4oTranscribe',
    models: ['gpt-4o-transcribe', 'gpt-4o-mini-transcribe', 'gpt-4o-transcribe-diarize', 'gpt-4o-mini-tts']
  },
  // ===== O-СЕРИЯ =====
  {
    nameKey: 'groupOSeries',
    models: ['o1', 'o1-preview', 'o1-mini', 'o1-pro']
  },
  // ===== O3 =====
  {
    nameKey: 'groupO3',
    models: ['o3', 'o3-mini', 'o3-pro', 'o3-deep-research']
  },
  // ===== O4 =====
  {
    nameKey: 'groupO4',
    models: ['o4-mini', 'o4-mini-deep-research']
  },
  // ===== GPT-3.5 =====
  {
    nameKey: 'groupGpt3',
    models: ['gpt-3.5-turbo']
  },
  // ===== LEGACY =====
  {
    nameKey: 'groupLegacy',
    models: ['davinci-002', 'babbage-002']
  },
  // ===== CODEX =====
  {
    nameKey: 'groupCodex',
    models: ['codex-mini-latest']
  },
  // ===== COMPUTER USE =====
  {
    nameKey: 'groupComputerUse',
    models: ['computer-use-preview']
  },
  // ===== GPT IMAGE =====
  {
    nameKey: 'groupGptImage',
    models: ['gpt-image-1', 'gpt-image-1-mini', 'gpt-image-1.5', 'chatgpt-image-latest']
  },
  // ===== GPT AUDIO =====
  {
    nameKey: 'groupGptAudio',
    models: ['gpt-audio', 'gpt-audio-1.5', 'gpt-audio-mini']
  },
  // ===== GPT REALTIME =====
  {
    nameKey: 'groupGptRealtime',
    models: ['gpt-realtime', 'gpt-realtime-1.5', 'gpt-realtime-mini']
  },
  // ===== DALL-E =====
  {
    nameKey: 'groupDallE',
    models: ['dall-e-3', 'dall-e-2']
  },
  // ===== SORA =====
  {
    nameKey: 'groupSora',
    models: ['sora-2', 'sora-2-pro']
  },
  // ===== EMBEDDINGS =====
  {
    nameKey: 'groupEmbeddings',
    models: ['text-embedding-3-large', 'text-embedding-3-small', 'text-embedding-ada-002']
  },
  // ===== MODERATION =====
  {
    nameKey: 'groupModeration',
    models: ['text-moderation', 'text-moderation-stable', 'omni-moderation']
  },
  // ===== TTS =====
  {
    nameKey: 'groupTts',
    models: ['tts-1', 'tts-1-hd']
  },
  // ===== WHISPER =====
  {
    nameKey: 'groupWhisper',
    models: ['whisper']
  },
  // ===== ТЕСТОВЫЕ OSS =====
  {
    nameKey: 'groupOss',
    models: ['gpt-oss-120b', 'gpt-oss-20b']
  },
];

const allModels = modelGroups.flatMap(g => g.models);

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentCheckingModel, setCurrentCheckingModel] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'ru' || saved === 'en') return saved;
    return navigator.language.startsWith('ru') ? 'ru' : 'en';
  });

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const getModelType = (model: string): 'chat' | 'embedding' | 'image' | 'audio_transcription' | 'audio_speech' | 'moderation' => {
    if (model.startsWith('text-embedding') || model.includes('embedding')) return 'embedding';
    if (model.startsWith('dall-e') || model.startsWith('gpt-image') || model.startsWith('chatgpt-image')) return 'image';
    if (model.startsWith('whisper')) return 'audio_transcription';
    if (model.startsWith('tts-')) return 'audio_speech';
    if (model.includes('moderation')) return 'moderation';
    // Sora теперь тестируется через chat/completions как обычная модель
    return 'chat';
  };

  const checkModel = async (model: string): Promise<ModelResult> => {
    const startTime = Date.now();
    const modelType = getModelType(model);
    
    try {
      let response: Response;
      
      if (modelType === 'embedding') {
        response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model, input: 'test' })
        });
      } else if (modelType === 'image') {
        response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model, prompt: 'test', n: 1, size: '1024x1024' })
        });
      } else if (modelType === 'audio_speech') {
        response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model, input: 'Hi', voice: 'alloy' })
        });
      } else if (modelType === 'audio_transcription') {
        const formData = new FormData();
        const emptyBlob = new Blob(['test'], { type: 'audio/wav' });
        formData.append('file', emptyBlob, 'test.wav');
        formData.append('model', model);
        response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}` },
          body: formData
        });
      } else if (modelType === 'moderation') {
        response = await fetch('https://api.openai.com/v1/moderations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model, input: 'test' })
        });
      } else {
        // Chat models (включая Sora - тестируем через chat/completions)
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'Hi' }],
            max_tokens: 1
          })
        });
      }

      const responseTime = Date.now() - startTime;
      
      if (modelType === 'audio_speech' && response.ok) {
        return { model, status: 'success', responseTime };
      }
      
      const data = await response.json();

      if (response.ok) {
        return { model, status: 'success', responseTime };
      } else {
        const errorMessage = data.error?.message || 'Unknown error';
        const errorCode = data.error?.code || '';
        
        // "Invalid value" = модель существует и отвечает, просто неверный параметр
        if (
          errorMessage.toLowerCase().includes('invalid value') ||
          errorMessage.toLowerCase().includes('supported values are') ||
          errorMessage.toLowerCase().includes('invalid parameter')
        ) {
          return { model, status: 'success', responseTime };
        }

        if (
          errorMessage.toLowerCase().includes('not allowed') ||
          errorMessage.toLowerCase().includes('permission') ||
          errorMessage.toLowerCase().includes('access denied') ||
          errorCode === 'access_denied' ||
          errorCode === 'permission_denied'
        ) {
          return { model, status: 'not_allowed', responseTime, error: errorMessage };
        }
        
        if (
          errorMessage.toLowerCase().includes('does not exist') ||
          errorMessage.toLowerCase().includes('model not found') ||
          errorMessage.toLowerCase().includes('invalid model') ||
          errorMessage.toLowerCase().includes('invalid method') ||
          errorCode === 'model_not_found' ||
          errorCode === 'invalid_model'
        ) {
          if (model.includes(':free') || model.includes('/') || model.includes('-azure')) {
            return { model, status: 'not_real_api', responseTime, error: 'Third-party API model' };
          }
          return { model, status: 'not_found', responseTime, error: errorMessage };
        }
        
        if (
          errorMessage.toLowerCase().includes('quota') ||
          errorMessage.toLowerCase().includes('rate limit') ||
          errorMessage.toLowerCase().includes('billing') ||
          errorMessage.toLowerCase().includes('exceeded') ||
          errorCode === 'insufficient_quota' ||
          errorCode === 'rate_limit_exceeded'
        ) {
          return { model, status: 'quota', responseTime, error: errorMessage };
        }
        
        return { model, status: 'error', responseTime, error: errorMessage };
      }
    } catch (err) {
      return { model, status: 'error', error: String(err) };
    }
  };

  const startCheck = async () => {
    if (!apiKey.trim()) return;
    
    setIsChecking(true);
    setResults(allModels.map(model => ({ model, status: 'pending' })));

    for (const model of allModels) {
      setCurrentCheckingModel(model);
      setResults(prev => prev.map(r => 
        r.model === model ? { ...r, status: 'checking' } : r
      ));
      
      const result = await checkModel(model);
      
      setResults(prev => prev.map(r => 
        r.model === model ? result : r
      ));
    }

    setCurrentCheckingModel(null);
    setIsChecking(false);
  };

  const getSubscriptionType = (): { type: string; color: string; descKey: string; needsTopUp: boolean } => {
    const successModels = results.filter(r => r.status === 'success').map(r => r.model);
    const quotaModels = results.filter(r => r.status === 'quota').map(r => r.model);
    // quota = модель ДОСТУПНА по подписке, но нет баланса — считаем как "доступную"
    const availableModels = [...successModels, ...quotaModels];
    const existingModels = results.filter(r => r.status !== 'not_found' && r.status !== 'pending' && r.status !== 'checking' && r.status !== 'not_real_api');
    
    // Если все модели с quota — нужно пополнить баланс
    const needsTopUp = quotaModels.length > 0 && successModels.length === 0;
    
    if (existingModels.length === 0) {
      return { type: t.subUnknown, color: 'from-gray-600 to-gray-700', descKey: 'subUnknownDesc', needsTopUp: false };
    }

    // Tier 5 ($1000+): GPT-5 Pro, GPT-5.2 Pro, O3-Pro, O1-Pro, Sora-2-Pro
    const tier5Models = ['gpt-5-pro', 'gpt-5.2-pro', 'o3-pro', 'o1-pro', 'sora-2-pro'];
    const hasTier5 = tier5Models.some(m => availableModels.includes(m));
    
    if (hasTier5) {
      return { type: t.subTier5, color: 'from-purple-600 via-pink-500 to-red-500', descKey: 'subTier5Desc', needsTopUp };
    }

    // Tier 4 ($250+): GPT-5, GPT-5.1, GPT-5.2, Codex, O3, O1
    const tier4Models = ['gpt-5', 'gpt-5.1', 'gpt-5.2', 'gpt-5-chat', 'gpt-5.1-chat', 'gpt-5.2-chat', 
      'gpt-5-codex', 'gpt-5.1-codex', 'gpt-5.2-codex', 'gpt-5.3-codex', 'gpt-5.1-codex-max',
      'o3', 'o3-deep-research', 'o1', 'codex-mini-latest', 'sora-2'];
    const hasTier4 = tier4Models.some(m => availableModels.includes(m));
    
    if (hasTier4) {
      return { type: t.subTier4, color: 'from-amber-500 via-orange-500 to-red-500', descKey: 'subTier4Desc', needsTopUp };
    }

    // Tier 3 ($100+): GPT-4.1, GPT-4o, GPT-5-mini, GPT-5-nano, GPT-4-turbo, O3-mini, O4-mini
    const tier3Models = ['gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4-turbo-preview', 'gpt-4.5-preview',
      'gpt-5-mini', 'gpt-5-nano', 'o3-mini', 'o4-mini', 'o1-preview',
      'gpt-4o-search-preview', 'gpt-4o-audio', 'gpt-4o-realtime',
      'computer-use-preview', 'gpt-image-1', 'dall-e-3'];
    const hasTier3 = tier3Models.some(m => availableModels.includes(m));
    
    if (hasTier3) {
      return { type: t.subTier3, color: 'from-green-500 to-emerald-600', descKey: 'subTier3Desc', needsTopUp };
    }

    // Tier 2 ($50+): GPT-4, GPT-4o-mini, GPT-4.1-mini, O1-mini
    const tier2Models = ['gpt-4', 'gpt-4o-mini', 'gpt-4.1-mini', 'chatgpt-4o', 'o1-mini', 'o4-mini-deep-research',
      'gpt-4o-mini-audio', 'gpt-4o-mini-realtime', 'gpt-4o-mini-search-preview', 'dall-e-2'];
    const hasTier2 = tier2Models.some(m => availableModels.includes(m));
    
    if (hasTier2) {
      return { type: t.subTier2, color: 'from-blue-500 to-indigo-600', descKey: 'subTier2Desc', needsTopUp };
    }

    // Tier 1 ($5+): GPT-3.5, базовые модели
    const tier1Models = ['gpt-3.5-turbo', 'gpt-4.1-nano', 'gpt-5.1-codex-mini', 'davinci-002', 'babbage-002',
      'text-embedding-3-small', 'text-embedding-ada-002', 'whisper', 'tts-1'];
    const hasTier1 = tier1Models.some(m => availableModels.includes(m));
    
    if (hasTier1 || availableModels.length > 0) {
      return { type: t.subTier1, color: 'from-cyan-500 to-blue-500', descKey: 'subTier1Desc', needsTopUp };
    }

    // Free ($0): ничего не работает или только бесплатные
    return { type: t.subFree, color: 'from-gray-500 to-gray-600', descKey: 'subFreeDesc', needsTopUp: false };
  };

  const getStatusBadge = (result: ModelResult) => {
    const baseClasses = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300";
    
    switch (result.status) {
      case 'success':
        return (
          <div className="flex flex-col items-end gap-1">
            <span className={`${baseClasses} bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30`}>
              ✅ {t.statusSuccess}
            </span>
            {result.responseTime && (
              <span className="text-xs text-green-500/70">{result.responseTime}{t.ms}</span>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-end gap-1">
            <span className={`${baseClasses} bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30`}>
              ❌ {t.statusError}
            </span>
            {result.error && (
              <span className="text-xs text-red-400/70 max-w-xs truncate text-right">{result.error}</span>
            )}
          </div>
        );
      case 'not_found':
        return (
          <div className="flex flex-col items-end gap-1">
            <span className={`${baseClasses} bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30`}>
              👻 {t.statusNotFound}
            </span>
            <span className="text-xs text-gray-500">{t.modelExpired}</span>
          </div>
        );
      case 'not_real_api':
        return (
          <div className="flex flex-col items-end gap-1">
            <span className={`${baseClasses} bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 border border-purple-500/30`}>
              🔗 {t.statusNotRealApi}
            </span>
            <span className="text-xs text-purple-500">{t.thirdPartyApi}</span>
          </div>
        );
      case 'quota':
        return (
          <div className="flex flex-col items-end gap-1">
            <span className={`${baseClasses} bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30`}>
              💸 {t.statusQuota}
            </span>
            {result.error && (
              <span className="text-xs text-orange-400/70 max-w-xs truncate text-right">{result.error}</span>
            )}
          </div>
        );
      case 'not_allowed':
        return (
          <div className="flex flex-col items-end gap-1">
            <span className={`${baseClasses} bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30`}>
              🚫 {t.statusNotAllowed}
            </span>
            <span className="text-xs text-yellow-500">{t.notAllowedDesc}</span>
          </div>
        );
      case 'checking':
        return (
          <span className={`${baseClasses} bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 animate-pulse`}>
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {t.statusChecking}
            </span>
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-black/30 text-gray-500 border border-gray-700`}>
            ⏳ {t.statusPending}
          </span>
        );
    }
  };

  const stats = {
    total: results.length,
    success: results.filter(r => r.status === 'success').length,
    error: results.filter(r => r.status === 'error').length,
    notFound: results.filter(r => r.status === 'not_found').length,
    quota: results.filter(r => r.status === 'quota').length,
    notAllowed: results.filter(r => r.status === 'not_allowed').length,
    thirdParty: results.filter(r => r.status === 'not_real_api').length
  };

  const hasResults = results.some(r => r.status !== 'pending');
  const progress = results.filter(r => r.status !== 'pending' && r.status !== 'checking').length;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}/>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-900/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}/>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-900/10 to-transparent rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}/>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 z-50 p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 border border-white/10 hover:border-white/20 group"
        title={t.settings}
      >
        <svg className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-xl animate-fadeIn"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10 transform transition-all duration-300 animate-slideUp"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              <span className="text-4xl">⚙️</span> {t.settings}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                  🌍 {t.language}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
                      language === 'ru' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    🇷🇺 {t.russian}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
                      language === 'en' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    🇬🇧 {t.english}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-medium transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-30 animate-pulse"/>
              <h1 className="relative text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                {t.title}
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* API Key Input */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 mb-10 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
          <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
            🔑 {t.apiKeyLabel}
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="w-full px-6 py-4 bg-black/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 text-lg placeholder-gray-600"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors px-2 py-1"
              >
                {showKey ? '🙈 ' + t.hideKey : '👁️ ' + t.showKey}
              </button>
            </div>
            <button
              onClick={startCheck}
              disabled={isChecking || !apiKey.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-800 rounded-2xl font-bold text-lg transition-all duration-300 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-purple-500/30 disabled:shadow-none hover:scale-105 disabled:scale-100"
            >
              {isChecking ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {t.checking}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 {t.startCheck}
                </span>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-4 flex items-center gap-2">
            🔒 {t.security}
          </p>
        </div>

        {/* Progress Bar */}
        {isChecking && (
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{currentCheckingModel && `🔍 ${currentCheckingModel}`}</span>
              <span className="text-sm text-gray-400">{progress} / {allModels.length}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                style={{ width: `${(progress / allModels.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <>
            {/* Subscription Type */}
            <div className="mb-10 animate-fadeIn">
              <div className={`bg-gradient-to-r ${getSubscriptionType().color} rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"/>
                <div className="relative">
                  <h2 className="text-sm uppercase tracking-widest opacity-70 mb-3">{t.yourSubscription}</h2>
                  <p className="text-4xl md:text-5xl font-black mb-3">{getSubscriptionType().type}</p>
                  <p className="opacity-80 text-lg">{t[getSubscriptionType().descKey as keyof typeof t]}</p>
                </div>
              </div>
              
              {/* Top Up Warning */}
              {getSubscriptionType().needsTopUp && (
                <div className="mt-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-6 text-center animate-pulse">
                  <p className="text-orange-400 text-lg font-medium">{t.topUpWarning}</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
              {[
                { value: stats.total, label: t.totalModels, gradient: 'from-gray-500/20 to-gray-600/20', text: 'text-gray-300', border: 'border-gray-500/30' },
                { value: stats.success, label: t.working, gradient: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400', border: 'border-green-500/30' },
                { value: stats.error, label: t.errors, gradient: 'from-red-500/20 to-rose-500/20', text: 'text-red-400', border: 'border-red-500/30' },
                { value: stats.notFound, label: t.notExists, gradient: 'from-gray-500/20 to-slate-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
                { value: stats.quota, label: t.noTokens, gradient: 'from-orange-500/20 to-amber-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
                { value: stats.notAllowed, label: t.noAccess, gradient: 'from-yellow-500/20 to-amber-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                { value: stats.thirdParty, label: t.thirdPartyShort, gradient: 'from-purple-500/20 to-violet-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 text-center border ${stat.border} backdrop-blur-xl transition-all duration-300 hover:scale-105`}>
                  <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
                  <p className={`text-xs ${stat.text} opacity-70 mt-1`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Model Groups */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                📊 {t.resultsTitle}
              </h2>
              
              {modelGroups.map((group, groupIndex) => (
                <div 
                  key={group.nameKey} 
                  className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                  style={{ animationDelay: `${groupIndex * 50}ms` }}
                >
                  <div className="bg-white/5 px-6 py-4 font-bold text-lg border-b border-white/10">
                    {t[group.nameKey as keyof typeof t]}
                  </div>
                  <div className="divide-y divide-white/5">
                    {group.models.map((model) => {
                      const result = results.find(r => r.model === model);
                      return (
                        <div 
                          key={model} 
                          className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all duration-300"
                        >
                          <span className="font-mono text-sm md:text-base text-gray-300">{model}</span>
                          {result && getStatusBadge(result)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
            📖 {t.legendTitle}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
            {[
              { color: 'from-purple-500 to-pink-500', text: t.legendTier5 },
              { color: 'from-amber-500 to-orange-500', text: t.legendTier4 },
              { color: 'from-green-500 to-emerald-500', text: t.legendTier3 },
              { color: 'from-blue-500 to-indigo-500', text: t.legendTier2 },
              { color: 'from-cyan-500 to-blue-500', text: t.legendTier1 },
              { color: 'from-gray-500 to-gray-600', text: t.legendFree },
              { color: 'from-orange-500 to-amber-500', text: t.legendQuota },
              { color: 'from-yellow-500 to-amber-500', text: t.legendNotAllowed },
              { color: 'from-gray-600 to-gray-700', text: t.legendNotFound },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} flex-shrink-0`}></span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Made with 💜 for OpenAI API users</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
