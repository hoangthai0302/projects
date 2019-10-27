<!DOCTYPE html>
<html lang="vi">

<head>
    <meta name="generator" content="HTML Tidy for HTML5 (experimental) for Windows https://github.com/w3c/tidy-html5/tree/c63cc39" />
    <meta charset="UTF-8">
    <title>Bootstrap 3 Navigation</title>
    <link rel="stylesheet" href="/facebook/resources/css/bootstrap.min.css" />
     <link rel="stylesheet" href="/facebook/resources/css/bootstrap-dialog.min.css" />
    <link rel="stylesheet" href="/facebook/resources/css/bootstrap-extended.css" />
    <link rel="stylesheet" href="/facebook/resources/css/font-awesome.min.css" />
    <link rel="stylesheet" href="/facebook/resources/css/tooltipster.css" />
    <link rel="stylesheet" href="/facebook/resources/css/colorbox.css" />
    <link rel="stylesheet" href="/facebook/resources/css/justifiedGallery.min.css" />
    <link rel="stylesheet" href="/facebook/resources/css/home.css" />
    <link rel="stylesheet" href="/facebook/resources/css/emoticons.css" />
    <script  type="text/javascript" charset="utf-8" src="/facebook/resources/js/jquery-1.11.2.min.js"></script>
    
    <script src="/facebook/resources/js/jquery.colorbox-min.js"></script>
    <script src="/facebook/resources/js/jquery.justifiedGallery.min.js"></script>
    <script src="/facebook/resources/js/moment.min.js"  charset="UTF-8"></script>
    
    <script src="/facebook/resources/js/Autolinker.min.js" charset="utf-8"></script>
    <script src="/facebook/resources/js/socket.js"></script>
    <script  type="text/javascript" charset="utf-8" src="/facebook/resources/js/react.js"></script>
    <script  type="text/javascript" charset="utf-8" src="/facebook/resources/js/react-dom.js"></script>
    <script  type="text/javascript" charset="utf-8" src="/facebook/resources/js/jquery.tiny-draggable.min.js"></script>
    <script src="/facebook/resources/js/bootstrap.min.js"></script>
    <script src="/facebook/resources/js/jquery.tooltipster.min.js"></script>
    <script src="/facebook/resources/js/bootstrap-dialog.min.js"  charset="UTF-8"></script>
    <script src="/facebook/resources/js/jquery.slimscroll.min.js"></script>
    
    <script src="/facebook/resources/js/site.js" charset="utf-8"></script>
   

</head>

<body class="bg-color1">
    <nav class="navbar navbar-default fixed_header">
        <div class="wrapper">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">MyFace</a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
                
            </div>
        </div>
    </nav>
    <div class="space-lg"></div>
    <div class="space-lg"></div>
    <div class="wrapper" id= "wall_header">

    </div>
    <div class="wrapper" id="main">
        <div id="left-content">
        	<div id='home_profile'>
        		
        	</div>
        	
            <div  class="leftBlock rd bd">
                <h4 class="small_title">About</h4>
                <div class="pb10" id="about_me"></div>
            </div>
            <div id = "connections" class="leftBlock rd bd">
            </div>
            <div class="leftBlock rd bd">
                <h4 class="small_title">GROUPS/PAGES</h4>
                <div class="pb10" id='groups'></div>
            </div>
            <div class="leftBlock rd bd">
                <h4 class="small_title">Sponsored</h4>
                <div class="pb10">Advertistment goes here ...</div>
            </div>
        </div>
        <div id="right-content" class="reset">
            <div id="updatebox" class="mb20 box rd bd bg"></div>
            <div id="timeline"></div>
        </div>

    </div>
    <div class = "wrapper">
    	<div id = "photos" class="hidden book">
    			    	
	    </div>
	    <div id = "friendbook" class="hidden book">
    			    	
	    </div>
    </div>
    
    

    <div id="chat">
    	
    </div>
    <audio id="alert" src="/facebook/resources/alert.mp3" preload="auto"></audio>
    <div id="chatters"></div>
    <div id='page' class='hidden'>${requestScope.page}</div>
    <div id='wall_id' class='hidden'>${requestScope.wall_id}</div>
    <input type='hidden' value="${requestScope.userID}" id = "userID"/>
    <input type='hidden' value="${requestScope.token}" id = "token"/>
    <script  src="/facebook/resources/react/out/contextmenu.js"   type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript" src="/facebook/resources/react/notification.js"></script>
    <script  src="/facebook/resources/react/likes.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/wallheader.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/groups.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/sharemodal.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/timeline.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/components.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/photoalbum.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/FriendBook.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/buttons.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/tooltiptag.js"   type="text/javascript" charset="utf-8"></script>
    
    <script  src="/facebook/resources/react/updatebox.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/chat.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/Reply.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/username.js"   type="text/javascript" charset="utf-8"></script>
    <script  src="/facebook/resources/react/main.js"   type="text/javascript" charset="utf-8"></script>
	

</body>

</html>
