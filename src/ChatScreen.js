import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit'

import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import TypingIndicator from './components/TypingIndicator'
import WhosOnlineList from './components/WhosOnlineList'

class ChatScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersWhoAreTyping: [],
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
    }

// ！！显示打字状态  一调用就’TypeError: this.state.currentUser.isTypingIn is not a function‘
    sendTypingEvent() {
        this.state.currentUser
            .isTypingIn({roomId:this.state.currentRoom.id})
            .catch(error => console.error('error', error))
    }

// ！！发送消息  跳过sendTypingEvent还是一调用就’not a function error‘
    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id,
        })
    }


    componentDidMount () {
        // TODO: state management
        // problem - before requested data arrvied or request failed, the UI not showing properly
        // solution - showing loading or failed UI

        // Next (optional):
        // - redux
        // - mobx

        // 初始化chatkit
        // ！！此处显示‘unresolved type ChatManager’和‘unresolved type TokenProvider’ ，是否Chatkit没有import成功
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:4ef37692-231e-428b-909f-fcbb250b7be1',
            userId: this.props.currentUsername,
            tokenExpiry: 86000,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'http://localhost:3001/authenticate',
            }),
        });


// connect to chatkit
        chatManager
            .connect()
            .then(currentUser => {
                console.log('get user', currentUser)
                this.setState({ currentUser })/*这是啥操作 直接就给currentUser赋值了？*/
                return currentUser.subscribeToRoom({
                    roomId:17524976,
                    messageLimit:100,
                    hooks:{
                        // ？？onNewMessage called in real-time each time a new message arrives
                        onNewMessage:message =>{
                        this.setState({
                            messages:[...this.state.messages,message],
                        })
                        },
                        onUserStartedTyping:user => {
                            this.setState({
                                usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                            })
                        },
                        onUserStoppedTyping:user => {
                        this.setState({
                            usersWhoAreTyping:this.state.usersWhoAreTyping.filter(
                                username => username !== user.name
                            ),
                        })
                        },
                        onUserCameOnline: () => this.forceUpdate(),
                        onUserWentOffline: () => this.forceUpdate(),
                        onUserJoined: () => this.forceUpdate(),
                    },
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom })
            })

            .catch(error => console.error('connet auth failed', error))
    }

    render() {
        const styles = {
            container: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            },
            chatContainer: {
                display: 'flex',
                flex: 1,
            },
            whosOnlineListContainer: {
                width: '300px',
                flex: 'none',
                padding: 20,
                backgroundColor: '#2c303b',
                color: 'white',
            },
            chatListContainer: {
                padding: 20,
                width: '85%',
                display: 'flex',
                flexDirection: 'column',
            },
        }

        return (
            <div style={styles.container}>
                <header style={styles.header}>
                    <h2>Chatly</h2>
                </header>

                <div style={styles.chatContainer}>
                    <aside style={styles.whosOnlineListContainer}>
                        {/*打死不显示！！用户在线列表*/}
                        <WhosOnlineList
                            currentUser={this.state.currentUser}
                            users={this.state.currentRoom.users}
                            />
                    </aside>
                    <section style={styles.chatListContainer}>
                        {/*对话框*/}
                        <MessageList
                            messages={this.state.messages}
                            style={styles.chatList} /*styles没有找到chatList*/
                        />
                        {/*打字状态提示*/}
                        <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                        {/*消息输入框*/}
                        <SendMessageForm
                            onSubmit={this.sendMessage}
                            onChange={this.sendTypingEvent}
                        />
                    </section>
                </div>
            </div>
        )
    }
}

export default ChatScreen

