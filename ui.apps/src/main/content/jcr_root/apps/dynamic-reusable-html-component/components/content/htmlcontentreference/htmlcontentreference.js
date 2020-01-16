/*******************************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 ******************************************************************************/
;
use(function () {
    "use strict";
    var PATTERN = java.util.regex.Pattern;
    var constants = Packages.com.adobe.cq.xf.ExperienceFragmentsConstants;
    var properties = resource.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
    if (properties == null) {
        return {
            fragmentPath: null,
            defaultContent:null
        };
    }

    var fragmentPath = properties.get("fragmentPath");
    if (fragmentPath == null || fragmentPath.equals("")) {
        return {
            fragmentPath: fragmentPath,
            defaultContent:null
        };
    }

    var fragment = resolver.getResource(fragmentPath);
    if (fragment == null) {
        return {
            fragmentPath: null,
            defaultContent:null
        };
    }
    var fragmentContent = fragment.getChild("jcr:content");
    if (fragmentContent == null) {
        return {
            fragmentPath: null,
            defaultContent:null
        };
    }



    var variation = null;
    var variationPath = fragmentPath;
    if (fragmentContent.isResourceType(constants.RT_EXPERIENCE_FRAGMENT_MASTER)) {
        var children = fragment.getChildren();
        for (var idx in children) {
            var res = children[idx];
            var content = res.getChild("jcr:content");
            if (content != null) {
                var props = content.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
                if (props.get(constants.PN_XF_MASTER_VARIATION) == true) {
                    variation = res;
                    variationPath = variation.getPath();
                }
            }
        }
    }

    //get the content properties if any
    if (variationPath != null) {
        var defaultContent = null;
        var originalHtmlContentResPath = variationPath + '/jcr:content' + '/root';
        var originalHtmlRes  = resolver.getResource(originalHtmlContentResPath);
        if (originalHtmlRes != null) {
            var props = originalHtmlRes.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
            defaultContent = props.get("defaultContent");
        }
        if (defaultContent != null) {
            var contextDataPath = variationPath + '/jcr:content' + '/root/content';
            var contextDataRes  = resolver.getResource(contextDataPath);
            if (contextDataRes != null) {
                var contextDataResChildren = contextDataRes.getChildren();
                for (var idx in contextDataResChildren) {
                    var res = contextDataResChildren[idx];
                    var props = res.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
                    var propName = props.get("key");
                    var valueToReplace = properties.get(propName,props.get("value"));
                    defaultContent = defaultContent.replaceAll(PATTERN.quote( "${" + propName + "}" ),valueToReplace);
                }
            }
            //config
            var configDataPath = variationPath + '/jcr:content' + '/root/config';
            var configDataRes  = resolver.getResource(configDataPath);
            if (configDataRes != null) {
                var configDataResChildren = configDataRes.getChildren();
                for (var idx in configDataResChildren) {
                    var res = configDataResChildren[idx];
                    var props = res.adaptTo(Packages.org.apache.sling.api.resource.ValueMap);
                    var propName = props.get("config_key");
                    var valueToReplace = properties.get(propName,props.get("config_value"));
                    defaultContent = defaultContent.replaceAll(PATTERN.quote( "${" + propName + "}" ),valueToReplace);
                }
            }
        }
    }
    return {
        defaultContent:defaultContent,
        variationResource: variation,
        fragmentPath: variationPath + '/jcr:content'
    }
});