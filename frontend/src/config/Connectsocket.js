import io from "socket.io-client";
import { NOTENDPOINT } from "../constants/constant";
const socket = io(NOTENDPOINT);
export { socket };
