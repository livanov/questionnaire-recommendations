import Option from "./option";

export default interface BaseQuestion {
    id: string;
    value: string;
    options: Option[];
}