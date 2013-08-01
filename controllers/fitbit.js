function API(client){
  
  function apiHandle(res){
    return function(err, json) {
      if(err) return res.status(500).json(err)
      res.status(200).json(json)
    }
  }
  
  this.auth = function(req, res){ client.getAccessToken(req, res, apiHandle(res)) }
  
  this.profile = function(req, res){ client.user('profile', req, apiHandle(res)) }
  this.devices = function(req, res){ client.user('devices', req, apiHandle(res)) }
}

exports.API = API;