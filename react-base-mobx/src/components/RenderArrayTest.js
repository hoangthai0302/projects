import React from 'react';
import classnames from 'classnames';
import styled, { css } from 'styled-components';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

const Person = ({ name, age }) => {

    console.log('render :' + name);
    return (
        <div>
            <h3>{name}</h3>
            <label>age: {age}</label>
        </div>
    )
}

const PersonMemo = React.memo(Person);

@observer
class RenderArrayTest extends React.Component {

    @observable
    people = [
        {
            name: 'thai',
            age: 27
        },
        {
            name: 'tuan',
            age: 13
        },
        {
            name: 'cuong',
            age: 12
        },
        {
            name: 'binh',
            age: 115
        },
    ]

    @action
    onIncrease = (e) => {
        e.age = e.age + 1;
    }

    @action
    add = () => {
        this.people.push({
            name: 'hung',
            age: 16
        })
    }

    @action
    remove = () => {
        this.people = [
            {
                name: 'cuong',
                age: 12
            },
            {
                name: 'tuan',
                age: 13
            },
            {
                name: 'thai',
                age: 27
            },
        ]
    }

    render() {
        console.log('rerender list');
        return (
            <div>
                <button onClick={this.add}>Add</button>
                <button onClick={this.remove}>Remove</button>
                <div>
                    {
                        this.people.map(e => (
                            <Person key={e.name} 
                                name={e.name} age={e.age} />
                        ))
                    }
                </div>
            </div>
        );
    }
};

export default RenderArrayTest;

const Div = styled.div`
    display: flex;
    align-items: center;
    
`