# jsonfile-updater

Node module for programatically updating `package.json` and other `.json` files.

`jsonfile-updater` enforces strict type values. Boolean, string, number, array, and object are supported. Functions are not supported.

A value can be overwritten (using `set()` or `append()`) by a value of same type only.

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

### Adding properties

**`add(property, value, callback)`**

Using the `add()` instance method, you can add new properties. If you try to add a property that aleady exists, the module will return an error.
If you want to overwrite an existing property use `set()` or `append()`.

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

You can add a sub-property using the dot notation:

```js
updater('./settings.json').add('author.age', 100, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.author.age) // 100
})
```

### Updating properties

**`set(property, value, callback)`**

Using the `set()` method, you can overwrite existing properties. If you try to update a property does not exist, the module will return an error.
The new value should be the same as the old value's data type.

```js
updater('./settings.json').update('license', 'FREE', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.license)
})
```

```js
updater('./settings.json').update('tags', 'cool', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.tags.includes('cool')) // true
})
```

```js
updater('./settings.json').update('author', { 'username': 'hacksparrow' }, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.author)
})
```

You can target a sub-property using the dot notation:

```js
updater('./settings.json').update('author.age', 200, function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.author.age) // 200
})
```

**`append(property, value, callback)`**

Using the `append()` method, you can append items to an existing value. If you try to update a property does not exist, the module will return an error.

There are some data type restrictions:

1. Booleans cannot be appended to anything
2. A string can be appended only to string or array (pushed)
3. A number can be appended only to an array (pushed)
4. An array can be appended only to another array (concatenated)
5. An object can be appended only to another object (merged)

```js
updater('./settings.json').update('tags', 'cool', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.tags)
})
```

### Deleting properties

**`delete(property|[properties ...], callback)`**

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

You can target a sub-property using the dot notation:

```js
updater('./settings.json').delete('author.age', function(err) {
  if (err) return console.log(err)
  var pkg = getParsedPackage()
  console.log(pkg.author.age) // undefined
})
```

## LICENSE

[MIT](LICENSE)
