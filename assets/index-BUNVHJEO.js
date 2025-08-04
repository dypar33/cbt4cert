(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();async function x(){try{const e=window.location.hostname==="dypar33.github.io"?"/cbt4cert":"",t=await fetch(`${e}/data/index.json`);if(!t.ok)throw new Error(`카탈로그 로드 실패: ${t.status}`);const r=await t.json();return k(r),r}catch(s){throw console.error("카탈로그 로드 중 오류:",s),new Error("카탈로그를 불러올 수 없습니다.")}}async function $(s,e){try{const n=`${window.location.hostname==="dypar33.github.io"?"/cbt4cert":""}/data/${encodeURIComponent(s)}/${encodeURIComponent(e)}/questions.json`,o=await fetch(n);if(!o.ok)throw new Error(`문제 은행 로드 실패: ${o.status}`);const i=await o.json();if(!Array.isArray(i))throw new Error("문제 데이터가 배열 형태가 아닙니다.");return i.map(S)}catch(t){throw console.error("문제 은행 로드 중 오류:",t),new Error(`${s} - ${e} 문제를 불러올 수 없습니다.`)}}function k(s){if(!s||typeof s!="object")throw new Error("카탈로그 형식이 올바르지 않습니다.");if(!Array.isArray(s.certifications))throw new Error("자격증 목록이 배열 형태가 아닙니다.");for(const e of s.certifications){if(!e.name||typeof e.name!="string")throw new Error("자격증 이름이 올바르지 않습니다.");if(!Array.isArray(e.subjects))throw new Error("과목 목록이 배열 형태가 아닙니다.")}}function S(s){if(!s||typeof s!="object")throw new Error("문제 데이터가 객체 형태가 아닙니다.");if(!s.id||typeof s.id!="string")throw new Error("문제 ID가 올바르지 않습니다.");if(!s.question||typeof s.question!="string")throw new Error("문제 내용이 올바르지 않습니다.");if(!Array.isArray(s.answer))throw new Error("정답이 배열 형태가 아닙니다.");const e=s.choices&&Array.isArray(s.choices)?"mcq":"short";return{id:s.id,question:s.question,description:s.description||void 0,type:s.type||e,choices:s.choices||void 0,answer:s.answer,explanation:s.explanation||void 0,tags:s.tags||void 0}}function E(s,e,t){if(s.length===0)throw new Error("문제 은행이 비어있습니다.");if(t<=0)throw new Error("문제 개수는 1개 이상이어야 합니다.");const r=s.map(n=>n.id);switch(e){case"sequential":return r.slice(0,Math.min(t,r.length));case"random":return f(r).slice(0,Math.min(t,r.length));case"randomRepeat":const n=f(r),o=[];for(let i=0;i<t;i++)o.push(n[i%n.length]);return o;default:throw new Error(`지원하지 않는 출제 순서: ${e}`)}}function I(s,e){return{id:q(),config:s,questionIds:e,currentIndex:0,answers:{},startTime:Date.now()}}function C(s,e,t,r){const n={...s,answers:{...s.answers,[e]:t}};if(s.config.mode==="practice"&&r){const o=R(t,r);return{run:n,feedback:o}}return{run:n}}function z(s,e){const t=Date.now(),r=new Map(e.map(a=>[a.id,a]));let n=0;const o=[];for(const a of s.questionIds){const u=r.get(a),p=s.answers[a]||[];u&&m(p,u)?n++:o.push(a)}const i=s.questionIds.length,c=i>0?Math.round(n/i*100):0,l=t-s.startTime;return{score:c,total:i,correct:n,wrong:o,timeSpent:l}}function R(s,e){return{correct:m(s,e),expected:e.answer,explanation:e.explanation}}function m(s,e){const t=o=>o.trim().toLowerCase().replace(/\s+/g,""),r=s.map(t).sort(),n=e.answer.map(t).sort();return r.length!==n.length?!1:r.every((o,i)=>o===n[i])}function f(s){const e=[...s];for(let t=e.length-1;t>0;t--){const r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}return e}function q(){return`run_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}const y="cbt4cert",g={darkMode:!1};function h(){try{const s=localStorage.getItem(y);if(!s)return{preferences:g};const e=JSON.parse(s);return{preferences:{...g,...e.preferences},currentRun:e.currentRun}}catch(s){return console.warn("저장된 데이터 로드 실패, 기본값 사용:",s),{preferences:g}}}function v(s){try{localStorage.setItem(y,JSON.stringify(s))}catch(e){console.error("데이터 저장 실패:",e)}}function b(s){const e=h();e.preferences={...e.preferences,...s},v(e)}function A(){const e=!h().preferences.darkMode;return b({darkMode:e}),document.documentElement.setAttribute("data-theme",e?"dark":"light"),e}function L(){const s=h();document.documentElement.setAttribute("data-theme",s.preferences.darkMode?"dark":"light")}const w={cuteCat:"/assets/images/cute-cat.svg",blackCat:"/assets/images/black-cat.svg"};class Q{constructor(e){this.container=e,this.catalog=null,this.onStartQuiz=null}render(e,t){this.catalog=e,this.onStartQuiz=t;const n=h().preferences;this.container.innerHTML=`
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
              ${e.certifications.map(o=>`<option value="${o.name}" ${n.lastCertification===o.name?"selected":""}>
                  ${o.name}
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
            <label for="count" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              문제 개수
            </label>
            <input 
              type="number" 
              id="count" 
              class="input" 
              min="1" 
              max="100" 
              value="${n.lastCount||10}" 
              required
            />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            퀴즈 시작
          </button>
        </form>
      </div>
    `,this.attachEventListeners(),this.setupImages()}setupImages(){const e=this.container.querySelector(".cute-cat-icon");e&&(e.style.backgroundImage=`url(${w.cuteCat})`)}attachEventListeners(){const e=this.container.querySelector("#theme-toggle");e.addEventListener("click",()=>{const o=A();e.textContent=o?"☀️ 라이트 모드":"🌙 다크 모드"});const t=this.container.querySelector("#certification"),r=this.container.querySelector("#subject");t.addEventListener("change",()=>{var i;const o=(i=this.catalog)==null?void 0:i.certifications.find(c=>c.name===t.value);if(o){r.disabled=!1,r.innerHTML=`
          <option value="">과목을 선택하세요</option>
          ${o.subjects.map(l=>`<option value="${l}">${l}</option>`).join("")}
        `;const c=h();c.preferences.lastSubject&&o.subjects.includes(c.preferences.lastSubject)&&(r.value=c.preferences.lastSubject)}else r.disabled=!0,r.innerHTML='<option value="">먼저 자격증을 선택하세요</option>'}),t.value&&t.dispatchEvent(new Event("change")),this.container.querySelector("#quiz-form").addEventListener("submit",o=>{o.preventDefault(),this.handleFormSubmit()})}handleFormSubmit(){var c;const e=this.container.querySelector("#certification").value,t=this.container.querySelector("#subject").value,r=this.container.querySelector("#order").value,n=this.container.querySelector("#mode").value,o=parseInt(this.container.querySelector("#count").value);if(!e||!t){alert("자격증과 과목을 모두 선택해주세요.");return}if(o<1||o>100){alert("문제 개수는 1~100개 사이로 설정해주세요.");return}b({lastCertification:e,lastSubject:t,lastOrder:r,lastMode:n,lastCount:o});const i={certification:e,subject:t,order:r,mode:n,count:o};(c=this.onStartQuiz)==null||c.call(this,i)}}class j{constructor(e){this.container=e}render(e,t,r,n,o){const i=e.wrong.map(a=>t.find(u=>u.id===a)).filter(Boolean),c=Math.floor(e.timeSpent/6e4),l=Math.floor(e.timeSpent%6e4/1e3);this.container.innerHTML=`
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
                ${i.map(a=>{const u=r.answers[a.id]||[];return`
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
                              background: ${u.includes(p)?"var(--color-error-bg)":a.answer.includes(p)?"var(--color-success-bg)":"transparent"};
                              border: 1px solid ${u.includes(p)?"var(--color-error)":a.answer.includes(p)?"var(--color-success)":"var(--color-border)"};
                              font-size: var(--font-size-sm);
                            ">
                              ${u.includes(p)?"❌":a.answer.includes(p)?"✅":"○"} ${p}
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
                          내 답안: ${u.length>0?u.join(", "):"(답안 없음)"}
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
                          ${a.explanation}
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
    `,this.attachEventListeners(n,o)}attachEventListeners(e,t){const r=this.container.querySelector("#retry-btn"),n=this.container.querySelector("#home-btn");r.addEventListener("click",e),n.addEventListener("click",t)}}class M{constructor(e){this.container=e,this.questions=[],this.run=null,this.currentIndex=0,this.onComplete=null,this.feedbackShown=new Set}render(e,t,r){this.questions=e,this.run=t,this.onComplete=r,this.currentIndex=0,this.feedbackShown.clear(),this.restoreProgress(),this.renderQuestion(),this.attachEventListeners()}renderQuestion(){if(!this.run||!this.questions.length)return;const e=this.getCurrentQuestion();if(!e)return;const t=(this.currentIndex+1)/this.run.questionIds.length*100,r=this.run.answers[e.id]||[],n=r.length>0,o=this.run.config.mode==="practice"&&n&&this.feedbackShown.has(this.currentIndex),i=o?this.checkAnswer(e,r):!1;this.container.innerHTML=`
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
            ${this.currentIndex+1} / ${this.run.questionIds.length}
          </div>
          <div style="
            background: var(--color-surface); 
            padding: var(--space-2) var(--space-4); 
            border-radius: var(--radius-lg);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          ">
            ${this.run.config.mode==="practice"?"연습 모드":"시험 모드"}
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
            ${e.question}
          </div>

          <!-- 답안 입력 영역 -->
          <div id="answer-area" style="margin-bottom: var(--space-8);">
            ${this.renderAnswerInput(e,r)}
          </div>

          <!-- 피드백 영역 (Practice 모드) -->
          ${o?`
            <div class="${i?"feedback-success":"feedback-error"}" style="
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
                ${i?"✅ 정답입니다!":"❌ 틀렸습니다."}
              </div>
              <div style="opacity: 0.9; font-size: var(--font-size-sm);">
                정답: ${e.answer.join(", ")}
              </div>
              ${e.explanation?`
                <div style="
                  opacity: 0.9; 
                  font-size: var(--font-size-sm); 
                  margin-top: var(--space-2);
                  padding-top: var(--space-2);
                  border-top: 1px solid rgba(255,255,255,0.2);
                ">
                  ${e.explanation}
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
              ${this.currentIndex===0?"disabled":""}
            >
              ← 이전
            </button>

            <div style="display: flex; gap: var(--space-2);">
              ${this.currentIndex===this.run.questionIds.length-1?`
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
    `,this.attachNavigationEvents(),this.attachAnswerEvents(),this.setupImages()}setupImages(){const e=this.container.querySelector(".black-cat-icon");e&&(e.style.backgroundImage=`url(${w.blackCat})`)}renderAnswerInput(e,t){if(e.type==="short"||!e.choices)return`
        <input 
          type="text" 
          class="input" 
          id="short-answer"
          placeholder="답을 입력하세요"
          value="${t[0]||""}"
          style="width: 100%; font-size: var(--font-size-lg);"
        />
      `;{const r=e.answer.length>1,n=r?"checkbox":"radio",o=r?"":"mcq-answer";return`
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${e.choices.map((i,c)=>{const l=t.includes(i),a=`choice-${c}`;return`
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
                  name="${o}"
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
                  ${i}
                </span>
              </label>
            `}).join("")}
        </div>
      `}}attachEventListeners(){document.addEventListener("keydown",this.handleKeydown.bind(this))}attachNavigationEvents(){const e=this.container.querySelector("#prev-btn");e==null||e.addEventListener("click",()=>this.goToPrevious());const t=this.container.querySelector("#next-btn");t==null||t.addEventListener("click",()=>this.goToNext());const r=this.container.querySelector("#finish-btn");r==null||r.addEventListener("click",()=>this.finish())}attachAnswerEvents(){const e=this.getCurrentQuestion();if(e)if(e.type==="short"||!e.choices){const t=this.container.querySelector("#short-answer");t==null||t.addEventListener("input",()=>{this.saveAnswer([t.value.trim()])}),t==null||t.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),this.goToNext())})}else this.container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r=>{r.addEventListener("change",()=>{this.updateMCQAnswer()})})}updateMCQAnswer(){const e=this.getCurrentQuestion();if(!e)return;if(e.answer.length>1){const n=Array.from(this.container.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value);this.saveAnswer(n)}else{const r=this.container.querySelector('input[type="radio"]:checked'),n=r?[r.value]:[];this.saveAnswer(n)}}saveAnswer(e){if(!this.run)return;const t=this.getCurrentQuestion();if(!t)return;const r=C(this.run,t.id,e,t);this.run=r.run,this.saveProgress()}goToPrevious(){this.currentIndex>0&&(this.currentIndex--,this.renderQuestion(),this.saveProgress())}goToNext(){if(this.run){if(console.log("goToNext 호출됨"),console.log("현재 모드:",this.run.config.mode),console.log("현재 인덱스:",this.currentIndex),this.run.config.mode==="practice"){const e=this.getCurrentQuestion();if(e){const t=this.run.answers[e.id]||[],r=t.length>0;if(console.log("답안 여부:",r),console.log("사용자 답안:",t),console.log("피드백 표시 여부:",this.feedbackShown.has(this.currentIndex)),r&&!this.feedbackShown.has(this.currentIndex)){console.log("피드백 표시 중..."),this.feedbackShown.add(this.currentIndex),this.renderQuestion();return}this.feedbackShown.has(this.currentIndex)&&console.log("피드백이 이미 표시됨, 다음 문제로 이동")}}console.log("다음 문제로 이동 중..."),this.currentIndex<this.run.questionIds.length-1&&(this.currentIndex++,this.renderQuestion(),this.saveProgress())}}finish(){var e;confirm("퀴즈를 완료하시겠습니까?")&&((e=this.onComplete)==null||e.call(this))}handleKeydown(e){if(e.key>="1"&&e.key<="9"){const t=parseInt(e.key)-1,r=this.container.querySelector(`#choice-${t}`);r&&r.click()}e.key==="ArrowLeft"?this.goToPrevious():e.key==="ArrowRight"&&this.goToNext()}getCurrentQuestion(){if(!this.run)return;const e=this.run.questionIds[this.currentIndex];return this.questions.find(t=>t.id===e)}checkAnswer(e,t){const r=i=>i.toLowerCase().trim().replace(/\s+/g," "),n=e.answer.map(r),o=t.map(r);return n.length===o.length&&n.every(i=>o.includes(i))}saveProgress(){if(!this.run)return;const e=h();e.currentRun=this.run,e.currentIndex=this.currentIndex,v(e)}restoreProgress(){const e=h();e.currentIndex!==void 0&&(this.currentIndex=Math.max(0,Math.min(e.currentIndex,this.run.questionIds.length-1)))}destroy(){document.removeEventListener("keydown",this.handleKeydown.bind(this))}}class T{constructor(){this.listeners=[],window.addEventListener("hashchange",()=>{this.notifyListeners()}),window.addEventListener("load",()=>{this.notifyListeners()})}getCurrentRoute(){const e=window.location.hash.slice(1);if(!e)return{path:"/",params:{}};const[t,r]=e.split("?"),n={};if(r){const o=new URLSearchParams(r);for(const[i,c]of o)n[i]=decodeURIComponent(c)}return{path:t||"/",params:n}}onRouteChange(e){this.listeners.push(e)}navigate(e,t){let r=`#${e}`;if(t&&Object.keys(t).length>0){const n=new URLSearchParams;for(const[o,i]of Object.entries(t))n.set(o,encodeURIComponent(i));r+=`?${n.toString()}`}window.location.hash=r}navigateToQuiz(e){const t=new URLSearchParams({cert:e.certification,subject:e.subject,order:e.order,mode:e.mode,count:e.count.toString()});this.navigate(`/quiz?${t.toString()}`)}navigateToResults(){this.navigate("/results")}navigateToHome(){this.navigate("/")}parseQuizConfig(e){const{cert:t,subject:r,order:n,mode:o,count:i}=e;if(!t||!r||!n||!o||!i)return null;const c=parseInt(i);return isNaN(c)||c<1||c>100||!["sequential","random","randomRepeat"].includes(n)||!["practice","exam"].includes(o)?null:{certification:t,subject:r,order:n,mode:o,count:c}}notifyListeners(){const e=this.getCurrentRoute();console.log("라우트 변경:",e),this.listeners.forEach(t=>t(e))}}const d=new T;class P{constructor(e){this.container=e,this.catalog=null,this.currentRun=null,this.currentQuestions=[],this.home=new Q(e),this.results=new j(e),this.runner=new M(e),d.onRouteChange(t=>this.handleRouteChange(t))}async initialize(){try{console.log("앱 초기화 중..."),this.catalog=await x(),console.log("카탈로그 로드 완료"),this.restoreState(),this.handleRouteChange(d.getCurrentRoute())}catch(e){console.error("앱 초기화 실패:",e),this.showError("앱을 시작할 수 없습니다",e)}}async handleRouteChange(e){console.log("라우트 변경:",e);try{switch(e.path){case"/":this.showHome();break;case"/quiz":await this.showQuiz(e.params);break;case"/results":this.showResults();break;default:console.warn("알 수 없는 라우트:",e.path),d.navigateToHome()}}catch(t){console.error("라우트 처리 실패:",t),this.showError("페이지를 로드할 수 없습니다",t)}}showHome(){if(!this.catalog){this.showError("카탈로그가 로드되지 않았습니다");return}this.home.render(this.catalog,e=>{d.navigateToQuiz(e)})}async showQuiz(e){const t=d.parseQuizConfig(e);if(!t){console.error("잘못된 퀴즈 설정:",e),d.navigateToHome();return}try{console.log("문제 은행 로딩 중...",t.certification,t.subject);const r=await $(t.certification,t.subject);if(r.length===0)throw new Error("문제가 없습니다");const n=E(r,t.order,t.count);this.currentRun=I(t,n),this.currentQuestions=r,this.saveState(),console.log(`퀴즈 시작: ${n.length}개 문제`),this.runner.render(this.currentQuestions,this.currentRun,()=>{this.restoreState(),d.navigateToResults()})}catch(r){console.error("퀴즈 시작 실패:",r),this.showError("퀴즈를 시작할 수 없습니다",r)}}showResults(){if(!this.currentRun||!this.currentQuestions.length){console.warn("표시할 결과가 없습니다"),d.navigateToHome();return}const e=z(this.currentRun,this.currentQuestions);this.showResultsWithData(e)}showResultsWithData(e){this.currentRun&&this.results.render(e,this.currentQuestions,this.currentRun,()=>{this.currentRun&&d.navigateToQuiz(this.currentRun.config)},()=>{this.clearState(),d.navigateToHome()})}showError(e,t){const r=t instanceof Error?t.message:"알 수 없는 오류";this.container.innerHTML=`
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
    `;const n=this.container.querySelector("#home-btn");n==null||n.addEventListener("click",()=>{this.clearState(),d.navigateToHome()})}saveState(){const e=h();e.currentRun=this.currentRun||void 0,v(e)}restoreState(){const e=h();e.currentRun&&(this.currentRun=e.currentRun,console.log("저장된 퀴즈 상태 복원됨"))}clearState(){this.currentRun=null,this.currentQuestions=[];const e=h();delete e.currentRun,v(e)}}console.log("CBT4Cert 앱이 시작되었습니다.");L();const H=document.querySelector("#app"),N=new P(H);N.initialize();
