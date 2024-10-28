import Error from '../../domain/error';

export default interface ProblemDetails extends Error {
    instance?: String;
    status: number;
    errors?: Error[];
}