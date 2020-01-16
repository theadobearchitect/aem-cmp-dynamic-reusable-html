(function($, $document) {
    "use strict";
    var FRAGMENTPATH = "./fragmentPath";
    $document.on("dialog-ready", function() {
        var $fragmentPath = $("[name='" + FRAGMENTPATH + "']"),
            cuiFragmentPath = $(".coral-fragmentPath"), cuiFragmentValue=$(".granite-value-html");
        var cfv = cuiFragmentPath.val();
        var act = cuiFragmentPath.closest("form");
		//console.log(cuiFragmentValue);
        var currentValJSON = act.attr("action") + ".2.json";
        $.getJSON(currentValJSON).done(function(currentData) {
			$.getJSON(cfv +"/_jcr_content/root.2.json").done(function(data) {
				cuiFragmentValue.val(data.defaultContent);
            });
            $(".coral-htmlfragment-tabs").on("coral-tabview:change", function(event) {
                var heading = $(event.detail.selection).text();
                if (heading !== "Context (Override)" && heading !== "Configuration (Override)" ) {
                    return;
                }
                $(".granite-context-container").first(".granite-context-items").html("");
                $(".granite-configuration-container").first(".granite-configuration-items").html("");
                if (cfv != '') {

                    var cnfgArr = [{"path":"/_jcr_content/root/content.2.json","key":"key","value":"value","c":".granite-context-container","i":".granite-context-items"},{"path":"/_jcr_content/root/config.2.json","key":"config_key","value":"config_value","c":".granite-configuration-container","i":".granite-configuration-items"}];
                    for (var i=0;i<cnfgArr.length;i++) {
                        var cnfg = cnfgArr[i];
                        $.getJSON(cfv + cnfg.path).done(function(data) {
                            if (_.isEmpty(data)) {
                                return;
                            }
                            if (this.url.indexOf("content.2") != -1){
								cnfg = cnfgArr[0];
                                console.log(cnfg);

                            }
                            else {
								cnfg = cnfgArr[1];
                            }
                            //console.log(this.url);
                            var $cfg = $(data);
                            for (var key in data) {
                                if (key.indexOf("item") != -1) {
                                    var nm = data[key][cnfg.key];
                                    var val = data[key][cnfg.value];
                                    var btn = new Coral.Textfield();
                                    btn.set("name", "./" + nm);
                                    if (currentData[nm]) {
                                        btn.set("value", currentData[nm]);
                                    }
                                    btn.set("placeholder", val);
                                    var tooltip = new Coral.Tooltip().set({
                                        content: {
                                            innerHTML: "Inherited Value " + val
                                        },
                                        placement: "right",
                                        target: "_prev",
                                        open: true
                                    });
                                    console.log(cnfg.c,cnfg.i);
                                    $(cnfg.c).first(cnfg.i).append("<div class='coral-Form-fieldwrapper'>").append("<label class='coral-Form-fieldlabel'>" + nm + "</label>").append(btn).append(tooltip).append("</div>");
                                }
                            };
                        })
                    }
                };

            });
        });

    });

})($, $(document));