'use strict';

var fs = require('fs')

function Updater(jsonFilePath) {
  this.jsonFilePath = jsonFilePath
  return this
}

Updater.prototype.add = function(property, value, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {
      var pkg = JSON.parse(fileContent)
      if (property in pkg) { return cb(new Error('Property "' + property + '" already defined')) }
      pkg[property] = value
      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.update = function(property, value, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {
      var pkg = JSON.parse(fileContent)
      if (!(property in pkg)) { return cb(new Error('Property "' + property + '" not defined')) }
      pkg[property] = getFormattedValues(pkg[property], value)
      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.delete = function(properties, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {
      var pkg = JSON.parse(fileContent)
      var propertiesArray = []
      if (!Array.isArray(properties)) { propertiesArray.push(properties) }
      else propertiesArray = properties
      for (var i = 0; i < propertiesArray.length; i++) {
        var property = propertiesArray[i]
        if (!(property in pkg)) { return cb(new Error('Property "' + property + '" not defined')) }
        pkg[property] = undefined
      }
      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.remove = Updater.prototype.delete

function getFormattedValues(targetProperty, value) {
  var formattedValues = value
  if (typeof targetProperty === 'object') {
    if (Array.isArray(targetProperty)) {
      if (!Array.isArray(value)) {
        formattedValues = [value]
      }
      formattedValues = targetProperty.concat(formattedValues)
    } else {
      formattedValues = Object.assign(value, targetProperty)
    }
  }
  return formattedValues
}

module.exports = function(jsonFilePath) {
  return new Updater(jsonFilePath)
}
