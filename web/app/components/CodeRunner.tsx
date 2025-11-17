"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CodeRunner() {
  const [code, setCode] = useState(`print("Hello, World!")`);
  const [stdin, setStdin] = useState("");
  const [languageId, setLanguageId] = useState(71); // Python 3
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const testCode = useAction(api.testCode.testCode);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const result = await testCode({
        language_id: languageId,
        source_code: code,
        stdin: stdin,
      });

      let outputText = "";
      
      if (result.stdout) {
        outputText += `✅ Output:\n${result.stdout}\n\n`;
      }
      
      if (result.stderr) {
        outputText += `❌ Error:\n${result.stderr}\n\n`;
      }
      
      if (result.compile_output) {
        outputText += `⚠️ Compilation:\n${result.compile_output}\n\n`;
      }
      
      outputText += `Status: ${result.status}\n`;
      
      if (result.time) {
        outputText += `Time: ${result.time}s\n`;
      }
      
      if (result.memory) {
        outputText += `Memory: ${result.memory}KB\n`;
      }

      setOutput(outputText || "No output");
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Code Runner (Judge0)</h2>
        
        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={languageId}
            onChange={(e) => setLanguageId(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          >
            <option value={71}>Python 3</option>
            <option value={63}>JavaScript (Node.js)</option>
            <option value={62}>Java</option>
            <option value={54}>C++</option>
            <option value={50}>C</option>
            <option value={51}>C#</option>
            <option value={78}>Kotlin</option>
            <option value={60}>Go</option>
            <option value={72}>Ruby</option>
            <option value={73}>Rust</option>
          </select>
        </div>

        {/* Code Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-3 font-mono text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your code here..."
          />
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Input (stdin)</label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="w-full h-24 p-3 font-mono text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Optional input for your program..."
          />
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunCode}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
        >
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div className="bg-gray-900 text-gray-100 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Output</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
        </div>
      )}
    </div>
  );
}
