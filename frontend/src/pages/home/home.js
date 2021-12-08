import React from 'react';
import './home.css';
import InputBox from './input_box';
import Submit from './submit';

export default class Home extends React.Component {

    constructor(props){
        super(props)

        this.handleTopicChange = this.handleTopicChange.bind(this);
        this.updateCardValue = this.updateCardValue.bind(this);
        this.addBox = this.addBox.bind(this);
        this.removeLastBox = this.removeLastBox.bind(this);
        this.getState = this.getState.bind(this);

        this.state = {
            topic:"",
            cards:[""],
            boxes : [<InputBox index={0} sendBack={this.updateCardValue} key={0} questionNumber={1}/>]
        }


        for(let i = 0; i < 5; i++){
            this.addBox();
        }
    }

    addBox(){
        let n = this.state.cards.length;

        let newBox = <InputBox index={n} key={n} sendBack={this.updateCardValue} questionNumber={this.state.boxes.length+1}/>
        console.log(this.state)
        this.setState({
            boxes:[...this.state.boxes, newBox],
            cards:[...this.state.cards, ""]
        })
    }

    removeLastBox() {
        this.setState({
            boxes:this.state.boxes.slice(0,-1),
            cards:this.state.cards.slice(0,-1)
        })
    }

    handleTopicChange(event){
        this.setState({topic:event.target.value});
    }

    updateCardValue(index, content){
        let c = this.state.cards;
        console.log(this.state);
        c[index]=content;
        this.setState({cards:c});
    }

    getState(){
        return this.state;
    }

    render(){
        
        
        if(this.state.cards[this.state.cards.length-1] !== ""){
            this.addBox();
        }

        if(this.state.cards[this.state.cards.length-2] === ""){
            this.removeLastBox();
        }

        return (
            <div id='page-container'>
                <div id='header-container'>
                    <input autoComplete="off" placeholder='Worksheet Title' id='topic-input' value={this.state.value} onChange={this.handleTopicChange}></input>
                </div>
                <div id='inputs-container'>
                    {this.state.boxes}
                </div>

                <Submit getState={this.getState}/>
            </div>
        )
    }
}