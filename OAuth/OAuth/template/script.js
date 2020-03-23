document.getElementById('loginbtn').addEventListener('click', loginWithFacebook, false);

function loginWithFacebook(e) {
    FB.login( response => {
        console.log(response);
        const { authResponse: { accessToken, userID }} = response;

        fetch('login-facebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accessToken, userID })
        }).then(res => {
            console.log(res);
        })
    }, { scope: 'public_profile, email'});

    return false;
}