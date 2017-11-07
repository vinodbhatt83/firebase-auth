/**
 * firebase-auth
 * To load firebase authentication include the following to your page
 * <div id="firebase-auth"></div>
 */

 "use strict";

/**
 * Returns authentication
 * @param {object} config
 * @return {object}
 */
function firebaseAuth(params) {

    var config = {
        apiKey: params.apiKey,
        authDomain: params.authDomain,
        databaseURL: params.databaseURL,
        projectId: params.projectId,
        storageBucket: params.storageBucket,
        messagingSenderId: params.messagingSenderId
    };

    var initConfig = function() {
        $.when(
            $.getScript("https://www.gstatic.com/firebasejs/4.5.0/firebase.js"),
            $.getScript("https://cdn.firebase.com/libs/firebaseui/2.4.0/firebaseui.js"),
            $.getScript("/mypath/myscript3.js"),
            $.Deferred(function(deferred) {
                $(deferred.resolve);
            })
        ).done(function() {
            firebase.initializeApp(config);
        });
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var getUiConfig = function() {
        return {
            'callbacks': {
                // Called when the user has been successfully signed in.
                'signInSuccess': function(user, credential, redirectUrl) {
                    handleSignedInUser(user);
                    return false;
                }
            },

            // Opens IDP Providers sign-in flow in a popup.
            'signInFlow': 'popup',

            'signInOptions': [
                // TODO(developer): Remove the providers you don't need for your app.
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    scopes: ['https://www.googleapis.com/auth/plus.login']
                },
                {
                    provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    scopes: [
                        'public_profile',
                        'email',
                        'user_likes',
                        'user_friends'
                    ]
                },
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    // Whether the display name should be displayed in Sign Up page.
                    requireDisplayName: true
                },
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID
                }
            ],
            // Terms of service url.
            'tosUrl': 'https://www.google.com'
        };
    };

    /**
     * Displays the UI for a signed in user.
     * @param {!firebase.User} user
     */
    var handleSignedInUser = function(user) {
        document.getElementById('fbase-user-signed-in').style.display = 'block';
        document.getElementById('fbase-user-signed-out').style.display = 'none';
        document.getElementById('fbase-name').textContent = user.displayName;
        document.getElementById('fbase-mail').textContent = user.email;
        document.getElementById('fbase-phone').textContent = user.phoneNumber;

        if (user.photoURL) {
            document.getElementById('fbase-photo').src = user.photoURL;
            document.getElementById('fbase-photo').style.display = 'block';
        } else {
            document.getElementById('fbase-photo').style.display = 'none';
        }
    };

    /**
     * Displays the UI for a signed out user.
     */
    var handleSignedOutUser = function() {
        document.getElementById('fbase-user-signed-in').style.display = 'none';
        document.getElementById('fbase-user-signed-out').style.display = 'block';
        ui.start('#firebase-auth', getUiConfig());
    };

    // Listen to change in auth state so it displays the correct UI for when
    // the user is signed in or not.
    firebase.auth().onAuthStateChanged(function(user) {
        document.getElementById('fbase-loading').style.display = 'none';
        document.getElementById('fbase-loaded').style.display = 'block';
        user ? handleSignedInUser(user) : handleSignedOutUser();
    });

    /**
     * Initializes the app.
     */
    var initApp = function() {
        initConfig();
        document.getElementById('fbase-sign-out').addEventListener('click', function() {
            firebase.auth().signOut();
        });
    };

    window.addEventListener('load', initApp);
};

module.exports = {
	firebaseAuth
}
