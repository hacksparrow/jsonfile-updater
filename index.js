'use strict';

var fs = require('fs')
var sortKeys = require('sort-keys')

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
      var propertyPath = ''

      for (var i = 0; i < inputProperties.length; i++) {
        var subProperty = inputProperties[i]
        propertyPath += '.' + subProperty
        if (i === inputProperties.length - 1) {
          if (typeof(propertyCursor[subProperty]) !== 'undefined') {
            return cb(new Error('Property "' + propertyPath + '" already defined'))
          }
          propertyCursor[subProperty] = value
        } else {
          if (typeof(propertyCursor[subProperty]) === 'undefined') { propertyCursor[subProperty] = {} }
        }
        propertyCursor = propertyCursor[subProperty]
      }

      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.set = function(property, value, cb) {
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return cb(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {

      if (err) return cb(err)

      var pkg = JSON.parse(fileContent)

      var inputProperties = property.split('.')
      var propertyCursor = pkg
      var propertyPath = ''

      for (var i = 0; i < inputProperties.length; i++) {
        var subProperty = inputProperties[i]
        propertyPath += '.' + subProperty
        if (i === inputProperties.length - 1) {
          if (!(subProperty in propertyCursor)) {
            return cb(new Error('Property "' + propertyPath + '" not defined'))
          }
          if (!areSameDataType(propertyCursor[subProperty], value)) {
            return cb(new Error('Mismatched data type'))
          } else {
            propertyCursor[subProperty] = value
          }
        } else {
          propertyCursor = propertyCursor[subProperty]
        }
      }

      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.append = function(property, value, preserve, cb) {
  if (typeof(preserve) === 'function') {
    cb = preserve
    preserve = false
  }
  var jsonFilePath = this.jsonFilePath
  fs.access(jsonFilePath, function(err) {
    if (err) return cb(err)
    fs.readFile(jsonFilePath, 'utf8', function(err, fileContent) {

      if (err) return cb(err)

      var pkg = JSON.parse(fileContent)

      var inputProperties = property.split('.')
      var propertyCursor = pkg
      var propertyPath = ''

      for (var i = 0; i < inputProperties.length; i++) {
        var subProperty = inputProperties[i]
        propertyPath += '.' + subProperty
        if (i === inputProperties.length - 1) {
          if (!(subProperty in propertyCursor)) {
            return cb(new Error('Property "' + propertyPath + '" not defined'))
          }
          var currentValue = propertyCursor[subProperty]
          if (areBooleanAndBoolean(currentValue, value) || areNumberAndNumber(currentValue, value)) {
            return cb(new Error('Cannot append'))
          } else if (!preserve && !areArrayAndValid(currentValue, value) && !areSameDataType(currentValue, value)) {
            return cb(new Error('Mismatched data type'))
          } else {
            propertyCursor[subProperty] = getAppendedValues(propertyCursor[subProperty], value, preserve)
          }
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
      var propertyPath = ''

      var propertiesArray = []
      if (!Array.isArray(properties)) { propertiesArray.push(properties) }
      else propertiesArray = properties
      for (var i = 0; i < propertiesArray.length; i++) {
        var property = propertiesArray[i]
        var inputProperties = property.split('.')

        for (var j = 0; j < inputProperties.length; j++) {
          var subProperty = inputProperties[j]
          propertyPath += '.' + subProperty
          if (!(subProperty in propertyCursor)) { return cb(new Error('Property "' + propertyPath + '" not defined')) }
          if (j === inputProperties.length - 1) {
            propertyCursor[subProperty] = undefined
          } else {
            propertyCursor = propertyCursor[subProperty]
          }
        }

        propertyCursor = pkg
        propertyPath = ''

      }

      var updatedPackage = JSON.stringify(pkg, null, 2)
      fs.writeFile(jsonFilePath, updatedPackage, cb)
    })
  })
}

Updater.prototype.remove = Updater.prototype.delete

function areBooleanAndBoolean(target, input) {
  if (typeof(target) === 'boolean' && typeof(input) === 'boolean') {
    return true
  } else { return false }
}

function areNumberAndNumber(target, input) {
  if (typeof(target) === 'number' && typeof(input) === 'number') {
    return true
  } else { return false }
}

function areArrayAndValid(target, input) {
  if (Array.isArray(target)) {
    if (typeof(input) === 'string' || typeof(input) === 'number') {
      return true
    } else { return false }
  } else { return false }
}

function areSameDataType(current, input) {
  if (Object.getPrototypeOf(current) === Object.getPrototypeOf(input)) {
    return true
  } else { return false }
}

function getAppendedValues(targetProperty, value, preserve) {
  var formattedValues = value
  if (typeof targetProperty === 'object') {
    if (Array.isArray(targetProperty)) {
      if (!Array.isArray(value)) {
        formattedValues = [value]
      }
      if (preserve === true) {
        targetProperty.push(value)
        formattedValues = targetProperty
      } else {
        formattedValues = targetProperty.concat(formattedValues)
      }

    } else {
      formattedValues = sortKeys(Object.assign(value, targetProperty))
    }
  } else if (typeof targetProperty === 'string') {
    formattedValues = targetProperty + value
  }
  return formattedValues
}

module.exports = function(jsonFilePath) {
  return new Updater(jsonFilePath)
}
