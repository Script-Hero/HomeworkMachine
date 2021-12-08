import React from "react";
import './view.css';

export default class View extends React.Component {

    constructor(props){
        super(props);

        this.state = {data:JSON.parse(localStorage.getItem("completedData")), topic:JSON.parse(localStorage.getItem("data")).topic};
    }

    render(){

        let questionCards = [];
        let d = this.state.data;
        Object.keys(this.state.data).forEach(function(question){
            let cards = d[question];
            questionCards.push( <QuestionCard question={question} cardData={cards}/>)
        });
        console.log(this.state.data)
        return(
        <div id='view-container'>
            <div id='header'>
                <h1 id='header-text'>Answers for worksheet "{this.state.topic}"</h1>
            </div>
            <div id='question-column'>
               {questionCards}
            </div>
        </div>
        )
    }
}


class QuestionCard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            open : false
        }
        this.toggleVisible=this.toggleVisible.bind(this);
    }


        toggleVisible(){
            this.setState({open : !this.state.open})
        }

        /*
        this.props.cardData = [
            {confidence, term, definition}
        ]
        */

    render(){
        let answerBlurbs = [];
        for(let card of this.props.cardData){
            answerBlurbs.push(<AnswerBlurb term={card.term} definition={card.definition} />)
        }
        return (
        <div class={ this.state.open ? 'question-card-container open' : 'question-card-container closed'}>
            <div className='question-card' onClick={this.toggleVisible}>
                <h1 className='question-text'>{this.props.question}</h1>
            </div>
        <div className= {this.state.open ? 'blurb-section visible' : 'blurb-section hidden'}>
            {answerBlurbs}
        </div>
        </div>
        );
    }

}

class AnswerBlurb extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div class='blurb-container'>
                <div class='blurb'>
                    <div class='blurb-term-container'>
                        <p class='blurb-term'>{this.props.term}</p>
                    </div>
                    <div class='divider' />
                    <div class='blurb-definition-container'>
                        <p class='blurb-definition'>{this.props.definition}</p>
                    </div>
                </div>
            </div>
        )
    }
}