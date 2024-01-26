import io from "socket.io-client";
import { NOTENDPOINT } from "../constants/constant";
const socket =  io("https://yolo.sachinms.fyi/notification")
export { socket };
