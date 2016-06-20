$(function () {
    
    var $form = $('form');
    var $community = $form.find('#community');
    var $tokenSecret = $form.find('#token-secret');
    var $accessToken = $form.find('#access-token');
    var $result = $('#result');

    $form.on('click', 'button', function (e) {

        // Get the community
        var community = $community.val();
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
                "Authorization": authorizationHeader
            },
            "mimeType": "multipart/form-data",
            "dataType": "json",
            "data": { "grant_type": "client_credentials" }
        }

        console.log("Performing OAuth2 request to " + settings.url);

        // Perform the AJAX request, process the result, and use the new access token to make an authenticated call.
        // Note: This call will likely fail because of CORS restrictions for your community. In order to get around this restriction, you will need to add the testing domain to your community's Trusted API Domains or host the file on an existing one.
        $.ajax(settings).then(GetAccessTokenFromResponse).then(UseAccessToken);

    });

    // Take the response from the oauth2 call and return the access token
    function GetAccessTokenFromResponse(response) {
        console.log("OAuth2 Response", response);

        $result.html(JSON.stringify(response, null, 4));

        return response.access_token;
    }

    // Makes an authenticated GET /v1/groups request
    function UseAccessToken(accessToken) {

        // Get the community
        var community = $community.val();

        // Create Authorization header with the returned access token
        var authorizationHeader = "Bearer " + accessToken;
        console.log("Authorization Header (Bearer)", authorizationHeader);

        // Create the AJAX settings to be used in the authenticated GET request
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://" + community + "/v1/groups",
            "method": "GET",
            "headers": {
                "authorization": authorizationHeader
            }
        }

        console.log("Performing Groups request to " + settings.url);

        // Perform the AJAX request and log the response
        $.ajax(settings).done(function (response) {
            console.log("Authenticated GET Response", response);
        });
    }

});