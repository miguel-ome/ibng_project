export interface ISessions {
  questionId: string;
  answer: string[];
}

export interface Answer {
  id: string;
  respostas: ISessions[];
}
