module.exports = function (sequelize, DataTypes) {
  var Collection = sequelize.define('Collection', {
      name: {
        type: DataTypes.STRING,
        set: function (value) {
          global.nameSlugify(this, value);
        }
      },
      nameSlugify: DataTypes.STRING,
      description: DataTypes.TEXT,
      public: {type: DataTypes.BOOLEAN, defaultValue: true},
      featured: {type: DataTypes.BOOLEAN, defaultValue: false}
    }, {
      classMethods: {
        associate: function (models) {
          Collection.belongsToMany(models.Work, {through: 'CollectionWork'});
          Collection.belongsTo(models.User, {onDelete: 'cascade'});
        }
      },
      instanceMethods: {
        buildParts: function (options) {
          var scope = this;
          return global.db.Sequelize.Promise.all([
            scope.numOfWorks(),
            scope.works()
          ]).then(function (result) {
            scope.setDataValue('numOfWorks', result[0]);
            scope.setDataValue('works', result[1]);
          });
        },
        numOfWorks: function () {
          var query = {attributes: [[global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']]};
          return this.getWorks(query).then(function (result) {
            return result[0].getDataValue('total');
          });
        },
        works: function () {
          var query = {
            include: [{model: global.db.User}], limit: 3,
            where: {public: true},
            order: [[global.db.sequelize.col('CollectionWork.createdAt'), 'DESC']]
          };
          return this.getWorks(query);
        }
      },
      hooks: {
        beforeDestroy: function (collection, options, fn) {
          collection.setWorks(null).then(function () {
            fn(null, collection);
          });
        },
        beforeFind: global.beforeFind,
        afterFind: global.afterFind
      }
    }
  );
  return Collection;
};
