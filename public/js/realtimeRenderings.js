'use strict';

/**
 * Created by ekerot on 2017-01-05.
 */

var socket = io.connect();

socket.on('webhook', function(hook) {  //getmessages from the websocket

    var selector = "div[id*='" + hook.issue.id + "']";

    $(document).ready(function () {

        switch(hook.action) {  //actions givs signal of what to do.

            case 'closed':
                $(selector).remove();
                break;

            case 'edited':  //GitHUb does not provide the new edited comment in the hook so I had to do a "ful hack"
                location.reload();
                break;

            case 'created':

                $(selector).find('.comments').text((hook.issue.comments + 1) + ' comments are written');

                break;

            case 'deleted':

                $(selector).find('.comments').text((hook.issue.comments - 1) + ' comments are written');

                break;

            case 'opened':      //open and reopen issues
            case 'reopened':


                $('.r').append($('<div>').attr({'id': hook.issue.id, 'class': 'col s12 m6'}));

                $(selector).append($('<div>').attr('class', 'card blue-grey darken-1')
                    .append($('<div>').attr('class', 'card-content white-text')
                        .append($('<span>').attr('class', 'card-title').text(hook.issue.title))));

                $(selector).find(".card-content").append($('<p>').attr('class', 'body')
                    .text(hook.issue.body));

                $(selector).find('.card-content').append($('<br>'));

                $(selector).find('.card-content').append($('<p>')
                    .attr('class', 'comments').text(hook.issue.comments + ' comments are written'))


                $(selector).find('.card').append($('<div>').attr('class', 'card-action')
                    .append($('<a>').attr('href', hook.issue.html_url).text('Link')));


                $(selector).find('.card-action').append($('<div>').attr('class', 'chip')
                    .append($('<img class="round">').attr("src", hook.issue.user.avatar_url)));

                $(selector).find('.chip').append($('<span>')
                    .attr('class', 'card-title').text(hook.issue.user.login));

                break;
        }
    });
});

function email(){

    var clientId = 'xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
    var apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    var scopes =
        'https://www.googleapis.com/auth/gmail.readonly '+
        'https://www.googleapis.com/auth/gmail.send';
    function handleClientLoad() {
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth, 1);
    }
    function checkAuth() {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: true
        }, handleAuthResult);
    }
    function handleAuthClick() {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: false
        }, handleAuthResult);
        return false;
    }
    function handleAuthResult(authResult) {
        if(authResult && !authResult.error) {
            loadGmailApi();
            $('#authorize-button').remove();
            $('.table-inbox').removeClass("hidden");
            $('#compose-button').removeClass("hidden");
        } else {
            $('#authorize-button').removeClass("hidden");
            $('#authorize-button').on('click', function(){
                handleAuthClick();
            });
        }
    }
    function loadGmailApi() {
        gapi.client.load('gmail', 'v1', displayInbox);
    }
}

//collapsible nav
$(".button-collapse").sideNav();