$(document).ready(function() {
                var offset = 20;
                var token = null;
                page = $('#page').html();
                var wall_id = $('#wall_id').html();
                var postData={};
                postData['wall_id'] = wall_id;
                postData['page'] = page;
                $.ajax({
                  async:false,  
                  url:BASE_URL + "/services/homeWall",
                  type:"post",
                  data:postData,
                }).success(function(msg){
                   updates= msg.updates;
                   you = msg.you;
                   chatters = msg.chatters;
                   groups = msg.groups;
                   current_wall = msg.current_wall;

                }).fail(function(){
                    alert("failed"); 
                });
                var onmessage = function(event) {
                    if(viewMode == 0){
                        var cloneData = updates;
                        var message = eval("(" + event.data + ")");
                        console.log("new message! Type:" + message.type);
                        var type = message.type;
                        if(type == "likes"){
                            var action = message.action;
                            
                            var userID = message.user_id;
                            var updateID = message.update_id;
                            var commentID = message.comment_id;
                            var replyID = message.reply_id;
                            var username = message.user_name;
                            var userlink = message.user_link;
                            var isFriend = message.isFriend;

                            var object_type = message.object_type;
                             //like update
                            if(object_type == "1"){
                                    if(action.toLowerCase() == "unlike"){
                                         for(var i in cloneData){
                                             if(cloneData[i]["id"] == updateID){
                                                if(userID == you.id){
                                                    cloneData[i]['you_like'] = '0';
                                                }else{
                                                    //nếu người like là bạn, xóa đi trong ds friends like
                                                    if(isFriend == 1 ){
                                                        for(var j in cloneData[i]['likes']){
                                                            if(cloneData[i]['likes'][j]['id'] == userID){
                                                                cloneData[i]["likes"].splice(j,1);

                                                                break;
                                                            }
                                                        }
                                                    }
                                                    
                                                }
                                                cloneData[i]['like_count'] = parseInt(cloneData[i]['like_count']) - 1;
                                                 break;
                                             }
                                         }

                                    }else if(action.toLowerCase() == "like"){
                                        console.log('like');
                                             var userLike = {};
                                             userLike["id"] = userID;
                                             userLike["name"] = username;
                                             userLike["link"] = userlink;
                                             var index ;

                                             for(var i in cloneData){
                                                 if(cloneData[i]["id"] == updateID){
                                                        //nếu người like chính là you
                                                        if(userID == you.id){
                                                            cloneData[i]['you_like'] = '1';
                                                        }else{
                                                            if(isFriend == 1){//nếu người like là friend, thêm vào ds friends like
                                                                if(cloneData[i]["likes"].length <3){
                                                                    cloneData[i]["likes"].unshift(userLike);
                                                                }
                                                            }
                                                            
                                                        }
                                                    cloneData[i]['like_count'] = parseInt(cloneData[i]['like_count']) + 1;
                                                    break;
                                                 }
                                             }
                                    }
                             }else if(object_type == 2){
                                    
                                 for(var i in cloneData){
                                     if(cloneData[i]["id"] == updateID){

                                        for(var j in cloneData[i]['comments']){
                                            if(cloneData[i]['comments'][j]['id'] == commentID){
                                                if(action.toLowerCase() == "unlike"){
                                                    cloneData[i]['comments'][j]['like_count']--;
                                                }else if(action.toLowerCase() == "like"){
                                                    cloneData[i]['comments'][j]['like_count']++;
                                                }
                                               
                                                break;
                                            }
                                        }
                                         break;
                                     }
                                 }
                                  
                            }else if(object_type == 3){
                                for(var i in cloneData){
                                    if(cloneData[i]["id"] == updateID){
                                        for(var j in cloneData[i]['comments']){

                                            if(cloneData[i]['comments'][j]['id'] == commentID){
                                                for(var k in cloneData[i]['comments'][j]['replies'])

                                                    if(cloneData[i]['comments'][j]['replies'][k]['id'] == replyID){
                                                        if(action.toLowerCase() == "unlike"){
                                                            cloneData[i]['comments'][j]['replies'][k]['like_count']--;
                                                        }else if(action.toLowerCase() == "like"){
                                                            cloneData[i]['comments'][j]['replies'][k]['like_count']++;    
                                                        }
                                                        break;
                                                    }
                                               
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                   
                            }

                            reRender();

                            
                         
                            if(message.notified == '1'){
                                you.new_noties++;
                                playSound();
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }

                           
                        }else if(type=="new_comment"){
                             var comment = {};
                             comment["id"] = message.comment_id;
                             comment["comment"] = message.comment;
                             comment["user_avatar"] = message.avatar;
                             comment["you_like"] = "0";
                             comment["reply_count"] = "0";
                             comment["replies"] = [];
                             comment["like_count"] = 0;
                             comment["time"] = parseInt(moment().format("X"));
                             comment["user_name"] = message.user_name;
                             comment["user_id"] = message.user_id;
                             
                             comment["user_link"] = message.userlink;
                                
                             var updateID = message.update_id;
                             var index;
                             for(var i in cloneData){
                                 if(cloneData[i]["id"]==updateID){
                                     cloneData[i]["comments"].push(comment);
                                     cloneData[i]["comment_count"]++;

                                     reRender();

                                     break;
                                 }
                             }
                            if(message.notified == '1'){
                                playSound();
                                you.new_noties++;
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }
                           
                             
                        }else if(type == 'new_reply'){
                            var reply = {};
                             reply["id"] = message.reply_id;
                             reply["reply"] = message.reply;
                             reply["user_avatar"] = message.avatar;
                             reply["you_like"] = "0";
                             reply["like_count"] = 0;
                             reply["time"] = parseInt(moment().format("X"));
                             reply["user_name"] = message.user_name;
                             reply["user_id"] = message.user_id;
                             reply["user_link"] = message.userlink;
                             var updateID = message.update_id;
                             var index;
                             for(var i in cloneData){
                                 if(cloneData[i]["id"]==updateID){
                                    for(var j in cloneData[i]['comments']){
                                        if(cloneData[i]['comments'][j]['id'] == message.comment_id){
                                            cloneData[i]['comments'][j]['replies'].push(reply);
                                            cloneData[i]['comments'][j]['reply_count']++;
                                            reRender();
                                            break;
                                        }

                                    }
                                     break;
                                 }
                            }
                            if(message.notified == '1'){
                                you.new_noties++;
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }

                            
                            

                        }else if(type == 'chat_message'){

                            var patner = message.patner;  //id của patner
                            var text = message.text;
                            var time = message.time;
                            var name = message.name;
                            var link = message.link;
                            var avatar = message.avatar;
                            console.log('name:' + name + ',link:' + link+', avatar:' +avatar)
                            var chat_msg = {to:'0',text:text,time:time};

                            var flag = true;
                            var lastseen = message.lastseen;
                            console.log('last seen:' + lastseen);
                            for(var i in conversations){
                                if(conversations[i]['id'] == patner){
                                    //cap nhat message moi vao 
                                    conversations[i]['data']['messages'].push(chat_msg);
                                    var div = document.getElementById("chat" + patner);
                                    if(div != null){
                                        flag = false;
                                        lastseen = 0;
                                        $.ajax({          
                                            url:BASE_URL +'/services/messages/panelactive',
                                            data:{patner_id :patner},
                                        });
                                        //cap nhat lai cua so chat
                                        React.render(React.createElement(ChatPanel,{data:conversations[i]['data'],patner:patner,link:link,name:name,avatar:avatar}),div);
                                        break;

                                    }
                                    
                                }
                            }
                            if(lastseen == 1){
                                //cập nhật you.new_chat_noties
                                you.new_chat_noties ++;
                                playSound();
                                //render lại navbar
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }
                            
                         

                         }else if(type =='new_friend_request'){
                                you.new_friend_request ++;
                                //render lại navbar
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                         }else if(type =='new_friend_confirm'){
                            you.new_friend_confirm ++;
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                         }else if(type=='online'){
                            for(var i in chatters){
                                if(chatters[i]['id'] == message.id){
                                    chatters[i]['is_online'] = parseInt(message.online);
                                    break;
                                }
                            }

                             React.render(
                                 React.createElement(Chatters, {data: chatters}),
                                 document.getElementById('chat')
                            );
                         }else if(type == 'seen_message'){
                            var patner_id = parseInt(message.patner_id);
                            for(var i in conversations){
                                if(conversations[i]['id']==patner_id){
                                    conversations[i]['data']['seen'] = 1;
                                    conversations[i]['data']['time'] = message.time;
                                    var div = document.getElementById("chat" + patner_id);
                                    if(div != null){
                                        React.render(React.createElement(ChatPanel,{data:conversations[i]['data'],patner:patner_id,link:conversations[i]['link'],name:conversations[i]['name'],avatar:conversations[i]['avatar']}),div);

                                    }
                                      
                                    break;
                                }
                            }
                         }

                    }
                    
                    else if(viewMode == 1){
                        var cloneData = updateSingle;
                        var message = eval("(" + event.data + ")");
                        console.log("new message! Type:" + message.type);

                        var type = message.type;
                        if(type == "likes"){
                            var action = message.action;
                            
                            var userID = message.user_id;
                            var updateID = message.update_id;
                            var commentID = message.comment_id;
                            var replyID = message.reply_id;
                            var username = message.user_name;
                            var userlink = message.user_link;
                            var isFriend = message.isFriend;

                            var object_type = message.object_type;
                             //like update
                            if(object_type == "1"){
                                    if(action.toLowerCase() == "unlike"){
                                         for(var i in cloneData){
                                             if(cloneData[i]["id"] == updateID){
                                                if(userID == you.id){
                                                    cloneData[i]['you_like'] = '0';
                                                }else{
                                                    if(isFriend == 1 ){
                                                        for(var j in cloneData[i]['likes']){
                                                            if(cloneData[i]['likes'][j]['id'] == userID){
                                                                cloneData[i]["likes"].splice(j,1);

                                                                break;
                                                            }
                                                        }
                                                    }
                                                    
                                                }
                                                cloneData[i]['like_count'] = parseInt(cloneData[i]['like_count']) - 1;
                                                 break;
                                             }
                                         }

                                    }else if(action.toLowerCase() == "like"){
                                             var userLike = {};
                                             userLike["id"] = userID;
                                             userLike["name"] = username;
                                             userLike["link"] = userlink;
                                             var index ;

                                             for(var i in cloneData){
                                                 if(cloneData[i]["id"] == updateID){
                                                        //nếu người like chính là you
                                                        if(userID == you.id){
                                                            cloneData[i]['you_like'] = '1';
                                                        }else{
                                                            if(isFriend == 1){//nếu người like là friend, thêm vào ds friends like
                                                                if(cloneData[i]["likes"].length <3){
                                                                    cloneData[i]["likes"].unshift(userLike);
                                                                }
                                                            }
                                                            
                                                        }
                                                    cloneData[i]['like_count'] = parseInt(cloneData[i]['like_count']) + 1;
                                                    break;
                                                 }
                                             }
                                    }
                             }else if(object_type == 2){
                                    
                                 for(var i in cloneData){
                                     if(cloneData[i]["id"] == updateID){

                                        for(var j in cloneData[i]['comments']){
                                            if(cloneData[i]['comments'][j]['id'] == commentID){
                                                if(action.toLowerCase() == "unlike"){
                                                    cloneData[i]['comments'][j]['like_count']--;
                                                }else if(action.toLowerCase() == "like"){
                                                    cloneData[i]['comments'][j]['like_count']++;
                                                }
                                               
                                                break;
                                            }
                                        }
                                         break;
                                     }
                                 }
                                  
                            }else if(object_type == 3){
                                for(var i in cloneData){
                                    if(cloneData[i]["id"] == updateID){
                                        for(var j in cloneData[i]['comments']){

                                            if(cloneData[i]['comments'][j]['id'] == commentID){
                                                for(var k in cloneData[i]['comments'][j]['replies'])

                                                    if(cloneData[i]['comments'][j]['replies'][k]['id'] == replyID){
                                                        if(action.toLowerCase() == "unlike"){
                                                            cloneData[i]['comments'][j]['replies'][k]['like_count']--;
                                                        }else if(action.toLowerCase() == "like"){
                                                            cloneData[i]['comments'][j]['replies'][k]['like_count']++;    
                                                        }
                                                        break;
                                                    }
                                               
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                   
                            }

                            reRender();

                            
                         
                            if(message.notified == '1'){
                                you.new_noties++;
                                playSound();
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }

                           
                        }else if(type=="new_comment"){
                             var comment = {};
                             comment["id"] = message.comment_id;
                             comment["comment"] = message.comment;
                             comment["user_avatar"] = message.avatar;
                             comment["you_like"] = "0";
                             comment["reply_count"] = "0";
                             comment["replies"] = [];
                             comment["like_count"] = 0;
                             comment["time"] = parseInt(moment().format("X"));
                             comment["user_name"] = message.user_name;
                             comment["user_id"] = message.user_id;
                             
                             comment["user_link"] = message.userlink;
                                
                             var updateID = message.update_id;
                             var index;
                             for(var i in cloneData){
                                 if(cloneData[i]["id"]==updateID){
                                     cloneData[i]["comments"].push(comment);
                                     cloneData[i]["comment_count"]++;

                                     reRender();

                                     break;
                                 }
                             }
                            if(message.notified == '1'){
                                playSound();
                                you.new_noties++;
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }
                           
                             
                        }else if(type == 'new_reply'){
                            var reply = {};
                             reply["id"] = message.reply_id;
                             reply["reply"] = message.reply;
                             reply["user_avatar"] = message.avatar;
                             reply["you_like"] = "0";
                             reply["like_count"] = 0;
                             reply["time"] = parseInt(moment().format("X"));
                             reply["user_name"] = message.user_name;
                             reply["user_id"] = message.user_id;
                             reply["user_link"] = message.userlink;
                             var updateID = message.update_id;
                             var index;
                             for(var i in cloneData){
                                 if(cloneData[i]["id"]==updateID){
                                    for(var j in cloneData[i]['comments']){
                                        if(cloneData[i]['comments'][j]['id'] == message.comment_id){
                                            cloneData[i]['comments'][j]['replies'].push(reply);
                                            cloneData[i]['comments'][j]['reply_count']++;
                                            reRender();
                                            break;
                                        }

                                    }
                                     break;
                                 }
                            }
                            if(message.notified == '1'){
                                you.new_noties++;
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }

                            
                            

                        }else if(type == 'chat_message'){

                            var patner = message.patner;  //id của patner
                            var text = message.text;
                            var time = message.time;
                            var name = message.name;
                            var link = message.link;
                            var avatar = message.avatar;
                            var chat_msg = {to:'0',text:text,time:time};

                            var flag = true;
                            var lastseen = message.lastseen;
                            for(var i in conversations){
                                if(conversations[i]['id'] == patner){
                                    //cap nhat message moi vao 
                                    conversations[i]['messages'].push(chat_msg);
                                    conversations[i]['seen']= 0;
                                    var div = document.getElementById("chat" + patner);
                                    if(div != null){
                                        flag = false;
                                        lastseen = 0;
                                        $.ajax({          
                                            url:BASE_URL +'/services/messages/panelactive',
                                            data:{patner_id :patner},
                                        });
                                        //cap nhat lai cua so chat
                                        React.render(React.createElement(ChatPanel,{data:conversations[i]['messages'],seen:0,patner:patner,link:link,name:name,avatar:avatar}),div);
                                        break;

                                    }
                                    
                                }
                            }
                            if(lastseen == 1){
                                //cập nhật you.new_chat_noties
                                you.new_chat_noties ++;
                                playSound();
                                //render lại navbar
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                            }
                            
                         

                         }else if(type =='new_friend_request'){
                                you.new_friend_request ++;
                                //render lại navbar
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                         }else if(type =='new_friend_confirm'){
                            you.new_friend_confirm ++;
                                React.render(
                                     React.createElement(NavBar, null),
                                     document.getElementById('myNavbar')
                                );
                         }else if(type=='online'){
                            for(var i in chatters){
                                if(chatters[i]['id'] == message.id){
                                    chatters[i]['is_online'] == parseInt(message.online);
                                    break;
                                }
                            }
                            
                             React.render(
                                 React.createElement(Chatters, {data: chatters}),
                                 document.getElementById('chat')
                            );
                         }else if(type == 'seen_message'){
                            var patner_id = parseInt(message.patner_id);
                            for(var i in conversations){
                                if(conversations[i]['id']==patner_id){
                                    conversations[i]['data']['seen'] = 1;
                                    var div = document.getElementById("chat" + patner_id);
                                    if(div != null){
                                        flag = false;
                                        lastseen = 0;
                                        $.ajax({          
                                            url:BASE_URL +'/services/messages/panelactive',
                                            data:{patner_id :patner_id},
                                        });
                                        //cap nhat lai cua so chat
                                        React.render(React.createElement(ChatPanel,{data:conversations[i]['data'],patner:patner_id,link:conversations[i]['link'],name:conversations[i]['name'],avatar:conversations[i]['avatar']}),div);
                                        break;

                                    }
                                    break;
                                }
                            }
                         }
                    }
                    
                 }
                 bind(onmessage);

                if(page =='1'){
                     React.render(
                         React.createElement(WallHeader,{data:current_wall}),
                         document.getElementById('wall_header')
                    ); 
                } else {
                    React.render(
                         React.createElement(HomeAvatar,{link:current_wall.link,avatar:current_wall.avatar,update_count:current_wall.update_count,upload_count:current_wall.upload_count,friend_count:current_wall.friend_count}),
                         document.getElementById('home_profile')
                    ); 
                }
               

                React.render(
                     React.createElement(AboutMe, {about:current_wall.about}),
                     document.getElementById('about_me')
                );
                React.render(
                     React.createElement(Connections, {data:current_wall.connections}),
                     document.getElementById('connections')
                ); 

                if(current_wall.id != you.id){
                    if(current_wall.id > 1090346680){
                        if(current_wall.is_friend == 1 ){
                            React.render(
                                 React.createElement(UpdateBox, {name: you.name}),
                                 document.getElementById('updatebox')
                            );
                        }
                        
                    }else{
                        if(current_wall.is_member == 1 || current_wall.owner_id == you.id){
                            React.render(
                                 React.createElement(UpdateBox, {name: you.name}),
                                 document.getElementById('updatebox')
                            );
                        }
                    }
                    
                    

                }else{
                    React.render(
                         React.createElement(UpdateBox, {name: you.name}),
                         document.getElementById('updatebox')
                    );
                }
                
                React.render(
                     React.createElement(UpdateList, {data: updates}),
                     document.getElementById('timeline')
                );

                 React.render(
                     React.createElement(Groups, {data:groups}),
                     document.getElementById('groups')
                );
               
                React.render(
                     React.createElement(NavBar, null),
                     document.getElementById('myNavbar')
                );

                React.render(
                     React.createElement(Chatters, {data: chatters}),
                     document.getElementById('chat')
                );


                window.onscroll = function(){
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                        var offset = updates.length;
                        postData['offset'] = offset;
                        $.ajax({
                          async:false,  
                          url:BASE_URL + "/services/homeWall",
                          data:postData,
                          type:"post"
                       }).success(function(msg){
                           updates= updates.concat(msg.updates);
                           React.render(
                                 React.createElement(UpdateList, {data: updates}),
                                 document.getElementById('timeline')
                            );

                       }).fail(function(){
                            alert("failed"); 
                       });

                   }
                }


                 
});

