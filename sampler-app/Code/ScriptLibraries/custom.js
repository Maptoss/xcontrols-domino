$(document).ready( function() {
	$(".fontawesomeicons a.bootcards-summary-item").click( function() {
		showFontAwesomeDetails(this);
	})
	buildCharts();
	if ($(".pagetitle").text() != "") {
		$(".navbar-brand").text($(".pagetitle").text());
	}
	initRTButtons();
	initBaseCards();
})

$(document).ajaxComplete( function() {
	if (window.location.href.indexOf("UnpMain.xsp") > -1 || window.location.href.indexOf("BaseCards.xsp") > -1) {
		// We need to re-init the charts
		buildCharts();
	}
	$(".fontawesomeicons a.bootcards-summary-item").click( function() {
		showFontAwesomeDetails(this);
	})
	/*
	 * If we're running inside an iFrame we might be in the Restyler, so go and
	 * see if we need to do anything
	 */
	try {
		var isInIframe = (window.location != window.parent.location) ? true
				: false;
		if (isInIframe) {
			window.parent.processAllSettings();
		}
	} catch (e) {

	}

	// Test To See if we need to remove a second buttons div
	if ($(".buttons").length > 1) {
		$(".buttons").eq(1).hide();
	}

	if ($(".pagetitle").text() != "") {
		$(".navbar-brand").text($(".pagetitle").text());
	}
	initRTButtons();
	initBaseCards();
})

function initRTButtons() {
	if (window.location.href.indexOf("TextEditingPanel") > -1) {
		$(".btn-danger").unbind();
		$(".btn-danger").click( function() {
			alert("The cancel button is disabled on this page");
		});
		$(".btn-success").unbind();
		$(".btn-success").click( function() {
			alert("The save button is disabled on this page");
		})
	}
}

function initBaseCards() {
	if ($("#chartcardheading").length > 0) {
		drawCharts();
	}
}
var drawCharts = function() {
	$("#barChart").empty();
	Morris.Bar( {
		element : 'barChart',
		data : [ {
			person : 'Guy Bardsley',
			sales : 550
		}, {
			person : 'Adam Callahan',
			sales : 1500
		}, {
			person : 'Arlo Geist',
			sales : 3750
		}, {
			person : 'Sheila Hutchins',
			sales : 3500
		} ],
		xkey : 'person',
		ykeys : [ 'sales' ],
		labels : [ 'Sales' ],
		hideHover : 'auto'
	});
}

function myCallBackFunction(message) {
	if (message){
		alert(message);
	}else{
		alert("This is custom code called by the OK	button using the callback custom property");
	}
	unp.closeDialog('dialogPopup');
}

function switchCSS(obj, newcss) {
	$("#footerTabBar li").removeClass("tabSelected");
	$(obj).addClass("tabSelected");
	$("[unp-id='primarycss']").attr("href", newcss);
	jQuery.get("SwitchCSS.xsp?css=" + newcss);
}

function initDialog() {
	setTimeout( function() {
		try {
			$(".opendialoglink").click( function(event) {
				openDialog($(this).attr('href'));
			});
		} catch (e) {

		}
	}, 1000);
}

function readForm(url, index) {
	loadPage(url + ' #contentwrapper', 'content', index);
}

function adjustIFrameSize() {
	setTimeout( function() {
		$("iframe").height($(window).height() - 120);
	}, 1500);
}

function buildCharts() {
	if ($(".chartpanelelement").length > 0) {
		var names = [ 'Allan Long', 'Darcy Raffield', 'Darren Eno',
				'Erik Leavell', 'Jack Floyd', 'Kurt Lobo', 'Tan Ser' ];
		var piedata = [];
		var tablerows = "";
		for ( var i = 0; i < names.length; i++) {
			var value = getRnd();
			piedata.push( {
				'label' : names[i],
				value : value
			});

			tablerows += "<tr><td>" + names[i]
					+ "</td><td class=\"text-right\">$"
					+ numberWithCommas(value) + "</td></tr>\n";
		}
		$(".table tbody").html(tablerows);
		var myDonut = Morris.Donut;
		myDonut.prototype.redraw = function() {

			var C, cx, cy, i, idx, last, max_value, min, next, seg, total, value, w, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
			this.raphael.clear();
			cx = this.el.width() / 2;
			cy = this.el.height() / 2;
			w = (Math.min(cx, cy) - 10) / 3;
			total = 0;
			_ref = this.values;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				value = _ref[_i];
				total += value;
			}
			min = 5 / (2 * w);
			C = 1.9999 * Math.PI - min * this.data.length;
			last = 0;
			idx = 0;
			this.segments = [];
			_ref1 = this.values;
			for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
				value = _ref1[i];
				next = last + min + C * (value / total);
				seg = new Morris.DonutSegment(cx, cy, w * 2, w, last, next,
						this.data[i].color
								|| this.options.colors[idx
										% this.options.colors.length],
						this.options.backgroundColor, idx, this.raphael);
				seg.render();
				this.segments.push(seg);
				seg.on('hover', this.select);
				seg.on('click', this.select);
				last = next;
				idx += 1;
			}
			this.text1 = this.drawEmptyDonutLabel(cx, cy - 10,
					this.options.labelColor, 15, 800);
			this.text2 = this.drawEmptyDonutLabel(cx, cy + 10,
					this.options.labelColor, 14);
			max_value = Math.max.apply(Math, this.values);
			idx = 0;
			_ref2 = this.values;
			_results = [];
			for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
				value = _ref2[_k];
				if (value === max_value) {
					this.select(idx);
					break;
				}
				_results.push(idx += 1);
			}
			return _results;
		};
		myDonut( {
			element : 'pie1',
			data : piedata,
			formatter : function(y, data) {
				// prefixes the values by an $ sign, adds thousands seperators

			nStr = y + '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return '$ ' + x1 + x2;
		}
		}).on('click', function(i, row) {
			// console.log(i, row);
			});
	}
}

function isPhone() {
	var isPhone = document.width <= 480;
	return isPhone;
}

function getRnd(max) {
	if (!max) {
		max = 6000
	}
	return parseInt(Math.random() * max);
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function labelFormatter(label, series) {
	return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>"
			+ label + "<br/>" + Math.round(series.percent) + "%</div>";
}

function startTest() {
	// $('head').append(
	// $('<link rel="stylesheet" type="text/css" />').attr('href',
	// './unp/qunit-1.12.css?open&rnd=' + getRnd(10000)));
	$("#qunit")
			.html(
					"<p><i class=\"fa fa-spinner fa-spin\"></i> Running test, this can take up to 30 seconds...</p>");
	$("#results-card").show();
	$("#qunit").show();
	$("#starttestbutton").hide();
	$("#upmarkiframe").attr("src", "UPMarkStart.xsp?starttime=" + Date.now());
}

function toggleChartData() {
	var $ev = $(event.target)
	var $chart = $ev.parents('.bootcards-chart');
	if ($chart.length > 0) {
		$chart.fadeOut('fast', function() {
			$chart.siblings('.bootcards-table').fadeIn('fast');
		});
	} else {
		var $data = $ev.parents('.bootcards-table');
		$data.fadeOut('fast', function() {
			$data.siblings('.bootcards-chart').fadeIn('fast');
		});
	}
}

function showFontAwesomeDetails(element) {
	$(".modal-title").text($(element).find("h4").text());
	$(".modal-body").html($(element).html());
	if (!$(".modal-body").hasClass("text-center")) {
		$(".modal-body").addClass("text-center");
	}
	$(".modal-body fa-3x").removeClass("fa-3x").addClass("fa-4x");
	$(".modal-body i").clone().insertBefore(".modal-body h4");
	$(".modal-body i").clone().insertBefore(".modal-body h4");
	$(".modal-body i").removeClass("fa-3x");
	var i = 5;
	$(".modal-body i").each( function() {
		$(this).addClass("fa-" + (i--) + "x");
		$(this).css("padding-right", "5px");
	})
	$(".modal-body h4").removeClass("hidden");
	unp.openDialog('fa-alert');
	// <a class="bootcards-summary-item"><i class="fa fa-3x fa-adn"></i><h4
	// class="hidden">fa-adn</h4></a>
}

//save the photo selected in the photo uploader
unp.photoUploader.savePhoto = function(button, saveButtonId) {
	//get the file input
	var $resizeFileUpload = $('input.js-photouploader-upload');
	var files = $resizeFileUpload[0].files;
	if ((typeof files == 'undefined' || files.length === 0) ) {
		return;
	}
	
	//disable all buttons
	$('button').attr('disabled', true);
	
	//show a spinner icon in the upload button
	unp.showSpinner(button);
	
	var _resizedFile = files[0];
                        
	//set the submit id to the current button (so the server knows what to do)
	$('input[name="$$xspsubmitid"]').val(saveButtonId);
                    
	//create FormData object to send all form data to Unplugged
	var fd = new FormData();
                            
	//get all inputs and add them to the formData object
	var $inputs = $('form :input');
                           	
	$inputs.each( function() { 
              	
		var $this = $(this);
		var name = $this.prop('name');
		var clazz = $this.prop('class');
		var type = $this.prop('type');
              		
		//add all file inputs, except the resized image and any buttons
		if ( clazz.indexOf('js-photouploader-upload') == -1 && type != 'button' ) {
			fd.append( name, $this.val() );
		}
              	
	});
	                    
	//now add the resized image to the FormData object and send it
	
	 var canvas = document.getElementById('photoUploadCanvas');
     if (unpluggedserver){
	     if (canvas.toBlob) {
		    canvas.toBlob(
		        function (blob) {
		            
		           	blob.name = _resizedFile.name;
		            fd.append( $resizeFileUpload.prop('id'), blob, 'photo.jpg' );
		            
		            //make the ajax request to send all data to the server             
		        	$.ajax({
		        	  url: window.location.pathname,
		        	  type: 'POST',
		        	  data: fd,
		        	  processData: false,
		        	  contentType: false,
		        	  
		        	  success: function(data) {
	
		        			if (typeof unpluggedserver != 'undefined' && unpluggedserver) {
		        				/*
		        				$.get("UnpSyncAll.xsp")
		        					.done( function() {
		        						alert('Photo Saved and Synced');
		        					})
		        					.fail( function() {
		        						alert('Photo Saved but not yet Synced');
		        					})
		        					.always( function() {
		        						unp.openDocument(window.location.href, 'doccontent');
		        					});
		        				*/
		        				window.location.reload();
		        			} else {
		        				alert('Photo Saved');
		        			}
		        			unp.hideSpinner($(".uploadphotobutton"));
		        		
		        	  }
		        	});
		        
		        },
		        'image/jpeg'
		    );
		}
     }else{
    	 var dataUrl = canvas.toDataURL("image/png");
    	 $('.js-photouploader-preview')
         	.find('.base64string')
            .val(dataUrl);
    	 unp.saveDocument(null, "newdoc", "BaseCards.xsp", "Photo", null, null, null, null, "photoupload");
     }
};

function callbackFunction(){
	var item = $(".list-group-item.active").find("h4");
	console.log("Opened " + $(item).text());
	return true;
}
 
function savecallback(dbName, viewName, summarycol, detailcol, category,
		xpage, refreshmethod, photocol, ajaxload, callback, target){
	console.log("Saved document at " + new Date());
	unp.clearsearch(dbName, viewName, summarycol, detailcol, category,
			xpage, refreshmethod, photocol, ajaxload, callback, target)
}

function presavecallback(){
	console.log("Pre save document at " + new Date());
	return true;
}

function editcallback(){
	console.log("Started editing document at " + new Date());
}