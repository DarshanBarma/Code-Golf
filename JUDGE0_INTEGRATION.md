# Judge0 Integration - Quick Start

## Files Created

### 1. `convex/testCode.ts` - Simple Judge0 Test Action
A standalone Convex action for testing code execution without match dependencies.

**Usage:**
```typescript
const testCode = useAction(api.testCode.testCode);

const result = await testCode({
  language_id: 71, // Python 3
  source_code: 'print("Hello, World!")',
  stdin: "" // optional input
});
```

### 2. `app/components/CodeRunner.tsx` - UI Component
A complete UI for testing Judge0 integration with:
- Language selector (Python, JavaScript, Java, C++, etc.)
- Code editor textarea
- Input (stdin) field
- Run button
- Output display with syntax highlighting

### 3. `app/test-code/page.tsx` - Demo Page
Visit `/test-code` to test the code runner.

## Environment Variables Required

Add to your `.env.local`:
```
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_HOST=judge0-ce.p.rapidapi.com
```

## How to Use in Your App

### Option 1: Use the Test Page
Navigate to `http://localhost:3000/test-code`

### Option 2: Add to Any Page
```tsx
import { CodeRunner } from "@/app/components";

export default function MyPage() {
  return <CodeRunner />;
}
```

### Option 3: Call the Action Directly
```tsx
"use client";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MyComponent() {
  const testCode = useAction(api.testCode.testCode);
  
  const runCode = async () => {
    const result = await testCode({
      language_id: 71,
      source_code: 'print("Hello")',
    });
    console.log(result.stdout); // "Hello"
  };
  
  return <button onClick={runCode}>Run</button>;
}
```

## Language IDs (Common)
- **71**: Python 3
- **63**: JavaScript (Node.js)
- **62**: Java
- **54**: C++ (GCC 9.2.0)
- **50**: C (GCC 9.2.0)
- **51**: C# (Mono 6.6.0.161)
- **78**: Kotlin
- **60**: Go
- **72**: Ruby
- **73**: Rust

## Your Existing runCode Action

The complex `convex/runCode.ts` is still there for your match-based submissions.
It includes:
- Test case validation
- Match completion logic
- Submission tracking

Use `testCode` for simple testing, `runCode` for actual match submissions.
