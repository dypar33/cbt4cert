(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();async function k(){try{const e=window.location.hostname==="dypar33.github.io"?"/cbt4cert":"/docs",t=await fetch(`${e}/data/index.json`);if(!t.ok)throw new Error(`카탈로그 로드 실패: ${t.status}`);const r=await t.json();return R(r),r}catch(o){throw console.error("카탈로그 로드 중 오류:",o),new Error("카탈로그를 불러올 수 없습니다.")}}async function I(o,e){try{const n=`${window.location.hostname==="dypar33.github.io"?"/cbt4cert":"/docs"}/data/${encodeURIComponent(o)}/${encodeURIComponent(e)}/questions.json`,s=await fetch(n);if(!s.ok)throw new Error(`문제 은행 로드 실패: ${s.status}`);const i=await s.json();if(!Array.isArray(i))throw new Error("문제 데이터가 배열 형태가 아닙니다.");return i.map(M)}catch(t){throw console.error("문제 은행 로드 중 오류:",t),new Error(`${o} - ${e} 문제를 불러올 수 없습니다.`)}}function R(o){if(!o||typeof o!="object")throw new Error("카탈로그 형식이 올바르지 않습니다.");if(!Array.isArray(o.certifications))throw new Error("자격증 목록이 배열 형태가 아닙니다.");for(const e of o.certifications){if(!e.name||typeof e.name!="string")throw new Error("자격증 이름이 올바르지 않습니다.");if(!Array.isArray(e.subjects))throw new Error("과목 목록이 배열 형태가 아닙니다.")}}function M(o){if(!o||typeof o!="object")throw new Error("문제 데이터가 객체 형태가 아닙니다.");if(!o.id||typeof o.id!="string")throw new Error("문제 ID가 올바르지 않습니다.");if(!o.question||typeof o.question!="string")throw new Error("문제 내용이 올바르지 않습니다.");if(!Array.isArray(o.answer))throw new Error("정답이 배열 형태가 아닙니다.");const e=o.choices&&Array.isArray(o.choices)?"mcq":"short";return{id:o.id,question:o.question,description:o.description||void 0,type:o.type||e,choices:o.choices||void 0,answer:o.answer,explanation:o.explanation||void 0,tags:o.tags||void 0}}const w=Object.freeze(Object.defineProperty({__proto__:null,loadCatalog:k,loadQuestionBank:I},Symbol.toStringTag,{value:"Module"}));function A(o,e,t){if(o.length===0)throw new Error("문제 은행이 비어있습니다.");if(t<=0)throw new Error("문제 개수는 1개 이상이어야 합니다.");const r=o.map(n=>n.id);switch(e){case"sequential":return r.slice(0,Math.min(t,r.length));case"random":return x(r).slice(0,Math.min(t,r.length));case"randomRepeat":const n=x(r),s=[];for(let i=0;i<t;i++)s.push(n[i%n.length]);return s;default:throw new Error(`지원하지 않는 출제 순서: ${e}`)}}function L(o,e){return{id:H(),config:o,questionIds:e,currentIndex:0,answers:{},startTime:Date.now()}}function T(o,e,t,r){const n={...o,answers:{...o.answers,[e]:t}};if(o.config.mode==="practice"&&r){const s=j(t,r);return{run:n,feedback:s}}return{run:n}}function P(o,e){const t=Date.now(),r=new Map(e.map(c=>[c.id,c]));let n=0;const s=[];for(const c of o.questionIds){const u=o.config.order==="randomRepeat"?c.split("_")[0]:c,d=r.get(u),h=o.answers[c]||[];d&&E(h,d)?n++:s.push(c)}const i=o.config.order==="randomRepeat"?o.config.count:o.questionIds.length,a=i>0?Math.round(n/i*100):0,l=t-o.startTime;return{score:a,total:i,correct:n,wrong:s,timeSpent:l}}function j(o,e){return{correct:E(o,e),expected:e.answer,explanation:e.explanation}}function E(o,e){const t=s=>s.trim().toLowerCase().replace(/\s+/g,""),r=o.map(t).sort(),n=e.answer.map(t).sort();return r.length!==n.length?!1:r.every((s,i)=>s===n[i])}function x(o){const e=[...o];for(let t=e.length-1;t>0;t--){const r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}return e}function H(){return`run_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}const F="modulepreload",_=function(o){return"/cbt4cert/"+o},S={},$=function(e,t,r){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),a=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(t.map(l=>{if(l=_(l),l in S)return;S[l]=!0;const c=l.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=c?"stylesheet":F,c||(d.as="script"),d.crossOrigin="",d.href=l,a&&d.setAttribute("nonce",a),document.head.appendChild(d),c)return new Promise((h,p)=>{d.addEventListener("load",h),d.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return n.then(i=>{for(const a of i||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})},z="cbt4cert",b={darkMode:!1};function f(){try{const o=localStorage.getItem(z);if(!o)return{preferences:b};const e=JSON.parse(o);return{preferences:{...b,...e.preferences},currentRun:e.currentRun}}catch(o){return console.warn("저장된 데이터 로드 실패, 기본값 사용:",o),{preferences:b}}}function y(o){try{localStorage.setItem(z,JSON.stringify(o))}catch(e){console.error("데이터 저장 실패:",e)}}function q(o){const e=f();e.preferences={...e.preferences,...o},y(e)}function O(){const e=!f().preferences.darkMode;return q({darkMode:e}),document.documentElement.setAttribute("data-theme",e?"dark":"light"),e}function D(){const o=f();document.documentElement.setAttribute("data-theme",o.preferences.darkMode?"dark":"light")}const N="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2036%2036'%3e%3cpath%20fill='%23F18F26'%20d='M10.478%2022.439s.702%202.281-.337%207.993c-.186%201.025-.46%202.072-.599%202.93-1.757%200-1.851%202.002-1.478%202.002h2.094c1.337%200%202.971-3.334%203.854-7.961s-3.534-4.964-3.534-4.964zm13.042%203.702s2.272%201.22%202.188%204.081c-.033%201.131-.249%202.091-.355%203.024-1.832%200-1.839%201.985-1.305%201.985h1.856c.923%200%203.001-3.158%203.379-7.281.379-4.122-5.763-1.809-5.763-1.809z'/%3e%3cpath%20fill='%23FFCC4E'%20d='M36%208.447C36%203.525%2031.859%201%2027%201c-.553%200-1%20.448-1%201s.447%201%201%201c1.804%200%206.717.934%206.717%205.447%200%202.881-1.567%205.462-3.77%205.982-.164-.073-.345-.104-.509-.192-7.239-3.917-13.457.902-15.226-.29-1.752-1.182-.539-3.255-2.824-5.243-.33-1.841-1.073-4.477-1.794-4.477-.549%200-1.265%201.825-1.74%203.656-.591-1.381-1.363-2.756-1.86-2.756-.64%200-1.278%202.273-1.594%204.235-1.68%201.147-2.906%202.809-2.906%204.765%200%202.7%204.05%203.357%205.4%203.411%201.35.054%203.023%203.562%203.585%205.072%201.242%204.367%202.051%208.699%202.698%2011.183-1.649%200-1.804%202.111-1.348%202.111.713%200%201.953-.003%202.225%200%201.381.014%202.026-4.706%202.026-8.849%200-.212-.011-.627-.011-.627s1.93.505%206.038-.208c2.444-.424%205.03.849%205.746%203.163.527%201.704%201.399%203.305%201.868%204.484-1.589%200-1.545%202.037-1.084%202.037.787%200%201.801.014%202.183%200%201.468-.055.643-7.574%201.03-10.097s1.267-5.578-.229-8.797C34.857%2015.236%2036%2011.505%2036%208.447z'/%3e%3ccircle%20fill='%23292F33'%20cx='5.994'%20cy='11.768'%20r='.9'/%3e%3cpath%20fill='%23E75A70'%20d='M2.984%2012.86c-.677.423-.677%201.777-1.015%201.777S.954%2013.841.954%2012.86c-.001-.981%202.862-.52%202.03%200z'/%3e%3cpath%20fill='%23FEE7B8'%20d='M6.578%2014.343c-.041.026-.09.036-.142.026-.018-.004-1.548-.241-2.545.146-.129.05-.341-.023-.413-.191s.023-.365.152-.415c1.44-.569%202.857-.234%202.934-.218.139.029.195.19.188.372-.004.114-.104.235-.174.28zm-.472%202.339c-.048.009-.097-.001-.141-.031-.015-.01-1.331-.83-2.402-.853-.138-.003-.305-.154-.305-.341%200-.186.165-.335.304-.333%201.552.024%202.724.891%202.789.937.117.082.104.255.027.424-.049.107-.189.182-.272.197z'/%3e%3cpath%20fill='%23F18F26'%20d='M7.854%207.881s.372-.039.859.033c.217-.46.585-.887.585-.887s.281.668.386%201.179c.025.12.218.117.322.189%200%200%20.038-3.463-.863-3.836.001-.002-.755%201.124-1.289%203.322zM4.399%209.36s.384-.267.883-.574c.217-.624.568-1.333.568-1.333s.307.602.345.81c.21-.114.21-.106.403-.19%200%200-.114-2.286-1.099-2.527%200%200-.732%201.372-1.1%203.814z'/%3e%3cpath%20fill='%23FD9'%20d='M18.45%2023.644c-2.649.57-2.38%202.782-2.38%202.782s1.93.505%206.038-.208c1.067-.185%202.153-.03%203.107.377-1.607-3.047-4.315-3.479-6.765-2.951z'/%3e%3cpath%20fill='%23F18F26'%20d='M14.686%2014.109c.476.676%202.397%202.368%202.745%202.159.338-.203.59-2.055.342-2.706-1.329.359-2.385.658-3.087.547zm7.024%202.689c.623.138%201.507-2.979%201.41-4.123-1.449.017-2.78.256-3.965.537.335%201.08%201.953%203.452%202.555%203.586zm2.627-4.082c.042.723.982%202.603%201.285%202.737.307.137%201.685-1.319%201.866-2.061-1.086-.378-2.142-.597-3.151-.676z'/%3e%3c/svg%3e",B="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2036%2036'%3e%3cpath%20fill='%23292F33'%20d='M10.478%2022.439s.702%202.281-.337%207.993c-.186%201.025-.46%202.072-.599%202.93-1.757%200-1.851%202.002-1.478%202.002h2.094c1.337%200%202.971-3.334%203.854-7.961s-3.534-4.964-3.534-4.964zm13.042%203.702s2.272%201.22%202.188%204.081c-.033%201.131-.249%202.091-.355%203.024-1.832%200-1.839%201.985-1.305%201.985h1.856c.923%200%203.001-3.158%203.379-7.281.379-4.122-5.763-1.809-5.763-1.809z'/%3e%3cpath%20fill='%23292F33'%20d='M36%208.447C36%203.525%2031.859%201%2027%201c-.553%200-1%20.448-1%201s.447%201%201%201c1.804%200%206.717.934%206.717%205.447%200%202.881-1.567%205.462-3.77%205.982-.164-.073-.345-.104-.509-.192-7.239-3.917-13.457.902-15.226-.29-1.752-1.182-.539-3.255-2.824-5.243-.33-1.841-1.073-4.477-1.794-4.477-.549%200-1.265%201.825-1.74%203.656-.591-1.381-1.363-2.756-1.86-2.756-.64%200-1.278%202.273-1.594%204.235-1.68%201.147-2.906%202.809-2.906%204.765%200%202.7%204.05%203.357%205.4%203.411%201.35.054%203.023%203.562%203.585%205.072%201.242%204.367%202.051%208.699%202.698%2011.183-1.649%200-1.804%202.111-1.348%202.111.713%200%201.953-.003%202.225%200%201.381.014%202.026-4.706%202.026-8.849%200-.212-.011-.627-.011-.627s1.93.505%206.038-.208c2.444-.424%205.03.849%205.746%203.163.527%201.704%201.399%203.305%201.868%204.484-1.589%200-1.545%202.037-1.084%202.037.787%200%201.801.014%202.183%200%201.468-.055.643-7.574%201.03-10.097s1.267-5.578-.229-8.797C34.857%2015.236%2036%2011.505%2036%208.447z'/%3e%3ccircle%20fill='%23C3C914'%20cx='5.994'%20cy='11.768'%20r='.9'/%3e%3cpath%20fill='%2366757F'%20d='M2.984%2012.86c-.677.423-.677%201.777-1.015%201.777S.954%2013.841.954%2012.86c-.001-.981%202.862-.52%202.03%200zm3.594%201.483c-.041.026-.09.036-.142.026-.018-.004-1.548-.241-2.545.146-.129.05-.341-.023-.413-.191s.023-.365.152-.415c1.44-.569%202.857-.234%202.934-.218.139.029.195.19.188.372-.004.114-.104.235-.174.28zm-.472%202.339c-.048.009-.097-.001-.141-.031-.015-.01-1.331-.83-2.402-.853-.138-.003-.305-.154-.305-.341%200-.186.165-.335.304-.333%201.552.024%202.724.891%202.789.937.117.082.104.255.027.424-.049.107-.189.182-.272.197z'/%3e%3cpath%20d='M7.854%207.881s.372-.039.859.033c.217-.46.585-.887.585-.887s.281.668.386%201.179c.025.12.218.117.322.189%200%200%20.038-3.463-.863-3.836.001-.002-.755%201.124-1.289%203.322zM4.399%209.36s.384-.267.883-.574c.217-.624.568-1.333.568-1.333s.307.602.345.81c.21-.114.21-.106.403-.19%200%200-.114-2.286-1.099-2.527%200%200-.732%201.372-1.1%203.814z'%20fill='%237F676D'/%3e%3cpath%20fill='%2366757F'%20d='M18.45%2023.644c-2.649.57-2.38%202.782-2.38%202.782s1.93.505%206.038-.208c1.067-.185%202.153-.03%203.107.377-1.607-3.047-4.315-3.479-6.765-2.951z'/%3e%3cpath%20fill='%23292F33'%20d='M5.976%2010.982s.333.347.319.778c-.014.43-.25.833-.25.833s-.292-.347-.319-.826c-.027-.48.25-.785.25-.785z'/%3e%3c/svg%3e",Q={cuteCat:N,blackCat:B};class U{constructor(e){this.container=e,this.catalog=null,this.onStartQuiz=null}render(e,t){this.catalog=e,this.onStartQuiz=t;const n=f().preferences;this.container.innerHTML=`
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
              ${e.certifications.map(s=>`<option value="${s.name}" ${n.lastCertification===s.name?"selected":""}>
                  ${s.name}
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
    `,this.attachEventListeners(),this.setupImages()}setupImages(){const e=this.container.querySelector(".cute-cat-icon");e&&(e.style.backgroundImage=`url(${Q.cuteCat})`)}attachEventListeners(){const e=this.container.querySelector("#theme-toggle");e.addEventListener("click",()=>{const a=O();e.textContent=a?"☀️ 라이트 모드":"🌙 다크 모드"});const t=this.container.querySelector("#certification"),r=this.container.querySelector("#subject"),n=this.container.querySelector("#order");this.container.querySelector("#count");const s=async()=>{const a=t.value,l=r.value,c=n.value,u=this.container.querySelector("#question-count-info"),d=this.container.querySelector("#count-input-container"),h=this.container.querySelector("#count");if(a&&l)try{const{loadQuestionBank:p}=await $(async()=>{const{loadQuestionBank:C}=await Promise.resolve().then(()=>w);return{loadQuestionBank:C}},void 0),g=(await p(a,l)).length;g>0?c==="randomRepeat"?(u.innerHTML=`
                <strong style="color: var(--color-primary);">${g}개</strong> 문제 중에서 랜덤 반복 출제
                <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
                  출제할 문제 수를 아래에 입력하세요 (같은 문제가 반복될 수 있습니다)
                </div>
              `,d.style.display="block",h.max=Math.max(100,g),h.placeholder=`1-${Math.max(100,g)}개`):(u.innerHTML=`
                <strong style="color: var(--color-primary);">${g}개</strong> 문제 ${c==="sequential"?"순차":"랜덤"} 출제
                <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
                  모든 문제가 한 번씩 출제됩니다
                </div>
              `,d.style.display="none"):(u.innerHTML=`
              <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
            `,d.style.display="none")}catch(p){console.error("문제 수 확인 중 오류:",p),u.innerHTML=`
            <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
          `,d.style.display="none"}else u.textContent="자격증과 과목을 선택하면 문제 개수가 표시됩니다.",d.style.display="none"};t.addEventListener("change",()=>{var l;const a=(l=this.catalog)==null?void 0:l.certifications.find(c=>c.name===t.value);if(a){r.disabled=!1,r.innerHTML=`
          <option value="">과목을 선택하세요</option>
          ${a.subjects.map(u=>`<option value="${u}">${u}</option>`).join("")}
        `;const c=f();c.preferences.lastSubject&&a.subjects.includes(c.preferences.lastSubject)&&(r.value=c.preferences.lastSubject,s())}else r.disabled=!0,r.innerHTML='<option value="">먼저 자격증을 선택하세요</option>',s()}),r.addEventListener("change",s),n.addEventListener("change",s),t.value&&t.dispatchEvent(new Event("change")),this.container.querySelector("#quiz-form").addEventListener("submit",a=>{a.preventDefault(),this.handleFormSubmit()})}async handleFormSubmit(){var c;const e=this.container.querySelector("#certification").value,t=this.container.querySelector("#subject").value,r=this.container.querySelector("#order").value,n=this.container.querySelector("#mode").value,s=this.container.querySelector("#count");if(!e||!t){alert("자격증과 과목을 모두 선택해주세요.");return}let i;try{const{loadQuestionBank:u}=await $(async()=>{const{loadQuestionBank:h}=await Promise.resolve().then(()=>w);return{loadQuestionBank:h}},void 0);i=(await u(e,t)).length}catch{alert("선택한 과목의 문제를 불러올 수 없습니다.");return}if(i===0){alert("선택한 과목에 문제가 없습니다.");return}let a;if(r==="randomRepeat"){if(a=parseInt(s.value),!a||a<1){alert("출제할 문제 수를 1개 이상 입력해주세요.");return}if(a>Math.max(100,i)){alert(`최대 ${Math.max(100,i)}개까지 설정할 수 있습니다.`);return}}else a=i;q({lastCertification:e,lastSubject:t,lastOrder:r,lastMode:n,lastCount:a});const l={certification:e,subject:t,order:r,mode:n,count:a};(c=this.onStartQuiz)==null||c.call(this,l)}}class K{constructor(e){this.container=e}formatText(e){return e?e.replace(/\\n/g,`
`).replace(/\n/g,"<br>").replace(/\s{2,}/g," "):""}render(e,t,r,n,s){const i=e.wrong.map(c=>{const u=r.config.order==="randomRepeat"?c.split("_")[0]:c;return t.find(d=>d.id===u)}).filter(Boolean),a=Math.floor(e.timeSpent/6e4),l=Math.floor(e.timeSpent%6e4/1e3);this.container.innerHTML=`
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
                소요 시간: ${a}분 ${l}초
              </div>
            </div>
          </div>

          <!-- 오답 목록 -->
          ${i.length>0?`
            <div style="
              background: var(--color-surface); 
              border: 1px solid var(--color-border); 
              border-radius: var(--radius-xl); 
              padding: var(--space-6); 
              margin-bottom: var(--space-6);
            ">
              <h3 style="margin: 0 0 var(--space-4) 0; color: var(--color-error);">
                틀린 문제 (${i.length}개)
              </h3>
              <div style="max-height: 400px; overflow-y: auto;">
                ${i.map((c,u)=>{const d=e.wrong[u],h=r.answers[d]||[];return`
                    <div style="
                      padding: var(--space-4); 
                      border: 1px solid var(--color-border);
                      border-radius: var(--radius-lg);
                      margin-bottom: var(--space-4);
                      background: var(--color-surface);
                    ">
                      <!-- 문제 -->
                      <div style="font-weight: 500; margin-bottom: var(--space-3); line-height: 1.5;">
                        ${c.question}
                      </div>
                      
                      <!-- 선택지 (객관식인 경우) -->
                      ${c.choices?`
                        <div style="margin-bottom: var(--space-3);">
                          ${c.choices.map(p=>`
                            <div style="
                              padding: var(--space-2); 
                              margin-bottom: var(--space-1);
                              border-radius: var(--radius-md);
                              background: ${h.includes(p)?"var(--color-error-bg)":c.answer.includes(p)?"var(--color-success-bg)":"transparent"};
                              border: 1px solid ${h.includes(p)?"var(--color-error)":c.answer.includes(p)?"var(--color-success)":"var(--color-border)"};
                              font-size: var(--font-size-sm);
                            ">
                              ${h.includes(p)?"❌":c.answer.includes(p)?"✅":"○"} ${p}
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
                          정답: ${c.answer.join(", ")}
                        </div>
                      </div>
                      
                      <!-- 해설 -->
                      ${c.explanation?`
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
                          ${this.formatText(c.explanation)}
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
    `,this.attachEventListeners(n,s)}attachEventListeners(e,t){const r=this.container.querySelector("#retry-btn"),n=this.container.querySelector("#home-btn");r.addEventListener("click",e),n.addEventListener("click",t)}}function G(o){if(!o)return"";const e=document.createElement("div");return e.textContent=o,e.innerHTML}function m(o){return o?G(o).replace(/\n/g,"<br>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/  /g,"&nbsp;&nbsp;"):""}class W{constructor(e){this.container=e,this.questions=[],this.run=null,this.currentIndex=0,this.onComplete=null,this.feedbackShown=new Set,this.boundHandleKeydown=this.handleKeydown.bind(this),this.randomQuestionHistory=[],this.totalQuestionsAnswered=0}render(e,t,r){this.questions=e,this.run=t,this.onComplete=r,this.currentIndex=0,this.feedbackShown.clear(),this.randomQuestionHistory=[],this.totalQuestionsAnswered=0,this.run.config.order==="randomRepeat"&&this.selectRandomQuestion(),this.restoreProgress(),this.renderQuestion(),this.attachEventListeners()}setupImages(){const e=this.container.querySelector(".black-cat-icon");e&&(e.style.backgroundImage=`url(${Q.blackCat})`)}renderAnswerInput(e,t){if(e.type==="short"||!e.choices)return`
        <input 
          type="text" 
          class="input" 
          id="short-answer"
          placeholder="답을 입력하세요"
          value="${t[0]||""}"
          style="width: 100%; font-size: var(--font-size-lg);"
        />
      `;{const r=e.answer.length>1,n=r?"checkbox":"radio",s=r?"":"mcq-answer";return`
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${e.choices.map((i,a)=>{const l=t.includes(i),c=`choice-${a}`;return`
              <label 
                for="${c}"
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
                  id="${c}"
                  name="${s}"
                  value="${i}"
                  ${l?"checked":""}
                  style="
                    width: 20px; 
                    height: 20px; 
                    margin: 0;
                    accent-color: var(--color-primary);
                  "
                />
                <span style="flex: 1; font-size: var(--font-size-base);">
                  ${m(i)}
                </span>
              </label>
            `}).join("")}
        </div>
      `}}attachEventListeners(){document.removeEventListener("keydown",this.boundHandleKeydown),document.addEventListener("keydown",this.boundHandleKeydown)}attachNavigationEvents(){const e=this.container.querySelector("#prev-btn");e==null||e.addEventListener("click",()=>this.goToPrevious());const t=this.container.querySelector("#next-btn");t==null||t.addEventListener("click",()=>this.goToNext());const r=this.container.querySelector("#finish-btn");r==null||r.addEventListener("click",()=>this.finish());const n=this.container.querySelector("#exit-btn");n==null||n.addEventListener("click",()=>this.exit())}attachAnswerEvents(){const e=this.getCurrentQuestion();if(e)if(e.type==="short"||!e.choices){const t=this.container.querySelector("#short-answer");t==null||t.addEventListener("input",()=>{this.saveAnswer([t.value.trim()])}),t==null||t.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),this.goToNext())})}else this.container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r=>{r.addEventListener("change",()=>{this.updateMCQAnswer()})})}updateMCQAnswer(){const e=this.getCurrentQuestion();if(!e)return;if(e.answer.length>1){const n=Array.from(this.container.querySelectorAll('input[type="checkbox"]:checked')).map(s=>s.value);this.saveAnswer(n)}else{const r=this.container.querySelector('input[type="radio"]:checked'),n=r?[r.value]:[];this.saveAnswer(n)}}saveAnswer(e){if(!this.run)return;const t=this.getCurrentQuestion();if(!t)return;const r=this.run.config.order==="randomRepeat"?this.run.questionIds[this.currentIndex]:t.id,n=T(this.run,r,e,t);this.run=n.run,this.saveProgress()}goToPrevious(){this.currentIndex>0&&(this.currentIndex--,this.renderQuestion(),this.saveProgress())}goToNext(){if(this.run){if(console.log("goToNext 호출됨"),console.log("현재 모드:",this.run.config.mode),console.log("현재 인덱스:",this.currentIndex),this.run.config.mode==="practice"){const e=this.getCurrentQuestion();if(e){const t=this.run.config.order==="randomRepeat"?this.run.questionIds[this.currentIndex]:e.id,r=this.run.answers[t]||[];if(console.log("사용자 답안:",r),console.log("피드백 표시 여부:",this.feedbackShown.has(this.currentIndex)),!this.feedbackShown.has(this.currentIndex)){console.log("피드백 표시 중..."),this.feedbackShown.add(this.currentIndex),this.renderQuestion();return}this.feedbackShown.has(this.currentIndex)&&console.log("피드백이 이미 표시됨, 다음 문제로 이동")}}if(this.run.config.order==="randomRepeat"){if(this.totalQuestionsAnswered++,this.totalQuestionsAnswered>=this.run.config.count){this.currentIndex=this.run.questionIds.length-1,this.renderQuestion();return}this.selectRandomQuestion(),this.renderQuestion(),this.saveProgress();return}console.log("다음 문제로 이동 중..."),this.currentIndex<this.run.questionIds.length-1&&(this.currentIndex++,this.renderQuestion(),this.saveProgress())}}finish(){var e;if(this.run.config.mode==="practice"&&!this.feedbackShown.has(this.currentIndex)){console.log("마지막 문제 피드백 표시 중..."),this.feedbackShown.add(this.currentIndex),this.renderQuestion();return}confirm("퀴즈를 완료하시겠습니까?")&&((e=this.onComplete)==null||e.call(this))}exit(){var n;const e=Object.keys(this.run.answers).length,t=this.run.config.order==="randomRepeat"?this.run.config.count:this.run.questionIds.length,r=e>0?`현재까지 ${e}/${t}개 문제를 풀었습니다.
정말로 종료하시겠습니까?`:"정말로 퀴즈를 종료하시겠습니까?";confirm(r)&&(this.saveProgress(),(n=this.onComplete)==null||n.call(this))}handleKeydown(e){if(!e.repeat){if(e.key>="1"&&e.key<="9"){const t=parseInt(e.key)-1,r=this.container.querySelector(`#choice-${t}`);r&&r.click()}if(e.key==="Enter"&&!(document.activeElement.tagName==="INPUT"&&document.activeElement.type==="text")){e.preventDefault();const t=this.container.querySelector("#next-btn"),r=this.container.querySelector("#finish-btn");t&&!t.disabled?t.click():r&&r.click()}e.key==="ArrowLeft"?this.goToPrevious():e.key==="ArrowRight"&&this.goToNext()}}getCurrentQuestion(){if(!this.run)return;const e=this.run.questionIds[this.currentIndex],t=this.run.config.order==="randomRepeat"?e.split("_")[0]:e;return this.questions.find(r=>r.id===t)}checkAnswer(e,t){const r=i=>i.toLowerCase().trim().replace(/\s+/g," "),n=e.answer.map(r),s=t.map(r);return n.length===s.length&&n.every(i=>s.includes(i))}saveProgress(){if(!this.run)return;const e=f();e.currentRun=this.run,e.currentIndex=this.currentIndex,y(e)}restoreProgress(){const e=f();e.currentIndex!==void 0&&(this.currentIndex=Math.max(0,Math.min(e.currentIndex,this.run.questionIds.length-1)))}setAutoFocus(){const e=this.getCurrentQuestion();e&&(e.type==="short"||!e.choices)&&setTimeout(()=>{const t=this.container.querySelector("#short-answer");t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))},100)}selectRandomQuestion(){if(!this.run||this.run.config.order!=="randomRepeat")return;const e=this.questions.map(i=>i.id);let t,r=0;const n=50;do{const i=Math.floor(Math.random()*e.length);t=e[i],r++}while(r<n&&this.randomQuestionHistory.length>0&&t===this.randomQuestionHistory[this.randomQuestionHistory.length-1].split("_")[0]);const s=`${t}_${this.randomQuestionHistory.length}`;this.randomQuestionHistory.push(s),this.run.questionIds=[...this.randomQuestionHistory],this.currentIndex=this.randomQuestionHistory.length-1}renderQuestion(){if(!this.run||!this.questions.length)return;const e=this.getCurrentQuestion();if(!e)return;let t,r;if(this.run.config.order==="randomRepeat"){const c=Math.min(this.totalQuestionsAnswered+1,this.run.config.count);t=this.totalQuestionsAnswered/this.run.config.count*100,r=`${c} / ${this.run.config.count}`}else t=(this.currentIndex+1)/this.run.questionIds.length*100,r=`${this.currentIndex+1} / ${this.run.questionIds.length}`;const n=this.run.config.order==="randomRepeat"?this.run.questionIds[this.currentIndex]:e.id,s=this.shouldClearAnswer(e)?[]:this.run.answers[n]||[],i=s.length>0,a=this.run.config.mode==="practice"&&this.feedbackShown.has(this.currentIndex),l=a&&i?this.checkAnswer(e,s):!1;this.container.innerHTML=`
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
            ${m(e.question)}
          </div>

          <!-- 답안 입력 영역 -->
          <div id="answer-area" style="margin-bottom: var(--space-8);">
            ${this.renderAnswerInput(e,s)}
          </div>

          <!-- 피드백 영역 (Practice 모드) -->
          ${a?`
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
                정답: ${e.answer.map(c=>m(c)).join(", ")}
              </div>
              ${e.explanation?`
                <div style="
                  opacity: 0.9; 
                  font-size: var(--font-size-sm); 
                  margin-top: var(--space-2);
                  padding-top: var(--space-2);
                  border-top: 1px solid rgba(255,255,255,0.2);
                ">
                  ${m(e.explanation)}
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
    `,this.attachNavigationEvents(),this.attachAnswerEvents(),this.setupImages(),this.setAutoFocus()}shouldClearAnswer(e){return this.run.config.order!=="randomRepeat",!1}shouldDisablePrevButton(){return this.run.config.order==="randomRepeat"?this.randomQuestionHistory.length<=1:this.currentIndex===0}shouldShowFinishButton(){return this.run.config.order==="randomRepeat"?this.totalQuestionsAnswered>=this.run.config.count:this.currentIndex===this.run.questionIds.length-1}destroy(){document.removeEventListener("keydown",this.boundHandleKeydown)}}class J{constructor(){this.listeners=[],window.addEventListener("hashchange",()=>{this.notifyListeners()}),window.addEventListener("load",()=>{this.notifyListeners()})}getCurrentRoute(){const e=window.location.hash.slice(1);if(!e)return{path:"/",params:{}};const[t,r]=e.split("?"),n={};if(r){const s=new URLSearchParams(r);for(const[i,a]of s)n[i]=decodeURIComponent(a)}return{path:t||"/",params:n}}onRouteChange(e){this.listeners.push(e)}navigate(e,t){let r=`#${e}`;if(t&&Object.keys(t).length>0){const n=new URLSearchParams;for(const[s,i]of Object.entries(t))n.set(s,encodeURIComponent(i));r+=`?${n.toString()}`}window.location.hash=r}navigateToQuiz(e){const t=new URLSearchParams({cert:e.certification,subject:e.subject,order:e.order,mode:e.mode,count:e.count.toString()});this.navigate(`/quiz?${t.toString()}`)}navigateToResults(){this.navigate("/results")}navigateToHome(){this.navigate("/")}parseQuizConfig(e){const{cert:t,subject:r,order:n,mode:s,count:i}=e;if(!t||!r||!n||!s||!i)return null;const a=parseInt(i);return isNaN(a)||a<1||a>100||!["sequential","random","randomRepeat"].includes(n)||!["practice","exam"].includes(s)?null:{certification:t,subject:r,order:n,mode:s,count:a}}notifyListeners(){const e=this.getCurrentRoute();console.log("라우트 변경:",e),this.listeners.forEach(t=>t(e))}}const v=new J;class V{constructor(e){this.container=e,this.catalog=null,this.currentRun=null,this.currentQuestions=[],this.home=new U(e),this.results=new K(e),this.runner=new W(e),v.onRouteChange(t=>this.handleRouteChange(t))}async initialize(){try{console.log("앱 초기화 중..."),this.catalog=await k(),console.log("카탈로그 로드 완료"),this.restoreState(),this.handleRouteChange(v.getCurrentRoute())}catch(e){console.error("앱 초기화 실패:",e),this.showError("앱을 시작할 수 없습니다",e)}}async handleRouteChange(e){console.log("라우트 변경:",e);try{switch(e.path){case"/":this.showHome();break;case"/quiz":await this.showQuiz(e.params);break;case"/results":this.showResults();break;default:console.warn("알 수 없는 라우트:",e.path),v.navigateToHome()}}catch(t){console.error("라우트 처리 실패:",t),this.showError("페이지를 로드할 수 없습니다",t)}}showHome(){if(!this.catalog){this.showError("카탈로그가 로드되지 않았습니다");return}this.home.render(this.catalog,e=>{v.navigateToQuiz(e)})}async showQuiz(e){const t=v.parseQuizConfig(e);if(!t){console.error("잘못된 퀴즈 설정:",e),v.navigateToHome();return}try{console.log("문제 은행 로딩 중...",t.certification,t.subject);const r=await I(t.certification,t.subject);if(r.length===0)throw new Error("문제가 없습니다");const n=A(r,t.order,t.count);this.currentRun=L(t,n),this.currentQuestions=r,this.saveState(),console.log(`퀴즈 시작: ${n.length}개 문제`),this.runner.render(this.currentQuestions,this.currentRun,()=>{this.restoreState(),v.navigateToResults()})}catch(r){console.error("퀴즈 시작 실패:",r),this.showError("퀴즈를 시작할 수 없습니다",r)}}showResults(){if(!this.currentRun||!this.currentQuestions.length){console.warn("표시할 결과가 없습니다"),v.navigateToHome();return}const e=P(this.currentRun,this.currentQuestions);this.showResultsWithData(e)}showResultsWithData(e){this.currentRun&&this.results.render(e,this.currentQuestions,this.currentRun,()=>{this.currentRun&&v.navigateToQuiz(this.currentRun.config)},()=>{this.clearState(),v.navigateToHome()})}showError(e,t){const r=t instanceof Error?t.message:"알 수 없는 오류";this.container.innerHTML=`
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
    `;const n=this.container.querySelector("#home-btn");n==null||n.addEventListener("click",()=>{this.clearState(),v.navigateToHome()})}saveState(){const e=f();e.currentRun=this.currentRun||void 0,y(e)}restoreState(){const e=f();e.currentRun&&(this.currentRun=e.currentRun,console.log("저장된 퀴즈 상태 복원됨"))}clearState(){this.currentRun=null,this.currentQuestions=[];const e=f();delete e.currentRun,y(e)}}console.log("CBT4Cert 앱이 시작되었습니다.");D();const Y=document.querySelector("#app"),X=new V(Y);X.initialize();
