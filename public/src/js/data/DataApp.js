/**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */

DataApp = {};

DataApp.baseUrl = 'http://127.0.0.1:3000/';
DataApp.templatesUrl = DataApp.baseUrl + 'resources/templates/';

DataApp.loginUrl = DataApp.baseUrl + 'auth/login';

DataApp.searchUrl = DataApp.baseUrl + 'search/';
DataApp.searchWorks = DataApp.searchUrl + 'works/category/all/page-1/';
DataApp.searchUsers = DataApp.searchUrl + 'users/specialties/all/page-1/';
DataApp.searchProducts = DataApp.searchUrl + 'products/type/all/page-1/';

DataApp.workLike = DataApp.baseUrl + user.username + '/work/like';
DataApp.workUnLike = DataApp.baseUrl + user.username + '/work/unlike';

DataApp.productLike = DataApp.baseUrl + user.username + '/work/like';
DataApp.productUnLike = DataApp.baseUrl + user.username + '/work/unlike';

DataApp.searchCollections = DataApp.baseUrl + 'artjam/collections/page-1';

DataApp.loginRedirect = '/auth/login/?returnTo=' + location.href;

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
    }
}