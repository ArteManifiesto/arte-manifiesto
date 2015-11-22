/**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */

DataApp = {};
DataApp.currentUser;
DataApp.baseUrl = window.location.origin + '/';
DataApp.baseTitle = 'Arte Manifiesto | ';
DataApp.loginUrl = DataApp.baseUrl + 'auth/login';
DataApp.discoverWorks = DataApp.baseUrl + '/works/category/all/page-1/';
DataApp.discoverUsers = DataApp.baseUrl + '/users/specialties/all/page-1/';
DataApp.discoverProducts = DataApp.baseUrl + '/products/type/all/page-1/';
DataApp.searchCollections = DataApp.baseUrl + 'artjam/collections/page-1';

DataApp.currentUrl = window.location.href.replace(/\/$/g, '');
DataApp.currentUrl = DataApp.currentUrl.replace(/#_=_$/g, '');

Events = {
  LOAD_START: 'loadStart',
  LOAD_END: 'loadEnd'
};
