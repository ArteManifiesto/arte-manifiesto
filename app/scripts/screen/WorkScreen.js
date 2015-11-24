/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.WorkScreen = function () {
  APP.BaseScreen.call(this, 'work');
  this.collections = [];
};

APP.WorkScreen.constructor = APP.WorkScreen;
APP.WorkScreen.prototype = Object.create(APP.BaseScreen.prototype);
//
// APP.WorkScreen.prototype.listeners = function () {
//   APP.BaseScreen.prototype.listeners.call(this);
//   $('.save-collections').click(this.saveCollectionHandler);
//   $('.collections').on('.collection', this.collectionHandler);
// };
//
// APP.WorkScreen.prototype.collectionHandler = function() {
//   var id = parseInt($(this).data('id'), 10);
//   var index = this.collections.indexOf(id);
//   if(index === -1){
//       collectionsClicked.push(id);
//       $(this).addClass('selected');
//   }else {
//     collectionsClicked.splice(index, 1);
//     $(this).removeClass('selected');
//   }
// }
//
// APP.WorkScreen.prototype.saveCollectionHandler = function() {
//   $('.save-collections').hide();
//   $('.save-collections-loading').show();
//
//   var url = DataApp.currentUser.url + '/' + entity + '/add_to_collection';
//   this.requestHandler(url, {
//     idWork: element.id,
//     collections: JSON.stringify(this.collections)
//   }, this.this.saveCollectionComplete);
// }
//
// APP.WorkScreen.prototype.saveCollectionComplete = function() {
//   $('.save-collections-loading').hide();
//   $('.save-collections').show();
//   $('#lean_overlay').trigger( "click" );
// }
