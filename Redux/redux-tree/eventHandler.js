import Editors from './editors'
import Utils from './utils'
import {PAGE} from './constant'
import FileNameUtils from './fileNameUtils'
import {LOCAL_STORAGE} from './constant'

var EventHandler = {
    RENAME_NODE: function(nodeData, newName) {
        var deferred = $.Deferred();

        var path = nodeData.path;

        var postData = {
            path: path,
            newName: newName
        };
        $.ajax({
            url: '/api/file/rename',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function(data) {
                if (data.success) {
                    deferred.resolve({
                        success: true
                    });
                } else {
                    deferred.reject();
                }
            },
            error: function() {
                deferred.reject();
            }
        });

        return deferred.promise();
    },
    ON_ITEM_DOUBLE_CLICK(node) {
        if (node.type == 'file') {

            var filePath = node.path;
            if(FileNameUtils.isNotes(filePath)){
                $.get('/api/file?path=' + filePath, function(data) {
                    localStorage.setItem('notes_current_path', filePath);
                    //editor is the key for note data store in localStorage
                    localStorage.setItem('note-data', data);

                     window.loadSavedData(); //this function defined in example.js
                     window.openTab('#notes')
                })
              
                //ToDo: render json previewer
            }else

            if (FileNameUtils.isTextFile(filePath)) {
                if (window.currentPage == PAGE.WORKSPACE) {

                    this._openTextFile(node);
                }
                else {
                    alert('open text editor');
                }

            }


        }
    },
    _openTextFile(node) {
        var filePath = node.path;
        $.get('/api/file?path=' + filePath, function(data) {

            //findout if the tab is already open or not
            var $chromeTabsExampleShell = $('.chrome-tabs-shell');

            var pathId = Utils.generatePathId(filePath);
            var editorDiv = document.getElementById(pathId);
            if (!editorDiv) {
                chromeTabs.addNewTab($chromeTabsExampleShell, {
                    favicon: '',
                    title: node.name,
                    data: {
                        node: node
                    },
                    action: null,
                    callback: function(nodeData) {}
                });
                $('#editor >div').hide();
                addNewEditorAndRegisterEventCtrS(filePath);
                var pathId = Utils.generatePathId(filePath);

                Editors[pathId].setValue(data);
            } else {
                //loop to find the tab that match filePath
                $('.chrome-tab').each(function() {
                    var data = $(this).data().tabData.data;
                    if (data.node.path == filePath) {
                        var $tab = $(this);
                        //active the tab
                        chromeTabs.setCurrentTab($chromeTabsExampleShell, $tab, null);
                        //show the editor
                        $('#editor >div').hide();
                        $('#' + pathId).show();
                    }
                });
            }

        });
    },
    ADD_TO_WORKSPACE: function(nodeData) {

    }
}

export default EventHandler;