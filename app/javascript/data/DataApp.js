/**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */

DataApp = {};
DataApp.currentUser;
DataApp.baseUrl = 'http://127.0.0.1:3000/';
DataApp.loginUrl = DataApp.baseUrl + 'auth/login';
DataApp.discoverWorks = DataApp.baseUrl + '/works/category/all/page-1/';
DataApp.discoverUsers = DataApp.baseUrl + '/users/specialties/all/page-1/';
DataApp.discoverProducts = DataApp.baseUrl + '/products/type/all/page-1/';

DataApp.searchCollections = DataApp.baseUrl + 'artjam/collections/page-1';
DataApp.loginRedirect = DataApp.loginUrl + '/?returnTo=' + location.href;

DataApp.currentUrl = window.location.href;
