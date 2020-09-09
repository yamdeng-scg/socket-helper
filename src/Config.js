const Config = {};

// url 목록(로컬, 개발, 운영)
Config.socketUrlList = [
  {
    env: '로컬',
    url:
      'http://localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8',
    loginApiUrl: 'http://localhost:9090/auth/sdtalk/sdtadm/1/emp/login',
    loginId: 'csmaster1',
    loginPassword: '1212'
  },
  {
    env: '개발',
    url:
      'http://localhost:9091?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8',
    loginApiUrl: 'http://localhost:9091/auth/sdtalk/sdtadm/1/emp/login',
    loginId: 'csmaster1',
    loginPassword: '1212'
  },
  {
    env: '운영',
    url:
      'http://localhost:9092?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8',
    loginApiUrl: 'http://localhost:9092/auth/sdtalk/sdtadm/1/emp/login',
    loginId: 'csmaster1',
    loginPassword: '1212'
  }
];

// 기본 url(로컬)
Config.defaultSocketUrl =
  'http://localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8';

// 기본 로그인 api url(로컬)
Config.defaultLoginApiUrl =
  'http://localhost:9090/auth/sdtalk/sdtadm/1/emp/login';

// 로그인 id 기본값
Config.defaultLoginId = 'csmaster1';

// 로그인 password 기본값
Config.defaultLoginPassword = '1212';

// 기본 listen event
Config.listenEventNameListString = 'payload,notimsg,reads,err,error';

// message
// reads-emp
// join
// payload
// leave
// token

// 상담톡 요청 목록
Config.webSocektRequestList = [
  {
    name: 'join',
    protocol: 'join',
    parameter: { empid: 1, space: '66', speaker: 177 },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  },
  {
    name: 'token',
    protocol: 'token',
    parameter: { userno: 'csmaster1' },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  }
];

export default Config;
