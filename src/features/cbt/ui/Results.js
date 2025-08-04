export class Results {
  constructor(container) {
    this.container = container
  }

  /**
   * 텍스트 포맷팅 - 줄바꿈과 공백 처리
   */
  formatText(text) {
    if (!text) return ''
    return text
      .replace(/\\n/g, '\n')  // \\n을 실제 줄바꿈으로 변환
      .replace(/\n/g, '<br>') // 줄바꿈을 <br>로 변환
      .replace(/\s{2,}/g, ' ') // 연속된 공백을 하나로 변환
  }

  /**
   * 결과 화면 렌더링
   */
  render(result, questions, run, onRetry, onHome) {
    const wrongQuestions = result.wrong.map(id => 
      questions.find(q => q.id === id)
    ).filter(Boolean)

    const timeMinutes = Math.floor(result.timeSpent / 60000)
    const timeSeconds = Math.floor((result.timeSpent % 60000) / 1000)

    this.container.innerHTML = `
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
                color: ${result.score >= 70 ? 'var(--color-success)' : result.score >= 50 ? 'var(--color-warning)' : 'var(--color-error)'};
                margin-bottom: var(--space-2);
              ">
                ${result.score}점
              </div>
              <div style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
                ${result.correct}/${result.total} 문제 정답
              </div>
              <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                소요 시간: ${timeMinutes}분 ${timeSeconds}초
              </div>
            </div>
          </div>

          <!-- 오답 목록 -->
          ${wrongQuestions.length > 0 ? `
            <div style="
              background: var(--color-surface); 
              border: 1px solid var(--color-border); 
              border-radius: var(--radius-xl); 
              padding: var(--space-6); 
              margin-bottom: var(--space-6);
            ">
              <h3 style="margin: 0 0 var(--space-4) 0; color: var(--color-error);">
                틀린 문제 (${wrongQuestions.length}개)
              </h3>
              <div style="max-height: 400px; overflow-y: auto;">
                ${wrongQuestions.map(q => {
                  const userAnswer = run.answers[q.id] || []
                  return `
                    <div style="
                      padding: var(--space-4); 
                      border: 1px solid var(--color-border);
                      border-radius: var(--radius-lg);
                      margin-bottom: var(--space-4);
                      background: var(--color-surface);
                    ">
                      <!-- 문제 -->
                      <div style="font-weight: 500; margin-bottom: var(--space-3); line-height: 1.5;">
                        ${q.question}
                      </div>
                      
                      <!-- 선택지 (객관식인 경우) -->
                      ${q.choices ? `
                        <div style="margin-bottom: var(--space-3);">
                          ${q.choices.map(choice => `
                            <div style="
                              padding: var(--space-2); 
                              margin-bottom: var(--space-1);
                              border-radius: var(--radius-md);
                              background: ${userAnswer.includes(choice) ? 'var(--color-error-bg)' : 
                                          q.answer.includes(choice) ? 'var(--color-success-bg)' : 'transparent'};
                              border: 1px solid ${userAnswer.includes(choice) ? 'var(--color-error)' : 
                                                 q.answer.includes(choice) ? 'var(--color-success)' : 'var(--color-border)'};
                              font-size: var(--font-size-sm);
                            ">
                              ${userAnswer.includes(choice) ? '❌' : q.answer.includes(choice) ? '✅' : '○'} ${choice}
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}
                      
                      <!-- 답안 정보 -->
                      <div style="
                        display: grid; 
                        gap: var(--space-2); 
                        font-size: var(--font-size-sm);
                        margin-bottom: var(--space-3);
                      ">
                        <div style="color: var(--color-error);">
                          내 답안: ${userAnswer.length > 0 ? userAnswer.join(', ') : '(답안 없음)'}
                        </div>
                        <div style="color: var(--color-success);">
                          정답: ${q.answer.join(', ')}
                        </div>
                      </div>
                      
                      <!-- 해설 -->
                      ${q.explanation ? `
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
                          ${this.formatText(q.explanation)}
                        </div>
                      ` : ''}
                    </div>
                  `
                }).join('')}
              </div>
            </div>
          ` : `
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
    `

    this.attachEventListeners(onRetry, onHome)
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEventListeners(onRetry, onHome) {
    const retryBtn = this.container.querySelector('#retry-btn')
    const homeBtn = this.container.querySelector('#home-btn')

    retryBtn.addEventListener('click', onRetry)
    homeBtn.addEventListener('click', onHome)
  }
}
