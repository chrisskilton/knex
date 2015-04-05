import {GROUP_BY} from '../../sql/keywords'

export class GroupingCompiler {

  compile() {
    return [GROUP_BY, this.groupings]
  }

}