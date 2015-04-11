
export class ReturningIterable {

  [iterSymbol]() {
    return iterable([RETURNING, this.value])
  }

}
