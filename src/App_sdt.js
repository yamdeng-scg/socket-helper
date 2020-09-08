import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";

class App extends Component {
  // history block 이벤트 핸들러 변수(clear 용도)
  historyBlockHandler = null;

  socket = null;

  constructor(props) {
    super(props);
    this.state = { messageList: [], inputValue: "" };
    this.init = this.init.bind(this);
    this.initSocket = this.initSocket.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.handleInputKeyboard = this.handleInputKeyboard.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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
    console.info("App init call");
    console.info("process.env : " + JSON.stringify(process.env));
    window.onerror = this.handleGlobalError;
    //localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8
    this.socket = io(
      "http://localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8"
    );
    //localhost:9090?prj=sdtalk&appid=sdtadm&cid=1&token=1aec31172508a8
    this.initSocket();
  }

  initSocket() {
    this.socket.on("connect", (msg) => {
      // debugger;
      console.info("socket connected!!!");
      setTimeout(() => {
        // this.socket.emit("join", { empid: 1, space: "66", speaker: 177 }, (err, res) => {
        //   debugger;
        // });
        axios
          .post("http://localhost:9090/auth/sdtalk/sdtadm/1/emp/login", {
            username: "csmaster1",
            password: "1212",
          })
          .then((response) => {
            debugger;
            let data = response.data;
            let token = data.token;
            // let user = data.user;
            this.socket.emit("login", {
              token:
                token,
            });
          });
      }, 2000);
    });

    this.socket.on("disconnect", (msg) => {
      debugger;
      console.info("socket disconnect!!!");
    });

    this.socket.on("connection_success", (msg) => {
      console.info("connected message : " + msg);
    });

    this.socket.on("join", (msg) => {
      debugger;
      console.info("join : " + msg);
    });

    this.socket.on("chat message", (message) => {
      this.addMessage(message);
    });
    // setTimeout(() => {
    //   // this.socket.emit("join", { empid: 1, space: "66", speaker: 177 });
    // }, 2000);
  }

  addMessage(message) {
    let { messageList } = this.state;
    this.setState({ messageList: messageList.concat(message) });
  }

  changeInput(event) {
    event.preventDefault();
    let value = event.target.value;
    this.setState({ inputValue: value });
  }

  handleInputKeyboard(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  sendMessage() {
    let { inputValue } = this.state;
    this.socket.emit("chat message", inputValue);
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {}

  render() {
    let { messageList, inputValue } = this.state;
    return (
      <div className="App">
        <ul>
          {messageList.map((message, index) => {
            return <li key={index}>{message}</li>;
          })}
        </ul>
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            autocomplete="off"
            onChange={this.changeInput}
            onKeyDown={this.handleInputKeyboard}
            value={inputValue}
          />
          <button type="button" onClick={this.sendMessage}>
            Send
          </button>
        </form>
      </div>
    );
  }
}

export default App;
