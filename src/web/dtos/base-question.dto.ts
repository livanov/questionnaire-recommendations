import OptionDto from "./option.dto";

export default interface BaseQuestionDto {
    id: string;
    value: string;
    options: OptionDto[];
}