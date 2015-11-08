$(document).ready(function() {
  $('.share-btn').on('click',function(){
    $('.add-collection').hide();
    $('.social-share').toggle();
  });
  var following = false;

  if(DataApp.currentUser && !owner) {
  var url = DataApp.currentUser.url + '/isFollowing';
  $.post(url, {idUser:element.User.id}, function (response) {
    if(response.status === 200) {
      following = response.data.following;
      if(response.data.following)
        $('.am-Follow-button').addClass('following').text('-Siguiendo');
    }
  });

  var url = DataApp.currentUser.url + '/collection/all';
  $.post(url, {}, function (response) {
    if(response.status === 200) {
      var collections = response.data.collections;
      var item = '<li class="collection" data-id="<%=id%>"><p><%=name%></p><i class="fa fa-check"></i></li>'
      for(var i= 0; i <collections.length; i++) {
        $('.collections').append($(_.template(item)(collections[i])));
      }

      var url = DataApp.currentUser.url + '/'+entity+'/inside_collection';
      var payload = {};
      payload['id' + Utils.capitalize(entity)] = element.id;
      $.post(url,payload, function (response) {
        var collections = response.data.collections;
        for(var i= 0; i <collections.length; i++) {
          var id = collections[i].id;
          $('.collection[data-id='+id+']').addClass('selected');
          collectionsClicked.push(id);
        }
      });
    }
  });
}

  $('.collect-btn').on('click',function() {
    $('.add-collection').toggle();
    $('.social-share').hide();
  });


  for (var i = 0; i <reviews.length; i++) {
    $('.reviews-items-container').append(new APP.Review(reviews[i]).view);
  }

  for (var i = 0; i <more.length; i++) {
    more[i].entity = entity;
  }

  for (var i = 0; i <similar.length; i++) {
    similar[i].entity = entity;
  }

  new APP.Viewer('carrouselItem', $('.more'), null, more);
  new APP.Viewer('carrouselItem', $('.similar'), null, similar);

  $('.am-Follow-button').click(function(event){
    if(following) {
      var url = DataApp.currentUser.url + '/unfollow/';
      $.post(url,{idUser: element.User.id}, function (response) {
        if(response.status === 200) {
          following = false;
          $('.am-Follow-button').removeClass('following').text('+Seguir');
        }
      });
    }else {
      var url = DataApp.currentUser.url + '/follow/';
      $.post(url,{idUser: element.User.id}, function (response) {
        if(response.status === 200) {
          following = true;
          $('.am-Follow-button').addClass('following').text('-Siguiendo');
        }
      });
    }
  });

  $('.add-collection-form').submit(function(event){
    event.preventDefault();
    var url = DataApp.currentUser.url + '/collection/create';
    $.post(url, $(this).serialize(), function (response) {
      if(response.status === 200) {
        var item = '<li class="collection selected" data-id="<%=id%>"><p><%=name%></p><i class="fa fa-check"></i></li>'
        var collection = response.data.collection;
        collectionsClicked.push(collection.id);
        $('.collections').append($(_.template(item)(collection)));
      }
    });
  });

  $('.like-btn').click(function(){
    var payload = {};
    payload['id' + Utils.capitalize(entity)] = element.id;
    if(!element.liked) {
      var url = DataApp.currentUser.url + '/'+entity+'/like';
      $.post(url, payload, function (response) {
        if(response.status === 200) {
          element.liked = true;
          $('.likes').text(response.data.likes)
          $('.like-btn').parent().addClass('active');
        }
      });
    }else {
      var url = DataApp.currentUser.url + '/'+entity+'/unlike';
      $.post(url, payload, function (response) {
        element.liked = false;
        $('.likes').text(response.data.likes)
        if(response.status === 200) {
          $('.like-btn').parent().removeClass('active');
        }
      });
    }
  });

  $('.review-form').submit(function(event){
    event.preventDefault();
    var url = DataApp.currentUser.url + '/'+entity+'/review/create';
    $.post(url, $(this).serialize(), function (response) {
      if(response.status === 200) {
        $('.value-input').val('');
        $('.reviews-items-container').append(new APP.Review(response.data.review).view);
      }
    });
  });

  var collectionsClicked = [];
  $('.collections').on("click", ".collection", function() {
    var id = parseInt($(this).data('id'),10);
    var index = collectionsClicked.indexOf(id);
    if(index === -1){
        collectionsClicked.push(id);
        $(this).addClass('selected');
    }else {
      collectionsClicked.splice(index, 1);
      $(this).removeClass('selected');
    }
  });

  $('.index').click(function() {
    Utils.changeUrl('tags', '/user/' + element.User.username + '/'+entity+'/' + element.nameSlugify);
    $('.index-container').show();
    $('.reviews-container').hide();
    $('.tags-container').hide();
  });

  $('.reviews').click(function() {
    Utils.changeUrl('tags', '/user/' + element.User.username + '/'+entity+'/' + element.nameSlugify + '/reviews');
    $('.index-container').hide();
    $('.reviews-container').show();
    $('.tags-container').hide();
  });

  $('.tags').click(function(){
    Utils.changeUrl('tags', '/user/' + element.User.username + '/'+entity+'/' + element.nameSlugify + '/tags');
    $('.index-container').hide();
    $('.reviews-container').hide();
    $('.tags-container').show();
  });

  $('.save-collections').click(function() {
    var url = DataApp.currentUser.url + '/'+entity+'/add_to_collection';
    var payload = {collections: JSON.stringify(collectionsClicked)};
    payload['id' + Utils.capitalize(entity)] = element.id;
    $.post(url, payload, function (response) {
      console.log(response);
    });
  });
});
