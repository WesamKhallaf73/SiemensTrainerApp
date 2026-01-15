export * from './types';

import type { Lesson } from './types';
import { Lesson1 } from './stl/lesson1';
import { Lesson2 } from './stl/lesson2';
import { Lesson3 } from './stl/lesson3';
import { Lesson4 } from './stl/lesson4';
import { Lesson5 } from './stl/lesson5';
import { Lesson6 } from './stl/lesson6';
import { Lesson7 } from './stl/lesson7';
import { Lesson8 } from './stl/lesson8';
import { Lesson9 } from './stl/lesson9';
import { Lesson10 } from './stl/lesson10';
import { Lesson11 } from './stl/lesson11';
import { Lesson12 } from './stl/lesson12';

import { L1 } from './ladder/lesson1';
import { L2 } from './ladder/lesson2';
import { L3 } from './ladder/lesson3';
import { L4 } from './ladder/lesson4';
import { L5 } from './ladder/lesson5';
import { L6 } from './ladder/lesson6';

export const LESSONS: Lesson[] = [
    Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6,
    Lesson7, Lesson8, Lesson9, Lesson10, Lesson11, Lesson12
];

export const LADDER_LESSONS: Lesson[] = [
    L1, L2, L3, L4, L5, L6
];
