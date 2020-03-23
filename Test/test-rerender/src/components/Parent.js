import React from 'react';

export default class Parent extends React.Component {

    componentWillUpdate(nextProps, nextState) {
        console.log('parent will update')
    }
    
    render() {
        const { data } = this.props;
        console.log('parent rerender')
        return <div>
            <div>Parent Name:{data.parentName}</div>
            <Child info={data.profile} />
                
        </div>
    }
}

class Child extends React.Component {

    // componentWillUpdate(nextProps, nextState) {
    //     console.log('child will update')
    // }
    
    render() {
        console.log('child  class component rerender')
        const { info } = this.props;
        return <div>
            <div>Child Name:{info.name}</div>
            <div>Child Age:{info.age}</div>
        </div>
    }
}