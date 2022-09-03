import { trigger, sequence, state,stagger, animate, transition, style, query, animateChild } from '@angular/animations';


export const fadeOut =
  trigger('fadeOut', [
    state('void', style({  opacity: 0, transform: 'translateX(-550px)', 'box-shadow': 'none' })),
    transition('void => *', sequence([
      animate(".5s ease")
    ])),
    transition('* => void', [animate("1s ease")])
  ]);
