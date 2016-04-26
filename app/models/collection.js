module.exports = function(sequelize, DataTypes) {
  var Collection = sequelize.define('Collection', {
    name: {
      type: DataTypes.STRING,
      set: function(value) {
        global.nameSlugify(this, value);
      }
    },
    nameSlugify: DataTypes.STRING,
    description: DataTypes.TEXT,
    meta: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Collection.belongsToMany(models.Work, {
          through: 'CollectionWork'
        });
        Collection.belongsToMany(models.Product, {
          through: 'CollectionProduct'
        });
        Collection.belongsTo(models.User, {
          onDelete: 'cascade'
        });
      }
    },
    instanceMethods: {
      buildParts: function(options) {
        var scope = this;
        return global.db.Sequelize.Promise.all([
          scope.numOfItems(),
          scope.items()
        ]).then(function(result) {
          scope.setDataValue('numOfItems', result[0]);
          scope.setDataValue('items', result[1]);
        });
      },
      numOfItems: function() {
        var query = {
          attributes: [
            [global.db.sequelize.fn('COUNT',
              global.db.sequelize.col('id')), 'total']
          ]
        };
        var afterGet = function(result) {
          return result[0].getDataValue('total');
        }
        if (this.meta === 'works') {
          return this.getWorks(query).then(afterGet);
        } else {
          return this.getProducts(query).then(afterGet);
        }
      },
      items: function() {
        var query = {
          include: [{
            model: global.db.User
          }],
          limit: 3,
          where: {}
        };
        if (this.meta === 'works') {
          query.where.public = true;
          query.order = [
            [global.db.sequelize.col('CollectionWork.createdAt'), 'DESC']
          ];
          return this.getWorks(query);
        } else {
          query.where.isActive = true;
          query.order = [
            [global.db.sequelize.col('CollectionProduct.createdAt'), 'DESC']
          ];
          return this.getProducts(query);
        }
      }
    },
    hooks: {
      beforeDestroy: function(collection, options, fn) {
        collection.setWorks(null).then(function() {
          collection.setProducts(null).then(function() {
            fn(null, collection);
          });
        });
      },
      beforeFind: global.beforeFind,
      afterFind: global.afterFind
    }
  });
  return Collection;
};