import {Transducer, protocols} from 'duce'
const  {step: tStep, result: tResult} = protocols.transducer

class SqlContainer extends Transducer {

  constructor(xf) {
    super(xf)
  }

  [tInit]() {
    return {sql: '', bindings: []}
  }

  [tStep](result, value) {

  }

  [tResult]() {

  }

}