import React from 'react';
import './input_box.css';


export default class InputBox extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            content:""
        }
        // this.props.sendBack(this.props.index, content)
        this.updateContent = this.updateContent.bind(this);
        //this.sendBack = this.props.sendBack.bind(this);
        //this.updateContent = this.updateContent.bind(this);
    }

/*


*/
    updateContent(event){
        let text = event.target.value;
        console.log(this.props.index)
        this.props.sendBack(this.props.index, text);
    }

    render(){
        console.log(this.props)
        return (
            <div class='input_box'>
                <input class='input_box_input' onChange={this.updateContent} placeholder={"Question #" + this.props.questionNumber}></input>
            </div>
        )
    }
}