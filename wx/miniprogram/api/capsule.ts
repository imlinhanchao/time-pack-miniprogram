import { Http } from '../utils/fetch';

export function create(data: ICapsule) {
  return Http.post<ICapsule>('/capsule/create', data);
}

export function list(params: ICapsuleQuery) {
  return Http.get<IPage<ICapsule>>('/capsule/list', params);
}

export function read(id:string) {
  return Http.get<ICapsule>('/capsule/read/'+id,undefined);
}

export function update(data) {
  return Http.post<ICapsule>('/capsule/update',data);
}