interface ICapsule {
  id?: string;
  user: string;
  title: string;
  content: string;
  time_out: number;
  type: number;
  gift: boolean;
  status: number;
  create_user: string;
  create_nick: string;
  create_avatar: string;
  create_time?: number;
  update_time?: number;
}

interface ICapsuleQuery {
  title: string;
  index?: number;
  count?: number;
  fields?: string;
}