import React from "react";
import "./card.css";

export default class Card extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            question: this.props.question,
            answers: this.props.answers,
            active:this.props.active
        }
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.answers !== this.state.answers) {
          this.setState({ answers: nextProps.answers });
        }
        if(nextProps.active !== this.state.active){
            this.setState({active:nextProps.active});
        }
      }

    render(){
        console.log(this.state.active)
        return (
            <div class='card'>
                <div id='active-circle' className={this.state.active?'visible' : 'hidden'}/>
                <div class='card-text'>
                    <h1 class='card-question'>{this.state.question}</h1>
                    <h2 class='card-answers'>Found {this.state.answers} answers.</h2>
                </div>
            </div>
        )
    }
}