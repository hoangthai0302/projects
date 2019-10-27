<!DOCTYPE html>
<html lang="en">

<head>
<meta name="generator"
	content="HTML Tidy for HTML5 (experimental) for Windows https://github.com/w3c/tidy-html5/tree/c63cc39" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Bootstrap 3 Navigation</title>
<link rel="stylesheet" href="/facebook/resources/css/bootstrap.min.css" />
<link rel="stylesheet"
	href="/facebook/resources/css/font-awesome.min.css" />
<link rel="stylesheet" href="/facebook/resources/css/lean-slider.css"
	type="text/css" />
<link rel="stylesheet" href="/facebook/resources/css/home.css" />
<link rel="stylesheet" href="/facebook/resources/css/helper.css" />
<link rel="stylesheet" href="/facebook/resources/css/animate.min.css" />
<script src="/facebook/resources/js/jquery-1.11.2.min.js"></script>
<script src="/facebook/resources/js/socket.js"></script>
<script src="/facebook/resources/js/bootstrap.min.js"></script>
<script src="/facebook/resources/js/font-awesome.min.js"></script>
<script src="/facebook/resources/js/jquery.slimscroll.min.js"></script>
<script src="/facebook/resources/js/lean-slider.js"></script>
<script src="/facebook/resources/js/site.js"></script>
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

.fixed_header .nav>li>a, .navbar-brand {
	color: #ffffff !important;
	text-decoration: none;
	font-weight: bold;
	font-family: 'Helvetica Neue', Helvetica, Arial, 'lucida grande', tahoma,
		verdana, arial, sans-serif;
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
							<input type="text" placeholder="Search for people and groups."
								class="form-control input-sm" /> <a href="#"><i
								class="fa fa-search"></i></a>
						</form>
					</li>
					<li><a href="#">Home</a></li>
					<li><a href="#">Profile</a></li>
					<li class="dropdown"><a data-toggle="dropdown"
						class="dropdown-toggle msg_image" href="#" aria-expanded="false">
							<span class="badge badge-sm up bg-purple count">4</span>
					</a>
						<ul class="dropdown-menu extended nicescroll" tabindex="5001"
							style="outline: none;">
							<li class="dropdown-header"><span>Notifications</span></li>
							<div id="scrollDiv">
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small style="color: black;"><b>John smith</b>
												commented <b>Your</b> status: Trr</small> <small
												class="text-muted media-object timeago">3 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
							</div>
							<li class="dropdown-footer"><a href="inbox.html"
								class="text-center">See all</a></li>
						</ul></li>
					<li class="dropdown"><a data-toggle="dropdown"
						class="dropdown-toggle noti_image" href="#" aria-expanded="false">
							<span class="badge badge-sm up bg-purple count">4</span>
					</a>
						<ul class="dropdown-menu extended nicescroll" tabindex="5001"
							style="outline: none;">
							<li class="dropdown-header"><span>Notifications</span></li>
							<div id="scrollDiv">
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small style="color: black;"><b>John smith</b>
												commented <b>Your</b> status: Trr</small> <small
												class="text-muted media-object timeago">3 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
								<li><a href="#" class="media">
										<div class="media-left">
											<img
												src="http://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mm&s=230"
												class="img-rounded thumb-md" alt="img" />
										</div>
										<div class="media-body">
											<small><b>Akash Joshi</b> is following you </small> <small
												class="text-muted media-object timeago">5 MONTHS AGO</small>
										</div>
								</a></li>
							</div>
							<li class="dropdown-footer"><a href="inbox.html"
								class="text-center">See all</a></li>
						</ul></li>
					<li><a class="set_image" href="#"></a></li>
					<li><a href="#">Logout</a></li>
					<script>
						$('#scrollDiv').slimScroll({});
					</script>
				</ul>
			</div>
		</div>
	</nav>
	<div class="space-lg"></div>
	<div class="wrapper">
		<div id="timelineBG" style="background-color: #d5d6d9;">
			<img src="/facebook/resources/images/15723733583_b4a7b52459_b.jpg"
				style="width: 100%">
		</div>
		<div id="timelineProfilePic">
			<img
				src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
				id="timelineIMG">
			<div class="space-sm">sdf</div>
		</div>
		<div id="timelineNav">
			<div id="timelineButtons">
				<span class="follow"> <b class="you">You!</b></span>
			</div>
			<ul>
				<li><span class="arrowUp"></span><a
					href="https://labs.9lessons.info/sfdasdfdsa"><span
						id="update_count" class="timelineNum"></span> Updates</a></li>
				<li><a href="https://labs.9lessons.info/friends/sfdasdfdsa"><span
						class="timelineNum">3</span> Friends</a></li>
				<li><a href="https://labs.9lessons.info/photos/sfdasdfdsa"><span
						id="update_count" class="timelineNum">0</span> Photos</a></li>
			</ul>
		</div>
	</div>
	<div class="wrapper">
		<div id="left-content">
			<div class="leftBlock rounded bordered">
				<h4 class="small_title">About Me</h4>
				<div class="pb10">Student at Aptech University ...</div>
			</div>
			<div class="leftBlock connection rounded bordered">
				<h4 class="small_title">Connections</h4>
				<a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a> <a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a> <a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a> <a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a> <a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a> <a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a> <a href="#"><img
					src="http://www.gravatar.com/avatar/dc287ec1aa272026a82aa754b81e2d77?d=mm&s=230"
					class="img-rounded thumb-md"></a>
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
			<div id="updatebox" class="mb20" data-step="1"
				data-intro="You can upload status.">
				<b id="what">What's up HoangThai?</b>
				<textarea name="update" id="ta_update" class="form-control"
					style="min-height: 100px; width: 100%"></textarea>
				<br>
				<div id="updateIcon" class="clearfix">
					<input type="button" value=" Update " id="update_button"
						class="btn btn-success pull-right"> <a
						href="javascript:void(0);" id="camera"
						original-title="Upload Image"></a>
				</div>
			</div>
			
			<div class="update-item">
				<a href="#" class="update-avatar"> <img
					src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
					class="img-rounded thumb-md">
				</a>
				<div class="update-content bordered rounded">
					<div class="update-body">
						<!--update author name-->
						<div>
							<a href="#" class="username">HoangThai</a> <span class="stdelete"
								href='#'></span>
						</div>
						<!--update author text-->
						<div class="update-text">test</div>
						<!--update uploads-->
						<div class="update-uploads mb10">
							
						</div>
						<small class="text-muted media-object timeago">3 MONTHS
							AGO</small>
					</div>
					<div class="update-footer">
						<!--update action buttons-->
						<ul class="list-inline update-actions">
							<li><a href="#" class="like like_button icontext"
								id="like27363" title="Unlike" rel="Unlike" data="0">Unlike</a></li>
							<li><a href="#"
								class="commentopen commentopen_button icontext" id="27363"
								rel="27363" title="Comment">Comment </a></li>
							<li><a href="#" class="share share_button icontext"
								id="shares27329" title="Unshare" rel="Unshare" data="1">Unshare</a>
							</li>
						</ul>
						<!--comment-container-->
						<div class="comment-container">
							
						</div>
						<!--comment-textarea submit-->
						<div class="comment_box">
							<a href='#'><img
								src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
								class="img-rounded thumb-sm" /></a>
							<div>
								<textarea class="form-control"></textarea>
								<div class="mt10">
									<a href="#" id="comment_button" class="btn btn-info ">Comment</a>
								</div>
							</div>
						</div>
					</div>
					<!--end update footer -->
				</div>
				<!--end update content -->
			</div>
			<!--End update-item-->
			
			<div class="update-item">
				<a href="#" class="update-avatar"> <img
					src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
					class="img-rounded thumb-md">
				</a>
				<div class="update-content bordered rounded">
					<div class="update-body">
						<!--update author name-->
						<div>
							<a href="#" class="username">HoangThai</a> <span class="stdelete"
								href='#'></span>
						</div>
						<!--update author text-->
						<div class="update-text">test</div>
						<!--update uploads-->
						<div class="update-uploads mb10">
							<div class="slider-wrapper">
								<div class="slider">
									<div class="slide1">
										<img src="/facebook/resources/images/1.jpg" alt="" />
									</div>
									<div class="slide2">
										<img src="/facebook/resources/images/2.jpg" alt="" />
									</div>
									<div class="slide3">
										<img src="/facebook/resources/images/3.jpg" alt="" />
									</div>
									<div class="slide4">
										<img src="/facebook/resources/images/4.jpg" alt="" />
									</div>
								</div>
								<div class="slider-direction-nav"></div>
								<div class="slider-control-nav"></div>
							</div>
						</div>
						<small class="text-muted media-object timeago">3 MONTHS
							AGO</small>
					</div>
					<div class="update-footer">
						<!--update action buttons-->
						<ul class="list-inline update-actions">
							<li><a href="#" class="like like_button icontext"
								id="like27363" title="Unlike" rel="Unlike" data="0">Unlike</a></li>
							<li><a href="#"
								class="commentopen commentopen_button icontext" id="27363"
								rel="27363" title="Comment">Comment </a></li>
							<li><a href="#" class="share share_button icontext"
								id="shares27329" title="Unshare" rel="Unshare" data="1">Unshare</a>
							</li>
						</ul>
						<!--comment-container-->
						<div class="comment-container">
							<div class="tbox ml15 comment-single">
								<a href='#'><img
									src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
									class="img-rounded thumb-sm2" /></a>
								<div>
									<div>
										<b>HoangThai</b> Test....
									</div>
									<div>
										<span class="stcommenttime" title="2 months ago">2
											months ago</span> <a href='#'>- Like</a>
									</div>
								</div>
							</div>
							<div class="tbox ml15 comment-single">
								<a href='#'><img
									src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
									class="img-rounded thumb-sm2" /></a>
								<div>
									<div>
										<b>HoangThai</b> asdfsa df sadf sadf sad f
									</div>
									<div>
										<span class="stcommenttime" title="2 months ago">2
											months ago</span> <a href='#'>- Like</a>
									</div>
								</div>
							</div>

							<div class="tbox ml15 comment-single">
								<a href='#'><img
									src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
									class="img-rounded thumb-sm2" /></a>
								<div>
									<div>
										<b>HoangThai</b> huhuhhhhhhhhhhhhh
									</div>
									<div>
										<span class="stcommenttime" title="2 months ago">2
											months ago</span> <a href='#'>- Like</a>
									</div>
								</div>
							</div>
						</div>
						<!--comment-textarea submit-->
						<div class="comment_box">
							<a href='#'><img
								src="https://labs_uploads.s3.amazonaws.com/user23363_1442505179.jpg"
								class="img-rounded thumb-sm" /></a>
							<div>
								<textarea class="form-control"></textarea>
								<div class="mt10">
									<a href="#" id="comment_button" class="btn btn-info ">Comment</a>
								</div>
							</div>
						</div>
					</div>
					<!--end update footer -->
				</div>
				<!--end update content -->
			</div>
			<!--End update-item-->

		</div>
		<input type="hidden" id="token" value="${sessionScope.token}" /> <input
			type="hidden" id="userID" value="${sessionScope.userID}" />
		<script type="text/javascript">
			$(document).ready(function() {
				var msg = {};
				msg["type"] = "notification";
				
				var onmessage = function(event) {
					var message = eval("(" + event.data + ")");
					alert(message.name);
				}
				bind(onmessage);
				send(msg);
				$('.slider').each(function() {
					$(this).leanSlider();
				});
				
			});
		</script>
	</div>
</body>

</html>
