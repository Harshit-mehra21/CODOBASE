import { NextResponse } from "next/server";
import vm from "vm";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const startTime = Date.now();
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const { code, filePath, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided to execute" }, { status: 400 });
    }

    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(
          args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
            .join(" ")
        );
      },
      error: (...args: any[]) => {
        logs.push(
          "🚨 " +
            args
              .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
              .join(" ")
        );
      },
      warn: (...args: any[]) => {
        logs.push(
          "⚠️ " +
            args
              .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
              .join(" ")
        );
      },
      info: (...args: any[]) => {
        logs.push(
          "ℹ️ " +
            args
              .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
              .join(" ")
        );
      },
    };

    // Prepare sandbox environment
    const sandbox = {
      console: customConsole,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      Promise,
      Buffer,
    };

    const context = vm.createContext(sandbox);

    // Strip basic TypeScript types and imports for VM execution
    let executableCode = code
      // remove typescript imports / exports
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, "// [import bundled]")
      .replace(/export\s+(default\s+)?(class|function|const|let|var|interface|type)\s+/g, "$2 ")
      .replace(/:\s*(string|number|boolean|any|void|object|unknown|string\[\]|number\[\])\b/g, "")
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "")
      .replace(/type\s+\w+\s*=[\s\S]*?;/g, "");

    let result: any = undefined;
    let status: "SUCCESS" | "ERROR" = "SUCCESS";

    try {
      const script = new vm.Script(executableCode, { filename: filePath || "script.ts" });
      result = script.runInContext(context, { timeout: 3000 });
      if (result !== undefined && logs.length === 0) {
        logs.push(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
      }
    } catch (execErr: any) {
      status = "ERROR";
      logs.push(`❌ Runtime Error: ${execErr.message || execErr}`);
    }

    const durationMs = Date.now() - startTime;
    const outputString = logs.join("\n") || "✔ Execution finished with no console output.";

    // Save execution record in database
    await db.executionLog.create({
      data: {
        roomId: id,
        userId: user?.id,
        filePath: filePath || "index.ts",
        language: language || "typescript",
        output: outputString,
        status,
        durationMs,
      },
    });

    return NextResponse.json({
      success: true,
      status,
      durationMs,
      output: logs,
      rawOutput: outputString,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error("Execution error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        durationMs,
        output: [`❌ Execution failed: ${error.message}`],
      },
      { status: 500 }
    );
  }
}
