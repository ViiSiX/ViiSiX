import React from 'react'
import PropTypes from 'prop-types'


/********* _AlgoriInput_SubmitButton *********/
class _AlgoriInput_SubmitButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            input_submit_disabled: true
        };

        this.onInputChanged = this.onInputChanged.bind(this)
    }

    onInputChanged () {
        if (this.state.input_submit_disabled) {
            this.setState({
                input_submit_disabled: false
            })
        }
    }
}


/********* AlgoriInput *********/
export class AlgoriInput extends _AlgoriInput_SubmitButton {
    constructor (props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit () {
        this.props.valueSubmit(this.refs.input.value);
        this.setState({
            input_submit_disabled: true
        })
    }

    render () {
        let input_class = "col col-6 input";
        if (!this.props.leftAlign) {
            input_class += " right-align"
        }
        return (
            <div className={this.props.className}>
                <label className="label">{this.props.label}</label>
                <div className="clearfix">
                    <input className={input_class}
                           ref="input"
                           defaultValue={this.props.defaultValue}
                           onChange={this.onInputChanged}
                    />
                    <button className="col col-4 ml1 btn btn-primary black bg-yellow"
                            onClick={this.onSubmit}
                            disabled={this.state.input_submit_disabled}
                    >Submit</button>
                </div>
            </div>
        )
    }
}

AlgoriInput.propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    valueSubmit: PropTypes.func,
    leftAlign: PropTypes.bool
};

AlgoriInput.defaultProps = {
    leftAlign: true
};


/********* AlgoriCounter *********/
export class AlgoriCounter extends React.Component {
    constructor (props) {
        super(props);
        this.increaseCount = this.increaseCount.bind(this);
        this.decreaseCount = this.decreaseCount.bind(this);
    }

    increaseCount () {
        if (this.props.maxCount > 0) {
            if (this.props.count < this.props.maxCount) {
                this.props.doIncrease()
            }
        } else
        {
            this.props.doIncrease()
        }
    }

    decreaseCount () {
        if (this.props.count > this.props.minCount) {
            this.props.doDecrease()
        }
    }

    render () {
        return (
            <div className={this.props.className}>
                <label className="label">{ this.props.label }</label>
                <button onClick={ this.decreaseCount }
                        className="btn btn-primary black bg-yellow ml3"
                >-</button>
                <span className="countValue mx3">{ this.props.count }</span>
                <button onClick={ this.increaseCount }
                        className="btn btn-primary black bg-yellow"
                >+</button>
            </div>
        )
    }
}

AlgoriCounter.propTypes = {
    count: PropTypes.number,
    minCount: PropTypes.number,
    maxCount: PropTypes.number,
    label: PropTypes.string,
    doIncrease: PropTypes.func,
    doDecrease: PropTypes.func,
    className: PropTypes.string
};

AlgoriCounter.defaultProps = {
    defaultCount: 1,
    minCount: 0,
    maxCount: 0,
    label: ""
};


/********* AlgoriLimitSetter *********/
export class AlgoriLimitSetter extends _AlgoriInput_SubmitButton {
    constructor (props) {
        super(props);

        this.updateLimit = this.updateLimit.bind(this);
    }

    updateLimit (event) {
        this.props.handleChange(this.props.varName, {
            upper:  parseFloat(this.refs.upper.value),
            lower: parseFloat(this.refs.lower.value)
        });
        this.setState({
            input_submit_disabled: true
        })
    }

    render () {
        return(
            <div className={this.props.className}>
                <input className="col col-3 input left-align"
                       ref="lower"
                       defaultValue={this.props.lower}
                       onChange={this.onInputChanged}
                />
                <input className="col col-3 ml1 input right-align"
                       ref="upper"
                       defaultValue={this.props.upper}
                       onChange={this.onInputChanged}
                />
                <button className="col col-4 ml1 mb1 btn btn-primary black bg-yellow"
                        onClick={this.updateLimit}
                        disabled={this.state.input_submit_disabled}
                >Submit</button>
            </div>
        )
    }
}
AlgoriLimitSetter.propTypes = {
    varName: PropTypes.string,
    upper: PropTypes.number,
    lower: PropTypes.number,
    handleChange: PropTypes.func,
    className: PropTypes.string
};
AlgoriLimitSetter.defaultProps = {
    upper: 100.0,
    lower: -100.0
};


/********* AlgoriSwitch *********/
export class AlgoriSwitch extends React.Component {
    constructor (props) {
        super(props);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }
    prev () {
        this.props.chooseList.prev();
        this.props.onChange()
    }
    next () {
        this.props.chooseList.next();
        this.props.onChange()
    }
    render () {
        return (
            <div className={this.props.className}>
                <label className="label">{this.props.label}</label>
                <div className="switch">
                    <button className="btn btn-primary black bg-yellow ml3"
                            onClick={this.prev}
                    >&lt;</button>
                    <span className="mx3">{this.props.chooseList.current}</span>
                    <button className="btn btn-primary black bg-yellow"
                            onClick={this.next}
                    >&gt;</button>
                </div>
            </div>
        )
    }
}
AlgoriSwitch.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    chooseList: PropTypes.object,
    onChange: PropTypes.func
};
