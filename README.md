# package-updater

Node module for programatically updating `package.json` and other `.json` files.

## Usage

#### Instantiation

```
var updater = require('package-updater') // pass the JSON file to work on
```

Further examples will be referring to the `updater` object created in the code above.

If you want to try out the examples, include the following code in your file.

```
var fs = require('fs') // need only for the examples
function getParsedPackage() {
  return JSON.parse(fs.readFileSync('./settings.json'))
}
```

### Adding properties

Using the `add()` instance method, you can add new properties. If you try to add a property that aleady exists, the module will return an error. If you want to overwrite an existing property use `update()`.

Adding a string-type property:

```
updater('./settings.json').add('time', 'now', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.time === 'now') // true
})
```

Adding an array-type property:

```
updater('./settings.json').add('tags', ['nodejs', 'javascript'], function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.tags)
})
```

Adding an object-type property:

```
updater('./settings.json').add('dependencies', { a: '1.2.1', b: '2.0.0'}, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.dependencies)
})
```

### Updating properties

Using the `update()` method, you can update existing properties. If you try to update a property does not exist, the module will return an error.

String-type properties are overwritten:

```
updater('./settings.json').update('license', 'FREE', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.license)
})
```

Array-type properties are appended:

```
updater('./settings.json').update('tags', 'cool', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.tags.includes('cool')) // true
})
```

Object-type properties are appended:

```
updater('./settings.json').update('author', { 'username': 'hacksparrow' }, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.author)
})
```

### Deleting properties

Using the `delete()` method, you can delete existing properties. If you try to delete a property that does not exist, the module will return an error.

FYI: `delete()` is also aliased as `remove()`.

Deleting a single property:

```
updater('./settings.json').delete('name', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg)
})
```

Deleting multiple properties:

```
updater('./settings.json').delete(['name', 'version'], function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg)
})
```

## LICENSE

[MIT](LICENSE)