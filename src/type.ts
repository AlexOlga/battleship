export type TRequest = {
    type: string;
    data: {
        [key: string]: string;
    };
    id: number;
};
