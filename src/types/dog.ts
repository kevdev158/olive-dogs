export interface Dog {
  breed: string;
  image: string | null;
}

export interface DogResponse {
  error?: string;
  data?: Dog[];
} 