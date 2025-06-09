import { Http } from '../utils/fetch';

export function create(data: ICapsule) {
  return Http.post<ICapsule>('/capsule/create', data);
}

export function list(params: ICapsuleQuery) {
  return Http.get<IPage<ICapsule>>('/capsule/list', params);
}