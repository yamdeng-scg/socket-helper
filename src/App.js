import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';
import {
  Button,
  Row,
  Col,
  Input,
  Tag,
  Divider,
  Checkbox,
  Modal,
  Tooltip,
  Collapse,
  Spin
} from 'antd';
import ReactJson from 'react-json-view';
import Config from './Config';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import copy from 'copy-to-clipboard';
import update from 'immutability-helper';

const { Panel } = Collapse;

class App extends Component {
  socket = null;

  constructor(props) {
    super(props);

    /*
      
      연결 url : socketUrl
      현재 상태 : isConnected
      연결 url 모달 open : isUrlModalOpen
      login api url : loginApiUrl
      id / password : loginId, loginPassword
      listen 이벤트 정보 : listenEventNameListString
      현재 응답명 : currentEventName
      현재 응답 정보 : currentEventResponse
      list event 정보 영역 view : viewListEvent
      protocol request 영역 view : viewWebSocketRequestInfo
      상담톡 웹소켓 요청 목록 view : viewSdtSocketList
      요청 protocol : requestWebSocketProtocol,
      요청 callback 반영 여부 : requestWebSocketCallbackEnable
      요청 파라미터 : requestWebSocketParamter,
      요청 파리미터 valid 여부 : validRequestParamter
      요청 callback 응답 : requestCallbackResponse
      상담톡 요청 소켓 목록 : webSocektRequestList
      로딩중 : isLoading

    */

    this.state = {
      socket: null,
      loginToken: '',
      loginUser: null,
      socketUrl: Config.defaultSocketUrl,
      isConnected: false,
      isUrlModalOpen: false,
      isLoginUserModalOpen: false,
      loginApiUrl: Config.defaultLoginApiUrl,
      loginId: Config.defaultLoginId,
      loginPassword: Config.defaultLoginPassword,
      listenEventNameListString: Config.listenEventNameListString,
      currentEventName: '',
      currentEventResponse: 'yamdeng',
      viewListEvent: true,
      viewWebSocketRequestInfo: true,
      viewSdtSocketList: true,
      requestWebSocketProtocol: '',
      requestWebSocketCallbackEnable: true,
      requestWebSocketParamter: null,
      validRequestParamter: true,
      requestCallbackResponse: null,
      webSocektRequestList: Config.webSocektRequestList,
      isLoading: false
    };

    // 공통 input 변경
    this.changeInput = this.changeInput.bind(this);

    // 공통 체크 박스 변경
    this.changeCheckbox = this.changeCheckbox.bind(this);

    // 모달 open
    this.showModal = this.showModal.bind(this);

    // 모달 close
    this.closeModal = this.closeModal.bind(this);

    // 로그인 사용자 정보 모달 open
    this.showLoginUserModal = this.showLoginUserModal.bind(this);

    // 로그인 사용자 정보 모달 close
    this.closeLoginUserModal = this.closeLoginUserModal.bind(this);

    // socket url, id, password 변경
    this.changeUrlInfo = this.changeUrlInfo.bind(this);

    // [연결] 버튼 핸들러
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);

    // socket connect
    this.connectSocket = this.connectSocket.bind(this);

    // socket 기본 이밴트 등록
    this.initDefaultSocektEvent = this.initDefaultSocektEvent.bind(this);

    // socket 기본 event
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onEvent = this.onEvent.bind(this);

    // state data reset
    this.resetData = this.resetData.bind(this);

    // 로그인 정보 클립보드 copy
    this.copyClipboardByLoginInfo = this.copyClipboardByLoginInfo.bind(this);

    // 커스텀 이벤트 등록
    this.addCustomEvent = this.addCustomEvent.bind(this);

    // 웹소켓 요청
    this.requestWebSocket = this.requestWebSocket.bind(this);

    // 웹소켓 요청(상담톡 개별)
    this.requestSdtWebsocket = this.requestSdtWebsocket.bind(this);

    // 상담톡 요청 파리미터 수정
    this.changeWebSocektRequestListToParameter = this.changeWebSocektRequestListToParameter.bind(
      this
    );

    // 상담톡 응답 수정
    this.changeWebSocektRequestListToResponse = this.changeWebSocektRequestListToResponse.bind(
      this
    );
  }

  handleGlobalError(message, url, lineNumber, column, errorObject) {
    if (errorObject && typeof errorObject === 'string') {
      errorObject = {
        message: errorObject
      };
    }
    let displayErrorMessage = '';
    displayErrorMessage = displayErrorMessage + 'url : ' + url + '\n';
    displayErrorMessage =
      displayErrorMessage + 'lineNumber : ' + lineNumber + '\n';
    displayErrorMessage = displayErrorMessage + 'column : ' + column + '\n';
    displayErrorMessage =
      displayErrorMessage +
      'message : ' +
      (errorObject && errorObject.message
        ? errorObject.message
        : 'NO MESSAGE') +
      '\n';
    errorObject = errorObject || {};
    errorObject.message = displayErrorMessage;
    let appErrorObject = { message: errorObject.message };
    if (errorObject.stack) {
      appErrorObject.statck = errorObject.stack;
    }
    console.info('appErrorInfo : ' + JSON.stringify(appErrorObject));
    return false;
  }

  init() {
    console.info('process.env : ' + JSON.stringify(process.env));
    window.onerror = this.handleGlobalError;
  }

  changeInput(event, inputName) {
    this.setState({ [inputName]: event.target.value });
  }

  changeCheckbox(event, inputName) {
    let checked = event.target.checked;
    this.setState({ [inputName]: checked });
  }

  showModal() {
    this.setState({ isUrlModalOpen: true });
  }

  closeModal() {
    this.setState({ isUrlModalOpen: false });
  }

  showLoginUserModal() {
    this.setState({ isLoginUserModalOpen: true });
  }

  closeLoginUserModal() {
    this.setState({ isLoginUserModalOpen: false });
  }

  changeUrlInfo(urlInfo) {
    this.setState({
      socketUrl: urlInfo.url,
      loginApiUrl: urlInfo.loginApiUrl,
      loginId: urlInfo.loginId,
      loginPassword: urlInfo.loginPassword,
      isUrlModalOpen: false
    });
  }

  resetData() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = null;
    this.setState({
      loginToken: '',
      loginUser: null,
      socket: null,
      isConnected: false,
      isUrlModalOpen: false,
      currentEventName: '',
      currentEventResponse: null,
      viewListEvent: true,
      viewWebSocketRequestInfo: true,
      viewSdtSocketList: true,
      requestCallbackResponse: null,
      webSocektRequestList: Config.webSocektRequestList
    });
  }

  copyClipboardByLoginInfo() {
    let { socket, loginUser, loginToken } = this.state;
    // 소켓 id :
    // 로그인 토큰 :
    // 사용자 정보(JSON) :
    let copyString =
      '소켓 id : ' +
      (socket ? socket.id : '') +
      '\n' +
      '로그인 토큰 : ' +
      loginToken +
      '\n' +
      '사용자 정보(JSON) : ' +
      JSON.stringify(loginUser);
    copy(copyString);
    alert('클립보드에 복사되었습니다');
    this.closeLoginUserModal();
  }

  connect() {
    this.resetData();
    let { loginApiUrl, loginId, loginPassword } = this.state;
    if (this.socket) {
      this.socket.disconnect();
    }
    this.setState({ isLoading: true });
    axios
      .post(loginApiUrl, {
        username: loginId,
        password: loginPassword
      })
      .then((response) => {
        let data = response.data;
        let token = data.token;
        let user = data.user;
        this.setState({ loginUser: user, loginToken: token, isLoading: false });
        this.connectSocket();
      })
      .catch((error) => {
        this.setState({ isLoading: false });
      });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.resetData();
    }
  }

  connectSocket() {
    let { socketUrl } = this.state;
    this.socket = io(socketUrl);
    this.initDefaultSocektEvent();
  }

  initDefaultSocektEvent() {
    // conenct, disconnect, message, event
    this.socket.on('connect', this.onConnect);
    this.socket.on('disconnect', this.onDisconnect);
    this.socket.on('message', this.onMessage);
    this.socket.on('event', this.onEvent);
  }

  onConnect() {
    let { loginToken } = this.state;
    let socket = this.socket;
    this.setState({ socket: socket, isConnected: true });
    this.socket.emit('login', {
      token: loginToken
    });
  }

  onDisconnect(event) {
    this.socket = null;
    this.resetData();
  }

  onMessage(event) {}

  onEvent(event) {}

  addCustomEvent() {
    let { listenEventNameListString } = this.state;
    let eventList = listenEventNameListString.split(',');
    let socket = this.socket;
    eventList.forEach((eventName) => {
      socket.off(eventName);
      socket.on(eventName, (customEventResult) => {
        this.setState({
          currentEventName: eventName,
          currentEventResponse: customEventResult
        });
      });
    });
    alert('커스텀 이벤트가 등록되었습니다');
  }

  requestWebSocket() {
    let {
      requestWebSocketProtocol,
      requestWebSocketParamter,
      requestWebSocketCallbackEnable
    } = this.state;
    let callbackFunction = null;
    if (requestWebSocketCallbackEnable) {
      callbackFunction = (err, res) => {
        this.setState({ requestCallbackResponse: res });
      };
    }
    this.socket.emit(
      requestWebSocketProtocol,
      requestWebSocketParamter,
      callbackFunction
    );
  }

  requestSdtWebsocket(arrayIndex, requestInfo) {
    let { protocol, parameter, isCallbackFunction } = requestInfo;
    let callbackFunction = null;
    if (isCallbackFunction) {
      callbackFunction = (err, res) => {
        if (typeof res === 'string') {
          res = { rootString: res };
        }
        this.changeWebSocektRequestListToResponse(arrayIndex, res);
      };
    }
    this.socket.emit(protocol, parameter, callbackFunction);
  }

  changeWebSocektRequestListToParameter(arrayIndex, updateParameter) {
    let { webSocektRequestList } = this.state;
    let updateWebSocektRequestList = update(webSocektRequestList, {
      [arrayIndex]: {
        parameter: { $set: updateParameter }
      }
    });
    this.setState({ webSocektRequestList: updateWebSocektRequestList });
  }

  changeWebSocektRequestListToResponse(arrayIndex, updateResponse) {
    let { webSocektRequestList } = this.state;
    let updateWebSocektRequestList = update(webSocektRequestList, {
      [arrayIndex]: {
        callbackFunctionResponse: { $set: updateResponse }
      }
    });
    this.setState({ webSocektRequestList: updateWebSocektRequestList });
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {}

  render() {
    let {
      socket,
      loginUser,
      loginToken,
      socketUrl,
      isConnected,
      isUrlModalOpen,
      isLoginUserModalOpen,
      loginApiUrl,
      loginId,
      loginPassword,
      listenEventNameListString,
      currentEventName,
      currentEventResponse,
      viewListEvent,
      viewWebSocketRequestInfo,
      viewSdtSocketList,
      requestWebSocketProtocol,
      requestWebSocketCallbackEnable,
      requestWebSocketParamter,
      validRequestParamter,
      requestCallbackResponse,
      webSocektRequestList,
      isLoading
    } = this.state;
    let socketUrlList = Config.socketUrlList;
    return (
      <div>
        <Spin tip="Loading..." spinning={isLoading}>
          <div>
            {/* 연결 url 모달/ */}
            <Modal
              title="소켓 URL 및 계정선택"
              visible={isUrlModalOpen}
              footer={null}
              onCancel={() => this.closeModal()}
            >
              <Collapse>
                {socketUrlList.map((urlInfo, index) => {
                  return (
                    <Panel header={urlInfo.env} key={index}>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={24}>
                          <span style={{ fontWeight: 'bold' }}>"url"</span> :{' '}
                          {urlInfo.url}
                        </Col>
                      </Row>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={24}>
                          <span style={{ fontWeight: 'bold' }}>
                            "로그인 api url"
                          </span>{' '}
                          : {urlInfo.loginApiUrl}
                        </Col>
                      </Row>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={24}>
                          <span style={{ fontWeight: 'bold' }}>"id"</span> :{' '}
                          {urlInfo.loginId},{' '}
                          <span style={{ fontWeight: 'bold' }}>"password"</span>{' '}
                          : {urlInfo.loginPassword}
                        </Col>
                      </Row>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={24}>
                          <Button
                            type="primary"
                            onClick={() => this.changeUrlInfo(urlInfo)}
                          >
                            적용
                          </Button>{' '}
                        </Col>
                      </Row>
                    </Panel>
                  );
                })}
              </Collapse>
            </Modal>
            {/* 로그인 사용자 정보 모달/ */}
            <Modal
              title="로그인 정보"
              visible={isLoginUserModalOpen}
              footer={null}
              onCancel={() => this.closeLoginUserModal()}
            >
              <p>
                <span style={{ fontWeight: 'bold' }}>"소켓 id"</span> :{' '}
                {socket ? socket.id : ''}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>"token"</span> :{' '}
                {loginToken}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>"사용자 정보 JSON"</span>
              </p>
              <p>{JSON.stringify(loginUser)}</p>
              <Button type="primary" onClick={this.copyClipboardByLoginInfo}>
                정보 복사
              </Button>
            </Modal>
            {/* 연결정보 */}
            <div>
              <Divider
                orientation="left"
                style={{
                  fontWeight: 'bold'
                }}
              >
                연결정보
              </Divider>
              <Row align="middle" gutter={6}>
                <Col span={2} align="" style={{ textAlign: 'right' }}>
                  소켓 url
                </Col>
                <Col span={10}>
                  <Input
                    value={socketUrl}
                    onChange={(e) => this.changeInput(e, 'socketUrl')}
                  />
                </Col>
                <Col span={10}>
                  {isConnected ? (
                    <Button
                      type="primary"
                      onClick={() => this.disconnect()}
                      danger
                    >
                      연결끊기
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => this.connect()}>
                      연결
                    </Button>
                  )}{' '}
                  <Button type="primary" onClick={() => this.showModal()}>
                    URL 선택
                  </Button>{' '}
                  <Button
                    type="primary"
                    onClick={() => this.showLoginUserModal()}
                    style={{ display: loginUser ? '' : 'none' }}
                  >
                    사용자 정보
                  </Button>{' '}
                  {isConnected ? (
                    <Tag color="#2db7f5">현재 상태 connected</Tag>
                  ) : (
                    <Tag color="#f50">현재 상태 disconnected</Tag>
                  )}
                </Col>
              </Row>
              <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                <Col span={2} align="" style={{ textAlign: 'right' }}>
                  로그인 api url
                </Col>
                <Col span={10}>
                  <Input
                    value={loginApiUrl}
                    onChange={(e) => this.changeInput(e, 'loginApiUrl')}
                  />
                </Col>
              </Row>
              <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                <Col span={2} style={{ textAlign: 'right' }}>
                  로그인 ID
                </Col>
                <Col span={4}>
                  <Input
                    value={loginId}
                    onChange={(e) => this.changeInput(e, 'loginId')}
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'right' }}>
                  암호
                </Col>
                <Col span={4}>
                  <Input
                    value={loginPassword}
                    onChange={(e) => this.changeInput(e, 'loginPassword')}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col span={1} style={{ textAlign: 'right' }}></Col>
                <Col span={22} style={{ textAlign: 'left' }}>
                  <Checkbox
                    checked={viewListEvent}
                    onChange={(e) => this.changeCheckbox(e, 'viewListEvent')}
                  >
                    listen event 보기
                  </Checkbox>
                  <Checkbox
                    checked={viewWebSocketRequestInfo}
                    onChange={(e) =>
                      this.changeCheckbox(e, 'viewWebSocketRequestInfo')
                    }
                  >
                    protocol request 보기
                  </Checkbox>
                  <Checkbox
                    checked={viewSdtSocketList}
                    onChange={(e) =>
                      this.changeCheckbox(e, 'viewSdtSocketList')
                    }
                  >
                    상담톡 요청 request 보기
                  </Checkbox>
                </Col>
              </Row>
            </div>
            {/* listen event 정보 */}
            <div style={{ display: viewListEvent ? '' : 'none' }}>
              <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                listen event 정보
              </Divider>
              <Row align="middle" gutter={6}>
                <Col span={2} align="" style={{ textAlign: 'right' }}>
                  event
                </Col>
                <Col span={15}>
                  <Tooltip
                    placement="bottomLeft"
                    title={', 구분자로 이벤트 등록\n예시) join,message,payload'}
                    overlayStyle={{ whiteSpace: 'pre' }}
                  >
                    <Input
                      value={listenEventNameListString}
                      onChange={(e) =>
                        this.changeInput(e, 'listenEventNameListString')
                      }
                    />
                  </Tooltip>
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    onClick={this.addCustomEvent}
                    disabled={!isConnected}
                  >
                    이벤트 등록
                  </Button>
                </Col>
              </Row>
              <Row
                align="middle"
                gutter={6}
                style={{ marginTop: 10, marginLeft: 10 }}
              >
                <Col
                  span={6}
                  align=""
                  style={{ textAlign: 'left', marginLeft: 5 }}
                >
                  현재 응답명 :{' '}
                  <sapn style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {'"' + currentEventName + '"'}
                  </sapn>
                </Col>
              </Row>
              <Row
                style={{
                  marginLeft: 20,
                  paddingTop: 10,
                  display: currentEventResponse ? '' : 'none'
                }}
              >
                <Col span={24}>
                  <ReactJson
                    name={false}
                    displayDataTypes={false}
                    collapsed={false}
                    src={currentEventResponse}
                    indentWidth={10}
                    theme="monokai"
                    style={{ width: '80%' }}
                  />
                </Col>
              </Row>
            </div>
            {/* protocol reqeust 정보 */}
            <div style={{ display: viewWebSocketRequestInfo ? '' : 'none' }}>
              <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                protocol request
              </Divider>
              <Row align="middle" gutter={6}>
                <Col span={2} align="" style={{ textAlign: 'right' }}>
                  소켓 프로토콜
                </Col>
                <Col span={10}>
                  <Input
                    value={requestWebSocketProtocol}
                    onChange={(e) =>
                      this.changeInput(e, 'requestWebSocketProtocol')
                    }
                  />{' '}
                </Col>
                <Col span={10}>
                  <Button
                    type="primary"
                    disabled={!isConnected || !validRequestParamter}
                    onClick={this.requestWebSocket}
                  >
                    요청
                  </Button>{' '}
                  <Checkbox
                    checked={requestWebSocketCallbackEnable}
                    onChange={(e) =>
                      this.changeCheckbox(e, 'requestWebSocketCallbackEnable')
                    }
                  >
                    callback 함수
                  </Checkbox>
                </Col>
              </Row>
              <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                <Col span={2} align="" style={{ textAlign: 'right' }}>
                  요청 파라미터
                </Col>
              </Row>
              <Row style={{ marginLeft: 15, paddingTop: 5 }}>
                <JSONInput
                  placeholder={requestWebSocketParamter} // data to display
                  theme="light_mitsuketa_tribute"
                  locale={locale}
                  colors={{
                    string: '#DAA520',
                    background: '#dbfbff'
                  }}
                  width="500px"
                  height="auto"
                  style={{
                    body: { minHeight: 50 },
                    container: { width: '100%' },
                    outerBox: { width: '80%' }
                  }}
                  onChange={(content) => {
                    let isError = content.error;
                    let updateJson = content.jsObject;
                    this.setState({
                      validRequestParamter: !isError,
                      requestWebSocketParamter: updateJson
                    });
                  }}
                />
              </Row>
              <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                <Col span={2} align="" style={{ textAlign: 'right' }}>
                  callback 응답
                </Col>
              </Row>
              <Row
                style={{
                  marginLeft: 20,
                  paddingTop: 10,
                  display: requestCallbackResponse ? '' : 'none'
                }}
              >
                <Col span={24}>
                  <ReactJson
                    name={false}
                    displayDataTypes={false}
                    collapsed={false}
                    src={requestCallbackResponse}
                    indentWidth={10}
                    theme="monokai"
                    style={{ width: '80%' }}
                  />
                </Col>
              </Row>
            </div>
            {/* 상담톡 웹소켓 요청 목록 */}
            <div
              style={{
                marginBottom: 100,
                display: viewSdtSocketList ? '' : 'none'
              }}
            >
              <Divider orientation="left" style={{ fontWeight: 'bold' }}>
                상담톡 웹소켓 요청 목록
              </Divider>
              <Collapse>
                {webSocektRequestList.map((requestInfo, index) => {
                  return (
                    <Panel header={requestInfo.name} key={index}>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={24}>
                          요청명 :
                          <sapn style={{ fontWeight: 'bold' }}>
                            "{requestInfo.name}"
                          </sapn>
                          {', callback 응답 여부'}
                          <Checkbox
                            checked={requestInfo.isCallbackFunction}
                            style={{ marginLeft: 5 }}
                          ></Checkbox>{' '}
                          <Button
                            type="primary"
                            size="small"
                            disabled={!isConnected}
                            onClick={() =>
                              this.requestSdtWebsocket(index, requestInfo)
                            }
                          >
                            요청
                          </Button>{' '}
                        </Col>
                      </Row>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={5} align="" style={{ textAlign: 'left' }}>
                          요청 파라미터
                        </Col>
                      </Row>
                      <Row style={{ paddingTop: 5 }}>
                        <ReactJson
                          name={false}
                          displayDataTypes={false}
                          onEdit={(info) => {
                            this.changeWebSocektRequestListToParameter(
                              index,
                              info.updated_src
                            );
                          }}
                          collapsed={false}
                          src={requestInfo.parameter}
                          indentWidth={10}
                          theme="monokai"
                          style={{ width: '80%' }}
                        />
                      </Row>
                      <Row align="middle" gutter={6} style={{ marginTop: 10 }}>
                        <Col span={5} align="" style={{ textAlign: 'left' }}>
                          callback 응답
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: 10,
                          display: requestInfo.callbackFunctionResponse
                            ? ''
                            : 'none'
                        }}
                      >
                        <Col span={24}>
                          <ReactJson
                            name={false}
                            displayDataTypes={false}
                            collapsed={false}
                            src={requestInfo.callbackFunctionResponse}
                            indentWidth={10}
                            theme="monokai"
                            style={{ width: '80%' }}
                          />
                        </Col>
                      </Row>
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default App;
