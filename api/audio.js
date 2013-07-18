var db      = require('../config/database')
  , config  = require('../config/config.json')
  , Audio   = db.audio
  , User    = db.user;

exports.zones = function(req, res) {
  Audio.list(res, function(zones){
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
  Audio.find({ where:{ audioId:req.params.id }}).success(function(a){
    res.json(a.parse());
  });
}

exports.state = function(req, res) {
  var vol     = req.body.volume
    , state   = req.body.state
    , zone    = req.params.id
    , client  = require('../app').client();
    
  Audio.find({where:{ zone:zone }}).success(function(a){
    if(a == undefined) res.json({ error:'Invalid zone' });
    //Turn on
    if(state == 'on' || (!a.active && vol > 0))
      a.setState(client, true);
    //Turn off
    if(state == 'off')
      a.setState(client, false);
    //Set volume
    if(vol >= 0 && vol <= 100 && vol != undefined)
      a.setVolume(client, vol)
    //Respond to client
    res.json(a.parse());
  })
}