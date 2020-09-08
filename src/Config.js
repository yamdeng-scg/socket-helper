const Config = {};

// url 목록(로컬, 개발, 운영)
Config.socketUrlList = ['http://localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8', 'http://localhost:9091?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8', 'http://localhost:9092?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8'];

// 기본 url(로컬)
Config.defaultSocketUrl = 'http://localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8';

// 로그인 id 기본값
Config.defaultLoginId = 'csmaster1';

// 로그인 password 기본값
Config.defaultLoginPassword = '1212';

// 기본 listen event
Config.listenEventNameListString = 'join,payload';

// 상담톡 요청 목록
Config.webSocektRequestList = [{
    name: 'root 조인',
    protocol: 'join',
    defaultParameter: {},
    isCallbackFunction: true
}];

export default Config;
