import React from 'react';
import { BrowserRouter, Route, Switch, NavLink, withRouter } from 'react-router-dom';
import { observable, action, configure, runInAction, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import routes from 'routes';
import io from 'socket.io-client';
@inject('rootStore')
@observer
class App extends React.Component {
	constructor(props) {
		super(props);
		const socket = io('http://localhost:5000')

		socket.on('connect', () => {
			console.log(socket.id); // 'G5p5...'
		  });

		socket.on('get_room_list', data => {
			console.log(data);
		})
		socket.on('error', function (err) {
			console.log('received socket error:')
			console.log(err)
		})
	}
    render() {
        const { rootStore } = this.props;
        return (
            <div>
				<BrowserRouter>
					<Switch>
						{
							routes.map((route, index) => {
								return <Route exact={route.exact} path={`${route.path}`} component={route.component} key={index} />;
							})
						}
					</Switch>
				</BrowserRouter>
            </div>
        )
    }
}


export default App;