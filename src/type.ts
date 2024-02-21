export type TRequest = {
    type: string;
    data: TPlayer;
    id: number;
};

export type TPlayer = {
    name: string;
    password: string;    
  }