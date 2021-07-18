// https://www.freecodecamp.org/news/how-to-log-a-node-js-api-in-an-express-js-app-with-mongoose-plugins-efe32717b59/

const _ = require('lodash')
const getDiff  = require('./differentGrabber');

const plugin = function (schema) {
  schema.post('init', doc => {
    doc._original = doc.toObject({transform: false})
  })
  schema.pre('save', function (next) {
    if (this.isNew) {
      next()
    }else {
      this._diff = getDiff(this, this._original)
      next()
    }
})

  schema.methods.log = function ()  {
    return this._diff;
  }
}

module.exports = plugin