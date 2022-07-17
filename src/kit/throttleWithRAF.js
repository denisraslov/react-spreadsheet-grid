export default (fn) => {
  let running = false

  // Seems like webpack compiles this in a way we can't use "arguments" here.
  // So, three of args are enough for now.
  return (arg1, arg2, arg3) => {
    if (running) return

    running = true

    window.requestAnimationFrame(() => {
      fn.call(this, arg1, arg2, arg3)

      running = false
    })
  }
}
