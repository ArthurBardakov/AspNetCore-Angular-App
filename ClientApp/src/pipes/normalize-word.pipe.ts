import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'normalize'
})
export class NormalizeWordPipe implements PipeTransform {

  transform(word: string, args?: any): string {
    const strArray = word.split(/(?=[A-Z])/);
    let upCase: boolean;
    word = '';

    for (let s = 0; s < strArray.length; s++) {
        if (s === 0) {
            upCase = strArray[s] === strArray[s].toUpperCase();
            if (upCase) {
                word += strArray[s] + ' ';
            } else {
                word += strArray[s][0].toUpperCase() +
                    strArray[s].slice(1, strArray[s].length).toLowerCase() + ' ';
            }
        } else if (s !== strArray.length - 1) {
            word += strArray[s].toLowerCase() + ' ';
        } else {
            word += strArray[s].toLowerCase();
        }
    }

    return word;
  }
}
