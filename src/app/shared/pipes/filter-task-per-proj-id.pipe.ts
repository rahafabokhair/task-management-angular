import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTaskPerProjId',
  standalone: true
})
export class FilterTaskPerProjIdPipe implements PipeTransform {
  transform(items: any[], projectId: number): any[] {
    if (!items) return [];
    if (!projectId) return items;

    return items.filter((it) => {
      return it.projectid == projectId;
    });
  }

}
