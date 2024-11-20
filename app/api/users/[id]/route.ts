import User from "@/database/user.model";
import dbConnect from "@/lib/dbconnection";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errros";
import { UserSchema } from "@/lib/validations";
import { ApiErroResponse } from "@/types/glabal";
import { NextRequest, NextResponse } from "next/server";

// get user by id -> api/users/[id]/route.ts
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    if (!id) throw new NotFoundError("user");

    await dbConnect();
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("user");
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}

// delete user ->api/users/[id]/route.ts
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    if (!id) throw new NotFoundError("user");

    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("user");
    return NextResponse.json(
      {
        success: true,
        message: "user deleted successfully",
      },
      { status: 204 },
    );
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
// update user -> api/users/[id]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const data = await req.json();
  const { id } = await params;

  try {
    await dbConnect();
    // instead of safeParse , parital only
    // validates the fields that are present in the data
    const validatedData = UserSchema.partial().parse(data);
    const user = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError("api", error) as ApiErroResponse;
  }
}
