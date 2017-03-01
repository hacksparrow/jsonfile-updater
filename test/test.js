'use strict';

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const updater = require('../')
const srcSettingsPath = path.join(__dirname, 'settings.json')
const destSettingsPath = path.join(__dirname, 'test.settings.json')

describe('updater()', function() {

  beforeEach(function(done) {
    fs.createReadStream(srcSettingsPath).pipe(fs.createWriteStream(destSettingsPath));
    done()
  })

  afterEach(function(done) {
    fs.unlink(destSettingsPath, done)
  })

  describe('.add()', function() {

    it('should throw if a property is aleady defined', function(done) {
      updater(destSettingsPath).add('author', 'Hage Yaapa', function(err) {
        assert(err)
        done()
      })
    })

    it('should add a string-type property', function(done) {
      updater(destSettingsPath).add('time', 'now', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert.equal('now', pkg.time)
        done()
      })
    })

    it('should add an array-type property', function(done) {
      updater(destSettingsPath).add('numbers', [1, 2, 3], function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert.equal(3, pkg.numbers.length)
        assert.equal(3, pkg.numbers[2])
        done()
      })
    })

    it('should add an object-type property', function(done) {
      updater(destSettingsPath).add('compound', {
        'one': '4.14.1',
        'two': [1, 2, 3],
        'three': {
          'a': 'a',
          'b': 'b'
        }
      }, function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert.equal('4.14.1', pkg.compound.one)
        assert.equal(1, pkg.compound.two[0])
        assert.equal('a', pkg.compound.three.a)
        done()
      })
    })

    describe('dot selector', function() {

      it('should throw if a property is aleady defined', function(done) {
        updater(destSettingsPath).add('author.name', 'Yaapa', function(err) {
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert(err)
          done()
        })
      })

      it('should add a string-type property', function(done) {
        updater(destSettingsPath).add('time.is', 'now', function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert.equal('now', pkg.time.is)
          done()
        })
      })

      it('should add an array-type property', function(done) {
        updater(destSettingsPath).add('numbers.prime.odd', [1, 3, 5, 7], function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert.equal(4, pkg.numbers.prime.odd.length)
          assert.equal(7, pkg.numbers.prime.odd[3])
          done()
        })
      })

      it('should add an object-type property', function(done) {
        updater(destSettingsPath).add('earth.india.karnataka', {
          'capital': 'Bengaluru'
        }, function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert.equal('Bengaluru', pkg.earth.india.karnataka.capital)
          done()
        })
      })

    })

  })

  describe('.update()', function() {

    it('should throw if a property is not defined', function(done) {
      updater(destSettingsPath).update('random', '', function(err) {
        assert(err)
        done()
      })
    })

    it('should overwrite an existing string-type property', function(done) {
      updater(destSettingsPath).update('license', 'FREE', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert.equal('FREE', pkg.license)
        done()
      })
    })

    it('should append to an existing array-type property', function(done) {
      updater(destSettingsPath).update('tags', 'cool', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert(pkg.tags.includes('node'))
        assert(pkg.tags.includes('cool'))
        done()
      })
    })

    it('should append to an existing object-type property', function(done) {
      updater(destSettingsPath).update('author', {
        'username': 'hacksparrow'
      }, function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert.equal('Hage Yaapa', pkg.author.name)
        assert.equal('hacksparrow', pkg.author.username)
        done()
      })
    })

    describe('dot selector', function() {

      it('should throw if a property is not defined', function(done) {
        updater(destSettingsPath).update('author.skillz', 'Nunchuks', function(err) {
          assert(err)
          done()
        })
      })

      it('should overwrite an existing string-type property', function(done) {
        updater(destSettingsPath).update('author.hobbies.others', 'Laughing', function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert.equal('Laughing', pkg.author.hobbies.others)
          assert.equal('Hage Yaapa', pkg.author.name)
          done()
        })
      })

      it('should append to an existing array-type property', function(done) {
        updater(destSettingsPath).update('author.hobbies.primary', 'ping pong', function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert(pkg.author.hobbies.primary.includes('ping pong'))
          assert(pkg.author.hobbies.primary.includes('disco dance'))
          done()
        })
      })

      it('should append to an existing object-type property', function(done) {
        updater(destSettingsPath).update('author.hobbies', {
          'secret': 'computer hacking'
        }, function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert.equal('computer hacking', pkg.author.hobbies.secret)
          assert.equal('Hage Yaapa', pkg.author.name)
          done()
        })
      })

    })

  })

  describe('.delete()', function() {

    it('should throw if a property is not defined', function(done) {
      updater(destSettingsPath).delete(['name', 'random'], function(err) {
        assert(err)
        done()
      })
    })

    it('should delete a single property', function(done) {
      updater(destSettingsPath).delete('name', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert.equal(undefined, pkg.name)
        done()
      })
    })

    it('should delete multiple properties', function(done) {
      updater(destSettingsPath).delete(['name', 'version'], function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert(!('name' in pkg))
        assert(!('version' in pkg))
        done()
      })
    })

    it('should support dot selector', function(done) {
      updater(destSettingsPath).delete('author.hobbies.secondary', function(err) {
        if (err) return done(err)
        var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
        assert(!('secondary' in pkg.author.hobbies))
        done()
      })
    })

    describe('dot selector', function() {

      it('should throw if a property is not defined', function(done) {
        updater(destSettingsPath).delete('author.skillz', function(err) {
          assert(err)
          done()
        })
      })

      it('should delete a single property', function(done) {
        updater(destSettingsPath).delete('author.hobbies.others', function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert.equal(undefined, pkg.author.hobbies.others)
          done()
        })
      })

      it('should delete multiple properties', function(done) {
        updater(destSettingsPath).delete(['author.hobbies.secondary', 'author.email'], function(err) {
          if (err) return done(err)
          var pkg = JSON.parse(fs.readFileSync(destSettingsPath))
          assert(!('secondary' in pkg.author.hobbies))
          assert(!('email' in pkg.author))
          assert.equal('Hage Yaapa', pkg.author.name)
          assert(pkg.author.hobbies.primary.includes('disco dance'))
          done()
        })
      })

    })

  })

})
