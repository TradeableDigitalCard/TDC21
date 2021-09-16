const truffleAssert = require('truffle-assertions');

const eventFilter = obj => !obj ? null : (ev) => !Object.keys(obj).some(k => ev[k] != obj[k])

const Emitted = (result, name, obj, msg = '') => truffleAssert.eventEmitted(result, name, eventFilter(obj), msg)
const NotEmitted = (result, name, obj, msg = '') => truffleAssert.eventNotEmitted(result, name, eventFilter(obj), msg)

module.exports = {
    Emitted,
    NotEmitted
}
