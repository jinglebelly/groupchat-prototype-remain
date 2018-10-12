import React, { Component } from 'react'
import UsernameForm from './components/UsernameForm'
import ChatScreen from './ChatScreen'

//TODO: change url when router is changing
// - otherwise state is store when refreshing
// Solution
// - react-router - the most popular router lib so far   or
// - reach-router - smaller, seems more promising in future
// Advance (optional)
// - code splitting (webpack)
// Test case
// - what if a user directly type localhost:3000/chat without token (UX friendly)
class App extends Component {
    constructor() {
        super();
        this.state = {
            currentUsername: '',
            currentScreen: 'WhatIsYourUsernameScreen'
        };
        this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
    }

    // 向server发出post请求，此处username来自表单UsernameForm.js
    onUsernameSubmitted(username) {
        fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username}),
        })
            .then(response => {
                this.setState({
                    currentUsername: username,
                    currentScreen: 'ChatScreen'
                })
            })
            .catch(error => console.error('error', error))
    }

    render() {
        // 检查是否提交username，若没有 留在UsernameForm表单；若有 转到Chatscreen聊天界面
        if (this.state.currentScreen === 'WhatIsYourUsernameScreen') {
            return <UsernameForm onSubmit={this.onUsernameSubmitted}/>
        }
        if (this.state.currentScreen === 'ChatScreen') {
            return <ChatScreen currentUsername={this.state.currentUsername}/>
        }
    }
}
export default App


