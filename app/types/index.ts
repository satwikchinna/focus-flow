export type Task = {
  id: string;
  title: string;
  status: 'new' | 'inProgress' | 'finished';
};

export type MusicGenre = 'lofi' | 'classical' | 'ambient' | 'jazz' | 'nature';