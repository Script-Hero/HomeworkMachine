import React from 'react';
import './submit.css';

export default class Submit extends React.Component {

    constructor(props){
        super(props);
        
        this.getState = this.props.getState.bind(this);
        this.go = this.go.bind(this);
    }
    go(){
        //console.log(this.getState())
        let state_ = this.getState()
        let important_info = {cards:state_['cards'].slice(0,-1), topic:state_['topic']}

        localStorage.setItem("data", JSON.stringify(important_info))
        localStorage.setItem("began", "false");
        window.location.href = '/loading'
    }
    render(){
        return (
            <div id='submit-container'>
                <div id='submit-box' onClick={this.go}>
                    <h1>Go</h1>
                </div>
            </div>
        )
    }
}