module.exports = function(sequelize, DataTypes) {
  var dt = require('../lib/datetime')
  
  return sequelize.define('security', {
    state: { type:DataTypes.ENUM, values:['off', 'day', 'night', 'vacation', 'day armed', 'disarming', 'arming'] },
  }, {
    freezeTableName: true,
    instanceMethods: {
      parse:function(){
        return { id:this.id, state:this.state, timestamp:dt.dateTimeFormat(this.createdAt) };
      },
    },
    classMethods: {
      
      entries:function(res){
        this.all({ order:'createdAt DESC' }).success(function(entries){
          entries.forEach(function(e){ e = e.parse() })
          res.json({ latest:entries[0], history:entries })
        })
      },
    }
  });
};