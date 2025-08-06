(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();async function q(){try{const e=window.location.hostname==="dypar33.github.io"?"/cbt4cert":"/docs",t=await fetch(`${e}/data/index.json`);if(!t.ok)throw new Error(`카탈로그 로드 실패: ${t.status}`);const r=await t.json();return M(r),r}catch(o){throw console.error("카탈로그 로드 중 오류:",o),new Error("카탈로그를 불러올 수 없습니다.")}}async function I(o,e,t=null){try{const n=window.location.hostname==="dypar33.github.io"?"/cbt4cert":"/docs";if(typeof e=="string"){const i=`${n}/data/${encodeURIComponent(o)}/${encodeURIComponent(e)}/questions.json`,s=await fetch(i);if(!s.ok)throw new Error(`문제 은행 로드 실패: ${s.status}`);const c=await s.json();if(!Array.isArray(c))throw new Error("문제 데이터가 배열 형태가 아닙니다.");return c.map(k)}if(e&&e.chapters){const i=e.name;let s=t||e.chapters.map(l=>l.file);const c=[];for(const l of s)try{const a=`${n}/data/${encodeURIComponent(o)}/${encodeURIComponent(i)}/${encodeURIComponent(l)}`,d=await fetch(a);if(!d.ok){console.warn(`챕터 파일 로드 실패: ${l} (${d.status})`);continue}const u=await d.json();Array.isArray(u)&&c.push(...u)}catch(a){console.warn(`챕터 파일 로드 중 오류: ${l}`,a)}if(c.length===0)throw new Error("선택된 챕터에서 문제를 불러올 수 없습니다.");return c.map(k)}throw new Error("올바르지 않은 과목 데이터입니다.")}catch(r){throw console.error("문제 은행 로드 중 오류:",r),new Error(`${o} - ${typeof e=="string"?e:e.name} 문제를 불러올 수 없습니다.`)}}function M(o){if(!o||typeof o!="object")throw new Error("카탈로그 형식이 올바르지 않습니다.");if(!Array.isArray(o.certifications))throw new Error("자격증 목록이 배열 형태가 아닙니다.");for(const e of o.certifications){if(!e.name||typeof e.name!="string")throw new Error("자격증 이름이 올바르지 않습니다.");if(!Array.isArray(e.subjects))throw new Error("과목 목록이 배열 형태가 아닙니다.")}}function k(o){if(!o||typeof o!="object")throw new Error("문제 데이터가 객체 형태가 아닙니다.");if(!o.id||typeof o.id!="string")throw new Error("문제 ID가 올바르지 않습니다.");if(!o.question||typeof o.question!="string")throw new Error("문제 내용이 올바르지 않습니다.");if(!Array.isArray(o.answer))throw new Error("정답이 배열 형태가 아닙니다.");const e=o.choices&&Array.isArray(o.choices)?"mcq":"short";return{id:o.id,question:o.question,description:o.description||void 0,type:o.type||e,choices:o.choices||void 0,answer:o.answer,explanation:o.explanation||void 0,tags:o.tags||void 0}}const w=Object.freeze(Object.defineProperty({__proto__:null,loadCatalog:q,loadQuestionBank:I},Symbol.toStringTag,{value:"Module"}));function L(o,e,t){if(o.length===0)throw new Error("문제 은행이 비어있습니다.");if(t<=0)throw new Error("문제 개수는 1개 이상이어야 합니다.");const r=o.map(n=>n.id);switch(e){case"sequential":return r.slice(0,Math.min(t,r.length));case"random":return C(r).slice(0,Math.min(t,r.length));case"randomRepeat":const n=C(r),i=[];for(let s=0;s<t;s++)i.push(n[s%n.length]);return i;default:throw new Error(`지원하지 않는 출제 순서: ${e}`)}}function T(o,e){return{id:N(),config:o,questionIds:e,currentIndex:0,answers:{},startTime:Date.now()}}function j(o,e,t,r){const n={...o,answers:{...o.answers,[e]:t}};if(o.config.mode==="practice"&&r){const i=P(t,r);return{run:n,feedback:i}}return{run:n}}function H(o,e){const t=Date.now(),r=new Map(e.map(a=>[a.id,a]));let n=0;const i=[];for(const a of o.questionIds){const d=o.config.order==="randomRepeat"?a.split("_")[0]:a,u=r.get(d),h=o.answers[a]||[];u&&E(h,u)?n++:i.push(a)}const s=o.config.order==="randomRepeat"?o.config.count:o.questionIds.length,c=s>0?Math.round(n/s*100):0,l=t-o.startTime;return{score:c,total:s,correct:n,wrong:i,timeSpent:l}}function P(o,e){return{correct:E(o,e),expected:e.answer,explanation:e.explanation}}function E(o,e){const t=i=>i.trim().toLowerCase().replace(/\s+/g,""),r=o.map(t).sort(),n=e.answer.map(t).sort();return r.length!==n.length?!1:r.every((i,s)=>i===n[s])}function C(o){const e=[...o];for(let t=e.length-1;t>0;t--){const r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}return e}function N(){return`run_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}const O="modulepreload",F=function(o){return"/cbt4cert/"+o},$={},x=function(e,t,r){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),c=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));n=Promise.allSettled(t.map(l=>{if(l=F(l),l in $)return;$[l]=!0;const a=l.endsWith(".css"),d=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const u=document.createElement("link");if(u.rel=a?"stylesheet":O,a||(u.as="script"),u.crossOrigin="",u.href=l,c&&u.setAttribute("nonce",c),document.head.appendChild(u),a)return new Promise((h,p)=>{u.addEventListener("load",h),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function i(s){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=s,window.dispatchEvent(c),!c.defaultPrevented)throw s}return n.then(s=>{for(const c of s||[])c.status==="rejected"&&i(c.reason);return e().catch(i)})},z="cbt4cert",S={darkMode:!1};function f(){try{const o=localStorage.getItem(z);if(!o)return{preferences:S};const e=JSON.parse(o);return{preferences:{...S,...e.preferences},currentRun:e.currentRun}}catch(o){return console.warn("저장된 데이터 로드 실패, 기본값 사용:",o),{preferences:S}}}function b(o){try{localStorage.setItem(z,JSON.stringify(o))}catch(e){console.error("데이터 저장 실패:",e)}}function Q(o){const e=f();e.preferences={...e.preferences,...o},b(e)}function _(){const e=!f().preferences.darkMode;return Q({darkMode:e}),document.documentElement.setAttribute("data-theme",e?"dark":"light"),e}function D(){const o=f();document.documentElement.setAttribute("data-theme",o.preferences.darkMode?"dark":"light")}const B="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2036%2036'%3e%3cpath%20fill='%23F18F26'%20d='M10.478%2022.439s.702%202.281-.337%207.993c-.186%201.025-.46%202.072-.599%202.93-1.757%200-1.851%202.002-1.478%202.002h2.094c1.337%200%202.971-3.334%203.854-7.961s-3.534-4.964-3.534-4.964zm13.042%203.702s2.272%201.22%202.188%204.081c-.033%201.131-.249%202.091-.355%203.024-1.832%200-1.839%201.985-1.305%201.985h1.856c.923%200%203.001-3.158%203.379-7.281.379-4.122-5.763-1.809-5.763-1.809z'/%3e%3cpath%20fill='%23FFCC4E'%20d='M36%208.447C36%203.525%2031.859%201%2027%201c-.553%200-1%20.448-1%201s.447%201%201%201c1.804%200%206.717.934%206.717%205.447%200%202.881-1.567%205.462-3.77%205.982-.164-.073-.345-.104-.509-.192-7.239-3.917-13.457.902-15.226-.29-1.752-1.182-.539-3.255-2.824-5.243-.33-1.841-1.073-4.477-1.794-4.477-.549%200-1.265%201.825-1.74%203.656-.591-1.381-1.363-2.756-1.86-2.756-.64%200-1.278%202.273-1.594%204.235-1.68%201.147-2.906%202.809-2.906%204.765%200%202.7%204.05%203.357%205.4%203.411%201.35.054%203.023%203.562%203.585%205.072%201.242%204.367%202.051%208.699%202.698%2011.183-1.649%200-1.804%202.111-1.348%202.111.713%200%201.953-.003%202.225%200%201.381.014%202.026-4.706%202.026-8.849%200-.212-.011-.627-.011-.627s1.93.505%206.038-.208c2.444-.424%205.03.849%205.746%203.163.527%201.704%201.399%203.305%201.868%204.484-1.589%200-1.545%202.037-1.084%202.037.787%200%201.801.014%202.183%200%201.468-.055.643-7.574%201.03-10.097s1.267-5.578-.229-8.797C34.857%2015.236%2036%2011.505%2036%208.447z'/%3e%3ccircle%20fill='%23292F33'%20cx='5.994'%20cy='11.768'%20r='.9'/%3e%3cpath%20fill='%23E75A70'%20d='M2.984%2012.86c-.677.423-.677%201.777-1.015%201.777S.954%2013.841.954%2012.86c-.001-.981%202.862-.52%202.03%200z'/%3e%3cpath%20fill='%23FEE7B8'%20d='M6.578%2014.343c-.041.026-.09.036-.142.026-.018-.004-1.548-.241-2.545.146-.129.05-.341-.023-.413-.191s.023-.365.152-.415c1.44-.569%202.857-.234%202.934-.218.139.029.195.19.188.372-.004.114-.104.235-.174.28zm-.472%202.339c-.048.009-.097-.001-.141-.031-.015-.01-1.331-.83-2.402-.853-.138-.003-.305-.154-.305-.341%200-.186.165-.335.304-.333%201.552.024%202.724.891%202.789.937.117.082.104.255.027.424-.049.107-.189.182-.272.197z'/%3e%3cpath%20fill='%23F18F26'%20d='M7.854%207.881s.372-.039.859.033c.217-.46.585-.887.585-.887s.281.668.386%201.179c.025.12.218.117.322.189%200%200%20.038-3.463-.863-3.836.001-.002-.755%201.124-1.289%203.322zM4.399%209.36s.384-.267.883-.574c.217-.624.568-1.333.568-1.333s.307.602.345.81c.21-.114.21-.106.403-.19%200%200-.114-2.286-1.099-2.527%200%200-.732%201.372-1.1%203.814z'/%3e%3cpath%20fill='%23FD9'%20d='M18.45%2023.644c-2.649.57-2.38%202.782-2.38%202.782s1.93.505%206.038-.208c1.067-.185%202.153-.03%203.107.377-1.607-3.047-4.315-3.479-6.765-2.951z'/%3e%3cpath%20fill='%23F18F26'%20d='M14.686%2014.109c.476.676%202.397%202.368%202.745%202.159.338-.203.59-2.055.342-2.706-1.329.359-2.385.658-3.087.547zm7.024%202.689c.623.138%201.507-2.979%201.41-4.123-1.449.017-2.78.256-3.965.537.335%201.08%201.953%203.452%202.555%203.586zm2.627-4.082c.042.723.982%202.603%201.285%202.737.307.137%201.685-1.319%201.866-2.061-1.086-.378-2.142-.597-3.151-.676z'/%3e%3c/svg%3e",U="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2036%2036'%3e%3cpath%20fill='%23292F33'%20d='M10.478%2022.439s.702%202.281-.337%207.993c-.186%201.025-.46%202.072-.599%202.93-1.757%200-1.851%202.002-1.478%202.002h2.094c1.337%200%202.971-3.334%203.854-7.961s-3.534-4.964-3.534-4.964zm13.042%203.702s2.272%201.22%202.188%204.081c-.033%201.131-.249%202.091-.355%203.024-1.832%200-1.839%201.985-1.305%201.985h1.856c.923%200%203.001-3.158%203.379-7.281.379-4.122-5.763-1.809-5.763-1.809z'/%3e%3cpath%20fill='%23292F33'%20d='M36%208.447C36%203.525%2031.859%201%2027%201c-.553%200-1%20.448-1%201s.447%201%201%201c1.804%200%206.717.934%206.717%205.447%200%202.881-1.567%205.462-3.77%205.982-.164-.073-.345-.104-.509-.192-7.239-3.917-13.457.902-15.226-.29-1.752-1.182-.539-3.255-2.824-5.243-.33-1.841-1.073-4.477-1.794-4.477-.549%200-1.265%201.825-1.74%203.656-.591-1.381-1.363-2.756-1.86-2.756-.64%200-1.278%202.273-1.594%204.235-1.68%201.147-2.906%202.809-2.906%204.765%200%202.7%204.05%203.357%205.4%203.411%201.35.054%203.023%203.562%203.585%205.072%201.242%204.367%202.051%208.699%202.698%2011.183-1.649%200-1.804%202.111-1.348%202.111.713%200%201.953-.003%202.225%200%201.381.014%202.026-4.706%202.026-8.849%200-.212-.011-.627-.011-.627s1.93.505%206.038-.208c2.444-.424%205.03.849%205.746%203.163.527%201.704%201.399%203.305%201.868%204.484-1.589%200-1.545%202.037-1.084%202.037.787%200%201.801.014%202.183%200%201.468-.055.643-7.574%201.03-10.097s1.267-5.578-.229-8.797C34.857%2015.236%2036%2011.505%2036%208.447z'/%3e%3ccircle%20fill='%23C3C914'%20cx='5.994'%20cy='11.768'%20r='.9'/%3e%3cpath%20fill='%2366757F'%20d='M2.984%2012.86c-.677.423-.677%201.777-1.015%201.777S.954%2013.841.954%2012.86c-.001-.981%202.862-.52%202.03%200zm3.594%201.483c-.041.026-.09.036-.142.026-.018-.004-1.548-.241-2.545.146-.129.05-.341-.023-.413-.191s.023-.365.152-.415c1.44-.569%202.857-.234%202.934-.218.139.029.195.19.188.372-.004.114-.104.235-.174.28zm-.472%202.339c-.048.009-.097-.001-.141-.031-.015-.01-1.331-.83-2.402-.853-.138-.003-.305-.154-.305-.341%200-.186.165-.335.304-.333%201.552.024%202.724.891%202.789.937.117.082.104.255.027.424-.049.107-.189.182-.272.197z'/%3e%3cpath%20d='M7.854%207.881s.372-.039.859.033c.217-.46.585-.887.585-.887s.281.668.386%201.179c.025.12.218.117.322.189%200%200%20.038-3.463-.863-3.836.001-.002-.755%201.124-1.289%203.322zM4.399%209.36s.384-.267.883-.574c.217-.624.568-1.333.568-1.333s.307.602.345.81c.21-.114.21-.106.403-.19%200%200-.114-2.286-1.099-2.527%200%200-.732%201.372-1.1%203.814z'%20fill='%237F676D'/%3e%3cpath%20fill='%2366757F'%20d='M18.45%2023.644c-2.649.57-2.38%202.782-2.38%202.782s1.93.505%206.038-.208c1.067-.185%202.153-.03%203.107.377-1.607-3.047-4.315-3.479-6.765-2.951z'/%3e%3cpath%20fill='%23292F33'%20d='M5.976%2010.982s.333.347.319.778c-.014.43-.25.833-.25.833s-.292-.347-.319-.826c-.027-.48.25-.785.25-.785z'/%3e%3c/svg%3e",R={cuteCat:B,blackCat:U};class J{constructor(e){this.container=e,this.catalog=null,this.onStartQuiz=null}render(e,t){this.catalog=e,this.onStartQuiz=t;const n=f().preferences;this.container.innerHTML=`
      <div class="container">
        <header style="text-align: center; margin-bottom: var(--space-8);">
          <h1 class="cat-logo" style="color: var(--color-primary); margin: var(--space-8) 0 var(--space-4) 0; font-size: var(--font-size-3xl);">
            CBT4Cert <span class="cute-cat-icon"></span>
          </h1>
          <p style="color: var(--color-text-secondary); margin: 0;">
            자격증 CBT 연습 사이트 <span class="cat-paw"></span>
          </p>
          <button class="btn btn-secondary" id="theme-toggle" style="margin-top: var(--space-4);">
            ${n.darkMode?"☀️ 라이트 모드":"🌙 다크 모드"}
          </button>
        </header>

        <form id="quiz-form" style="max-width: 500px; margin: 0 auto;">
          <div style="margin-bottom: var(--space-6);">
            <label for="certification" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              자격증 선택
            </label>
            <select id="certification" class="input" required>
              <option value="">자격증을 선택하세요</option>
              ${e.certifications.map(i=>`<option value="${i.name}" ${n.lastCertification===i.name?"selected":""}>
                  ${i.name}
                </option>`).join("")}
            </select>
          </div>

          <div style="margin-bottom: var(--space-6);">
            <label for="subject" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              과목 선택
            </label>
            <select id="subject" class="input" required disabled>
              <option value="">먼저 자격증을 선택하세요</option>
            </select>
          </div>

          <div id="chapter-selection" style="margin-bottom: var(--space-6); display: none;">
            <label style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              챕터 선택
            </label>
            <div style="
              padding: var(--space-4);
              background: var(--color-surface);
              border-radius: var(--radius-lg);
              border: 1px solid var(--color-border);
            ">
              <div style="margin-bottom: var(--space-3);">
                <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                  <input type="checkbox" id="select-all-chapters" style="margin: 0;">
                  <span style="font-weight: 500;">전체 선택</span>
                </label>
              </div>
              <div id="chapter-list" style="display: grid; gap: var(--space-2);">
                <!-- 챕터 목록이 여기에 동적으로 추가됩니다 -->
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6);">
            <div>
              <label for="order" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
                출제 순서
              </label>
              <select id="order" class="input">
                <option value="sequential" ${n.lastOrder==="sequential"?"selected":""}>순차</option>
                <option value="random" ${n.lastOrder==="random"?"selected":""}>랜덤</option>
                <option value="randomRepeat" ${n.lastOrder==="randomRepeat"?"selected":""}>랜덤 반복</option>
              </select>
            </div>
            <div>
              <label for="mode" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
                학습 모드
              </label>
              <select id="mode" class="input">
                <option value="practice" ${n.lastMode==="practice"?"selected":""}>연습 (즉시 피드백)</option>
                <option value="exam" ${n.lastMode==="exam"?"selected":""}>시험 (결과는 마지막에)</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom: var(--space-8);">
            <div style="
              padding: var(--space-4);
              background: var(--color-surface);
              border-radius: var(--radius-lg);
              border: 1px solid var(--color-border);
            ">
              <div style="font-weight: 500; margin-bottom: var(--space-2);">
                문제 개수
              </div>
              <div id="question-count-info" style="color: var(--color-text-secondary);">
                자격증과 과목을 선택하면 문제 개수가 표시됩니다.
              </div>
              <div id="count-input-container" style="margin-top: var(--space-3); display: none;">
                <input 
                  type="number" 
                  id="count" 
                  class="input" 
                  min="1" 
                  max="100" 
                  value="${n.lastCount||20}" 
                  placeholder="출제할 문제 수를 입력하세요"
                  style="width: 100%;"
                />
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            퀴즈 시작
          </button>
        </form>
      </div>
    `,this.attachEventListeners(),this.setupImages()}setupImages(){const e=this.container.querySelector(".cute-cat-icon");e&&(e.style.backgroundImage=`url(${R.cuteCat})`)}attachEventListeners(){const e=this.container.querySelector("#theme-toggle");e.addEventListener("click",()=>{const c=_();e.textContent=c?"☀️ 라이트 모드":"🌙 다크 모드"});const t=this.container.querySelector("#certification"),r=this.container.querySelector("#subject"),n=this.container.querySelector("#order");this.container.querySelector("#count");const i=async()=>{const c=t.value,l=r.value,a=n.value,d=this.container.querySelector("#question-count-info"),u=this.container.querySelector("#count-input-container"),h=this.container.querySelector("#count");if(c&&l)try{const{loadQuestionBank:p}=await x(async()=>{const{loadQuestionBank:A}=await Promise.resolve().then(()=>w);return{loadQuestionBank:A}},void 0),g=(await p(c,l)).length;g>0?a==="randomRepeat"?(d.innerHTML=`
                <strong style="color: var(--color-primary);">${g}개</strong> 문제 중에서 랜덤 반복 출제
                <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
                  출제할 문제 수를 아래에 입력하세요 (같은 문제가 반복될 수 있습니다)
                </div>
              `,u.style.display="block",h.max=Math.max(100,g),h.placeholder=`1-${Math.max(100,g)}개`):(d.innerHTML=`
                <strong style="color: var(--color-primary);">${g}개</strong> 문제 ${a==="sequential"?"순차":"랜덤"} 출제
                <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
                  모든 문제가 한 번씩 출제됩니다
                </div>
              `,u.style.display="none"):(d.innerHTML=`
              <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
            `,u.style.display="none")}catch(p){console.error("문제 수 확인 중 오류:",p),d.innerHTML=`
            <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
          `,u.style.display="none"}else d.textContent="자격증과 과목을 선택하면 문제 개수가 표시됩니다.",u.style.display="none"};t.addEventListener("change",()=>{var l;const c=(l=this.catalog)==null?void 0:l.certifications.find(a=>a.name===t.value);if(c){r.disabled=!1,r.innerHTML=`
          <option value="">과목을 선택하세요</option>
          ${c.subjects.map(d=>{const u=typeof d=="string"?d:d.name;return`<option value="${JSON.stringify(d).replace(/"/g,"&quot;")}">${u}</option>`}).join("")}
        `;const a=f();if(a.preferences.lastSubject){const d=c.subjects.find(u=>(typeof u=="string"?u:u.name)===a.preferences.lastSubject);d&&(r.value=JSON.stringify(d).replace(/"/g,"&quot;"),r.dispatchEvent(new Event("change")))}}else r.disabled=!0,r.innerHTML='<option value="">먼저 자격증을 선택하세요</option>',this.hideChapterSelection(),i()}),r.addEventListener("change",()=>{this.handleSubjectChange(),i()}),n.addEventListener("change",i),t.value&&t.dispatchEvent(new Event("change")),this.container.querySelector("#quiz-form").addEventListener("submit",c=>{c.preventDefault(),this.handleFormSubmit()})}async handleFormSubmit(){var h;const e=this.container.querySelector("#certification").value,t=this.container.querySelector("#subject").value,r=this.container.querySelector("#order").value,n=this.container.querySelector("#mode").value,i=this.container.querySelector("#count");if(!e||!t){alert("자격증과 과목을 모두 선택해주세요.");return}let s,c=null;try{if(s=JSON.parse(t.replace(/&quot;/g,'"')),s&&s.chapters&&(c=this.getSelectedChapters(),c.length===0)){alert("최소 하나의 챕터를 선택해주세요.");return}}catch{s=t}let l;try{const{loadQuestionBank:p}=await x(async()=>{const{loadQuestionBank:g}=await Promise.resolve().then(()=>w);return{loadQuestionBank:g}},void 0);l=(await p(e,s,c)).length}catch{alert("선택한 과목의 문제를 불러올 수 없습니다.");return}if(l===0){alert("선택한 과목에 문제가 없습니다.");return}let a;if(r==="randomRepeat"){if(a=parseInt(i.value),!a||a<1){alert("출제할 문제 수를 1개 이상 입력해주세요.");return}if(a>Math.max(100,l)){alert(`최대 ${Math.max(100,l)}개까지 설정할 수 있습니다.`);return}}else a=l;const d=typeof s=="string"?s:s.name;Q({lastCertification:e,lastSubject:d,lastOrder:r,lastMode:n,lastCount:a});const u={certification:e,subject:s,selectedChapters:c,order:r,mode:n,count:a};(h=this.onStartQuiz)==null||h.call(this,u)}handleSubjectChange(){const t=this.container.querySelector("#subject").value;if(!t){this.hideChapterSelection();return}try{const r=JSON.parse(t.replace(/&quot;/g,'"'));r&&r.chapters&&Array.isArray(r.chapters)?this.showChapterSelection(r.chapters):this.hideChapterSelection()}catch{this.hideChapterSelection()}}showChapterSelection(e){const t=this.container.querySelector("#chapter-selection"),r=this.container.querySelector("#chapter-list"),n=this.container.querySelector("#select-all-chapters");r.innerHTML=e.map(s=>`
      <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
        <input type="checkbox" class="chapter-checkbox" value="${s.file}" style="margin: 0;" checked>
        <span>${s.name} - ${s.title}</span>
      </label>
    `).join(""),n.checked=!0,n.addEventListener("change",()=>{r.querySelectorAll(".chapter-checkbox").forEach(c=>{c.checked=n.checked}),this.updateQuestionCountForChapters()});const i=r.querySelectorAll(".chapter-checkbox");i.forEach(s=>{s.addEventListener("change",()=>{const c=Array.from(i).every(a=>a.checked),l=Array.from(i).every(a=>!a.checked);n.checked=c,n.indeterminate=!c&&!l,this.updateQuestionCountForChapters()})}),t.style.display="block",this.updateQuestionCountForChapters()}hideChapterSelection(){const e=this.container.querySelector("#chapter-selection");e.style.display="none"}async updateQuestionCountForChapters(){const e=this.container.querySelector("#certification").value,t=this.container.querySelector("#subject"),r=this.container.querySelector("#order").value,n=this.container.querySelector("#question-count-info"),i=this.container.querySelector("#count-input-container"),s=this.container.querySelector("#count");if(!(!e||!t.value))try{const c=JSON.parse(t.value.replace(/&quot;/g,'"'));if(!c.chapters)return;const l=Array.from(this.container.querySelectorAll(".chapter-checkbox:checked")).map(h=>h.value);if(l.length===0){n.innerHTML=`
          <span style="color: var(--color-warning);">최소 하나의 챕터를 선택해주세요</span>
        `,i.style.display="none";return}const{loadQuestionBank:a}=await x(async()=>{const{loadQuestionBank:h}=await Promise.resolve().then(()=>w);return{loadQuestionBank:h}},void 0),u=(await a(e,c,l)).length;if(u>0){const h=l.map(p=>{const m=c.chapters.find(g=>g.file===p);return m?m.name:p}).join(", ");r==="randomRepeat"?(n.innerHTML=`
            <strong style="color: var(--color-primary);">${u}개</strong> 문제 중에서 랜덤 반복 출제
            <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
              선택된 챕터: ${h}
            </div>
            <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
              출제할 문제 수를 아래에 입력하세요 (같은 문제가 반복될 수 있습니다)
            </div>
          `,i.style.display="block",s.max=Math.max(100,u),s.placeholder=`1-${Math.max(100,u)}개`):(n.innerHTML=`
            <strong style="color: var(--color-primary);">${u}개</strong> 문제 ${r==="sequential"?"순차":"랜덤"} 출제
            <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
              선택된 챕터: ${h}
            </div>
            <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
              모든 문제가 한 번씩 출제됩니다
            </div>
          `,i.style.display="none")}else n.innerHTML=`
          <span style="color: var(--color-error);">선택된 챕터에서 문제를 불러올 수 없습니다</span>
        `,i.style.display="none"}catch(c){console.error("챕터별 문제 수 확인 중 오류:",c),n.innerHTML=`
        <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
      `,i.style.display="none"}}getSelectedChapters(){const e=this.container.querySelectorAll(".chapter-checkbox:checked");return Array.from(e).map(t=>t.value)}}class K{constructor(e){this.container=e}formatText(e){return e?e.replace(/\\n/g,`
`).replace(/\n/g,"<br>").replace(/\s{2,}/g," "):""}render(e,t,r,n,i){const s=e.wrong.map(a=>{const d=r.config.order==="randomRepeat"?a.split("_")[0]:a;return t.find(u=>u.id===d)}).filter(Boolean),c=Math.floor(e.timeSpent/6e4),l=Math.floor(e.timeSpent%6e4/1e3);this.container.innerHTML=`
      <div class="container">
        <header style="text-align: center; margin-bottom: var(--space-8);">
          <h1 style="color: var(--color-primary); margin: var(--space-8) 0 var(--space-4) 0; font-size: var(--font-size-3xl);">
            퀴즈 완료!
          </h1>
        </header>

        <div style="max-width: 500px; margin: 0 auto;">
          <!-- 점수 카드 -->
          <div style="
            background: var(--color-surface); 
            border: 1px solid var(--color-border); 
            border-radius: var(--radius-xl); 
            padding: var(--space-6); 
            margin-bottom: var(--space-6);
            box-shadow: var(--shadow-md);
          ">
            <div style="text-align: center;">
              <div style="
                font-size: var(--font-size-3xl); 
                font-weight: bold; 
                color: ${e.score>=70?"var(--color-success)":e.score>=50?"var(--color-warning)":"var(--color-error)"};
                margin-bottom: var(--space-2);
              ">
                ${e.score}점
              </div>
              <div style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
                ${e.correct}/${e.total} 문제 정답
              </div>
              <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                소요 시간: ${c}분 ${l}초
              </div>
            </div>
          </div>

          <!-- 오답 목록 -->
          ${s.length>0?`
            <div style="
              background: var(--color-surface); 
              border: 1px solid var(--color-border); 
              border-radius: var(--radius-xl); 
              padding: var(--space-6); 
              margin-bottom: var(--space-6);
            ">
              <h3 style="margin: 0 0 var(--space-4) 0; color: var(--color-error);">
                틀린 문제 (${s.length}개)
              </h3>
              <div style="max-height: 400px; overflow-y: auto;">
                ${s.map((a,d)=>{const u=e.wrong[d],h=r.answers[u]||[];return`
                    <div style="
                      padding: var(--space-4); 
                      border: 1px solid var(--color-border);
                      border-radius: var(--radius-lg);
                      margin-bottom: var(--space-4);
                      background: var(--color-surface);
                    ">
                      <!-- 문제 -->
                      <div style="font-weight: 500; margin-bottom: var(--space-3); line-height: 1.5;">
                        ${a.question}
                      </div>
                      
                      <!-- 선택지 (객관식인 경우) -->
                      ${a.choices?`
                        <div style="margin-bottom: var(--space-3);">
                          ${a.choices.map(p=>`
                            <div style="
                              padding: var(--space-2); 
                              margin-bottom: var(--space-1);
                              border-radius: var(--radius-md);
                              background: ${h.includes(p)?"var(--color-error-bg)":a.answer.includes(p)?"var(--color-success-bg)":"transparent"};
                              border: 1px solid ${h.includes(p)?"var(--color-error)":a.answer.includes(p)?"var(--color-success)":"var(--color-border)"};
                              font-size: var(--font-size-sm);
                            ">
                              ${h.includes(p)?"❌":a.answer.includes(p)?"✅":"○"} ${p}
                            </div>
                          `).join("")}
                        </div>
                      `:""}
                      
                      <!-- 답안 정보 -->
                      <div style="
                        display: grid; 
                        gap: var(--space-2); 
                        font-size: var(--font-size-sm);
                        margin-bottom: var(--space-3);
                      ">
                        <div style="color: var(--color-error);">
                          내 답안: ${h.length>0?h.join(", "):"(답안 없음)"}
                        </div>
                        <div style="color: var(--color-success);">
                          정답: ${a.answer.join(", ")}
                        </div>
                      </div>
                      
                      <!-- 해설 -->
                      ${a.explanation?`
                        <div style="
                          background: var(--color-primary-bg);
                          border: 1px solid var(--color-primary);
                          border-radius: var(--radius-md);
                          padding: var(--space-3);
                          color: var(--color-text-secondary); 
                          font-size: var(--font-size-sm); 
                          line-height: 1.4;
                        ">
                          <div style="font-weight: 500; color: var(--color-primary); margin-bottom: var(--space-1);">
                            💡 해설
                          </div>
                          ${this.formatText(a.explanation)}
                        </div>
                      `:""}
                    </div>
                  `}).join("")}
              </div>
            </div>
          `:`
            <div style="
              background: var(--color-surface); 
              border: 1px solid var(--color-border); 
              border-radius: var(--radius-xl); 
              padding: var(--space-6); 
              margin-bottom: var(--space-6);
              text-align: center;
            ">
              <div style="color: var(--color-success); font-size: var(--font-size-lg);">
                🎉 모든 문제를 맞혔습니다!
              </div>
            </div>
          `}

          <!-- 액션 버튼들 -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <button class="btn btn-secondary" id="home-btn">
              홈으로
            </button>
            <button class="btn btn-primary" id="retry-btn">
              다시 풀기
            </button>
          </div>
        </div>
      </div>
    `,this.attachEventListeners(n,i)}attachEventListeners(e,t){const r=this.container.querySelector("#retry-btn"),n=this.container.querySelector("#home-btn");r.addEventListener("click",e),n.addEventListener("click",t)}}function G(o){if(!o)return"";const e=document.createElement("div");return e.textContent=o,e.innerHTML}function y(o){return o?G(o).replace(/\n/g,"<br>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/  /g,"&nbsp;&nbsp;"):""}class V{constructor(e){this.container=e,this.questions=[],this.run=null,this.currentIndex=0,this.onComplete=null,this.feedbackShown=new Set,this.boundHandleKeydown=this.handleKeydown.bind(this),this.randomQuestionHistory=[],this.totalQuestionsAnswered=0}render(e,t,r){this.questions=e,this.run=t,this.onComplete=r,this.currentIndex=0,this.feedbackShown.clear(),this.randomQuestionHistory=[],this.totalQuestionsAnswered=0,this.run.config.order==="randomRepeat"&&this.selectRandomQuestion(),this.restoreProgress(),this.renderQuestion(),this.attachEventListeners()}setupImages(){const e=this.container.querySelector(".black-cat-icon");e&&(e.style.backgroundImage=`url(${R.blackCat})`)}renderAnswerInput(e,t){if(e.type==="short"||!e.choices)return`
        <input 
          type="text" 
          class="input" 
          id="short-answer"
          placeholder="답을 입력하세요"
          value="${t[0]||""}"
          style="width: 100%; font-size: var(--font-size-lg);"
        />
      `;{const r=e.answer.length>1,n=r?"checkbox":"radio",i=r?"":"mcq-answer";return`
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${e.choices.map((s,c)=>{const l=t.includes(s),a=`choice-${c}`;return`
              <label 
                for="${a}"
                style="
                  display: flex; 
                  align-items: center; 
                  gap: var(--space-3);
                  padding: var(--space-4);
                  border: 2px solid ${l?"var(--color-primary)":"var(--color-border)"};
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  transition: all 0.2s ease;
                  background: ${l?"var(--color-primary-bg)":"var(--color-surface)"};
                "
                onmouseover="this.style.borderColor = 'var(--color-primary)'"
                onmouseout="this.style.borderColor = '${l?"var(--color-primary)":"var(--color-border)"}'"
              >
                <input 
                  type="${n}"
                  id="${a}"
                  name="${i}"
                  value="${s}"
                  ${l?"checked":""}
                  style="
                    width: 20px; 
                    height: 20px; 
                    margin: 0;
                    accent-color: var(--color-primary);
                  "
                />
                <span style="flex: 1; font-size: var(--font-size-base);">
                  ${y(s)}
                </span>
              </label>
            `}).join("")}
        </div>
      `}}attachEventListeners(){document.removeEventListener("keydown",this.boundHandleKeydown),document.addEventListener("keydown",this.boundHandleKeydown)}attachNavigationEvents(){const e=this.container.querySelector("#prev-btn");e==null||e.addEventListener("click",()=>this.goToPrevious());const t=this.container.querySelector("#next-btn");t==null||t.addEventListener("click",()=>this.goToNext());const r=this.container.querySelector("#finish-btn");r==null||r.addEventListener("click",()=>this.finish());const n=this.container.querySelector("#exit-btn");n==null||n.addEventListener("click",()=>this.exit())}attachAnswerEvents(){const e=this.getCurrentQuestion();if(e)if(e.type==="short"||!e.choices){const t=this.container.querySelector("#short-answer");t==null||t.addEventListener("input",()=>{this.saveAnswer([t.value.trim()])}),t==null||t.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),this.goToNext())})}else this.container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r=>{r.addEventListener("change",()=>{this.updateMCQAnswer()})})}updateMCQAnswer(){const e=this.getCurrentQuestion();if(!e)return;if(e.answer.length>1){const n=Array.from(this.container.querySelectorAll('input[type="checkbox"]:checked')).map(i=>i.value);this.saveAnswer(n)}else{const r=this.container.querySelector('input[type="radio"]:checked'),n=r?[r.value]:[];this.saveAnswer(n)}}saveAnswer(e){if(!this.run)return;const t=this.getCurrentQuestion();if(!t)return;const r=this.run.config.order==="randomRepeat"?this.run.questionIds[this.currentIndex]:t.id,n=j(this.run,r,e,t);this.run=n.run,this.saveProgress()}goToPrevious(){this.currentIndex>0&&(this.currentIndex--,this.renderQuestion(),this.saveProgress())}goToNext(){if(this.run){if(console.log("goToNext 호출됨"),console.log("현재 모드:",this.run.config.mode),console.log("현재 인덱스:",this.currentIndex),this.run.config.mode==="practice"){const e=this.getCurrentQuestion();if(e){const t=this.run.config.order==="randomRepeat"?this.run.questionIds[this.currentIndex]:e.id,r=this.run.answers[t]||[];if(console.log("사용자 답안:",r),console.log("피드백 표시 여부:",this.feedbackShown.has(this.currentIndex)),!this.feedbackShown.has(this.currentIndex)){console.log("피드백 표시 중..."),this.feedbackShown.add(this.currentIndex),this.renderQuestion();return}this.feedbackShown.has(this.currentIndex)&&console.log("피드백이 이미 표시됨, 다음 문제로 이동")}}if(this.run.config.order==="randomRepeat"){if(this.totalQuestionsAnswered++,this.totalQuestionsAnswered>=this.run.config.count){this.currentIndex=this.run.questionIds.length-1,this.renderQuestion();return}this.selectRandomQuestion(),this.renderQuestion(),this.saveProgress();return}console.log("다음 문제로 이동 중..."),this.currentIndex<this.run.questionIds.length-1&&(this.currentIndex++,this.renderQuestion(),this.saveProgress())}}finish(){var e;if(this.run.config.mode==="practice"&&!this.feedbackShown.has(this.currentIndex)){console.log("마지막 문제 피드백 표시 중..."),this.feedbackShown.add(this.currentIndex),this.renderQuestion();return}confirm("퀴즈를 완료하시겠습니까?")&&((e=this.onComplete)==null||e.call(this))}exit(){var n;const e=Object.keys(this.run.answers).length,t=this.run.config.order==="randomRepeat"?this.run.config.count:this.run.questionIds.length,r=e>0?`현재까지 ${e}/${t}개 문제를 풀었습니다.
정말로 종료하시겠습니까?`:"정말로 퀴즈를 종료하시겠습니까?";confirm(r)&&(this.saveProgress(),(n=this.onComplete)==null||n.call(this))}handleKeydown(e){if(!e.repeat){if(e.key>="1"&&e.key<="9"){const t=parseInt(e.key)-1,r=this.container.querySelector(`#choice-${t}`);r&&r.click()}if(e.key==="Enter"&&!(document.activeElement.tagName==="INPUT"&&document.activeElement.type==="text")){e.preventDefault();const t=this.container.querySelector("#next-btn"),r=this.container.querySelector("#finish-btn");t&&!t.disabled?t.click():r&&r.click()}e.key==="ArrowLeft"?this.goToPrevious():e.key==="ArrowRight"&&this.goToNext()}}getCurrentQuestion(){if(!this.run)return;const e=this.run.questionIds[this.currentIndex],t=this.run.config.order==="randomRepeat"?e.split("_")[0]:e;return this.questions.find(r=>r.id===t)}checkAnswer(e,t){const r=s=>s.toLowerCase().trim().replace(/\s+/g," "),n=e.answer.map(r),i=t.map(r);return n.length===i.length&&n.every(s=>i.includes(s))}saveProgress(){if(!this.run)return;const e=f();e.currentRun=this.run,e.currentIndex=this.currentIndex,b(e)}restoreProgress(){const e=f();e.currentIndex!==void 0&&(this.currentIndex=Math.max(0,Math.min(e.currentIndex,this.run.questionIds.length-1)))}setAutoFocus(){const e=this.getCurrentQuestion();e&&(e.type==="short"||!e.choices)&&setTimeout(()=>{const t=this.container.querySelector("#short-answer");t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))},100)}selectRandomQuestion(){if(!this.run||this.run.config.order!=="randomRepeat")return;const e=this.questions.map(s=>s.id);let t,r=0;const n=50;do{const s=Math.floor(Math.random()*e.length);t=e[s],r++}while(r<n&&this.randomQuestionHistory.length>0&&t===this.randomQuestionHistory[this.randomQuestionHistory.length-1].split("_")[0]);const i=`${t}_${this.randomQuestionHistory.length}`;this.randomQuestionHistory.push(i),this.run.questionIds=[...this.randomQuestionHistory],this.currentIndex=this.randomQuestionHistory.length-1}renderQuestion(){if(!this.run||!this.questions.length)return;const e=this.getCurrentQuestion();if(!e)return;let t,r;if(this.run.config.order==="randomRepeat"){const a=Math.min(this.totalQuestionsAnswered+1,this.run.config.count);t=this.totalQuestionsAnswered/this.run.config.count*100,r=`${a} / ${this.run.config.count}`}else t=(this.currentIndex+1)/this.run.questionIds.length*100,r=`${this.currentIndex+1} / ${this.run.questionIds.length}`;const n=this.run.config.order==="randomRepeat"?this.run.questionIds[this.currentIndex]:e.id,i=this.shouldClearAnswer(e)?[]:this.run.answers[n]||[],s=i.length>0,c=this.run.config.mode==="practice"&&this.feedbackShown.has(this.currentIndex),l=c&&s?this.checkAnswer(e,i):!1;this.container.innerHTML=`
      <div class="container">
        <!-- 헤더 -->
        <header style="
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: var(--space-6);
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--color-border);
        ">
          <div style="font-weight: 500; color: var(--color-text-secondary);">
            ${r}
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="
              background: var(--color-surface); 
              padding: var(--space-2) var(--space-4); 
              border-radius: var(--radius-lg);
              font-size: var(--font-size-sm);
              color: var(--color-text-secondary);
            ">
              ${this.run.config.mode==="practice"?"연습 모드":"시험 모드"}
            </div>
            <button 
              class="btn btn-secondary" 
              id="exit-btn"
              style="
                font-size: var(--font-size-sm);
                padding: var(--space-2) var(--space-3);
                background: var(--color-error);
                color: white;
                border: none;
              "
            >
              종료
            </button>
          </div>
        </header>

        <!-- 진행률 바 -->
        <div class="progress-bar" style="
          height: 8px; 
          margin-bottom: var(--space-8);
        ">
          <div class="progress-fill" style="
            height: 100%; 
            width: ${t}%;
            transition: width 0.3s ease;
          "></div>
          <div class="progress-cat black-cat-icon"></div>
        </div>

        <!-- 문제 영역 -->
        <div style="max-width: 600px; margin: 0 auto;">
          <!-- 문제 정보 -->
          ${e.description?`
            <div style="
              color: var(--color-text-secondary); 
              font-size: var(--font-size-sm); 
              margin-bottom: var(--space-2);
            ">
              ${e.description}
            </div>
          `:""}

          <!-- 문제 내용 -->
          <div style="
            font-size: var(--font-size-lg); 
            font-weight: 500; 
            margin-bottom: var(--space-6);
            line-height: 1.6;
          ">
            ${y(e.question)}
          </div>

          <!-- 답안 입력 영역 -->
          <div id="answer-area" style="margin-bottom: var(--space-8);">
            ${this.renderAnswerInput(e,i)}
          </div>

          <!-- 피드백 영역 (Practice 모드) -->
          ${c?`
            <div class="${l?"feedback-success":"feedback-error"}" style="
              padding: var(--space-4);
              margin-bottom: var(--space-6);
              color: white;
            ">
              <div style="
                display: flex; 
                align-items: center; 
                gap: var(--space-2); 
                margin-bottom: var(--space-2);
                font-weight: 500;
              ">
                ${l?"✅ 정답입니다!":"❌ 틀렸습니다."}
              </div>
              <div style="opacity: 0.9; font-size: var(--font-size-sm);">
                정답: ${e.answer.map(a=>y(a)).join(", ")}
              </div>
              ${e.explanation?`
                <div style="
                  opacity: 0.9; 
                  font-size: var(--font-size-sm); 
                  margin-top: var(--space-2);
                  padding-top: var(--space-2);
                  border-top: 1px solid rgba(255,255,255,0.2);
                ">
                  ${y(e.explanation)}
                </div>
              `:""}
            </div>
          `:""}

          <!-- 네비게이션 버튼 -->
          <div style="
            display: flex; 
            gap: var(--space-4); 
            justify-content: space-between;
            align-items: center;
          ">
            <button 
              class="btn btn-secondary" 
              id="prev-btn"
              ${this.shouldDisablePrevButton()?"disabled":""}
            >
              ← 이전
            </button>

            <div style="display: flex; gap: var(--space-2);">
              ${this.shouldShowFinishButton()?`
                <button class="btn btn-primary" id="finish-btn">
                  완료
                </button>
              `:`
                <button class="btn btn-primary" id="next-btn">
                  다음 →
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `,this.attachNavigationEvents(),this.attachAnswerEvents(),this.setupImages(),this.setAutoFocus()}shouldClearAnswer(e){return this.run.config.order!=="randomRepeat",!1}shouldDisablePrevButton(){return this.run.config.order==="randomRepeat"?this.randomQuestionHistory.length<=1:this.currentIndex===0}shouldShowFinishButton(){return this.run.config.order==="randomRepeat"?this.totalQuestionsAnswered>=this.run.config.count:this.currentIndex===this.run.questionIds.length-1}destroy(){document.removeEventListener("keydown",this.boundHandleKeydown)}}class W{constructor(){this.listeners=[],window.addEventListener("hashchange",()=>{this.notifyListeners()}),window.addEventListener("load",()=>{this.notifyListeners()})}getCurrentRoute(){const e=window.location.hash.slice(1);if(!e)return{path:"/",params:{}};const[t,r]=e.split("?"),n={};if(r){const i=new URLSearchParams(r);for(const[s,c]of i)n[s]=decodeURIComponent(c)}return{path:t||"/",params:n}}onRouteChange(e){this.listeners.push(e)}navigate(e,t){let r=`#${e}`;if(t&&Object.keys(t).length>0){const n=new URLSearchParams;for(const[i,s]of Object.entries(t))n.set(i,encodeURIComponent(s));r+=`?${n.toString()}`}window.location.hash=r}navigateToQuiz(e){const t=new URLSearchParams({certification:e.certification,subject:typeof e.subject=="string"?e.subject:JSON.stringify(e.subject),order:e.order,mode:e.mode,count:e.count.toString()});e.selectedChapters&&e.selectedChapters.length>0&&t.set("chapters",JSON.stringify(e.selectedChapters)),this.navigate(`/quiz?${t.toString()}`)}navigateToResults(){this.navigate("/results")}navigateToHome(){this.navigate("/")}parseQuizConfig(e){const{certification:t,subject:r,order:n,mode:i,count:s,chapters:c}=e;if(!t||!r||!n||!i||!s)return null;const l=parseInt(s);if(isNaN(l)||l<1||l>100||!["sequential","random","randomRepeat"].includes(n)||!["practice","exam"].includes(i))return null;let a;try{a=JSON.parse(r)}catch{a=r}let d=null;if(c)try{d=JSON.parse(c),Array.isArray(d)||(d=null)}catch(u){console.warn("챕터 파라미터 파싱 실패:",u),d=null}return{certification:t,subject:a,selectedChapters:d,order:n,mode:i,count:l}}notifyListeners(){const e=this.getCurrentRoute();console.log("라우트 변경:",e),this.listeners.forEach(t=>t(e))}}const v=new W;class Y{constructor(e){this.container=e,this.catalog=null,this.currentRun=null,this.currentQuestions=[],this.home=new J(e),this.results=new K(e),this.runner=new V(e),v.onRouteChange(t=>this.handleRouteChange(t))}async initialize(){try{console.log("앱 초기화 중..."),this.catalog=await q(),console.log("카탈로그 로드 완료"),this.restoreState(),this.handleRouteChange(v.getCurrentRoute())}catch(e){console.error("앱 초기화 실패:",e),this.showError("앱을 시작할 수 없습니다",e)}}async handleRouteChange(e){console.log("라우트 변경:",e);try{switch(e.path){case"/":this.showHome();break;case"/quiz":await this.showQuiz(e.params);break;case"/results":this.showResults();break;default:console.warn("알 수 없는 라우트:",e.path),v.navigateToHome()}}catch(t){console.error("라우트 처리 실패:",t),this.showError("페이지를 로드할 수 없습니다",t)}}showHome(){if(!this.catalog){this.showError("카탈로그가 로드되지 않았습니다");return}this.home.render(this.catalog,e=>{v.navigateToQuiz(e)})}async showQuiz(e){const t=v.parseQuizConfig(e);if(!t){console.error("잘못된 퀴즈 설정:",e),v.navigateToHome();return}try{console.log("문제 은행 로딩 중...",t.certification,t.subject);const r=await I(t.certification,t.subject,t.selectedChapters);if(r.length===0)throw new Error("문제가 없습니다");const n=L(r,t.order,t.count);this.currentRun=T(t,n),this.currentQuestions=r,this.saveState(),console.log(`퀴즈 시작: ${n.length}개 문제`),this.runner.render(this.currentQuestions,this.currentRun,()=>{this.restoreState(),v.navigateToResults()})}catch(r){console.error("퀴즈 시작 실패:",r),this.showError("퀴즈를 시작할 수 없습니다",r)}}showResults(){if(!this.currentRun||!this.currentQuestions.length){console.warn("표시할 결과가 없습니다"),v.navigateToHome();return}const e=H(this.currentRun,this.currentQuestions);this.showResultsWithData(e)}showResultsWithData(e){this.currentRun&&this.results.render(e,this.currentQuestions,this.currentRun,()=>{this.currentRun&&v.navigateToQuiz(this.currentRun.config)},()=>{this.clearState(),v.navigateToHome()})}showError(e,t){const r=t instanceof Error?t.message:"알 수 없는 오류";this.container.innerHTML=`
      <div class="container" style="text-align: center; padding: var(--space-8);">
        <h1 style="color: var(--color-error); margin-bottom: var(--space-4);">
          오류 발생
        </h1>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-2);">
          ${e}
        </p>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-6);">
          ${r}
        </p>
        <div style="display: flex; gap: var(--space-4); justify-content: center;">
          <button class="btn btn-secondary" onclick="location.reload()">
            새로고침
          </button>
          <button class="btn btn-primary" id="home-btn">
            홈으로
          </button>
        </div>
      </div>
    `;const n=this.container.querySelector("#home-btn");n==null||n.addEventListener("click",()=>{this.clearState(),v.navigateToHome()})}saveState(){const e=f();e.currentRun=this.currentRun||void 0,b(e)}restoreState(){const e=f();e.currentRun&&(this.currentRun=e.currentRun,console.log("저장된 퀴즈 상태 복원됨"))}clearState(){this.currentRun=null,this.currentQuestions=[];const e=f();delete e.currentRun,b(e)}}console.log("CBT4Cert 앱이 시작되었습니다.");D();const X=document.querySelector("#app"),Z=new Y(X);Z.initialize();
