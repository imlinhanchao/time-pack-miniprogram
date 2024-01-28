import { Http } from '../utils/fetch';

export function create(data: ICapsule) {
  return Http.post<ICapsule>('/capsule/create', data);
}