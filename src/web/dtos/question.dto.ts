import BaseQuestionDto from "./base-question.dto";

export default interface QuestionDto extends BaseQuestionDto {
    subquestions?: QuestionDto[];
}