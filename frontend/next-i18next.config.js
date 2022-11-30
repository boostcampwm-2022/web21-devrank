const path = require('path');

module.exports = {
  i18n: {
    // 어플리케이션에서 지원할 언어 리스트
    locales: ['en', 'ko'],
    defaultLocale: 'ko',
    localePath: path.resolve('./public/locales'),
  },
};
