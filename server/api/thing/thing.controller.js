'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var ejs = require('ejs');
var outputDir = __dirname  + '/downloads/' + 'meansible_';
var custDir = 'meansible_';
var async = require('async');
var AdmZip = require('adm-zip');
var path = require('path');

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 484;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
           cb(err,null); // something went wrong
        } else {
          // console.log(path);
          cb(null,path);
        }
        // successfully created folder
    });
}

// Generate and Send Scripts
exports.getScript = function(req, res) {
  var hostname = req.body.hostname || 'default';
  var outputDir = path.normalize(__dirname + '/../../../client/assets/downloads/meansible_' + hostname)
  // outputDir = __dirname  + '/downloads/' + 'meansible_' + hostname;
  custDir = 'meansible_' + hostname;

  async.waterfall([
    function(cb){ 
      ensureExists(outputDir, 484, function callback(err,path) {
        if (err) {
            if (err.code == 'EEXIST') {
                var rndNow = Date.now();
                outputDir = outputDir + '-' + rndNow;
                custDir = 'meansible_' + hostname + '-' + rndNow;
                ensureExists(outputDir, 484, callback); // Call again
                // return console.log("A Folder with same name already exists");
            } else {
                return console.log(err);
            };
        }

        path = path || outputDir;
        cb(null,path);
      });
    },

    function(path,cb){
      // console.log("hhhhhhhhhhhh" + "  " + path)
      var jsondata = req.body;
      //VagrantFile generation
      fs.readFile(__dirname + "/pages/vagrant.ejs", 'utf-8', function(err, data) {      
        // console.log(data) 
        var vagrant_out = ejs.render(data, {data:jsondata});
        var vagrantFile = path + '/Vagrantfile';
        fs.outputFile(vagrantFile, vagrant_out, function(err) {
          console.log(err) 
        });  
      })

      //Playbook generation
      fs.readFile(__dirname + "/pages/playbook.ejs", 'utf-8', function(err, data) {
        var playbook_out = ejs.render(data, {data:jsondata});
        var playbookFile = path + '/playbook.yml';
        fs.outputFile(playbookFile, playbook_out, function(err) {
          console.log(err) // => null
        });
      })

      //Create Role Files
      jsondata.roles.forEach(function(role){
        fs.readFile(__dirname + "/pages/roles/" + role + "/tasks/main.ejs", 'utf-8', function(err, data) {
          // console.log(data);
          var role_out = ejs.render(data, {data:jsondata});
          var roleFile = path + '/roles/'+ role + '/tasks/main.yml';
          fs.outputFile(roleFile, role_out, function(err) {
            console.log(err) // => null
          });
        })
      });   

      setTimeout(function(){
        cb(null, path, 'generated');
      }, 1000);  
      
    },

    function(path1,arg1,cb){
      // console.log("The path is : ----" ,path1,"-------")
      var zip = new AdmZip();
      zip.addLocalFolder(path1);
      zip.writeZip(path1 + ".zip");      
      cb(null,"/assets/downloads/" + path.basename(path1 + ".zip"));
    }
  ], function cb (err,result){
      console.log(result);
      res.send({
        url: result
      });
  });


  // res.sendfile('meansible.zip');

  // res.json({"message": "folder created"});
  // var outputFile = '/assets/downloads/first.zip';
  // res.send({
  //   url: outputFile
  // });
};


