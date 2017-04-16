import utils from "loader-utils"
import isFunction from "lodash/isFunction"

function transformFileLoader(content, sourceMaps) {
  const cb = this.async()

  const emit = (name, code, map, ast) => {
    console.log(name)
    this.emitFile(name, code, map)
    cb(null, code, map, ast)
  }

  const query = utils.getOptions(this)

  const regExp = query.regExp

  const resource = this.resource
  const filename = this.resourcePath
  const context = query.context || this.options.context
  const interpolatedFilename = utils.interpolateName(this, query.name, {
    context, content, regExp
  })

  if (!isFunction(query.transformer)) {
    return emit(interpolatedFilename, content, sourceMaps)
  }

  try {
    const res = query.transformer({
      resource, filename, interpolatedFilename, content, sourceMaps, regExp
    })

    if (res instanceof Promise) {
      const onFulfilled = ({filename, content, sourceMaps}) => emit(
        filename, content, sourceMaps
      )

      return res.then(onFulfilled).catch(cb)
    }

    return emit(res.filename, res.content, res.sourceMaps)
  } catch (err) {
    return cb(err)
  }
}

export default transformFileLoader
