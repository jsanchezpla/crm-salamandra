import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Comprobamos si ya existe para no duplicar
    const userExists = await User.findOne({ email: "jsanchezpla@gmail.com" });
    if (userExists) return NextResponse.json({ msg: "El admin ya existe" });

    // Encriptamos la clave
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Aumenta2026*", salt);

    // Creamos el usuario
    await User.create({
      email: "jsanchezpla@gmail.com",
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Admin creado correctamente",
      user: "jsanchezpla@gmail.com",
      pass: "Aumenta2026*",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
