$(function () {

    var $form = $('form');
    var $tokenSecret = $form.find('#token-secret');
    var $accessToken = $form.find('#access-token');
    var $result = $form.find('#result');

    $form.on('click', 'button', function (e) {

        // Get the community
        var community = $form.find('#community').val();
        console.log("Community", community);

        // Get access token and token secret
        var accessToken = $accessToken.val();
        var tokenSecret = $tokenSecret.val();
        console.log("Access Token", accessToken);
        console.log("Token Secret", tokenSecret);

        // URI-Encode each one
        var accessTokenEncoded = encodeURIComponent(accessToken);
        var tokenSecretEncoded = encodeURIComponent(tokenSecret);
        console.log("Encoded Access Token", accessTokenEncoded);
        console.log("Encoded Token Secret", tokenSecretEncoded);

        // Combine them into a single credential string
        var credentials = accessTokenEncoded + ":" + tokenSecretEncoded;
        console.log("Credentials", credentials);

        // Base64-Encode the credentials
        var credentialsEncoded = window.btoa(credentials);
        console.log("Encoded Credentials", credentialsEncoded);

        // Create Authorization header string value
        var authorizationHeader = "Basic " + credentialsEncoded;
        console.log("Authorization Header", authorizationHeader);

        // Create the settings to be used in the AJAX request
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://" + community + "/v1/oauth2/token",
            "method": "POST",
            "headers": { 
                "Authorization": authorizationHeader,
            },
            "mimeType": "multipart/form-data",
            "dataType": "json",
            "data": { "grant_type": "client_credentials" }
        }

        // Perform the AJAX request and handle the response
        $.ajax(settings).done(function (response, status) {
            $result.text(status);
            console.log("Response", response);
        });

    });

});

