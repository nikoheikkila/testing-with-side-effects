# Testing with Side Effects

A comprehensive educational project demonstrating how to write testable Node.js applications without mocks by leveraging dependency injection and test doubles.

## Table of Contents

- [Overview](#overview)
- [Why This Approach?](#why-this-approach)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Learning Objectives](#learning-objectives)
- [Key Concepts](#key-concepts)
- [Exercises](#exercises)
- [Further Reading](#further-reading)
- [Contributing](#contributing)

## Overview

This repository serves as an educational resource for teaching students how to write maintainable, testable Node.js applications that interact with external systems (command-line arguments, output streams) without relying on mocks. Instead, it demonstrates the use of **dependency injection** and **test doubles** to achieve clean, isolated unit tests.

The application is a simple command-line tool that takes a string input and reverses it, but the focus is on the testing architecture that enables side effect testing without mocks.

## Approach

Traditional testing often relies heavily on mocking frameworks, which can lead to several problems:

- **Brittle tests** that break when implementation details change
- **False positives** where mocked behavior doesn't match real behavior
- **Coupling** between tests and implementation details
- **Difficult refactoring** due to tightly coupled mock expectations

This project demonstrates an alternative approach that:

✅ **Creates more robust tests** by using real implementations when possible  
✅ **Reduces test brittleness** by focusing on behavior, not implementation  
✅ **Enables easier refactoring** with loosely coupled test architecture  
✅ **Improves confidence** in test results through realistic test scenarios  

## Architecture

The project follows a clean architecture pattern with clear separation of concerns:

```
├── cli.ts                   # Command line entry point
├── src/
│   ├── app.ts              # Main application class
│   ├── adapters/           # External dependencies (infrastructure)
│   │   ├── command_line.ts # Command line interface abstraction
│   │   ├── output.ts       # Output tracking and emission
│   │   ├── types.ts        # Adapter type definitions
│   │   └── index.ts        # Adapter exports
│   └── domain/             # Pure business logic
│       ├── reverse.ts      # String reversal logic
│       └── index.ts        # Domain exports
└── tests/
    └── app.test.ts         # Application tests
```

### Key Design Patterns

1. **Dependency Injection**: The `App` class receives its dependencies through constructor injection
2. **Test Doubles**: `CommandLine.createNull()` provides a test-specific implementation
3. **Observer Pattern**: Output tracking using event emitters for test verification
4. **Hexagonal Architecture**: Domain logic is separated from adapters (infrastructure concerns)
5. **Separation of Concerns**: Clear separation between domain logic, adapters, and tests

## Prerequisites

- [Bun](https://bun.sh/) v1.2.0 or later
- TypeScript v5.0 or later

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nikoheikkila/testing-with-side-effects.git
   cd testing-with-side-effects
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

## Usage

The application reverses any string provided as a command-line argument:

```bash
# Using bun directly
$ bun run cli.ts "Hello world"
dlrow olleh

# Different input examples
$ bun run cli.ts "TypeScript"
tpircSepyT

# No arguments - shows usage
$ bun run cli.ts
Usage: run <text>

# Too many arguments - shows error
$ bun run cli.ts "hello" "world"
too many arguments
```

## Testing

### Running Tests

```bash
bun test
```

### Test Architecture

The tests demonstrate several key principles:

#### 1. Dependency Injection for Testability

```typescript
class App {
   constructor(commandline = CommandLine.create()) {
     this.commandline = commandline;
   }
}
```

The `App` class accepts a `CommandLine` dependency, defaulting to the real implementation but allowing test doubles to be injected.

#### 2. Test Doubles Instead of Mocks

```typescript
function run({ args }: RunOptions): RunResult {
  const commandLine = CommandLine.createNull({ args });
  const output = commandLine.trackOutput();

  const app = new App(commandLine);
  app.run();

  return { output };
}
```

Instead of mocking, we use `CommandLine.createNull()` which provides a test-specific implementation that behaves like the real thing but captures output for verification.

#### 3. Output Tracking with Observer Pattern

```typescript
class OutputTracker {
  public readonly data: string[];

  private readonly emitter: EventEmitter;
  private readonly event: string;
  private readonly trackerFn: (text: string) => void;

  public constructor(emitter: EventEmitter, event: string) {
    this.emitter = emitter;
    this.event = event;
    this.data = [];

    this.trackerFn = (text: string) => this.data.push(text);
    this.emitter.on(this.event, this.trackerFn);
  }
}
```

Output is tracked using an event-based system that allows tests to verify what was written without mocking stdout.

## Learning Objectives

After working with this repository, students will understand:

1. **Dependency Injection Fundamentals**
   - How to design classes that accept dependencies
   - The difference between constructor and setter injection
   - How DI enables testability and flexibility

2. **Test Doubles vs Mocks**
   - What test doubles are and how they differ from mocks
   - When to use stubs, fakes, and null objects
   - How test doubles provide more realistic testing scenarios

3. **Separation of Concerns**
   - How to separate business logic from infrastructure
   - The importance of pure functions for testability
   - Designing abstractions for external dependencies

4. **Event-Driven Testing**
   - Using event emitters for test verification
   - How to track side effects without mocks
   - Observer pattern implementation in tests

## Key Concepts

### Test Doubles Explained

This project uses several types of test doubles:

- **Null Object** (`CommandLine.createNull()`): Provides a working implementation that does nothing harmful
- **Fake** (`StubProcess`): A lightweight implementation for testing
- **Spy** (`OutputTracker`): Records information for later verification

### Mock-Free Testing Benefits

| Mock-Based Testing                      | Mock-Free Testing                                  |
|-----------------------------------------|----------------------------------------------------|
| mock entire modules                     | Use dependency injection with real implementations |
| `expect(mock).toHaveBeenCalledWith()`   | Verify actual side effects and outputs             |
| Brittle tests that break on refactoring | Robust tests that survive implementation changes   |
| False confidence from mocked behavior   | Real confidence from actual behavior               |

## Exercises

### Beginner Exercises

1. **Add Input Validation**: Extend the app to validate input (e.g., no empty strings, maximum length)
2. **New Business Logic**: Add a function to count vowels and test it
3. **Multiple Operations**: Allow the app to perform multiple operations (reverse, uppercase, etc.)

### Intermediate Exercises

1. **File I/O**: Add file reading/writing capabilities with proper abstractions
2. **Configuration**: Add a configuration system with environment variable support
3. **Logging**: Implement a logging system that can be tested without mocks

### Advanced Exercises

1. **HTTP Client**: Add HTTP requests with a testable HTTP client abstraction
2. **Database Integration**: Add database operations using the same patterns
3. **Plugin System**: Create a plugin architecture that's fully testable

## Further Reading

### Books
- *Growing Object-Oriented Software, Guided by Tests* by Steve Freeman & Nat Pryce
- *Clean Code* by Robert C. Martin
- *Refactoring* by Martin Fowler

### Articles
- [The Magic Tricks of Testing](https://www.youtube.com/watch?v=URSWYvyc42M) by Sandi Metz
- [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) by Martin Fowler
- [Test Doubles](https://www.martinfowler.com/bliki/TestDouble.html) by Martin Fowler

### Online Resources
- [Dependency Injection Principles, Practices, and Patterns](https://www.manning.com/books/dependency-injection-principles-practices-patterns)
- [Test-Driven Development: By Example](https://www.oreilly.com/library/view/test-driven-development/0321146530/)

## Contributing

This is an educational project. Contributions that enhance the learning experience are welcome:

1. **Additional Examples**: New use cases that demonstrate the patterns
2. **Exercise Solutions**: Reference implementations for the exercises
3. **Documentation**: Improvements to explanations and examples
4. **Bug Fixes**: Corrections to existing code or documentation

### Guidelines

- Keep examples simple and focused on the learning objectives
- Ensure all code follows TypeScript best practices
- Add tests for any new functionality
- Update documentation to reflect changes

## Troubleshooting

### Common Issues

**Q: Tests are failing with "Cannot find module" errors**  
A: Make sure you've run `bun install` and that TypeScript compilation is working.

**Q: The application doesn't produce output**  
A: Remember to create an entry point that instantiates and runs the App class, as shown in the usage examples.

**Q: I want to see the actual stdout output in tests**  
A: The tests use a null object pattern for the process. To see real stdout, use the real CommandLine implementation.

## License

This project is released under the MIT License. See the LICENSE file for details.

---

*Happy learning! 🚀*
