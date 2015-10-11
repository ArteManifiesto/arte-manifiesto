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

DataApp.workLike = DataApp.baseUrl + 'juliocanares/work/like';
DataApp.workUnLike = DataApp.baseUrl + 'juliocanares/work/unlike';

DataApp.productLike = DataApp.baseUrl + 'juliocanares/work/like';
DataApp.productUnLike = DataApp.baseUrl + 'juliocanares/work/unlike';

DataApp.searchCollections = DataApp.baseUrl + 'artjam/collections/page-1';

DataApp.loginRedirect = '/auth/login/?returnTo=' + location.href;

DataApp.currentUrl = window.location.href;
