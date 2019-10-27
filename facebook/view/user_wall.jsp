<!DOCTYPE html>
<html lang="vi">

<head>
    <meta name="generator" content="HTML Tidy for HTML5 (experimental) for Windows https://github.com/w3c/tidy-html5/tree/c63cc39" />
    <meta charset="UTF-8">
    <title>Bootstrap 3 Navigation</title>
    <link rel="stylesheet" href="/facebook/resources/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/facebook/resources/css/font-awesome.min.css" />
    <link rel="stylesheet" href="/facebook/resources/css/lean-slider.css" type="text/css" />
    <link rel="stylesheet" href="/facebook/resources/css/home.css" />
    <link rel="stylesheet" href="/facebook/resources/css/helper.css" />
    <link rel="stylesheet" href="/facebook/resources/css/animate.min.css" />
    <script  type="text/javascript" charset="utf-8" src="/facebook/resources/js/jquery-1.11.2.min.js"></script>
    <script src="/facebook/resources/js/moment.min.js"  charset="UTF-8"></script>
    <script src="/facebook/resources/js/socket.js"></script>
    <script  type="text/javascript" charset="utf-8" src="/facebook/resources/js/react.min.js"></script>
    <script src="/facebook/resources/js/bootstrap.min.js"></script>
    <script src="/facebook/resources/js/font-awesome.min.js"></script>
    <script src="/facebook/resources/js/jquery.slimscroll.min.js"></script>
    <script src="/facebook/resources/js/lean-slider.js"></script>
    <script src="/facebook/resources/js/site.js" charset="utf-8"></script>
    <style>
    .open>a {
        background-color: transparent !important;
    }
    
    .fixed_header {
        border-bottom: 1px solid #262932;
        box-shadow: 0px 0 3px rgba(0, 0, 0, 0.5);
        background: #2c3e50;
        background: -webkit-linear-gradient(top, #3c5772, #2c3e50);
        background: -moz-linear-gradient(top, #3c5772, #2c3e50);
        background: -o-linear-gradient(top, #3c5772, #2c3e50);
        background-image: -ms-linear-gradient(#3c5772, #2c3e50);
        position: fixed;
        width: 100%;
        z-index: 4000;
        webkit-box-shadow: 0 2px 2px -2px rgba(0, 0, 0, .52);
    }
    
    .fixed_header .nav>li>a,
    .navbar-brand {
        color: #ffffff !important;
        text-decoration: none;
        font-weight: bold;
        font-family: 'Helvetica Neue', Helvetica, Arial, 'lucida grande', tahoma, verdana, arial, sans-serif;
        text-shadow: 0 -1px rgba(0, 0, 0, .5);
    }
    
    .app-search {
        position: relative;
    }
    
    .app-search a {
        position: absolute;
        top: 15px;
        left: 8px;
        color: gray !important;
    }
    
    .app-search input {
        text-indent: 15px;
        margin-top: 10px;
        width: 300px;
        margin-right: 30px;
    }
    </style>
</head>

<body>
    <nav class="navbar navbar-default fixed_header">
        <div class="wrapper">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">MyFace</a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav">
                    <li>
                        <form role="search" class="app-search pull-left hidden-xs">
                            <input type="text" placeholder="Search for people and groups." class="form-control input-sm" /> <a href="#"><i
                                class="fa fa-search"></i></a>
                        </form>
                    </li>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Profile</a></li>
                    <li class="dropdown">
                        <a data-toggle="dropdown" class="dropdown-toggle msg_image" href="#" aria-expanded="false">
                            <span class="badge badge-sm up bg-purple count">4</span>
                        </a>
                        <ul class="dropdown-menu extended nicescroll" tabindex="5001" style="outline: none;">
                            <li class="dropdown-header"><span>Notifications</span></li>
                            <div id="scrollDiv"></div>
                            <li class="dropdown-footer"><a href="inbox.html" class="text-center">See all</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a data-toggle="dropdown" class="dropdown-toggle noti_image" href="#" aria-expanded="false">
                            <span class="badge badge-sm up bg-purple count">4</span>
                        </a>
                        <ul class="dropdown-menu extended nicescroll" tabindex="5001" style="outline: none;">
                            <li class="dropdown-header"><span>Notifications</span></li>
                            <div id="scrollDiv">
                                <li>
                                    <a href="#" class="media">
                                        <div class="media-left">
                                            <img src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230" class="img-rounded thumb-md" alt="img" />
                                        </div>
                                        <div class="media-body">
                                            <small style="color: black;"><b>John smith</b>
                                                commented <b>Your</b> status: Trr</small> <small class="text-muted media-object timeago">3 MONTHS AGO</small>
                                        </div>
                                    </a>
                                </li>
                                
                            </div>
                            <li class="dropdown-footer"><a href="inbox.html" class="text-center">See all</a></li>
                        </ul>
                    </li>
                    <li>
                        <a class="set_image" href="#"></a>
                    </li>
                    <li><a href="/facebook/logout">Logout</a></li>
                    <script>
                    $('#scrollDiv').slimScroll({});
                    </script>
                </ul>
            </div>
        </div>
    </nav>
    <div class="space-lg"></div>
    <div class="wrapper" id= "wall_header">
       
    </div>
    <div class="wrapper">
        <div id="left-content">
            <div class="leftBlock rounded bordered">
                <h4 class="small_title">About Me</h4>
                <div class="pb10" id="about_me"></div>
            </div>
            <div id = "connections" class="leftBlock rounded bordered">
               
            </div>
            <div class="leftBlock rounded bordered">
                <h4 class="small_title">GROUPS/PAGES</h4>
                <div class="pb10">Tao nhom o day ...</div>
            </div>
            <div class="leftBlock rounded bordered">
                <h4 class="small_title">Sponsored</h4>
                <div class="pb10">Advertistment goes here ...</div>
            </div>
        </div>
        <div id="right-content" class="reset">
            <div id="updatebox" class="mb20"></div>
            <div id="timeline"></div>
        </div>

        
        
       
    </div>
    <script type="text/javascript" src="/facebook/resources/react/out/notification.js"></script>
        <script  src="/facebook/resources/react/out/timeline.js"   type="text/javascript" charset="utf-8"></script>
</body>

</html>
