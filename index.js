'use strict';

var fs = require('fs')

function Updater(jsonFilePath) {
  this.jsonFilePath = jsonFilePath
  return this
}

Updater.prototype.add = function(property, value, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return cb(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {

      if (err) return cb(err)

      var pkg = JSON.parse(fileContent)
      var inputProperties = property.split('.')
      var propertyCursor = pkg

      for (var i = 0; i < inputProperties.length; i++) {
        var subProperty = inputProperties[i]
        if (i === inputProperties.length - 1) {
          if (subProperty in propertyCursor) { return cb(new Error('Property "' + property + '" already defined')) }
          propertyCursor[subProperty] = value
        } else {
          propertyCursor[subProperty] = {}
          propertyCursor = propertyCursor[subProperty]
        }
      }

      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.update = function(property, value, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return cb(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {

      if (err) return cb(err)

      var pkg = JSON.parse(fileContent)

      var inputProperties = property.split('.')
      var propertyCursor = pkg

      for (var i = 0; i < inputProperties.length; i++) {
        var subProperty = inputProperties[i]
        if (i === inputProperties.length - 1) {
          if (!(subProperty in propertyCursor)) { return cb(new Error('Property "' + property + '" not defined')) }
          propertyCursor[subProperty] = getFormattedValues(propertyCursor[subProperty], value)
        } else {
          propertyCursor = propertyCursor[subProperty]
        }
      }

      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.delete = function(properties, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return cb(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {

      if (err) return cb(err)

      var pkg = JSON.parse(fileContent)
      var propertyCursor = pkg

      var propertiesArray = []
      if (!Array.isArray(properties)) { propertiesArray.push(properties) }
      else propertiesArray = properties
      for (var i = 0; i < propertiesArray.length; i++) {
        var property = propertiesArray[i]
        var inputProperties = property.split('.')

        for (var j = 0; j < inputProperties.length; j++) {
          var subProperty = inputProperties[j]
          if (!(subProperty in propertyCursor)) { return cb(new Error('Property "' + property + '" not defined')) }
          if (j === inputProperties.length - 1) {
            propertyCursor[subProperty] = undefined
          } else {
            propertyCursor = propertyCursor[subProperty]
          }
        }

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
