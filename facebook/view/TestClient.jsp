<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<!-- Su dung truc tiep ten HelloSpringMVC -->
<link rel="stylesheet" href="/facebook/resources/css/bootstrap.min.css" />
<!-- Su dung contextPath -->
<script
	src="${pageContext.request.contextPath}/resources/js/jquery-1.11.2.min.js"></script>

</head>
<body>
	<div class="container">
		<h1>${requestScope.abc}</h1>
		<img src="/facebook/resources/images/28.jpg" />
	</div>

	<script>
		$.ajax({
			type:"get",
			url:"http://localhost:8081/facebook/test/thai"
		}).success(function(data){
			alert(data);
		}).fail(function(){
			alert("failed");
		});
	</script>

</body>
</html>