import { Pipe, PipeTransform } from '@angular/core';
import { GameplayHistoryEntry } from '../../../definitions';

@Pipe({
  name: 'filterByEventType',
  standalone: true
})
export class FilterByEventTypePipe implements PipeTransform {
  transform(entries: GameplayHistoryEntry[], eventType: string): GameplayHistoryEntry[] {
    if (!eventType || eventType === 'all') {
      return entries;
    }
    return entries.filter(entry => entry.action === eventType);
  }
}
