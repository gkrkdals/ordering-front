import User from "@src/models/manager/User.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";

export function isManager(user: User) {
  return user.permission === PermissionEnum.Manager;
}

export function isRider(user: User) {
  return user.permission === PermissionEnum.Rider;
}

export function isCook(user: User) {
  return user.permission === PermissionEnum.Cook;
}
