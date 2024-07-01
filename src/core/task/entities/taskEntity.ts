type TaskEntityCompletoDTO = {
  id: string;
  uid: string | undefined;
  task: string;
  completed: boolean;
  createdAt: number;
  concludedAt: number | null;
}

export type NewTaskEntityDTO = {
  uid: string | undefined;
  task: string;
  completed: boolean;
  concludedAt: number | null;
}

export default class TaskEntity {
  readonly id: string;
  readonly uid: string | undefined;
  readonly createdAt: number;
  task: string;
  completed: boolean;
  concludedAt: number | null;

  constructor(props: TaskEntityCompletoDTO) {
    this.id = props.id;
    this.uid = props.uid;
    this.createdAt = props.createdAt;
    this.concludedAt = props.concludedAt;
    this.completed = props.completed;
    this.task = props.task;
  }

  static criar(props: NewTaskEntityDTO): TaskEntity {
    const id = crypto.randomUUID();
    const createdAt = Date.now();

    const novoUsuario = new TaskEntity({
      id,
      createdAt,
      uid: props.uid,
      concludedAt: props.concludedAt,
      completed: props.completed,
      task: props.task
    });

    if (!id || !props.uid || !props.task || !createdAt) {
      throw new Error('Missing required fields');
    }

    return novoUsuario;
  }

  static montar(props: TaskEntityCompletoDTO): TaskEntity {
    const usuarioMontado = new TaskEntity({
      id: props.id,
      uid: props.uid,
      createdAt: props.createdAt,
      concludedAt: props.concludedAt,
      completed: props.completed,
      task: props.task
    });
    return usuarioMontado;
  }
}