import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Parent from './Parent';
class Home extends React.Component {

    state = {
        company: 'humax',
        parentName:'parent',
        profile: {
            name: 'danny',
            age: 16
        }
    }

    profile = {
        name: 'danny',
        age: 99
    }

    updateState = () => {
        this.setState({
            school: 'VinSchool',
            parentName:'parent2',
            profile: this.profile
        })
    }


    
    render() {

        return (
            <div>
                <button onClick={this.updateState}>Update state</button>
                <Parent data={this.state} />
                <Child1 data={this.profile} />
                <Child2 name={this.state.profile.name} age={this.state.profile.age} />
                <Child3 name={this.state.profile.name} age={this.state.profile.age} />
                <Child4Memo name={this.state.profile.name} age={this.state.profile.age} />
            </div>
        );
    }
};

export default Home;

class Child1 extends React.Component {
    // componentDidUpdate(nextProps, nextState) {
    //     console.log('child1 did update')
    // }
    
    render() {
        console.log('child 1 is class component rerender')
        const { data } = this.props;
        return <div>
            <div>Child1 Name:{data.name}</div>
            <div>Child1 Age:{data.age}</div>
        </div>
    }
}
class Child2 extends React.PureComponent {
    // componentDidUpdate(nextProps, nextState) {
    //     console.log('child2 did update')
    // }
    
    render() {
        console.log('child2 uses PureComponent rerender')
        const { name, age } = this.props;
        return <div>
            <div>Child2 Name:{name}</div>
            <div>Child2 Age:{age}</div>
        </div>
    }
}

const Child3 = ({ name, age}) => {
    console.log('child3  stateless component rerender')
    return <div>
            <div>Child3 Name:{name}</div>
            <div>Child3 Age:{age}</div>
        </div>
}

const Child4Memo = React.memo(
    ({ name, age}) => {
        console.log('child 4 use memo rerender')
        return (
          <div>
              <div>Child4 Name:{name}</div>
              <div>Child4 Age:{age}</div>
          </div>
        )
    }
)