import Editors from './editors'
import Utils from './utils'
import {PAGE} from './constant'

var ActionHandlers = {
	onItemDoubleClick(node){
		if(node.type=='file'){

                var filePath = node.path;
                if(FileNameUtils.isTextFile(filePath)){
                	if(window.currentPage == PAGE.WORKSPACE)	
                		this._openTextFile(node);
                	if(window.currentPage == PAGE.EXPLORER)
                		alert('open text editor');
                }
                
                
            }
	},
	_openTextFile(node){
		var filePath = node.path;
		$.get('/api/file?path=' +filePath,function(data){
                    
                    //findout if the tab is already open or not
                        var $chromeTabsExampleShell = $('.chrome-tabs-shell');

                        var pathId = Utils.generatePathId(filePath);
                        var editorDiv = document.getElementById(pathId);
                        if(!editorDiv){
                            chromeTabs.addNewTab($chromeTabsExampleShell, {
                                favicon: '',
                                title: node.name,
                                data: {
                                    node: node
                                },
                                action:null,
                                callback:function(nodeData){
                                }
                            });
                            $('#editor >div').hide();
                            addNewEditorAndRegisterEventCtrS(filePath);
                            var pathId = Utils.generatePathId(filePath);
                      
                            Editors[pathId].setValue(data);
                        }else{
                            //loop to find the tab that match filePath
                            $('.chrome-tab').each(function(){
                                var data = $(this).data().tabData.data;
                                if(data.node.path == filePath){
                                    var $tab = $(this);
                                    //active the tab
                                    chromeTabs.setCurrentTab($chromeTabsExampleShell, $tab,null);
                                    //show the editor
                                    $('#editor >div').hide();
                                    $('#' + pathId).show();
                                }
                            });
                        }
                    
                });
	}
}

export default ActionHandlers;