# jsonfile-updater

Node module for programatically updating `package.json` and other `.json` files.

## Usage

### Instantiation

```js
var updater = require('jsonfile-updater')
```

Further examples will be referring to the `updater` object created in the code above.

If you want to try out the examples, include the following code in your file.

```js
var fs = require('fs')
function getParsedPackage() {
  return JSON.parse(fs.readFileSync('./settings.json'))
}
```

### Adding properties - add()

Using the `add()` instance method, you can add new properties. If you try to add a property that aleady exists, the module will return an error. If you want to overwrite an existing property use `update()`.

Adding a string-type property:

```js
updater('./settings.json').add('time', 'now', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.time === 'now') // true
})
```

Adding an array-type property:

```js
updater('./settings.json').add('tags', ['nodejs', 'javascript'], function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.tags)
})
```

Adding an object-type property:

```js
updater('./settings.json').add('dependencies', { a: '1.2.1', b: '2.0.0'}, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.dependencies)
})
```

### Updating properties - update()

Using the `update()` method, you can update existing properties. If you try to update a property does not exist, the module will return an error.

String-type properties are overwritten:

```js
updater('./settings.json').update('license', 'FREE', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.license)
})
```

Array-type properties are appended:

```js
updater('./settings.json').update('tags', 'cool', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.tags.includes('cool')) // true
})
```

Object-type properties are appended:

```js
updater('./settings.json').update('author', { 'username': 'hacksparrow' }, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.author)
})
```

### Deleting properties - delete()

Using the `delete()` method, you can delete existing properties. If you try to delete a property that does not exist, the module will return an error.

FYI: `delete()` is also aliased as `remove()`.

Deleting a single property:

```js
updater('./settings.json').delete('name', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg)
})
```

Deleting multiple properties:

```js
updater('./settings.json').delete(['name', 'version'], function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg)
})
```

## LICENSE

[MIT](LICENSE)
