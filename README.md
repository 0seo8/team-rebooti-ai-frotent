# 전자 도장을 찍어보자! ✍️

🔗 **데모:** (https://team-rebooti-ai-frotent.vercel.app/)

PDF 파일에 전자 도장을 삽입할 수 있는 웹 애플리케이션입니다. 사용자가 PDF를 업로드하고 도장 이미지를 추가해 모든 페이지에 도장을 찍을 수 있습니다.

## 주요 기능 ✨

- 📄 PDF 파일 업로드/다운로드/삭제
- 🖼️ 전자 도장 이미지 업로드 (최대 5개)
- 👀 PDF 모든 페이지 미리보기
- ✍️ PDF 모든 페이지에 도장 삽입

## 기술 스택 🛠️

- **프레임워크:** React 19 + TypeScript
- **빌드 도구:** Vite 6
- **주요 라이브러리:** pdf-lib, pdfjs-dist, fabric.js, zustand, styled-components

## 구현 기능 ✅

- **환경 설정:** npm 스크립트, 폴더 구조, ESLint, Prettier
- **PDF 관리:** 업로드, 미리보기, 페이지 이동, 삭제
- **도장 관리:** 업로드, 자동 선택, 배치, 크기 조정
- **도장 적용:** 현재 페이지 및 모든 페이지에 도장 적용
- **다운로드:** PDF 및 이미지 다운로드
- **파일 제한:** PDF(10MB), PNG(2MB), 최대 5개 도장
- **코드 품질:** 타입 정의, 컴포넌트 분리, 커스텀 훅 구현

## 개선 예정 사항 🔄

- **테스트 코드:** 기능 테스트 추가

## 사용자 플로우 🔄

1. **PDF 업로드**
2. **도장 이미지 업로드 및 선택**
3. **도장 배치 및 적용**
4. **PDF 다운로드**

## 개발 환경 설정 📋

```bash
# 개발 모드 실행
npm run dev

# 빌드
npm run build

# 코드 검사
npm run lint

# 타입 검사
npm run type-check

# 코드 포맷팅
npm run format
```
