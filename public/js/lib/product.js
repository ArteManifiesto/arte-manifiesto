function Product(el, data) {
    // console.log('el: ', el)
    // console.log('data: ', data)

    var id = data.id,

        likes = data.likes,
        liked = data.liked,

        buttonLike = el.querySelector('.button-like'),
        likesEl = buttonLike.querySelector('span'),

        buttonCollection = el.querySelector('.wish-list');
    // console.log('buttonLike: ', buttonLike)
    // console.log('buttonLike: ', buttonLike)

    // console.log('liked: ', liked)
    // console.log('buttonLike: ', buttonLike)

    function setup() {

        buttonLike.addEventListener('click', function () {
            // console.log('click')
            if (!user) {
                location.href = '/auth/login/?returnTo=' + location.href
                return
            }
            if (!liked) like()
            else unLike()
        })

        buttonCollection.addEventListener('click', function () {
            if (!user) {
                location.href = '/auth/login/?returnTo=' + location.href
                return
            }
            collect()
            // if (!collecte) like()
            // else unLike()
        })
    }

    function collect() {

        // var url = '/' + user.username + '/collection/all'
        var url = '/' + user.username + '/product/addToCollection'
        // var url = '/' + user.username + '/product/'
        // var
        console.log(url)
        $.ajax({
            type: "POST",
            url: url,
            datatype: "json",
            data: JSON.stringify({idProduct: id, idCollections: [2, 3]}),
            success: function (data) {
                console.log(data)
            },
            contentType: "application/json; charset=utf-8",
        });
    }

    function like() {

        var url = '/' + user.username + '/product/like'
        console.log(url)

        $.post(url, {idProduct: id}, function (data) {
            console.log(data)

            if (data.status == 200) {
                buttonLike.classList.add('active')
                buttonLike.classList.add('disabled')
                liked = true

                var newLikes = data.data.likes
                likes = newLikes
                console.log('likes :  ', likes);
                likesEl.innerHTML = likes
            }
        })
    }

    function unLike() {

        console.log('unLike')

        var url = '/' + user.username + '/product/unlike'
        console.log(url)

        $.post(url, {idProduct: id}, function (data) {
            console.log(data)

            if (data.status == 200) {
                buttonLike.classList.remove('active')
                buttonLike.classList.remove('disabled')
                liked = false

                var newLikes = data.data.likes
                likes = newLikes
                console.log('likes :  ', likes);
                likesEl.innerHTML = likes
            }
        })
    }

    setup()
}