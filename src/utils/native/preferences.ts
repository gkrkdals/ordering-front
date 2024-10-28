import {Preferences} from "@capacitor/preferences";

export async function setObject(key: string, value: string) {
  await Preferences.set({ key, value })
}

export async function getObject(key: string) {
  return await Preferences.get({ key })
}

export async function deleteObject(key: string) {
  await Preferences.remove({ key });
}