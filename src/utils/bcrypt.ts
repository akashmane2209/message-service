import bcrypt from "bcryptjs";

export async function hash(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function compare(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
