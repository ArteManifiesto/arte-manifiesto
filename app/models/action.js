module.exports = function (sequelize, DataTypes) {
    var Action = sequelize.define('Action', {
            verb: DataTypes.STRING,
            ObjectId: DataTypes.INTEGER,
            OwnerId: DataTypes.INTEGER,
            data: DataTypes.TEXT
        }, {
            classMethods: {
                associate: function (models) {
                  Action.belongsTo(models.User);
                }
            },
            instanceMethods: {
              buildParts: function (options) {
                var scope = this;
                return scope.getElement(options).then(function (element) {
                  scope.setDataValue('element' , element);
                });
              },
              getElement:function(options) {
                if(this.verb === 'like-work' || this.verb === 'create-work' || this.verb === 'request-work') {
                  return global.db.Work.find({where:{id:this.ObjectId}, addUser:true, build:true, viewer: options.viewer});
                }
                if(this.verb === 'follow-user') {
                  if(options.reverse) {
                    return global.db.User.find({where:{id:this.ObjectId}});
                  }
                  return global.db.User.find({where:{id:this.ObjectId}, build:true, viewer: options.viewer});
                }
              }
            },
            hooks: {
              afterFind: global.afterFind
            }
        }
    );
    return Action;
};
