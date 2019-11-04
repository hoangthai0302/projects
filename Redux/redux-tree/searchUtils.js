import Utils from './utils.js'
import HintServices from './hintService.js'
import {COMMAND, LOCAL_STORAGE} from './constant.js'

function getFirstItem(parent, hint) {
    if (hint) {
        for (var i = 0; i < parent.children.length; i++) {
            var child = parent.children[i];
            if (child.name.toLowerCase().indexOf(hint) != -1) {
                return child;
            }
        }

    }
    return null;
}

var SearchUtils = {
    searchFolder(hint, command) {
        hint = hint.toLowerCase();
        var result = [];
        if (hint.trim().length == 0) return [];

        function runner(hint, data) {
            if (result.length > 20) return;
            if (data.type == 'folder') {
                for (var i = 0; i < data.children.length; i++) {

                    var child = data.children[i];
                    if (child.type == 'folder') {
                        if (child.name.toLowerCase().indexOf(hint) != -1) {
                            result.push({
                                name: child.name,
                                path: child.path,
                                type: child.type,
                                command: command
                            })
                        }
                        runner(hint, child);
                    }


                }
            }


        }
        var documents = Utils.getRootData();
        runner(hint, documents);
        return result;
    },
    searchFile(hint, data) {
        hint = hint.toLowerCase();
        var result = [];
        if (hint.trim().length == 0) return [];

        function runner(hint, data) {
            if (result.length > 20) return;
            if (data.type == 'folder') {
                for (var i = 0; i < data.children.length; i++) {

                    var child = data.children[i];
                    if (child.type == 'file') {
                        if (child.name.toLowerCase().indexOf(hint) != -1) {

                            result.push({
                                name: child.name,
                                path: child.path,
                                type: child.type
                            })
                        }
                    } else {
                        runner(hint, child);
                    }
                }
            }


        }
        runner(hint, data);
        return result;
    },
    search(hint) {
        var hintText;
        var that = this;
        var result = [];
        if (hint) {
            if (hint.startsWith('@') || hint.startsWith('!')) {
                var command = COMMAND.OPEN;
                hintText = HintServices.getHint(hint);
                if (hint.startsWith('!')) {
                    result = this.searchFolder(hintText, COMMAND.IMPORT)
                    command = COMMAND.IMPORT;
                }
                if (hint.startsWith('@')) {
                    result = this.searchFolder(hintText, COMMAND.OPEN)
                }
                if(result.length == 0){
                    return {children:result}
                }
                if (HintServices.isListingChildren(hint)) {
                    var firstItem = result[0];
                    var nextLevel = 0;

                    firstItem.level = nextLevel;
                    result = [];
                    result.push(firstItem);
                    var path = firstItem.path;
                    var folder = Utils.getFolder(path);


                    for (var i = 0; i < folder.children.length; i++) {
                        var child = folder.children[i];
                        var selected = i== 0;

                        result.push({
                            name: child.name,
                            path: child.path,
                            type: child.type,
                            level: 1,
                            command:command,
                            selected:selected
                        })
                    }

                    var subQuery = HintServices.getSubQuery(hint);
                    if (subQuery) {
                        result = [];
                        result.push(firstItem);
                        var hintArr = subQuery.split(':');
                        var parent = folder;
                        if(hintArr.length > 1){
                            for (let i = 0; i < hintArr.length - 1; i++) {
                                var subHint = hintArr[i];
                                if(subHint){
                                    let item = getFirstItem(parent, subHint);
                                    parent = item;
                                    if (parent) {
                                        nextLevel++;
                                        result.push({
                                            name: parent.name,
                                            path: parent.path,
                                            type: parent.type,
                                            level: nextLevel,
                                            command:command
                                        });
                                    }
                                }
                            }
                            
                        }
                        if (parent) {
                            nextLevel++;
                            if (parent.children) {
                                var selected = true;
                                for (let i = 0; i < parent.children.length; i++) {
                                    let child = parent.children[i];
                                    if (child.name.toLowerCase().indexOf(hintArr[hintArr.length - 1]) != -1) {
                                        result.push({
                                            name:child.name,
                                            path:child.path,
                                            type:child.type,
                                            level:nextLevel,
                                            command:command,
                                            selected:selected
                                        });
                                        selected = false;
                                    }
                                }

                            }
                        }




                    }
                }else{
                    result[0].selected = true;
                }

            }
            /*else{
                        if(window.currentPage =='workspace'){
                              var wsPath = LocalDataService.getWorkspacePath();
                              if(wsPath){
                                  var wsData = LocalDataService.getFolderData(wsPath);
                                  result = LocalDataService.searchFile(hint, wsData);
                              }
                          }else if(window.currentPage == 'notes'){
                            var notesFolder = LocalDataService.getNotesFolder();
                            var result = LocalDataService.searchFile(hint,notesFolder);
                          }else{
                              var explorerPath = LocalDataService.getCurrentExplorerPath();
                              if(explorerPath){
                                  var data = LocalDataService.getFolderData(explorerPath);
                                  result = LocalDataService.searchFile(hint, data);
                              }
                          }
                      }*/





        }
       /* if (result.length > 0) {
            result[0].selected = true; //select the first result
        }*/
        //get the first result
        localStorage.setItem(LOCAL_STORAGE.LAST_HINT, hint);
        return {children:result};
    }
}
export default SearchUtils;