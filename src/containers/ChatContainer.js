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
		let userKey = firebase.database().ref('users/')
		const user = {user: this.state.handle}
		userKey.push(user)
			.then(res => {
				this.setState({
					userId: res.key
				})
				let disconnect = firebase.database().ref('users/' + res.key)
				disconnect.onDisconnect().remove();
		})
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
		})
	}

	onEnterSubmit = (event) => {
		if(event.charCode === 13 && this.state.text.trim() !== ""){
			const nextMessage = {
				handle: this.state.handle,
				message: this.state.text
			}
			let ref = firebase.database().ref('messages/')
			ref.push(nextMessage)
				.then(res => {
					console.log(res.key);
				});
			this.setState({text: ""})
			event.target.value = ""
		}

	}
	onSubmit = (event) => {
		console.log("submit: " + this.state.text);
		if(this.state.text.trim() !== ""){
			const nextMessage = {
				handle: this.state.handle,
				message: this.state.text
			}
			let ref = firebase.database().ref('messages/')
			ref.push(nextMessage)
				.then(res => {
					console.log(res.key);
				});
			
			this.setState({text: ""})
			this.refs.chatTextfield.value = ""
		}
	}

	retrieveMessages = () => {
		firebase.database().ref('messages/').on('value', (snapshot) => {
			let incMessages = [];
			snapshot.forEach(index => {
				let msg = index.val();
				incMessages.push({id:index.key, message: msg.message, handle: msg.handle});
			});
			this.setState({messages: incMessages});
			this.scrollBottom.scrollIntoView({behavior:"smooth"});
		})
		//console.log(this.scrollBottom)
		
	}
	updateText = (event) => {
		console.log("update: " + event.target.value);
		this.setState({
			text: event.target.value
		})
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

	changeHandle = (event) => {
		if(event.charCode === 13 && event.target.value.trim() !== ""){
			const updateHandle = {
				user: event.target.value
			}
			let update = firebase.database().ref('users/' + this.state.userId)
			update.update(updateHandle)
			this.setState({handle: event.target.value})
		}
	}

	render(){
		return(
			<div>
				<input type="text" onKeyPress={this.changeHandle} ref="handle"/>
				<button >Change Handle</button>
				<div id="message-container">
					<ul className="message-style">
						{this.renderChat()}
					</ul>	
					<span ref={ el => this.scrollBottom = el}></span>
				</div>
				<input  ref="chatTextfield"
								type="text" 
								placeholder="Type here..." 
								onChange={(event) => this.updateText(event)} 
								onKeyPress={(event) => this.onEnterSubmit(event)}
				></input>
				<button onClick={(event) => this.onSubmit(event)}>submit</button>
				<div>
					<ul className="message-style">
						{this.renderUsers()}
					</ul>
				</div>				
			</div>

		);
	}
}
export default ChatContainer;