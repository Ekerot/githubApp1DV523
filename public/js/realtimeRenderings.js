'use strict';

/**
 * Created by ekerot on 2017-01-05.
 */

var socket = io.connect();

socket.on('webhook', function(hook) {

    console.log(hook)

    var selector = "div[id*='" + hook.issue.id + "']";

    console.log(hook)

    $(document).ready(function () {
        if (hook.action === 'closed') {

            $(selector).remove();
        }


        else if (hook.action === 'created') {

            $(selector).find('.comments').text(hook.issue.comments + ' comments are written');
        }


        else if (hook.action === 'opened' || 'reopened') {
            $('.row').append($('<div>').attr({'id':hook.issue.id, 'class':'col s12 m6'}));

            $(selector).append($('<div>').attr('class', 'card blue-grey darken-1')
                .append($('<div>').attr('class', 'card-content white-text')
                .append($('<span>').attr('class', 'card-title').text(hook.issue.title))));

            $(selector).find(".card-content white-text").append($('<p>')
                .text(hook.issue.body));

            $(selector).find(".card-content white-text").append($('<br>'));

            $(selector).find(".card-content white-text").append($('<p>')
                .attr('class', 'comments').text('{{this.comments}} comments are written'))


            $(selector).find('.card-content white-text').append($('<div>').attr('class', 'card-action')
                .append($('<a>').attr('href', hook.issue.html_url).text('Link')));

            $(selector).find(".card-action").append($('<p>')
                .text('Created at ' + hook.issue.created_at));

            $(selector).find(".card-action").append($('<div>').attr('class', 'chip')
                .append($('<img>').attr({class:'round', src:hook.issue.user.avatar_url})));

            $(selector).find('.chip').append($('<span>')
                .attr('class', 'card-title').text(hook.issue.user.login));
        }
    });
});

//collapsible nav
$(".button-collapse").sideNav();