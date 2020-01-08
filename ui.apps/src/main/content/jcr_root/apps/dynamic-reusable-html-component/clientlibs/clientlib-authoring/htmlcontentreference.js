(function($, $document) {
    "use strict";
    var FRAGMENTPATH = "./fragmentPath";
    $document.on("dialog-ready", function() {
        var $fragmentPath = $("[name='" + FRAGMENTPATH + "']"),
            cuiFragmentPath = $(".coral-fragmentPath");
        var cfv = cuiFragmentPath.val();
        var act = cuiFragmentPath.closest("form");
        var currentValJSON = act.attr("action") + ".2.json";
        $.getJSON(currentValJSON).done(function(currentData) {
            $(".coral-htmlfragment-tabs").on("coral-tabview:change", function(event) {
                var heading = $(event.detail.selection).text();
                if (heading !== "Context (Override)") {
                    return;
                }
                $(".granite-configuration-container").first(".granite-configuration-items").html("");
                if (cfv != '') {
                    $.getJSON(cfv + '/_jcr_content/root/content.2.json').done(function(data) {
                        if (_.isEmpty(data)) {
                            return;
                        }
                        var $cfg = $(data);
                        for (var key in data) {
                            if (key.indexOf("item") != -1) {
                                var nm = data[key]["key"];
                                var val = data[key]["value"];
                                var btn = new Coral.Textfield();
                                btn.set("name", "./" + nm);
                                if (currentData[nm]) {
                                    btn.set("value", currentData[nm]);
                                }
                                btn.set("placeholder", nm);
                                var tooltip = new Coral.Tooltip().set({
                                    content: {
                                        innerHTML: "Inherited Value " + val
                                    },
                                    placement: "right",
                                    target: "_prev",
                                    open: true
                                });
                                $(".granite-configuration-container").first(".granite-configuration-items").append("<div class='coral-Form-fieldwrapper'>").append("<label class='coral-Form-fieldlabel'>" + nm + "</label>").append(btn).append(tooltip).append("</div>");
                            }
                        };
                    })
                };

            });
        });

    });

})($, $(document));