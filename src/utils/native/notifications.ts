import {Channel} from "@capacitor/push-notifications";

export const channels: Channel[] = [
  {
    id: 'new_order',
    name: 'New Order',
    description: '새로운 주문 채널',
    importance: 5,
    sound: 'new_order',
    vibration: true,
  },
  {
    id: 'cooking_started',
    name: 'Cooking Started',
    description: '조리 시작 채널',
    importance: 5,
    sound: 'cooking_started',
    vibration: true,
  },
  {
    id: 'cooking_exceeded',
    name: 'Cooking Exceeded',
    description: '조리시간 초과 채널',
    importance: 5,
    sound: 'cooking_exceeded',
    vibration: true,
  },
  {
    id: 'new_delivery',
    name: 'New Delivery',
    description: '새로운 배달 채널',
    importance: 5,
    sound: 'new_delivery',
    vibration: true,
  },
  {
    id: 'deliver_delayed',
    name: 'Deliver Delayed',
    description: '배달시간 초과 채널',
    importance: 5,
    sound: 'deliver_delayed',
    vibration: true,
  },
  {
    id: 'new_dish_disposal',
    name: 'New Dish Disposal',
    description: '새로운 그릇수거 채널',
    importance: 5,
    sound: 'new_dish_disposal',
    vibration: true,
  },
]