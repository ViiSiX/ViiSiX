import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as Util from './AlgoriUtil'
import { TeX } from './AlgoriOutput'
import { AlgoriInput, AlgoriCounter, AlgoriLimitSetter, AlgoriSwitch }  from './AlgoriInput'
import math from "mathjs";


let default_function = "2*x*sin(x^2)";
let minMaxObj = new Util.LoopQueue(['Max', 'Min']);


function pso_math_func_validate (math_func) {
    return math.parse(math_func).compile();
}


function pso_better_compare (value, target, is_max=true) {
    if (target === null) {
        return true
    }
    if (is_max) {
        return value > target
    } else {
        return value < target
    }
}


function pso_check_constraint (position, pso_input) {
    for (let dimension in position) {
        if (position[dimension] < pso_input.variables[dimension].lower ||
            position[dimension] > pso_input.variables[dimension].upper
        ) {
            return false
        }
    }
    return true
}


function pso_update_velocity (c1, c2, g_best, particle) {
    let velocity = {};
    let r1 = math.random();
    let r2 = math.random();
    for (let dimension in particle.velocity) {
        let d_v1 = c1*r1*(particle.local_best.position[dimension] - particle.position[dimension]);
        let d_v2 = c2*r2*(g_best.position[dimension] - particle.position[dimension]);

        velocity[dimension] = particle.velocity[dimension] + d_v1 + d_v2;
    }
    particle.velocity = velocity;
}


function pso_reduce_velocity (particle) {
    for (let dimension in particle.velocity) {
        particle.velocity[dimension] = particle.velocity[dimension]/2
    }
}


function pso_update_position (particle) {
    let new_position = {};
    for (let dimension in particle.position) {
        new_position[dimension] = particle.position[dimension] + particle.velocity[dimension]
    }
    return new_position
}


function pso_init (pso_input, math_func) {
    // Randomly generate n particles
    let particles = [];
    let global_best = {position: {}, value: null};
    for (let i = 0; i < pso_input.no_of_particles; i++) {
        let particle = {
            position: {},
            velocity: {},
            local_best: {}
        };
        for (let variable_name in pso_input.variables) {
            particle.position[variable_name] = math.random(
                pso_input.variables[variable_name].lower,
                pso_input.variables[variable_name].upper
            );
            particle.velocity[variable_name] = pso_input.c1*math.random()
        }
        particle.value = math_func.eval(particle.position);
        particle.local_best.position = Util.deep_copy(particle.position);
        particle.local_best.value = Util.deep_copy(particle.value);
        if (pso_better_compare(particle.value, global_best.value, pso_input.findingMax)) {
            global_best.position = Util.deep_copy(particle.position);
            global_best.value = particle.value
        }
        particles.push(particle)
    }
    return {particles, global_best}
}


function pso_iteration_run (pso_input, math_func, last_iteration_set) {
    let n_global_best = Util.deep_copy(last_iteration_set.global_best);
    for (let i in last_iteration_set.particles) {
        let particle = last_iteration_set.particles[i];
        pso_update_velocity(pso_input.c1, pso_input.c2, last_iteration_set.global_best, particle);
        let new_position = pso_update_position(particle);
        while (!pso_check_constraint(new_position, pso_input)) {
            pso_reduce_velocity(particle);
            new_position = pso_update_position(particle)
        }
        particle.position = new_position;
        particle.value = math_func.eval(particle.position);
        if (pso_better_compare(particle.value, particle.local_best.value, pso_input.findingMax)) {
            particle.local_best.position = Util.deep_copy(particle.position);
            particle.local_best.value = particle.value
        }
        if (pso_better_compare(particle.value, n_global_best.value, pso_input.findingMax)) {
            n_global_best.position = Util.deep_copy(particle.position);
            n_global_best.value = particle.value
        }
    }
    last_iteration_set.global_best = n_global_best
}


class FunctionInput extends React.Component {
    render () {
        return (
            <div className={this.props.className}>
                <label htmlFor="func"
                       className="label">Function</label>
                <input id="func" type="text"
                       defaultValue={ this.props.func }
                       onChange={ this.props.handleChange }
                       className="input"/>
            </div>
        )
    }
}


class VariablesConfig extends React.Component {
    render () {
        let variables_components = [];
        for(let key in this.props.variables) {
            variables_components.push(
                <li className="block" key={key}>
                    <span className="bold ml1">{key}</span>
                    <AlgoriLimitSetter className="clearfix"
                                       varName={key}
                                       upper={this.props.variables[key].upper}
                                       lower={this.props.variables[key].lower}
                                       handleChange={this.props.handleChange}
                    />
                </li>
            )
        }
        return (
            <div className={this.props.className}>
                <label className="label">Variable Config</label>
                <div className="block ml3">
                    {variables_components}
                </div>
            </div>
        )
    }
}


class PSO_Input extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            math_func: props.func,
            no_of_variable: 1,
            no_of_particles: 10,
            variables: {
                x: {
                    upper: 3,
                    lower: -3
                }
            },
            c1: 2,
            c2: 2,
            iterSteps: 20,
            findingMax: minMaxObj.current === 'Max'
        };
        this.handleChangeFunc = this.handleChangeFunc.bind(this);
        this.handleIncreaseVariables = this.handleIncreaseVariables.bind(this);
        this.handleDecreaseVariables = this.handleDecreaseVariables.bind(this);
        this.handleConfigVariable = this.handleConfigVariable.bind(this);
        this.handleIncreaseParticles = this.handleIncreaseParticles.bind(this);
        this.handleDecreaseParticles = this.handleDecreaseParticles.bind(this);
        this.handleC1Change = this.handleC1Change.bind(this);
        this.handleC2Change = this.handleC2Change.bind(this);
        this.handleIterStepsChange = this.handleIterStepsChange.bind(this);
        this.handleFindingChange = this.handleFindingChange.bind(this);
        this.runFunc = this.runFunc.bind(this);
    }

    runFunc () {
        this.props.runFunc({
            math_func: this.state.math_func,
            variables: Util.deep_copy(this.state.variables),
            no_of_particles: this.state.no_of_particles,
            c1: this.state.c1,
            c2: this.state.c2,
            iterSteps: this.state.iterSteps,
            findingMax: this.state.findingMax
        })
    }

    handleChangeFunc (event) {
        try {
            math.parse(event.target.value).toTex();
            this.setState({
                math_func: event.target.value
            })
        }
        catch(err){}
    }

    handleIncreaseVariables () {
        let variables = Util.deep_copy(this.state.variables);
        if (typeof variables.y === "undefined"){
            variables.y = {
                upper: 100,
                lower: -100
            }
        } else if (typeof variables.z === "undefined"){
            variables.z = {
                upper: 100,
                lower: -100
            }
        }
        this.setState({
            no_of_variable: this.state.no_of_variable + 1,
            variables: variables
        })
    }

    handleDecreaseVariables () {
        let variables = Util.deep_copy(this.state.variables);
        if (typeof variables.z !== "undefined") {
            delete variables.z
        } else if (typeof variables.y !== "undefined") {
            delete variables.y
        }
        this.setState({
            no_of_variable: this.state.no_of_variable - 1,
            variables: variables
        })
    }

    handleIncreaseParticles () {
        this.setState({
            no_of_particles: this.state.no_of_particles + 1,
        })
    }

    handleDecreaseParticles () {
        this.setState({
            no_of_particles: this.state.no_of_particles - 1,
        })
    }

    handleConfigVariable (key, values) {
        let variables = Util.deep_copy(this.state.variables);
        variables[key] = values;
        this.setState({
            variables: variables
        })
    }

    handleC1Change (value) {
        this.setState({
            c1: parseFloat(value)
        })
    }

    handleC2Change (value) {
        this.setState({
            c2: parseFloat(value)
        })
    }

    handleIterStepsChange (value) {
        this.setState({
            iterSteps: parseInt(value)
        })
    }

    handleFindingChange () {
        this.setState({
            findingMax: minMaxObj.current === 'Max'
        })
    }

    render () {
        let standard_class_name = "mx1 sm-col-6 mb1";
        return (
            <div>
                <h3>Input</h3>
                <h4>Function</h4>
                <AlgoriCounter
                    count={ this.state.no_of_variable }
                    label="Number of variable (max: 3)"
                    maxCount={3}
                    minCount={1}
                    className={standard_class_name}
                    doIncrease={ this.handleIncreaseVariables }
                    doDecrease={ this.handleDecreaseVariables }
                />
                <VariablesConfig no_of_variable={this.state.no_of_variable}
                                 variables={this.state.variables}
                                 handleChange={this.handleConfigVariable}
                                 className={standard_class_name}
                />
                <AlgoriSwitch
                    className={standard_class_name}
                    label="Finding"
                    chooseList={minMaxObj}
                    onChange={this.handleFindingChange}
                />
                <FunctionInput func={ this.props.func }
                               handleChange={ this.handleChangeFunc }
                               className={standard_class_name}
                />
                <TeX className="algori-func mb1"
                     func={this.state.math_func}
                     no_of_variable={this.state.no_of_variable}
                />
                <h4>PSO attributes</h4>
                <AlgoriCounter
                    count={ this.state.no_of_particles }
                    label="Number of particles (max: 50)"
                    maxCount={50}
                    minCount={1}
                    className={standard_class_name}
                    doIncrease={ this.handleIncreaseParticles }
                    doDecrease={ this.handleDecreaseParticles }
                />
                <AlgoriInput className={ standard_class_name }
                             label="Learning factors c1"
                             valueSubmit={ this.handleC1Change }
                             defaultValue={this.state.c1}
                             leftAlign={false}
                />
                <AlgoriInput className={ standard_class_name }
                             label="Learning factors c2"
                             valueSubmit={ this.handleC2Change }
                             defaultValue={this.state.c2}
                             leftAlign={false}
                />
                <AlgoriInput className={ standard_class_name }
                             label="Iteration steps"
                             valueSubmit={ this.handleIterStepsChange }
                             defaultValue={ this.state.iterSteps }
                             leftAlign={false}
                />
                <div className="center">
                    <button className="btn btn-big bg-olive"
                            onClick={this.runFunc}
                    >Start Running</button>
                </div>
            </div>
        )
    }
}

PSO_Input.propsType = {
    runFunc: PropTypes.func
};


class PSO_Result extends React.Component {
    render () {
        let positions = [];
        for (let dimension in this.props.result.position) {
            positions.push(
                <label className="label" key={dimension}>{dimension} = {this.props.result.position[dimension]}</label>
            )
        }
        return (
            <div>
                <h3>Result</h3>
                <div className="ml3">
                    {positions}
                    <label className="label">=&gt; {this.props.result.value}</label>
                </div>
            </div>
        )
    }
}


class PSO_Demo extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            running: false
        };

        this.run = this.run.bind(this)
    }

    run (pso_input) {
        let complied_math_func = pso_math_func_validate(pso_input.math_func);
        let pso_iteration_set = pso_init(pso_input, complied_math_func);
        for (let i = 0; i < pso_input.iterSteps; i++) {
            pso_iteration_run(pso_input, complied_math_func, pso_iteration_set);
        }

        this.setState({
            haveResult: true,
            result: pso_iteration_set.global_best
        })
    }

    render () {
        let run_node = null;
        if (this.state.haveResult) {
            run_node = <PSO_Result result={this.state.result}/>
        }
        return (
            <div className="algori-demo mb3">
                <h2>Demonstration</h2>
                <PSO_Input func={this.props.func}
                           runFunc={this.run}
                />
                {run_node}
            </div>
        )
    }
}


ReactDOM.render(<PSO_Demo func={ default_function }/>, document.getElementById("algori-demo"));
