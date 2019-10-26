import { observable, action, configure, runInAction, computed } from 'mobx';

class RootStore {
    
    constructor() {
        this.ws = new WsStore(this);
    }

    @observable name = 'thai';
    
}

export default new RootStore();