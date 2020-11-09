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
Config.defaultSocketUrl = 'http://localhost:8090';

// 기본 로그인 api url(로컬)
Config.defaultLoginApiUrl = 'http://localhost:8090/auth/login';

// 로그인 id 기본값
Config.defaultLoginId = 'csmaster1';

// 로그인 password 기본값
Config.defaultLoginPassword = '1212';

// 기본 listen event
Config.listenEventNameListString =
  'welcome,room-detail,message-list,message,app-error,read-message,receive-event';

// 상담톡 요청 목록 : room-detail, join, message-list, message, end, save-history, delete-message, send-event, leave, read-message
Config.webSocektRequestList = [
  {
    name: '방 상세',
    protocol: 'room-detail',
    parameter: { roomId: 150 },
    isCallbackFunction: true,
    callbackFunctionResponse: null,
    isCustomerConnect: false
  },
  {
    name: '방 조인',
    protocol: 'join',
    parameter: { roomId: 150, speakerId: 221 },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  },
  {
    name: '메시지 목록(더보기)',
    protocol: 'message-list',
    parameter: { roomId: 2, speakerId: 221, startId: 20000 },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  },
  {
    name: '메시지 생성',
    protocol: 'message',
    parameter: {
      companyId: '1',
      roomId: 150,
      speakerId: 221,
      mesasgeType: 0,
      isSystemMessage: 0,
      message: '메시지입니당',
      messageAdminType: 0,
      isEmployee: 0,
      messageDetail: '',
      templateId: null
    },
    isCallbackFunction: false,
    callbackFunctionResponse: null
  },
  {
    name: '상담 종료',
    protocol: 'end',
    parameter: { roomId: 150 },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  },
  {
    name: '이전 히스토리 저장',
    protocol: 'save-history',
    parameter: {
      roomId: 150,
      history: [
        {
          m: '나도 오늘 저녁이 기대된다!',
          t: '2019-08-23 17:41:28'
        },
        {
          m: 'ㅏㅏㅏㅏㅏㅏ',
          t: '2019-08-23 17:41:39'
        }
      ]
    },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  },
  {
    name: '메시지 삭제',
    protocol: 'delete-message',
    parameter: {
      roomId: 150,
      id: 2320
    },
    isCallbackFunction: true,
    callbackFunctionResponse: null
  },
  {
    name: '커스텀 이벤트 전달',
    protocol: 'send-event',
    parameter: {
      eventName: 'reload-all',
      roomId: 150,
      target: 'all'
    },
    isCallbackFunction: false,
    callbackFunctionResponse: null
  },
  {
    name: '상담사 상담 종료',
    protocol: 'leave',
    parameter: { roomId: 150 },
    isCallbackFunction: false,
    callbackFunctionResponse: null
  },
  {
    name: '메시지 읽음',
    protocol: 'read-message',
    parameter: { roomId: 150, startId: 100, endId: 200, speakerId: 221 },
    isCallbackFunction: true,
    callbackFunctionResponse: null
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
