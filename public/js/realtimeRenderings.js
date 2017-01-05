'use strict';

/**
 * Created by ekerot on 2017-01-05.
 */

var socket = io.connect();

socket.on('webhook', function(hook) {

    var selector = "li[id*='" + hook.issue.id + "']";

    console.log(hook)

    $(document).ready(function () {
        if (hook.action === 'closed') {

            $(selector).remove();
        }


        else if (hook.action === 'created') {

            $(selector).find('.comments').text(hook.issue.comments + ' comments are written');
        }


        else if (hook.action === 'opened' || 'reopened') {
            $('#list-issues').append($('<li>').attr('id', hook.issue.id + ' list-element'));

            $(selector).append($('<div>').attr('class', 'collapsible-header red darken-1 white-text z-depth-5')
                .append($('<i>').attr('class', 'material-icons').text('whatshot'))
                .append($('<p>').text(hook.issue.title)));

            $(selector).append($('<div>').attr('class', 'collapsible-body')
                .append($('<p>').attr('class', 'body').text(hook.issue.body)));

            $(selector).find(".collapsible-body").append($('<p>').attr('id', 'comments')
                .text(hook.issue.comments + ' comments are written'));

            $(selector).find(".collapsible-body").append($('<p>')
                .append($('<a>').attr('href', hook.issue.html_url)
                    .text(hook.issue.html_url)));

            $(selector).find(".collapsible-body").append($('<p>')
                .text('Created at ' + hook.issue.created_at));

            $(selector).find('.collapsible-body').append($('<div>').attr('class', 'chip')
                .append($('<img>').attr({class:'round', src:hook.issue.user.avatar_url})));

            $(selector).find('.chip').append($('<span>')
                .attr('class', 'card-title').text(hook.issue.user.login));
        }
    });
});

$(document).ready(function(){
    $('.collapsible').collapsible();});

$(".button-collapse").sideNav();