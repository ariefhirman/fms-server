module.exports = {
  command: {
    all: ':command:#',
    start: ':command:start',
    pause: ':command:pause',
    restart: ':command:restart',
    shutdown: ':command:shutdown',
    rth: ':command:rth'
  },
  status: {
    all: ':status:#',
    connection: ':status:flight:connection',
    armed: ':status:flight:armed',
    mode: ':status:flight:mode',
    altitude: ':status:flight:altitude',
    speed: ':status:flight:speed',
    battery_percentage: ':status:battery:percentage'
  }
}