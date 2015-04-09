
import {iterSymbol, iterator} from 'transduce'

export class JoinIterable {

  [iterSymbol]() {
    return iterator([])
  }

}

export class GroupedJoinIterable extends JoinIterable {

}
