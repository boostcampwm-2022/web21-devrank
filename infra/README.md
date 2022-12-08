## 실행 방법
1. infra 디렉토리 내에 서버측 .env파일을 생성
2. nginx/default.conf에 SSL 인증서 경로 설정
3. hooks.json의 경로를 수정
4. hooks.service를 등록
5. initial-deploy.sh 실행
6. 이후에는 github Repository의 Main 브랜치에 Merge가 발생하면 자동으로 배포가 됩니다