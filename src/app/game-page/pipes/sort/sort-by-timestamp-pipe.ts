import { Pipe, PipeTransform } from '@angular/core';
import { GameplayHistoryEntry } from '../../../definitions';

@Pipe({
  name: 'sortByTimestampPipe',
  standalone: true
})
export class SortByTimestampPipe implements PipeTransform {

  transform(entries: GameplayHistoryEntry[], sortOrder: string): GameplayHistoryEntry[] {
    if (sortOrder === 'latest') {
      return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else {
      return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
  }

}
