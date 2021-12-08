import React from 'react';
import io from 'socket.io-client';

import Card from './card';

import './load.css'

export default class Load extends React.Component{
    constructor(props){
        super(props);
        this.state={
            topic:"",
            answers:0,
            answersTracker:[],
            activeIndex:0,
            data:{topic:"", cards:[]}
        }
    }
    componentDidMount(){
        this.data = this.formatData(JSON.parse(localStorage.getItem("data"))) // {topic, cards : [strings]}
        let answersTracker = [];
        for(let i = 0; i < this.data.cards.length; i++){
            answersTracker.push(0);
        }
        this.setState({topic:this.data.topic, answersTracker, data:this.data})

        this.socket = io("localhost:5000");
        
        let began = localStorage.getItem("began") === 'true';
        if(!began){
            this.socket.emit("search", this.data); // this sends
            localStorage.setItem("began","true");
        }

        this.socket.on("received", ()=>{
            console.log("Beginning search")
        })

        this.socket.on("found", question_index =>{
            console.log("Found answer for question " + question_index)
            let answersTracker = this.state.answersTracker;
            answersTracker[question_index] += 1;
            this.setState(answersTracker);
        })

        this.socket.on("complete", data =>{
            console.log(data)
            localStorage.setItem("completedData", JSON.stringify(data))
            window.location.href = '/view'
        })

        this.socket.on("starting_question", question_index => {
            console.log("Starting question: " + question_index);
            this.setState({activeIndex:question_index})
        })

        this.socket.on("starting_set", set_number => {
            console.log("Looking at set " + set_number)            
        })


    }

    formatData(data){
        let cards = []
        for(let c in data.cards){
            cards.push({topic:data.topic, question:data.cards[c]});
        }   
        return {'cards' : cards, 'topic':data.topic};
    }

    trunacteText(text, length){
        let truncStr = text.substring(0, Math.min(length,text.length));
        if(text.length > length){
            truncStr += "...";
        }
        return truncStr;
    }

    render(){
        let cardElements = [];
        let i = 0;
            for(let c of this.state.data.cards){

                cardElements.push(
                    <Card question={this.trunacteText(c.question, 40)} answers={this.state.answersTracker[i]} active={i == this.state.activeIndex} />
                );
               
                
                i++;
            }
        

        console.log(this.state)
        return (
            <div id='container'>
                <div id='header'>
                    <h1 id='header-text'>Searching worksheet: {this.state.topic}</h1>
                </div>
                <div id='cards-container'>
                    {cardElements}

                </div>
            </div>
        );
    }
}