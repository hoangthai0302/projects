import React from 'react'
import ReactDOM from 'react-dom';
import ReactSwipe from 'react-swipe';
 
class Carousel extends React.Component {
    render() {
        return (
            <ReactSwipe className="carousel" swipeOptions={{continuous: false}}>
                <div id="body">
                    <div id="explorer">
                        <div id="sidebar-explorer"></div>
                        <div id="sidebar-resizer" class="resizer"></div>
                        
                        <div style="flex-flow: column ; justify-content: flex-start; align-items: stretch; display: flex; width: 100%;">
                            <div id="tree-folder"></div>
                            <div class="status-bar">Menu Go here</div>
                        </div>
                    </div>
                    
                </div>
                <div>PANE 2</div>
                <div>PANE 3</div>
            </ReactSwipe>
        );
    }
}
 
ReactDOM.render(
    <Carousel />, 
    document.getElementById('app')
);