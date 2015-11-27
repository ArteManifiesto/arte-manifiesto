Dashboard.ObjectResizer = {
init: function (e) {
    this.dashboard = e, this.canvas = canvas
}, isVector: function (e) {
    return false;
},
resizeToFit: function (e, t, n) {
    t || (t = e.originalWidth), n || (n = e.originalHeight)
    if (e.type == "image" && !this.isVector(e)) {
        if (!t || !n)return this;
        this.resizeObjectPerDPI(e, t, n)
    }
    return canvas.setActiveObject(e.setCoords()), this
},
getHeightForCurrentSideDPI: function (e, t, n) {
    return e.originalHeight / t * n
},
getWidthForCurrentSideDPI: function (e, t, n) {
    return e.originalWidth / t * n
},
getCurrentSideWidth: function () {
    return d.designs[0].dimensions[2]
},
getCurrentSideHeight: function () {
    return d.designs[0].dimensions[3]
},
findBestUsableHeight: function (e) {
    return this._findBestUsable("Height", e)
},
findBestUsableWidth: function (e) {
    return this._findBestUsable("Width", e)
},
_findBestUsable: function (e, t) {

    var n = 200;

    var r = 100;

    var i = 50;

    var s = 20;

    var o = d.designs[0].dpi;

    var u = "get" + e + "ForCurrentSideDPI";

    for (var a = n; a >= r; a -= i) {
        var f = this[u](t, a, o);
        if (f > s)return f
    }
    var l = this[u](t, r, o);
    return l
},
findSideToScaleBy: function () {
    return this.getCurrentSideWidth() > this.getCurrentSideHeight() ? "Height" : "Width"
},
resizeObjectPerDPI: function (e, t, n) {
    e.originalWidth = parseInt(t, 10);
    e.originalHeight = parseInt(n, 10);
    var r = this.findSideToScaleBy(e),
            i = this["findBestUsable" + r](e), s = this["getCurrentSide" + r]();

    e["scaleTo" + r](Math.min(i, s));


    canvas.renderAll();

},
isBelowMinDPI: function (e) {
    if (this.isVector(e))return!1;
    var basicDPI = 200;
    var showDPI = d.designs[0].dpi;

    maxHeight = this.getHeightForCurrentSideDPI(e, basicDPI, showDPI);
    maxWidth = this.getWidthForCurrentSideDPI(e, basicDPI, showDPI);

    return e.getHeight() > maxHeight || e.getWidth() > maxWidth
}
}
