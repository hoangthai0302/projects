import React from 'react';
import logo from './logo.svg';
import './App.css';
import { observable, action, configure, runInAction, computed } from 'mobx';
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
class App extends React.Component {
    render() {
        const { rootStore } = this.props;
        return (
            <div>
                {rootStore.name}
            </div>
        )
    }
}


export default App;