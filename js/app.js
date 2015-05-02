var nwApp = {

	runApp: function() {
		var gui = require('nw.gui');
		var win = gui.Window.get();
		nwApp.addMenu(document, gui);
		$('#jsfiddle').load(function() {
			nwApp.addActions(this, win);
			nwApp.addMenu($(this)[0].contentWindow.document, gui);
			$('#loading').fadeOut();
		});
		win.maximize();
	},

	addMenu: function (element, gui) {
		var menu = nwApp.menu(element, gui);
		$(element).on("contextmenu", function(e) {
			e.preventDefault();
			menu.popup(e.originalEvent.x, e.originalEvent.y);
		});
	},

	addActions: function(iframe, win) {
		var jsFiddle = $(iframe).contents();
		jsFiddle.find('#branding').hide(); //Temp removed for real estate reasons and issue #3
		var actions = jsFiddle.find('.actionCont:eq(1)');
		actions.prepend('<li class="actionItem"><a id="nw-open" class="aiButton" href="#nw-open" title="Open Fiddle"><span class="icon-file"></span>Open</a></li>');
		actions.find('#nw-open').on('click', function() {
			nwApp.openAction(jsFiddle);
		});
		actions.append('<li class="actionItem"><a id="nw-sidebar" class="aiButton" href="#nw-sidebar" title="Toggle sidebar"><span class="icon-chevron-left"></span>Sidebar</a></li>');
		actions.find('#nw-sidebar').on('click', function() {
			nwApp.sidebarAction(jsFiddle);
		});
		actions.append('<li class="actionItem"><a id="nw-devtools" class="aiButton" href="#nw-devtools" title="Open dev tools"><span class="icon-cog"></span>Dev Tools</a></li>');
		actions.find('#nw-devtools').on('click', function() {
			nwApp.devtoolsAction(win);
		});
		actions.append('<li class="actionItem"><a id="nw-zen" class="aiButton" href="#nw-zen" title="Zen Mode"><span class="icon-th-large"></span>Zen Mode</a></li>');
		actions.find('#nw-zen').on('click', function() {
			nwApp.zenAction(jsFiddle, win);
		});
		var credits = jsFiddle.find('.ebCont:last');
		credits.append('<p><strong>nwFiddle</strong></p><p>Created and maintained by Brad Metcalf (brad@localabstract.com)<br />Github: baconface</p>');
	},

	openAction: function(jsFiddle) {
		var dialog = BootstrapDialog.show({
			title: 'Open Fiddle',
			message: '<p>Enter a jsFiddle link you wish to open:</p><input type="text" class="form-control" id="nw-open-input" />',
			buttons: [{
				label: 'Open',
				action: function(dialog) {
					var fiddle = $('#nw-open-input').val();
					if(nwApp.fiddleCheck(fiddle) === true) {
						dialog.close();
						$('#loading').fadeIn();
						$('#jsfiddle').attr('src', fiddle);
					}
				}
			}, {
				label: 'Cancel',
				action: function(dialog) {
					dialog.close();
				}
			}]
		});
	},

	sidebarAction: function(jsFiddle) {
		var sidebar = jsFiddle.find('#sidebar');
		var content = jsFiddle.find('#content');
		var icon = jsFiddle.find('#nw-sidebar span');
		if(icon.attr('class') == 'icon-chevron-left') {
			sidebar.css('opacity', '0');
			content.css('margin', '14px 15px 0 15px');
			icon.attr('class', 'icon-chevron-right');
		} else {
			sidebar.css('opacity', '1');
			content.css('margin', '14px 15px 0 232px');
			icon.attr('class', 'icon-chevron-left');
		}
	},

	devtoolsAction: function(win) {
		if($('#devtools').height() == 0) {
			$('#jsfiddle').css('height', '75%');
			$('#devtools').css('height', '25%');
			win.showDevTools('jsfiddle', true);
			win.on("devtools-opened", function(url) {
				$('#devtools').attr('src', url);
				win.closeDevTools();
			});
		} else {
			$('#jsfiddle').css('height', '100%');
			$('#devtools').css('height', '0%');
		}
	},

	zenAction: function(jsFiddle, win) {
		var sidebar = jsFiddle.find('#sidebar');
		var icon = jsFiddle.find('#nw-zen span');
		if(icon.attr('class') == 'icon-th-large') {
			icon.attr('class', 'icon-remove');
			win.enterFullscreen();
		} else {
			icon.attr('class', 'icon-th-large');
			win.leaveFullscreen();
		}
	},

	fiddleCheck: function(url) {
		url = url.match(/^http.?:\/\/[^/]+/);
		if(url == null || url[0].toLowerCase().indexOf("jsfiddle.net") === -1) {
			var dialog = BootstrapDialog.show({
				title: 'Invalid Fiddle',
				type: BootstrapDialog.TYPE_DANGER,
				message: 'Please input a working fiddle to continue',
				buttons: [{
					label: 'Cancel',
					action: function(dialog) {
						dialog.close();
					}
				}]
			});
		} else {
			return true;
		}
	},

	menu: function(element, gui) {
		var menu = new gui.Menu();
		var cut = new gui.MenuItem({
			label: "Cut", 
			click: function() {
				element.execCommand("cut");
			}
		});
		var copy = new gui.MenuItem({
			label: "Copy", 
			click: function() {
				element.execCommand("copy");
			}
		});
		var paste = new gui.MenuItem({
			label: "Paste",
			click: function() {
				element.execCommand("paste");
			}
		});
		menu.append(cut);
		menu.append(copy);
		menu.append(paste);
		return menu;
	}

};

nwApp.runApp();