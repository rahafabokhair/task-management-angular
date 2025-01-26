import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], projectId: number): any[] {
    if (!items) return [];
    if (!projectId) return items;

    return items.filter((it) => {
      return it.id == projectId;
    });
  }
}
