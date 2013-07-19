var db      = require('../config/database')
  , config  = require('../config/config.json')
  , Audio   = db.audio;

exports.list = function(req, res) {
  Audio.all().success(function(zones){
    zones.forEach(function(a){ a = a.parse(); })
    res.json({
      'zones':zones,
      'sources':[{
        sourceId:1,
        name:"Hugh's iPhone",
      }]
    });
  });
}

exports.zone = function(req, res) {
  Audio.find(req.params.id).success(function(a){
    res.json(a.parse());
  });
}

exports.state = function(req, res) {
  var vol     = req.body.volume
    , state   = req.body.state
    , zone    = req.params.id
    , client  = require('../app').client();
    
  Audio.find(zone).success(function(a){
    if(a == undefined) res.json({ error:'Invalid zone' });
    //Turn on
    if(state == 'on' || (a.state == 'off' && vol))
      a.setState(client, 'on');
    //Turn off
    else if(state == 'off' || state == 'mute')
      a.setState(client, state);
    //Set volume
    if(vol >= 0 && vol <= 100 && vol != undefined)
      a.setVolume(client, vol);
    a.save().success(function(a){
      //Respond to client
      res.json(a.parse());
    })
  })
}