import React, { Component } from 'react';
import firebase from 'firebase'
import '../stylesheets/ChatStyles.css'

class ChatContainer extends Component{

	constructor(props){
		super(props)
		this.state = {
			userId: "",
			handle: "Anon",
			text: "",
			messages: [],
			users: []
		}
	}
	
	componentDidMount(){
		var config = {
			apiKey: "AIzaSyABTZhpAfL1RnBf_4lE2Vix38gaksYYmos",
			authDomain: "chat-app-f4ec0.firebaseapp.com",
			databaseURL: "https://chat-app-f4ec0.firebaseio.com",
			projectId: "chat-app-f4ec0",
			storageBucket: "chat-app-f4ec0.appspot.com",
			messagingSenderId: "132611912217"
    	};
		firebase.initializeApp(config);
		this.setupUser();
		this.retrieveMessages();
		this.retrieveUsers();
	}
	
	setupUser = () => {
		let userKey = firebase.database().ref('users/');
		const user = {user: this.state.handle};
		userKey.push(user)
			.then(res => {
				this.setState({
					userId: res.key
				});
				let disconnect = firebase.database().ref('users/' + res.key);
				disconnect.onDisconnect().remove();
		});
	}

	retrieveUsers = () => {
		firebase.database().ref('users/').on('value', (snapshot) => {
			let incUsers = [];
			if(snapshot !== null){
				snapshot.forEach(index => {
					let users = index.val();
					incUsers.push({id:index.key, handle: users.user});
				});
				this.setState({users: incUsers});
			}
		});
	}

	onSubmit = (event) => {
		if((event.charCode === 13 || event.type === 'click') && this.state.text.trim() !== ""){
			const nextMessage = {
				handle: this.state.handle,
				message: this.state.text
			};
			let ref = firebase.database().ref('messages/')
			ref.push(nextMessage)
				.then(res => {
					this.setState({text: ""})
					this.chatTextfield.value = ""
				});
		}
	}

	retrieveMessages = () => {
		firebase.database().ref('messages/').on('value', (snapshot) => {
			let incMessages = [];
			snapshot.forEach(index => {
				let msg = index.val();
				incMessages.push({id:index.key, message: msg.message, handle: msg.handle});
			});
			this.setState({messages: incMessages}, () => {
				this.bottom.scrollIntoView({behavior:"smooth"});
			});
		});
	}

	changeHandle = (event) => {
		if((event.charCode === 13 || event.type === 'click') && this.handle.value !== ""){
			const updateHandle = {
				user: this.handle.value
			};
			let update = firebase.database().ref('users/' + this.state.userId);
			update.update(updateHandle);
			this.setState({handle: this.handle.value});
		}
	}

	updateText = (event) => {
	//	console.log("update: " + event.target.value);
		this.setState({
			text: event.target.value
		});
	}

	renderChat = () => (
		this.state.messages.map((message, i) => {
			return (
				<li className=""
					key={message.id}
				> {message.handle + ": " + message.message} 
				</li>
			)
		})
	)

	renderUsers = () => (
		this.state.users.map((user, i) => {
			return (
				<li className=""
					key={user.id}
				> {user.handle } 
				</li>
			)
		})
	)

	render(){
		return(
			<div id="chat-root">
				<input type="text" onKeyPress={this.changeHandle} ref={el => this.handle = el}/>
				<button onClick={this.changeHandle}>Change Handle</button>
				<div>
				<div ref={ (el) => {this.scrollBottom = el}} id="message-container">
					<ul className="message-style">
						{this.renderChat()}
					</ul>	
					<div ref={el => this.bottom = el}></div>
				</div>
				<div id="user-container">
					<ul className="message-style">
						{this.renderUsers()}
					</ul>
				</div>
				<div>
					<textarea  ref={el => this.chatTextfield = el}
								type="text" 
								placeholder="Type here..." 
								className="message-box"
								autoFocus
								onChange={(event) => this.updateText(event)} 
								onKeyPress={(event) => this.onSubmit(event)}
					></textarea>	
					<span>
					<button className="button" onClick={(event) => this.onSubmit(event)}>Send</button>
					</span>
				</div>
				</div>
				
							
			</div>

		);
	}
}
export default ChatContainer;