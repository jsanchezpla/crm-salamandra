import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    // 1. Extraemos los datos que nos envía tu formulario
    const { email, password } = await request.json();

    // 2. Buscamos si existe el email en MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // 3. Comparamos la contraseña escrita con la encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // 4. Si todo es correcto, creamos el Token (Carnet de identidad digital)
    // Nota: process.env.JWT_SECRET debe estar en tu archivo .env.local
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // La sesión caduca a las 8 horas
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
