import { observable, action, configure, runInAction, computed } from 'mobx';


class RootStore {
    @observable name = 'thai';
}

export default new RootStore();