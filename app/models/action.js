module.exports = function (sequelize, DataTypes) {
    var Action = sequelize.define('Action', {
            verb: DataTypes.STRING,
            ObjectId: DataTypes.INTEGER,
            OwnerId: DataTypes.INTEGER,
            data: DataTypes.TEXT,
            seen: {type: DataTypes.BOOLEAN, defaultValue: false}
        }, {
            classMethods: {
                associate: function (models) {
                  Action.belongsTo(models.User, {onDelete: 'cascade'});
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
                if(this.verb === 'like-work' || this.verb === 'create-work' || this.verb === 'request-work' || this.verb === 'review-work') {
                  return global.db.Work.find({where:{id:this.ObjectId},
                    build:true, viewer: options.viewer}).then(function(work){
                      return work.getUser({build:true, viewer: options.viewer}).then(function(user){
                        work.setDataValue('User', user);
                        return work;
                      });
                    });
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
              beforeFind: global.beforeFind,
              afterFind: global.afterFind
            }
        }
    );
    return Action;
};
