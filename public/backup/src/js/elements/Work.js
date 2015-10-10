/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Work = function (data) {
    APP.BaseElement.call(this, data, 'work');
    this.liked = this.data.liked;
};

APP.Work.prototype = Object.create(APP.BaseElement.prototype);

APP.Work.constructor = APP.Work;

APP.Work.prototype.setupUI = function () {
    this.hammer = new Hammer.Manager(this.rawView);
    this.hammer.add(new Hammer.Tap({event: 'doubletap', taps: 2}));
    this.hammer.add(new Hammer.Tap({event: 'singletap'}));
    this.hammer.get('doubletap').recognizeWith('singletap');
    this.hammer.get('singletap').requireFailure('doubletap');

    this.likeBtn = this.view.find('.social-item');
};

APP.Work.prototype.listeners = function () {
    if (Utils.isMobile.any()) {
        this.hammer.on("singletap", this.gotoSingle.bind(this));
        this.hammer.on("doubletap", this.likeToggle.bind(this));
    } else {
        this.likeBtn.click(this.likeToggle.bind(this));
        this.view.click(this.gotoSingle.bind(this));
    }
};

APP.Work.prototype.likeToggle = function (event) {
    this.checkLogged();

    var params = {
        data: {idWork: this.data.id},
        url: DataApp[!this.liked ? 'workLike' : 'workUnLike']
    };

    this.callToApi(params).done(this.afterLikeApi.bind(this));

    if (event.stopPropagation)
        event.stopPropagation();
};

APP.Work.prototype.afterLikeApi = function (data) {
    if (data.status === 200) {
        if (Utils.isMobile.any())
            this.likeBtn.toggleClass('fade');
        else
            this.likeBtn.toggleClass('active');
        this.liked = !this.liked;
    }
};