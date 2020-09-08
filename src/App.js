import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";
import { Button, Row, Col, Input, Tag, Divider, Modal, Tooltip } from 'antd';
import ReactJson from 'react-json-view'
import Config from './Config';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

let sampleData = {
  heidy_white : {
    L2: {
        userID: "heidy_white",
        userName: "Heidy White",
        id : "L2",
        score : false,
        date_created : 15120765766312,
        date_signed : false,
        date_approved: false,
        answers: [0, 1, 2, 3, 4]
      }
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        socketUrl: Config.defaultSocketUrl,
        isConnected: false,
        loginId: Config.defaultLoginId,
        loginPassword: Config.defaultLoginPassword,
        listenEventNameListString: Config.listenEventNameListString,
        currentEventName: 'join',
        currentEventResponse: {test: 'aaa', inner: {bbb: "bbb"}},
        viewListEvent: true
    };

    /*
      
      연결 url : socketUrl
      현재 상태 : isConnected
      id / password : loginId, loginPassword
      현재 응답명 : currentEventName
      현재 응답 정보 : currentEventResponse
      list event 정보 영역 view : viewListEvent

    */
   this.changeInput = this.changeInput.bind(this);
  }

  handleGlobalError(message, url, lineNumber, column, errorObject) {
    if (errorObject && typeof errorObject === "string") {
      errorObject = {
        message: errorObject,
      };
    }
    let displayErrorMessage = "";
    displayErrorMessage = displayErrorMessage + "url : " + url + "\n";
    displayErrorMessage =
      displayErrorMessage + "lineNumber : " + lineNumber + "\n";
    displayErrorMessage = displayErrorMessage + "column : " + column + "\n";
    displayErrorMessage =
      displayErrorMessage +
      "message : " +
      (errorObject && errorObject.message
        ? errorObject.message
        : "NO MESSAGE") +
      "\n";
    errorObject = errorObject || {};
    errorObject.message = displayErrorMessage;
    let appErrorObject = { message: errorObject.message };
    if (errorObject.stack) {
      appErrorObject.statck = errorObject.stack;
    }
    console.info("appErrorInfo : " + JSON.stringify(appErrorObject));
    return false;
  }

  init() {
    console.info("process.env : " + JSON.stringify(process.env));
    window.onerror = this.handleGlobalError;
  }

  changeInput(event, inputName) {
    this.setState({[inputName] : event.target.value});
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {}

  render() {
    let { socketUrl, isConnected, loginId, loginPassword, listenEventNameListString, currentEventName, currentEventResponse, viewListEvent } = this.state;
    return (
      <div>
        <div>
          {/* 연결정보 */}
          <div>
            <Divider orientation="left" style={{fontWeight: 'bold'}}>연결정보</Divider>
            <Row align="middle" gutter={6}>
              <Col span={2} align="" style={{textAlign: 'right'}}>
                소켓 url
              </Col>
              <Col span={10}>
                <Input value={socketUrl} onChange={(e) => this.changeInput(e, "socketUrl")}/>
              </Col>
              <Col span={10}>
                <Button type="primary">연결</Button>
                {' '}
                <Button type="primary">URL 선택</Button>
                {' '}
                {isConnected ? <Tag color="#2db7f5">현재 상태 connected</Tag> : <Tag color="#f50">현재 상태 disconnected</Tag>}
              </Col>
            </Row>
            <Row align="middle" gutter={6} style={{marginTop: 10}}>
              <Col span={2} style={{textAlign: 'right'}}>
                로그인 ID
              </Col>
              <Col span={4}>
                <Input value={loginId} onChange={(e) => this.changeInput(e, "loginId")}/>
              </Col>
              <Col span={2} style={{textAlign: 'right'}}>
                암호
              </Col>
              <Col span={4}>
                <Input value={loginPassword} onChange={(e) => this.changeInput(e, "loginPassword")}/>
              </Col>
            </Row>
          </div>
          <div>
            <Divider orientation="left" style={{fontWeight: 'bold'}}>listen event 정보</Divider>
            <Row align="middle" gutter={6}>
              <Col span={2} align="" style={{textAlign: 'right'}}>
                  event
              </Col>
              <Col span={15}>
                <Tooltip placement="bottomLeft" title={", 구분자로 이벤트 등록 예시) join,message,payload"}>
                  <Input value={listenEventNameListString} onChange={(e) => this.changeInput(e, "listenEventNameListString")}/>
                </Tooltip>
                
              </Col>
              <Col span={4}>
                <Button type="primary">이벤트 등록</Button>
              </Col>
            </Row>
            <Row align="middle" gutter={6} style={{marginTop: 10, marginLeft: 10}}>
              <Col span={2} align="" style={{textAlign: 'right'}}>
                  현재 응답명 : <sapn style={{fontWeight: 'bold', fontSize: '18px'}}>{'"' + currentEventName + '"'}</sapn>
              </Col>
            </Row>
            <Row style={{marginLeft: 20, paddingTop: 10}}>
              <Col span={24}>
                <ReactJson displayDataTypes={false} onEdit={(info) => {
                  this.setState({currentEventResponse: info.updated_src});
                }} collapsed={false} src={currentEventResponse} indentWidth={10} theme="monokai" style={{width: '80%'}}/>
              </Col>
            </Row>
            <JSONInput
              placeholder={sampleData} // data to display
              theme="light_mitsuketa_tribute"
              locale={locale}
              colors={{
                string: "#DAA520" // overrides theme colors with whatever color value you want
              }}
              height="550px"
            />
          </div>
          <div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default App;
