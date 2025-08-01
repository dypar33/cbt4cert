# CBT4Cert

자격증 CBT(Computer Based Test) 연습을 위한 모바일 퍼스트 웹 애플리케이션입니다.

## 🚀 특징

- **100% 클라이언트 사이드**: GitHub Pages에서 정적 호스팅 가능
- **모바일 퍼스트**: 터치 친화적인 반응형 디자인
- **간편한 콘텐츠 관리**: JSON 파일만 추가하면 새로운 문제 세트 추가 가능
- **다양한 학습 모드**: 연습 모드(즉시 피드백) / 시험 모드(결과는 마지막에)
- **출제 순서 옵션**: 순차 / 랜덤 / 랜덤 반복
- **다크 모드 지원**: 사용자 설정 저장
- **딥링크 지원**: URL로 퀴즈 설정 공유 가능
- **고양이 테마**: 귀여운 고양이 애니메이션과 테마

## 🛠️ 기술 스택

- **프론트엔드**: Vite + Vanilla TypeScript
- **스타일링**: CSS Variables (Design Tokens)
- **상태 관리**: localStorage
- **라우팅**: Hash Router
- **호스팅**: GitHub Pages (정적 사이트)

## 📁 프로젝트 구조

```
/
├── public/
│   ├── data/                    # 문제 데이터
│   │   ├── index.json          # 카탈로그 (새 콘텐츠 추가 시 수정)
│   │   └── <자격증>/
│   │       └── <과목>/
│   │           └── questions.json
│   └── 404.html                # GitHub Pages SPA 지원
├── src/
│   ├── app/                    # 앱 컨트롤러 & 라우터
│   ├── features/cbt/           # CBT 기능
│   │   ├── data/              # 타입 & 데이터 로더
│   │   ├── engine/            # 퀴즈 엔진 (순수 함수)
│   │   └── ui/                # UI 컴포넌트
│   ├── assets/                # 이미지 등 정적 자원
│   ├── styles/                # 디자인 토큰
│   └── utils/                 # 유틸리티 (localStorage 등)
└── dist/                      # 빌드 결과물
```

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/dypar33/cbt4cert.git
cd cbt4cert

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📝 새로운 문제 세트 추가하기

새로운 자격증이나 과목을 추가하려면 **코드 수정 없이** 다음 단계만 따르면 됩니다:

### 1. 폴더 구조 생성

```
public/data/<자격증명>/<과목명>/questions.json
```

예시:
```
public/data/정보처리기사/소프트웨어설계/questions.json
```

### 2. 문제 파일 작성 (questions.json)

```json
[
  {
    "id": "unique-question-id",
    "question": "문제 내용",
    "description": "2023년 1회 #15 (선택사항)",
    "type": "mcq",
    "choices": ["선택지1", "선택지2", "선택지3", "선택지4"],
    "answer": ["선택지2"],
    "explanation": "해설 (선택사항)",
    "tags": ["태그1", "태그2"]
  }
]
```

#### 문제 타입
- **mcq**: 객관식 (choices 필수)
- **short**: 단답형 (choices 생략)

#### 필수 필드
- `id`: 고유 식별자
- `question`: 문제 내용  
- `answer`: 정답 배열 (복수 정답 가능)

#### 선택 필드
- `description`: 출처 정보
- `type`: 생략 시 자동 추론
- `choices`: 객관식 선택지
- `explanation`: 해설
- `tags`: 분류 태그

### 3. 카탈로그 업데이트 (public/data/index.json)

```json
{
  "certifications": [
    {
      "name": "기존자격증",
      "subjects": ["기존과목1", "기존과목2"]
    },
    {
      "name": "정보처리기사",
      "subjects": ["소프트웨어설계", "데이터베이스"]
    }
  ]
}
```

### 4. 완료!

새로고침하면 새로운 자격증/과목이 자동으로 나타납니다.