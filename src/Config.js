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
Config.listenEventNameListString = 'payload,message,reads,err,welcome';

// 상담톡 요청 목록 : 상담톡(join, payload, message, reads-emp, leave), 고객(join, message, prehistory, spaceinfo, speaks, reads, end)

Config.webSocektRequestList = [
  {
    name: '방 조인(상담사)',
    protocol: 'join',
    parameter: { empid: 1, space: '9', speaker: 177 },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: false
  },
  {
    name: 'payload',
    protocol: 'payload',
    parameter: {
      cmd: 'reload-spaces-by-admin',
      space: 9
    },
    isCallbackFunction: false,
    callbackFunctionResponse: null,
    isCustomerConnect: false
  },
  {
    name: '메시지 전송(상담사)',
    protocol: 'message',
    parameter: {
      space: 9,
      msg: 'scgmsc://hanbill/regist',
      mtype: 4,
      sysmsg: 0,
      onlyadm: 0,
      isemp: 1,
      msgname: '요금상세'
    },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: false
  },

  {
    name: '메시지 읽음(상담사)',
    protocol: 'reads-emp',
    parameter: {
      space: 9,
      startid: 2483,
      lastid: 2484,
      speaker: 177
    },
    isCallbackFunction: false,
    callbackFunctionResponse: null,
    isCustomerConnect: false
  },
  {
    name: '방나가기(상담사)',
    protocol: 'leave',
    parameter: { space: '9' },
    isCallbackFunction: false,
    callbackFunctionResponse: null,
    isCustomerConnect: false
  },
  {
    name: '방 조인(고객)',
    protocol: 'join',
    parameter: { space: '9' },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  },
  {
    name: '메시지 전송(고객)',
    protocol: 'message',
    parameter: {
      space: 9,
      msg: 'yap yap',
      mtype: 0
    },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  },
  {
    name: '이전 히스토리 저장(고객)',
    protocol: 'prehistory',
    parameter: {
      space: '9',
      data: [
        { m: '...', t: '2018-06-26 05:23:05' },
        { m: '[상담사와 채팅하기] 클릭 1', t: '2018-06-26 05:23:11' }
      ]
    },
    isCallbackFunction: false,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  },
  {
    name: '방 정보 조회(고객)2',
    protocol: 'spaceinfo',
    parameter: { speaker: 69 },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  },
  {
    name: '메시지 목록(고객)',
    protocol: 'speaks',
    parameter: { space: '9' },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  },
  {
    name: '메시지 읽음(고객)',
    protocol: 'reads',
    parameter: { space: 9, startid: 111, lastid: 333 },
    isCallbackFunction: false,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  },
  {
    name: '방 나가기(고객)',
    protocol: 'end',
    parameter: { space: '9' },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: true
  }
];

Config.defaultSendMessageValue = {
  space: 9,
  msg: '기본 메시지',
  mtype: 0,
  sysmsg: 0,
  onlyadm: 0,
  isemp: 1,
  msgname: ''
};

export default Config;
