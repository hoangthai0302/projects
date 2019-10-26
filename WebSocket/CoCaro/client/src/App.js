import React from 'react';
import logo from './logo.svg';
import './App.css';
import { observable, action, configure, runInAction, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Msg from 'constants/Msg';

@inject('rootStore')
@observer
class App extends React.Component {

    @observable msg = '';

    @action
    onChangeMsg = e => {
        this.msg = e.target.value;
    }

    @action
    onKeyDown = e => {
        if(e.keyCode === 13) {
            this.props.ws.chatToPublic(this.msg);
            this.msg = '';
        }
    }
    
    render() {
        const { rootStore, ws: { clients } } = this.props;

        return (
            <div>
                {
                    clients.map(c => {
                        return (
                            <div>{c.clientID}</div>
                        )
                    })
                }
                <div id="msg_log"></div>
                <input type="text" onKeyDown={this.onKeyDown} value={this.msg} onChange={this.onChangeMsg} ></input>
            </div>
        )
    }
}


export default App;