'use strict';

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const updater = require('../')
const srcPackagePath = path.join(__dirname, 'package.json')
const destPackagePath = path.join(__dirname, 'test.package.json')

describe('updater()', function() {

  beforeEach(function(done) {
    fs.createReadStream(srcPackagePath).pipe(fs.createWriteStream(destPackagePath));
    done()
  })

  afterEach(function(done) {
    fs.unlink(destPackagePath, done)
  })

  describe('.add()', function() {

    it('should throw if a property is aleady defined', function(done) {
      updater(destPackagePath).add('author', 'Hage Yaapa', function(err) {
        assert(err)
        done()
      })
    })

    it('should add a string-type property', function(done) {
      updater(destPackagePath).add('time', 'now', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert.equal('now', pkg.time)
        done()
      })
    })

    it('should add an array-type property', function(done) {
      updater(destPackagePath).add('numbers', [1, 2, 3], function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert.equal(3, pkg.numbers.length)
        assert.equal(3, pkg.numbers[2])
        done()
      })
    })

    it('should add an object-type property', function(done) {
      updater(destPackagePath).add('compound', {
        'one': '4.14.1',
        'two': [1, 2, 3],
        'three': {
          'a': 'a',
          'b': 'b'
        }
      }, function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert.equal('4.14.1', pkg.compound.one)
        assert.equal(1, pkg.compound.two[0])
        assert.equal('a', pkg.compound.three.a)
        done()
      })
    })

  })

  describe('.update()', function() {

    it('should throw if a property is not defined', function(done) {
      updater(destPackagePath).update('random', '', function(err) {
        assert(err)
        done()
      })
    })

    it('should overwrite an existing string-type property', function(done) {
      updater(destPackagePath).update('license', 'FREE', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert.equal('FREE', pkg.license)
        done()
      })
    })

    it('should append to an existing array-type property', function(done) {
      updater(destPackagePath).update('tags', 'cool', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert(pkg.tags.includes('node'))
        assert(pkg.tags.includes('cool'))
        done()
      })
    })

    it('should append to an existing object-type property', function(done) {
      updater(destPackagePath).update('author', {
        'username': 'hacksparrow'
      }, function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert.equal('Hage Yaapa', pkg.author.name)
        assert.equal('hacksparrow', pkg.author.username)
        done()
      })
    })

  })

  describe('.delete()', function() {

    it('should throw if a property is not defined', function(done) {
      updater(destPackagePath).delete(['name', 'random'], function(err) {
        assert(err)
        done()
      })
    })

    it('should delete a single property', function(done) {
      updater(destPackagePath).delete('name', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert.equal(undefined, pkg.name)
        done()
      })
    })

    it('should delete multiple properties', function(done) {
      updater(destPackagePath).delete(['name', 'version'], function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destPackagePath))
        assert(!('name' in pkg))
        assert(!('version' in pkg))
        done()
      })
    })

  })

})
