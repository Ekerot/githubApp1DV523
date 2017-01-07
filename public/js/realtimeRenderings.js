'use strict';

/**
 * Created by ekerot on 2017-01-05.
 */

var socket = io.connect();

socket.on('webhook', function(hook) {

    console.log(hook)

    var selector = "div[id*='" + hook.issue.id + "']";

    $(document).ready(function () {

        switch(hook.action) {

            case 'closed':
                $(selector).remove();
                break;

            case 'edited':
                $(selector).find('.body').text(hook.issue.body);
                break;

            case 'created':

                $(selector).find('.comments').text((hook.issue.comments + 1) + ' comments are written');

                break;

            case 'deleted':

                $(selector).find('.comments').text((hook.issue.comments - 1) + ' comments are written');

                break;

            case 'opened':
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

//collapsible nav
$(".button-collapse").sideNav();