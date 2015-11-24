/**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */
Utils = {
    isMobile: {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (Utils.isMobile.Android() || Utils.isMobile.BlackBerry() ||
            Utils.isMobile.iOS() || Utils.isMobile.Opera() || Utils.isMobile.Windows());
        }
    },
    paginationButtons: function (currentPage, totalPages, maxButtons) {
        var i, result = [1], middle = Math.floor(maxButtons / 2);

        if (currentPage > totalPages)
            return null;

        if (totalPages < maxButtons) {
            for (i = 2; i < totalPages + 1; i++)
                result.push(i);
            return result;
        }

        if (currentPage <= middle && currentPage > 0)
            for (i = 2; i < maxButtons; i++)
                result.push(i);

        var maxLimit = (totalPages - middle);

        if (currentPage > middle && currentPage < maxLimit) {
            var steps = ((maxButtons - 3) / 2);
            for (i = currentPage - steps; i < currentPage + steps + 1; i++)
                result.push(i);
        }

        if (currentPage >= maxLimit && currentPage <= totalPages) {
            for (i = (totalPages - (maxButtons - 2) ); i < totalPages; i++)
                result.push(i);
        }

        result.push(totalPages);
        return result;
    },
    getUrlParameter: function(sParam) {
        var sPageURL = window.location.search.substring(1)
        var sURLVariables = sPageURL.split('&')
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=')
            if (sParameterName[0] == sParam)
                return sParameterName[1]
        }
    },
    capitalize: function(text) {
        return text.charAt(0).toUpperCase() + text.substring(1);
    },
    getData : function (params) {
        return APP.RestClientManager.instance.execute(params);
    },
    changeUrl: function(page, url) {
      DataApp.currentUrl = url;
       if (typeof (history.pushState) != 'undefined') {
           var tempUrl = {page: page, url: url};
           history.pushState(tempUrl, tempUrl.page, tempUrl.url);
       } else {
         window.location.href = "/";
       }
    },
    addImageFilter: function(url, filter) {
      return url.replace('upload/', 'upload/' + filter +'/');
    },
    checkAuthentication: function() {
      if (!DataApp.currentUser)
        window.location.href = DataApp.loginUrl + '/?returnTo=' + window.location.href;
    },
    share: {
      facebook: function(options, complete) {
        options.method = 'feed';
        window.FB && FB.ui(options, complete);
      }
    }
};
