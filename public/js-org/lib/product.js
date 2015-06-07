function Product(el, data) {
    // console.log('el: ', el)
    // console.log('data: ', data)

    var id = data.id,

        likes = data.likes,
        liked = data.liked,
    // username = data.username,
    // nameSlugify = data.nameSlugify,

        buttonLike = el.querySelector('.' + data.buttonLikeClass),
        likesEl = buttonLike.querySelector('.button-liner__number');

    console.log('liked: ', liked)
    // console.log('buttonLike: ', buttonLike)

    function setup() {

        buttonLike.addEventListener('click', function () {
            // console.log('click')
            if (!user) {
                location.href = '/auth/login'
                return
            }
            if (!liked) like()
            else unLike()
        })
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
                console.log('like :  ', newLikes);
                likesEl.innerHTML = likes
            }
        })
    }

    function unLike() {

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
                likesEl.innerHTML = likes
            }
        })
    }

    setup()
}