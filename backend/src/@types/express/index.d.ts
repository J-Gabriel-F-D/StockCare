import { Request } from "express";
import { Usuario } from "./Usuario";

export interface RequestWithUser extends Request {
  usuario?: Usuario;
}
