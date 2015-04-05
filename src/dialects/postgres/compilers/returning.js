
export class ReturningCompiler {

  constructor() {
    this.type = 'clause:returning'
  }

  compile() {
    return [RETURNING, ]
  }

}