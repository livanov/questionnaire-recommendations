import BaseQuestion from "./base-question";
import Subquestion from "./subquestion";

export default interface Question extends BaseQuestion {
    subquestions?: Subquestion[];
    rank: number;
}

