import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectFilter',
  standalone: true,
})
export class ProjectFilterPipe implements PipeTransform {
  transform(items: any[], projectId: number): unknown {
    let projectName = '';
    if (!items) return projectName;
    if (!projectId) return projectName;
    if (items.length > 0 && projectId) {
      let projectItem = items.find((it) => {
        return it.id == projectId;
      });
      if (projectItem) {
        projectName = projectItem.name;
      }
    }

    return projectName;
  }
}
