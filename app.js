// --- PART 1: BUILD THE ENTIRE HTML STRUCTURE ---
// --- 第 1 部分：構建完整的 HTML 結構 ---

// Create and set the document title and meta tags
document.title = 'Polyglot AI Translator';
const metaCharset = document.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');
document.head.appendChild(metaCharset);

const metaViewport = document.createElement('meta');
metaViewport.setAttribute('name', 'viewport');
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
document.head.appendChild(metaViewport);

// Define the entire HTML body content as a string
const appHTML = `
    <div id="translator-app">
        <header>
            <h1 id="app-title">Polyglot AI Translator</h1>
            <div class="lang-switcher">
                <span id="lang-label">Language:</span>
                <select id="lang-select">
                    <option value="en">English</option>
                    <option value="zh-TW">繁體中文</option>
                </select>
            </div>
        </header>

        <div class="input-container">
            <textarea id="source-text" placeholder="Enter text to translate..."></textarea>
            <div class="controls">
                <select id="target-language"></select>
                <button id="translate-btn">Translate</button>
            </div>
        </div>

        <div id="results-grid"></div>
    </div>
`;

// Inject the HTML structure into the body
document.body.innerHTML = appHTML;


// --- PART 2: DYNAMICALLY INJECT ALL CSS STYLES ---
// --- 第 2 部分：動態注入所有 CSS 樣式 ---
const styles = `
    :root {
        --primary-color: #007aff;
        --secondary-color: #f4f4f9;
        --border-color: #e0e0e6;
        --text-color: #1a1a1a;
        --subtle-text-color: #555;
        --card-bg: #ffffff;
        --shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
        --border-radius: 16px;
        --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    body {
        font-family: var(--font-family);
        background-color: var(--secondary-color);
        color: var(--text-color);
        margin: 0;
        padding: 24px;
        display: flex;
        justify-content: center;
        min-height: 100vh;
        box-sizing: border-box;
    }
    #translator-app { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 30px; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 0 10px; }
    header h1 { font-size: 2.2em; margin: 0; font-weight: 700; }
    .lang-switcher { display: flex; align-items: center; gap: 10px; }
    #lang-select { padding: 8px 12px; font-size: 15px; border-radius: 10px; border: 1px solid var(--border-color); background-color: var(--card-bg); cursor: pointer; }
    .input-container { background: var(--card-bg); padding: 30px; border-radius: var(--border-radius); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 20px; }
    #source-text { width: 100%; min-height: 140px; padding: 16px; font-size: 17px; border-radius: 12px; border: 1px solid var(--border-color); resize: vertical; box-sizing: border-box; line-height: 1.6; }
    #source-text:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15); }
    .controls { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
    #target-language { padding: 14px; font-size: 16px; border-radius: 12px; border: 1px solid var(--border-color); flex-grow: 1; background-color: #fafafa; }
    #translate-btn { padding: 14px 30px; font-size: 16px; font-weight: 600; color: #fff; background-color: var(--primary-color); border: none; border-radius: 12px; cursor: pointer; transition: background-color 0.2s, transform 0.1s; }
    #translate-btn:hover:not(:disabled) { background-color: #0056b3; }
    #translate-btn:active:not(:disabled) { transform: scale(0.98); }
    #translate-btn:disabled { background-color: #b8b8b8; cursor: not-allowed; }
    #results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
    .result-card { background: var(--card-bg); border-radius: var(--border-radius); box-shadow: var(--shadow); display: flex; flex-direction: column; overflow: hidden; min-height: 180px; }
    .card-header { padding: 16px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background-color: #fcfcfd; }
    .card-header h3 { margin: 0; font-size: 1.1em; font-weight: 600; }
    .copy-btn { font-size: 14px; padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border-color); background-color: #fff; cursor: pointer; display: none; transition: background-color 0.2s; }
    .copy-btn:hover { background-color: #f0f0f0; }
    .card-content { padding: 24px; font-size: 16px; line-height: 1.7; flex-grow: 1; word-wrap: break-word; }
    .error-message { color: #d93025; font-weight: 500; }
    .error-detail { font-family: monospace; font-size: 13px; color: var(--subtle-text-color); margin-top: 10px; word-break: break-all; }
    .spinner { display: none; width: 22px; height: 22px; border: 3px solid rgba(0, 0, 0, 0.1); border-left-color: var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 640px) { body { padding: 16px; } header { flex-direction: column; align-items: flex-start; gap: 16px; } header h1 { font-size: 1.9em; } .controls { flex-direction: column; align-items: stretch; } #results-grid { grid-template-columns: 1fr; } }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


// --- PART 3: APPLICATION LOGIC ---
// --- 第 3 部分：應用程式邏輯 ---
const sourceTextEl = document.getElementById('source-text');
const targetLanguageEl = document.getElementById('target-language');
const translateBtn = document.getElementById('translate-btn');
const resultsGridEl = document.getElementById('results-grid');
const langSelect = document.getElementById('lang-select');

const models = [
    { id: 'deepseek-r1', name: 'DeepSeek R1', model: 'openrouter:deepseek/deepseek-r1:free' },
    { id: 'gemini-flash-preview', name: 'Gemini Flash Preview', model: 'openrouter:google/gemini-2.5-flash-image-preview' },
    { id: 'qwen-72b', name: 'Qwen 2.5 72B', model: 'openrouter:qwen/qwen-2.5-72b-instruct:free' },
    { id: 'gemini-2-flash-exp', name: 'Gemini 2.0 Flash Exp', model: 'openrouter:google/gemini-2.0-flash-exp:free' },
    { id: 'qwen3-235b', name: 'Qwen3 235B', model: 'openrouter:qwen/qwen3-235b-a22b:free' },
    { id: 'llama-4-maverick', name: 'Llama 4 Maverick', model: 'openrouter:meta-llama/llama-4-maverick:free' }
];

const uiText = {
    'en': {
        appTitle: 'Polyglot AI Translator', langLabel: 'Language:', sourcePlaceholder: 'Enter text to translate...', translateBtn: 'Translate', translatingBtn: 'Translating...', copyBtn: 'Copy', copiedBtn: 'Copied!', errorTitle: 'Translation failed.', errorUnknown: 'An unknown error occurred.', errorServer: 'Server Error:',
        targetLangs: [
            { value: 'English', text: 'English' }, { value: 'Traditional Chinese', text: 'Traditional Chinese' }, { value: 'Spanish', text: 'Spanish' }, { value: 'French', text: 'French' }, { value: 'German', text: 'German' }, { value: 'Japanese', text: 'Japanese' }
        ]
    },
    'zh-TW': {
        appTitle: 'Polyglot AI 翻譯器', langLabel: '界面語言:', sourcePlaceholder: '輸入要翻譯的文字...', translateBtn: '翻譯', translatingBtn: '翻譯中...', copyBtn: '複製', copiedBtn: '已複製!', errorTitle: '翻譯失敗。', errorUnknown: '發生未知錯誤。', errorServer: '伺服器錯誤:',
        targetLangs: [
            { value: 'English', text: '英語' }, { value: 'Traditional Chinese', text: '繁體中文' }, { value: 'Spanish', text: '西班牙語' }, { value: 'French', text: '法語' }, { value: 'German', text: '德語' }, { value: 'Japanese', text: '日語' }
        ]
    }
};

function setLanguage(lang) {
    const texts = uiText[lang];
    document.documentElement.lang = lang;
    document.getElementById('app-title').textContent = texts.appTitle;
    document.getElementById('lang-label').textContent = texts.langLabel;
    sourceTextEl.placeholder = texts.sourcePlaceholder;
    translateBtn.textContent = texts.translateBtn;
    const currentTargetValue = targetLanguageEl.value;
    targetLanguageEl.innerHTML = '';
    texts.targetLangs.forEach(langOption => {
        const option = document.createElement('option');
        option.value = langOption.value;
        option.textContent = langOption.text;
        targetLanguageEl.appendChild(option);
    });
    targetLanguageEl.value = currentTargetValue || texts.targetLangs[1].value;
    localStorage.setItem('userLang', lang);
}

langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

translateBtn.addEventListener('click', async () => {
    const sourceText = sourceTextEl.value.trim();
    if (!sourceText) return;
    const targetLanguage = targetLanguageEl.value;
    const currentLang = langSelect.value;
    translateBtn.disabled = true;
    translateBtn.textContent = uiText[currentLang].translatingBtn;
    resultsGridEl.innerHTML = '';
    models.forEach(model => {
        resultsGridEl.insertAdjacentHTML('beforeend', `
            <div class="result-card" id="card-${model.id}">
                <div class="card-header">
                    <h3>${model.name}</h3>
                    <div class="spinner" id="spinner-${model.id}" style="display: block;"></div>
                    <button class="copy-btn" id="copy-${model.id}">${uiText[currentLang].copyBtn}</button>
                </div>
                <div class="card-content" id="content-${model.id}"></div>
            </div>`);
        document.getElementById(`copy-${model.id}`).addEventListener('click', handleCopy);
    });
    const translationPromises = models.map(model => streamTranslation(model, sourceText, targetLanguage));
    await Promise.allSettled(translationPromises);
    translateBtn.disabled = false;
    translateBtn.textContent = uiText[currentLang].translateBtn;
});

async function streamTranslation(model, text, language) {
    const contentEl = document.getElementById(`content-${model.id}`);
    const spinnerEl = document.getElementById(`spinner-${model.id}`);
    const copyBtnEl = document.getElementById(`copy-${model.id}`);
    const currentLang = langSelect.value;
    const prompt = `Translate to ${language}. Provide only the translated text, no explanations.\n\nText:\n"${text}"`;
    try {
        const chat_resp = await puter.ai.chat(prompt, { model: model.model, stream: true });
        let fullTranslation = '';
        for await (const part of chat_resp) {
            fullTranslation += (part?.text || '');
            contentEl.textContent = fullTranslation;
        }
        if (fullTranslation.trim() === '') throw new Error("Empty response.");
    } catch (error) {
        const serverErrorMsg = error?.error?.message || uiText[currentLang].errorUnknown;
        contentEl.innerHTML = `<div class="error-message">${uiText[currentLang].errorTitle}</div><div class="error-detail"><strong>${uiText[currentLang].errorServer}</strong> "${serverErrorMsg}"</div>`;
    } finally {
        spinnerEl.style.display = 'none';
        if (!contentEl.querySelector('.error-message')) copyBtnEl.style.display = 'block';
    }
}

function handleCopy(event) {
    const currentLang = langSelect.value;
    const modelId = event.target.id.replace('copy-', '');
    const textToCopy = document.getElementById(`content-${modelId}`).textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        event.target.textContent = uiText[currentLang].copiedBtn;
        setTimeout(() => { event.target.textContent = uiText[currentLang].copyBtn; }, 2000);
    });
}

const savedLang = localStorage.getItem('userLang') || 'en';
langSelect.value = savedLang;
setLanguage(savedLang);
