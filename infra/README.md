## 실행 방법

### 기본적으로 docker가 설치되어 있어야합니다.

1. infra 디렉토리 내에 서버측 .env파일을 생성합니다.
2. 아래와 같이 docker를 이용해서 SSL 인증서 생성합니다.(서드도메인까지 모두 만들어줘야합니다) [참고](https://lynlab.co.kr/blog/72)

```bash
sudo docker run -it --rm --name certbot \
   -v '/etc/letsencrypt:/etc/letsencrypt' \
   -v '/var/lib/letsencrypt:/var/lib/letsencrypt' \
   certbot/certbot certonly -d '도메인이름' --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```

3. nginx/default.conf를 아래와 같이 수정합니다.

   - server_name을 도메인에 맞게 수정
   - SSL 인증서 경로 설정

   > 현재는 dreamdev.me, api.dreamdev.me로 설정되어 있습니다.

4. hooks.json 파일을 아래와 같이 수정합니다.
   - `command-working-directory`를 infra폴더 경로로 수정
   - `execute-command`를 해당 폴더의 backend-deploy.sh, frontend-deploy.sh로 수정
5. hooks.service를 등록합니다. [참고](https://118k.tistory.com/1055)
6. initial-deploy.sh 실행하면 배포가 완료됩니다.
7. 이후에는 github Repository의 Main 브랜치에 Merge가 발생하면 자동으로 배포가 됩니다!
