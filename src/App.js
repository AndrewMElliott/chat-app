import React, { Component } from 'react';
import logo from './logo.svg';
import ChatContainer from './containers/ChatContainer';
//import firebase from "firebase";
import './App.css';
class App extends Component {

  
  render() {
    return (
      <div className="App">
       <ChatContainer/>
      </div>
    );
  }
}

export default App;
