import React from 'react';
import { BrowserRouter, Route, Switch, NavLink, withRouter } from 'react-router-dom';
import { observable, action, configure, runInAction, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import routes from 'routes';

@inject('rootStore')
@observer
class App extends React.Component {
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