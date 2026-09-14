import { alphabetData, LetterCardType } from "../features/learning/data/learning.data"

export const shuffleArray=<T,>(array:T[]):T[]=>{
  return [...array].sort(()=>Math.random()-0.5);  
}

export const createRounds=()=>{
    const shuffled=shuffleArray(alphabetData);

    const selected=shuffled.slice(0,20);
 
    const rounds: LetterCardType[][]=[];

    for(let i=0;i<4;i++){
        const round = selected.slice(i*5,i*5+5);
        rounds.push(round);
    }
    return rounds;
}
