global.setToString = function (property) {
    return {
        type: 'TEXT',
        get: function () {
            return JSON.parse(this.getDataValue(property))
        }
    }
};