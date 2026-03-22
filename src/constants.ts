/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: number;
  text: string;
  answer: boolean;
  explanation: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Ryška bývala pri veľkom starom smreku.",
    answer: false,
    explanation: "Ryška bývala pri veľkom starom dube."
  },
  {
    id: 2,
    text: "Ryška mala ryšavý chvostík a bystré očká.",
    answer: true,
    explanation: "Áno, Ryška mala presne takýto vzhľad."
  },
  {
    id: 3,
    text: "Ryška každé ráno zbierala lieskové oriešky a hľadala šišky.",
    answer: true,
    explanation: "To bola jej ranná rutina v lese."
  },
  {
    id: 4,
    text: "Ryška uvidela smutného ježka, ktorý sedel v tráve.",
    answer: true,
    explanation: "Ježko bol smutný, pretože sa stratil."
  },
  {
    id: 5,
    text: "Ježko sa stratil, keď hľadal lieskové oriešky.",
    answer: false,
    explanation: "Ježko hľadal chrobáčiky, nie oriešky."
  },
  {
    id: 6,
    text: "Ryška a ježko prešli cez slnečnú lúku plnú kvetov.",
    answer: true,
    explanation: "Cesta viedla cez krásnu zakvitnutú lúku."
  },
  {
    id: 7,
    text: "Potôčik v lese ticho žblnkotal medzi kameňmi.",
    answer: true,
    explanation: "Presne tak bol opísaný potôčik v príbehu."
  },
  {
    id: 8,
    text: "Múdra sova ukázala smerom k starej jedli.",
    answer: true,
    explanation: "Sova im poradila, kde hľadať ježkov domov."
  },
  {
    id: 9,
    text: "Ježkov domček bol postavený z malých kameňov.",
    answer: false,
    explanation: "Domček bol z lístia a vetvičiek."
  },
  {
    id: 10,
    text: "Najväčšia radosť je v tom, keď nájdeš najviac orieškov.",
    answer: false,
    explanation: "Najväčšia radosť je v tom, keď pomôžeš kamarátovi."
  }
];
