// Strong Oracle Engine
// -------
import Engine_Oracle from '../oracle/engine'

export default class Engine_StrongOracle extends Engine_Oracle {

  constructor(options) {
    super(options)
  }

  get driver() {
    return 'strong-oracle'
  }

}