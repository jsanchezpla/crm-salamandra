import { NextResponse } from "next/server";
import { getMasterModels } from "@/lib/masterDb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const { User } = await getMasterModels();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // Actualizar lastLogin
    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    const token = jwt.sign(
      { userId: user._id, email: user.email, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
