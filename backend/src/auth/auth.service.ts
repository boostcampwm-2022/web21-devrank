export class AuthService {
  githubLoginCallback() {
    // 1. auth code 받는다
    // 2. access token 받는다
    // 3. 정보 받아와서 DB에 저장한다
    // 4. 서버측 jwt 발급해서 response
    return true;
  }

  refreshNewToken() {
    // 1. GET /refresh-token  // GET? or POST?
    // 2. cookie에 있는 refresh token 검증
    // 3. 성공 시 새 access token 발급, 실패 시 Unauthorized Error
    return true;
  }

  issueAccessToken() {
    return true;
  }

  issueRefreshToken() {
    return true;
  }
}
