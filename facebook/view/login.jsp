<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="generator"
        content="HTML Tidy for HTML5 (experimental) for Windows https://github.com/w3c/tidy-html5/tree/c63cc39" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>FaceBook</title>
        <link rel="stylesheet" href="/facebook/resources/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/facebook/resources/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/facebook/resources/css/bootstrap-extended.css" />
        <link rel="stylesheet" href="/facebook/resources/css/animate.min.css" />
        <script src="/facebook/resources/js/jquery-1.11.2.min.js"></script>
        <script src="/facebook/resources/js/bootstrap.min.js"></script>
        <script src="/facebook/resources/js/font-awesome.min.js"></script>
        <style>
			
			.fixed_header {
				border-bottom: 1px solid #262932;
				box-shadow: 0px 0 3px rgba(0,0,0,0.5);
				background: #2c3e50;
				background: -webkit-linear-gradient(top,#3c5772,#2c3e50);
				background: -moz-linear-gradient(top,#3c5772,#2c3e50);
				background: -o-linear-gradient(top,#3c5772,#2c3e50);
				background-image: -ms-linear-gradient(#3c5772,#2c3e50);
				position: fixed;
				width: 100%;
				z-index: 4000;
				webkit-box-shadow: 0 2px 2px -2px rgba(0, 0, 0, .52);
			}
			.fixed_header a {
				color: #ffffff !important;
				text-decoration: none;
				font-weight: bold;
				font-family: 'Helvetica Neue', Helvetica, Arial, 'lucida grande',tahoma,verdana,arial,sans-serif;
				text-shadow: 0 -1px rgba(0, 0, 0, .5);
			}
			.form {margin-top:100px;}
		
			input {
				line-height: 45px !important;
				height: 45px !important;
			}

			body,
			input {
				background: #fbfafb !important;
			}

			label {
				font-weight: normal !important
			}

			div.col-sm-3 {
				background: white;
				height:450px;
			}
    
</style>
    </head>
    <body>
        <nav class="navbar navbar-default fixed_header">
            <div class="container">
                <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar"></button> 
                <a class="navbar-brand" href="#">MyFace</a></div>
                <div class="collapse navbar-collapse" id="myNavbar">
                    
                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <a href="#">Sign Up</a>
                        </li>
                        <li>
                            <a href="#">Login</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
		<div class="space"></div>
        <div class="container form">
            <div class="row">
                <div class="col-sm-3 col-sm-offset-2 shadow-bottom2 border-radius">
                    <div class="space"></div>
                    <h3>
                        <b>Login</b>
                    </h3>
                    <form action="/facebook/login" method = "POST">
                        <div class="form-group">
                        <label for="inputEmail" class="text-muted">Username or Email:</label> 
                        <input type="text" name="username" class="form-control" id="inputEmail"  /></div>
                        <div class="form-group">
                        <label for="inputEmail" class="text-muted">Password:</label> 
                        <input type="password" class="form-control" name="password" id="inputPassword"  /></div>
                        <div>
                            <a href="#">Forgot password?</a>
                        </div>
                        <div class="space-sm"></div>
                        <button type="submit" class="btn btn-primary">LOG IN</button>
                        <div class="space"></div>
                    </form>
                </div>
                <div class="col-sm-3 col-sm-offset-2 shadow-bottom2 border-radius">
                    <div class="space"></div>
                    <h3>
                        <b>Registration</b>
                    </h3>
                    <form action="/facebook/login" method="POST" >
                        <div class="form-group">
                        <label for="inputEmail" class="text-muted">Email:</label> 
                        <input type="email" name="email" class="form-control .input-lg" id="inputEmail"/></div>
                        <div class="form-group">
                        <label for="username" class="text-muted">Username:</label> 
                        <input type="text" name="username" class="form-control .input-lg" id="username" /></div>
                        <div class="form-group">
                        <label for="inputEmail" class="text-muted">Password:</label> 
                        <input type="password" name="password" class="form-control .input-lg" id="inputPassword"/></div>
                        <div class="space-sm"></div>
                        <button id="submit" class="btn btn-success">CREATE</button>
                        <script>
                            var postData = {};
                            postData["email"] = "abc";
                            postData["username"] = "abc";
                            postData["password"] = "abc";
                            $("#submit").click(function(){
                                $.ajax({
                                    type:"POST",
                                   url:"http://localhost:8080/FaceBook/api/login/checkLogin",
                                   data:postData
                                }).success(function(){
                                    alert("success");
                                }).fail(function(){
                                    alert("fail");
                                });
                            });
                        </script>
                        <div class="space"></div>
                    </form>
                </div>
            </div>
        </div>
    </body>
</html>
