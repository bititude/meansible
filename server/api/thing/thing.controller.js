'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var ejs = require('ejs');
var outputDir = __dirname  + '/downloads/' + 'meansible_';

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 484;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
           cb(err,null); // something went wrong
        } else {
          console.log(path);
          cb(null,path);
        }
        // successfully created folder
    });
}


// function callback(err,path) {
//     if (err) {
//         if (err.code == 'EEXIST') {
//             outputDir = outputDir + '-' + Date.now();
//             ensureExists(outputDir, 484, callback); // Call again
//             // return console.log("A Folder with same name already exists");
//         } else {
//             return console.log(err);
//         };
//     } else {
//         return ({msg:"folder created"});
//     }
// }

// Generate and Send Scripts
exports.getScript = function(req, res) {
  var hostname = req.body.hostname || 'default';
  outputDir = __dirname  + '/downloads/' + 'meansible_' + hostname;

  ensureExists(outputDir, 484, function callback(err,path) {
    if (err) {
        if (err.code == 'EEXIST') {
            outputDir = outputDir + '-' + Date.now();
            ensureExists(outputDir, 484, callback); // Call again
            // return console.log("A Folder with same name already exists");
        } else {
            return console.log(err);
        };
    }

    var jsondata = req.body;

    //VagrantFile generation
    fs.readFile(__dirname + "/pages/vagrant.ejs", 'utf-8', function(err, data) {
      console.log(data);
      // console.log(data) // => hello!
      var vagrant_out = ejs.render(data, {data:jsondata});
      var vagrantFile = path + '/Vagrantfile';
      fs.outputFile(vagrantFile, vagrant_out, function(err) {
        console.log(err) // => null
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
      console.log("The role no processing is :  "+ role);
      console.log(__dirname + "/pages/roles/" + role + "/tasks/main.ejs");
      fs.readFile(__dirname + "/pages/roles/" + role + "/tasks/main.ejs", 'utf-8', function(err, data) {
        console.log(data);
        var role_out = ejs.render(data, {data:jsondata});
        var roleFile = path + '/roles/'+ role + '/tasks/main.yml';
        fs.outputFile(roleFile, role_out, function(err) {
          console.log(err) // => null
        });
      })
    });
    // var vagrant_tpl = fs.readFileSync(__dirname + "/pages/vagrant.ejs").toString();
    // var vagrant_out = ejs.render(vagrant_tpl, {data:data});
    // var vagrantFile = path + '/Vagrantfile';
    // fs.outputFile(vagrantFile, vagrant_out, function(err) {
    //   console.log(err) // => null
    // })

    // res.sendFile(outputFile);
});


  res.json({"message": "folder created"});
  // var outputFile = '/assets/downloads/first.zip';
  // res.send({
  //   url: outputFile
  // });
};


// Get list of things
exports.index = function(req, res) {
  res.json([{
    name: 'Development Tools',
    info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name: 'Server and Client integration',
    info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }]);
};


