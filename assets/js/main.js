
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

	// Show the worker details and let the visitor choose when to continue.
		(function() {
			var links = document.querySelectorAll('.support-link'),
				dialog = document.getElementById('support-dialog'),
				continueLink = document.getElementById('support-continue'),
				cancelButton = document.getElementById('support-cancel');

			if (!links.length || !dialog || !continueLink || !cancelButton || typeof dialog.showModal !== 'function')
				return;

			function closeDialog() {
				dialog.close();
			}

			links.forEach(function(link) {
				link.addEventListener('click', function(event) {
					event.preventDefault();
					if (dialog.open)
						return;

					continueLink.href = link.href;
					dialog.showModal();
					$body.addClass('has-support-modal');
				});
			});

			cancelButton.addEventListener('click', closeDialog);
			continueLink.addEventListener('click', closeDialog);
			dialog.addEventListener('close', function() {
				$body.removeClass('has-support-modal');
			});
		})();

	// Language selection. Content is filtered by the root language in CSS.
		var $languageSwitcher = $('.language-switcher'),
			$languageButtons = $languageSwitcher.find('[data-language]');

		$languageButtons.on('click', function() {
			var language = $(this).attr('data-language');

			if (language !== 'en' && language !== 'ko')
				return;

			document.documentElement.lang = language;
			$languageSwitcher.attr('aria-label', language === 'ko' ? '언어 선택' : 'Language');
			$languageButtons.each(function() {
				$(this).attr('aria-pressed', String($(this).attr('data-language') === language));
			});
			$window.trigger('languagechange');
		});
		$languageSwitcher.prop('hidden', false);

	// Expandable About Us sections.
		$('#about-us-en, #about-us-kr').each(function() {
			var $section = $(this),
				$content = $section.children('.about-us-content'),
				$copy = $content.children('.about-us-copy'),
				$toggle = $section.children('.about-us-toggle'),
				$firstParagraph = $copy.children('p').first(),
				expanded = false,
				collapsedHeight = 0,
				reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

			if (!$firstParagraph.length || !$toggle.length)
				return;

			function refresh() {
				// Wait until this language is visible before measuring its text.
				if ($section.attr('data') !== document.documentElement.lang)
					return;

				var paragraphStyle = window.getComputedStyle($firstParagraph[0]),
					lineHeight = parseFloat(paragraphStyle.lineHeight) || parseFloat(paragraphStyle.fontSize) * 1.5,
					fullHeight = $copy.outerHeight();

				// Measure five rendered lines, even after resizing or loading fonts.
				collapsedHeight = lineHeight * 5;
				$content.stop(true).height(expanded ? 'auto' : Math.min(collapsedHeight, fullHeight));
				$content.toggleClass('is-collapsed', !expanded && fullHeight > collapsedHeight + 1);
				$toggle.prop('hidden', fullHeight <= collapsedHeight + 1);
			}

			$toggle.on('click', function() {
				expanded = !expanded;
				$content.toggleClass('is-collapsed', !expanded && $copy.outerHeight() > collapsedHeight + 1);
				$toggle.attr('aria-expanded', String(expanded));
				$toggle.text($toggle.attr(expanded ? 'data-collapse-label' : 'data-expand-label'));

				$content.stop(true).animate({
					height: expanded ? $copy.outerHeight() : Math.min(collapsedHeight, $copy.outerHeight())
				}, {
					duration: reducedMotion && reducedMotion.matches ? 0 : 400,
					complete: function() {
						if (expanded)
							$content.css('height', 'auto');
						else if ($toggle[0].getBoundingClientRect().top < 0)
							$section[0].scrollIntoView({ block: 'start', behavior: 'auto' });
					}
				});
			});

			refresh();
			$window.on('resize languagechange', refresh);

			if (document.fonts && document.fonts.ready)
				document.fonts.ready.then(refresh);
		});

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