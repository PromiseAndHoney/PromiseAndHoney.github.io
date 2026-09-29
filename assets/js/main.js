
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}


	// Scrolly.
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

	// Slideshow Background.
		(function() {

			// Only the landing page uses the slideshow.
				if (!$body.hasClass('landing'))
					return;

			// Settings: image URLs are relative to the HTML page.
				var settings = {
					images: {
						'images/bg01.jpg': 'center',
						'images/bg02.jpg': 'center',
						'images/bg03.jpg': 'center',
            'images/bg04.jpg': 'center',
            'images/bg05.jpg': 'center'
					},
					delay: 6000
				};

				var pos = 0,
					bgs = [],
					bgWrapper = document.createElement('div');

			// Create decorative background layers behind the page content.
				bgWrapper.id = 'bg';
				bgWrapper.setAttribute('aria-hidden', 'true');

				Object.keys(settings.images).forEach(function(url) {
					var bg = document.createElement('div');
					bg.style.backgroundImage = 'url("' + url + '")';
					bg.style.backgroundPosition = settings.images[url];
					bg.style.transitionDuration = (settings.delay / 2) + 'ms';
					bgWrapper.appendChild(bg);
					bgs.push(bg);
				});

				if (bgs.length === 0)
					return;

				bgs[pos].classList.add('visible');
				bgs[pos].classList.add('top');
				$body[0].appendChild(bgWrapper);
				$body.addClass('has-slideshow');

			// Keep a static image when animation is unavailable or unwanted.
				if (bgs.length === 1
				|| !browser.canUse('transition')
				|| (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches))
					return;

				window.setInterval(function() {
					var previous = bgs[pos];
					pos = (pos + 1) % bgs.length;

					previous.classList.remove('top');
					bgs[pos].classList.add('visible');
					bgs[pos].classList.add('top');

					// Leave the previous image underneath until the new one fades in.
					window.setTimeout(function() {
						previous.classList.remove('visible');
					}, settings.delay / 2);
				}, settings.delay);

		})();

})(jQuery);