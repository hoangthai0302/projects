<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script type="text/javascript"
	src="/facebook/resources/js/jquery-1.11.2.min.js"></script>
<script type="text/javascript"
	src="/facebook/resources/js/jquery.form.js"></script>
<title>Insert title here</title>
</head>
<body>
	<form>
		<input name="file" id="file" type="file" /><br />
	</form>

	<button value="Submit" onclick="uploadFormData()">Upload</button>

	<script>
		function uploadFormData(){
		    $('#result').html('');
		  var formData = new FormData();
		  formData.append("file", file.files[0]);
		 
		  $.ajax({
		    url: '/facebook/services/upload',
		    data: formData,
		    processData: false,
		    contentType: false,
		    type: 'POST',
		    success: function(data){
		      alert(data.link);
		    },fail:function(){
		    	alert("fail");
		    }
		  });
		}
	</script>
</body>
</html>