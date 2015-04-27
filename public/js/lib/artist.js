function Artist(el, data) {

    var id = data.id,

        followers = data.followers,
        following = data.following,

        buttonFollow = el.querySelector('.' + data.buttonFollowClass);


    function setup() {

        buttonFollow.addEventListener('click', function () {

            if (!following) follow()
            else unFollow()
        })
    }

    function follow() {
        $.post('/user/follow/', {idUser: id}, function (data) {
            console.log(data)
            if (data.code == 202) {
                buttonFollow.classList.add('disabled')
                following = true
            }
        })
    }

    function unFollow() {

        $.post('/user/unfollow/', {idUser: id}, function (data) {
            console.log(data)
            if (data.code == 202) {
                buttonFollow.classList.remove('disabled')
                following = false
            }
        })
    }

    setup()
}