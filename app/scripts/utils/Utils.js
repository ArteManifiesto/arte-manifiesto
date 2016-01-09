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
  getUrlParameter: function (sParam) {
    var sPageURL = window.location.search.substring(1)
    var sURLVariables = sPageURL.split('&')
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=')
      if (sParameterName[0] == sParam)
        return sParameterName[1]
    }
  },
  capitalize: function (text) {
    return text.charAt(0).toUpperCase() + text.substring(1);
  },
  getData: function (params) {
    return APP.RestClientManager.instance.execute(params);
  },
  changeUrl: function (page, url) {
    DataApp.currentUrl = url;
    if (typeof (history.pushState) != 'undefined') {
      var tempUrl = {page: page, url: url};
      history.pushState(tempUrl, tempUrl.page, tempUrl.url);
    } else {
      window.location.href = "/";
    }
  },
  addImageFilter: function (url, filter) {
    return url.replace('upload/', 'upload/' + filter + '/');
  },
  checkAuthentication: function () {
    if (!DataApp.currentUser) {
      if (window.location.href.indexOf('auth') === -1)
        Cookies.set('return_to', window.location.href);

      window.location.href = DataApp.loginUrl;
    }
  },
  share: {
    facebook: function (options, complete) {
      options.method = 'feed';
      window.FB && FB.ui(options, complete);
    }
  },
  shareFBWork: function (work) {
    $('#lean_overlay').trigger("click");
    Utils.share.facebook({
      link: DataApp.baseUrl + '/user/' + work.User.username + '/work/' + work.nameSlugify,
      picture: Utils.addImageFilter(work.photo, 'w_1200,h_630,q_60,c_crop'),
      name: work.name,
      caption: 'Arte Manifiesto',
      description: work.description
    });
  },
  removeURLParameter: function (url, parameter) {
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(parameter) + '=';
      var pars = urlparts[1].split(/[&;]/g);

      for (var i = pars.length; i-- > 0;) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url = urlparts[0] + '?' + pars.join('&');
      return url;
    } else {
      return url;
    }
  },
  updateQueryStringParameter : function (uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }
};
