$(document).ready(function () {
	var position = 0;

	function loadPosts() {
		var requestURL = "https://raw.githubusercontent.com/fiction-works/shopifybuilder/master/posts.json?callback";
		$.getJSON(requestURL, function (data) {
			console.log(data);
			$.each(data.items, function (i, post) {
				if ($("#cboFilter").val() === "All") {
					filter(post);
				} else {
					filterSpecific(post);
				}
			});
			masonry();
			linkify();
		});
	}

	function masonry() {
		var $grid = $('.grid');
		$grid.imagesLoaded(function () {
			$grid.masonry({
				itemSelector: '.grid-item',
				columnWidth: '.grid-sizer',
				percentPosition: true,
				transitionDuration: 0
			});
			$grid.masonry('reloadItems');
			$grid.css({
				opacity: 0,
				visibility: "visible"
			}).animate({
				opacity: 1
			}, 500);
			$(window).scrollTop(position);
		});
	}

	function filter(post) {
		switch (post.service_name) {
		case ("Manual"):
			loadManual(post);
			break;
		case ("Twitter"):
			loadTwitter(post);
			break;
		case ("Instagram"):
			loadInstagram(post);
			break;
		}
	}

	function filterSpecific(post) {
		if (post.service_name === $("#cboFilter").val()) {
			filter(post);
		}
	}

	function loadManual(post) {
		var postManual = "\
                    <div class=\"grid-item\">\
                        <div class=\"iconoverlay overlayAFF\">\
                            <div>AFF</div>\
                        </div>\
                        <div class=\"postcontent\">\
                            <img src=\"" + post.item_data.image_url + "\" class=\"manualimage\">\
                            <div class=\"fontDefault manualtext\">" + post.item_data.text + "\
                            </div>\
                            <a href=\"" + post.item_data.link + "\" class=\"fontDefault link\" target=\"_blank\">" + post.item_data.link_text + "</a>\
                        </div>\
                    </div>\
                    ";
		$(".grid").append(postManual);
	}

	function loadTwitter(post) {
		var postTwitter = "\
                    <div class=\"grid-item\">\
                        <div class=\"iconoverlay overlayTwitter\">\
                            <i class=\"fa fa-twitter\" aria-hidden=\"true\"></i>\
                        </div>\
                        <div class=\"postcontent\">\
                            <div class=\"twitterimagecontainer\">\
                                <img src=\"" + post.item_data.user.avatar + "\" class=\"twitterimage\">\
                            </div>\
                            <div class=\"twitterID\"><a href=\"http://twitter.com/" + post.item_data.user.username + "\">@" + post.item_data.user.username + "</a></div>\
                            <div class=\"fontDefault twittertext\">" + post.item_data.tweet + "\
                            </div>\
                        </div>\
                    </div>";
		$(".grid").append(postTwitter);
	}

	function loadInstagram(post) {
		var postInstagram = "\
					<div class=\"grid-item\">\
						<div class=\"iconoverlay overlayInstagram\">\
							<i class=\"fa fa-instagram\" aria-hidden=\"true\"></i>\
						</div>\
						<div class=\"postcontent\">\
							<img src=\"" + post.item_data.image.medium + "\"class=\"instagramimage\">\
							<div class=\"instagramID\"><a href=\"http://instagram.com/" + post.item_data.user.username + "\">" + post.item_data.user.username + "</a></div>\
							<div class=\"fontDefault instagramtext\">" + post.item_data.caption + "\</div>\
						</div>\
					</div>";
		$(".grid").append(postInstagram);
	}

	loadPosts();

	$("#cboFilter").change(function () {
		position = 0;
		var $grid = $('.grid');
		$grid.css({
			opacity: 1,
			visibility: "visible"
		}).animate({
			opacity: 0
		}, 200).promise().done(function () {
			$grid.empty();
			$grid.append("<div class=\"grid-sizer\"></div>");
			$grid.masonry('destroy')
			loadPosts();
		});

	});

	$("#loadmore a").click(function (e) {
		e.preventDefault();
		position = $(window).scrollTop();
		var $grid = $('.grid');
		$grid.css({
			opacity: 1,
			visibility: "visible"
		}).animate({
			opacity: 0
		}, 200).promise().done(function () {
			$grid.masonry('destroy')
			loadPosts();
		});
	});

	function linkify() {
		$(".twittertext").linky({
			mentions: true,
			hashtags: true,
			urls: true,
			linkTo: "twitter",
			target: "_blank"
		});
		$(".instagramtext").linky({
			mentions: true,
			hashtags: true,
			urls: true,
			linkTo: "instagram",
			target: "_blank"
		});
		$(".manualtext").linky({
			target: "_blank"
		});
	}
});