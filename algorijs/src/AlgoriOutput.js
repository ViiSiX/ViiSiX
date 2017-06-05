import React from 'react'
import ReactDOM from 'react-dom'
import math from 'mathjs'


export class TeX extends React.Component{
    constructor (props) {
        super(props);

        MathJax.Hub.Config({
            tex2jax: props.tex2jax,
            showMathMenu: props.showMathMenu,
            showMathMenuMSIE: props.showMathMenuMSIE,
        });
    }

    componentDidMount () {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }

    componentDidUpdate () {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }

    render () {
        let to_display = math.parse(this.props.func).toTex();
        let b4_to_display = 'f(x';
        if (this.props.no_of_variable > 1) {
            b4_to_display += ',y'
        }
        if (this.props.no_of_variable > 2) {
            b4_to_display += ',z'
        }
        to_display = b4_to_display + ') = ' + to_display;
        return (
            <div className={ this.props.className }
            >{`$${to_display}$`}</div>
        )
    }
}

TeX.defaultProps = {
    showMathMenu: false,
    showMathMenuMSIE: false,
    tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
};
