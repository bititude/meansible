'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var ejs = require('ejs');
var outputDir = __dirname  + '/downloads/' + 'meansible_';
var custDir = 'meansible_';
var async = require('async');
var AdmZip = require('adm-zip');
var JSZip = require('jszip');
var path = require('path');

// function ensureExists(path, mask, cb) {
//     if (typeof mask == 'function') { // allow the `mask` parameter to be optional
//         cb = mask;
//         mask = 484;
//     }
//     fs.mkdir(path, mask, function(err) {
//         if (err) {
//            cb(err,null); // something went wrong
//         } else {
//           // console.log(path);
//           cb(null,path);
//         }
//         // successfully created folder
//     });
// }


exports.downloadGen = function(req, res, next) {
  var hostname = req.body.hostname || 'default';
  var outputDir = path.normalize(__dirname + '/../../../client/assets/downloads/meansible_' + hostname)
  // outputDir = __dirname  + '/downloads/' + 'meansible_' + hostname;
  custDir = 'meansible_' + hostname;

  async.waterfall([
    function(cb){
      var jsondata = req.body;
      //VagrantFile generation
      fs.readFile(__dirname + "/pages/vagrant.ejs", 'utf-8', function(err, data) {      
        var vagrantFileBuff = ejs.render(data, {data:jsondata});
        var payload = {};
        payload.vagrantFile = vagrantFileBuff;
        cb(null,payload);
      })
    },
    
    function(payload,cb){
      var jsondata = req.body;
      //VagrantFile generation
      fs.readFile(__dirname + "/pages/playbook.ejs", 'utf-8', function(err, data) {      
        var playbookFileBuff = ejs.render(data, {data:jsondata});        
        payload.playbookFile = playbookFileBuff;
        cb(null,payload);
      })
    },  

    function(payload,cb){
      var jsondata = req.body;
      payload.roles = {};
      //Create Role Files
      jsondata.roles.forEach(function(role){
        fs.readFile(__dirname + "/pages/roles/" + role + "/tasks/main.ejs", 'utf-8', function(err, data) {
          // console.log(data);
          var role_out = ejs.render(data, {data:jsondata});
          payload.roles[role] = role_out;          
        })
      }); 

      setTimeout(function(){
        cb(null,payload);
      }, 1000);  
      
    },
    function(payload,cb){
      // var zip = new AdmZip();
      // zip.addLocalFolder(path1);
      // zip.writeZip(path1 + ".zip");      
      // cb(null,"/assets/downloads/" + path.basename(path1 + ".zip"));

      var zip = new JSZip();
      var hostname = req.body.hostname || 'default';
      var outputFile = path.normalize(__dirname + '/../../../client/assets/downloads/meansible_' + hostname)

      if(payload.vagrantFile) {
        zip.file("Vagrantfile", payload.vagrantFile);
      }

      if(payload.playbookFile) {
        zip.file("playbook.yml", payload.playbookFile);
      }    

      _.forIn(payload.roles, function(value, key) {
        zip.file("roles/"+key+"/tasks/main.yml", value);
      });

      // var content = zip.generate({type:"blob"});
      var buffer = zip.generate({type:"nodebuffer"});

      fs.exists(outputFile + ".zip", function callback(exists) {
        if(exists){
          var rndNow = Date.now();
          outputFile = outputFile + '-' + rndNow;
          fs.exists(outputFile + ".zip", callback);          
        }
         fs.writeFile(outputFile + ".zip", buffer, function(err) {
           if (err) console.log(err);
           cb(null,"/assets/downloads/" + path.basename(outputFile + ".zip"));
         });
      });
      
    }
  ], function cb (err,result){
      console.log(result);
      req.filepath = result;
      return next();     
  });

}


// Generate and Send Scripts
exports.getScript = function(req, res) {
  console.log(req.filepath)
  res.send({
    url: req.filepath
  });
};


