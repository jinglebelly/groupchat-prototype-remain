import React,{Component} from 'react'

// 用户名表单
class UsernameForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            username:'',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
// 提交新state.username 到APP.js
    onSubmit(e){
        e.preventDefault();
        this.props.onSubmit(this.state.username)
    }

// state.username变为表单输入值
    onChange(e){
        this.setState({username:e.target.value})
    }

    render(){
        return(
            <div>
                <div>
                    <h2>What is your username?</h2>
                    <form onSubmit={this.onSubmit}>
                        <input
                            type='text'
                            placeholder='your full name'
                            onChange={this.onChange}/>
                        <input type='submit'/>
                    </form>
                </div>
            </div>
        )
    }
}
export default UsernameForm
