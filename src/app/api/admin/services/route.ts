import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const SERVICES_FILE_PATH = path.join(process.cwd(), "src/app/services/page.tsx");

export async function GET() {
  try {
    const fileContent = await fs.readFile(SERVICES_FILE_PATH, "utf-8");
    const packagesMatch = fileContent.match(/const packages = (\[[\s\S]*?\]);/);
    
    if (!packagesMatch) {
      return NextResponse.json({ error: "Paketler bulunamadı" }, { status: 404 });
    }

    const packages = eval(packagesMatch[1]);
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error reading packages:", error);
    return NextResponse.json({ error: "Paketler okunamadı" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { packages } = await request.json();
    
    // Read the current file content
    const fileContent = await fs.readFile(SERVICES_FILE_PATH, "utf-8");
    
    // Create the new packages array string
    const packagesString = JSON.stringify(packages, null, 2);
    
    // Replace the packages array in the file
    const newContent = fileContent.replace(
      /const packages = (\[[\s\S]*?\]);/,
      `const packages = ${packagesString};`
    );
    
    // Write the updated content back to the file
    await fs.writeFile(SERVICES_FILE_PATH, newContent, "utf-8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating packages:", error);
    return NextResponse.json({ error: "Paketler güncellenemedi" }, { status: 500 });
  }
} 