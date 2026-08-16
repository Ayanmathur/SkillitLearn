import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envFile = fs.readFileSync(".env", "utf-8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.trim().split("="))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const skillId = "b46f1688-9ce4-48e7-abfc-2297f340119d";

async function run() {
  console.log("Updating Skill #54: Python Programming (9 steps across 3 tracks)...");

  // 1. Fetch tracks for this skill
  let { data: tracks, error: tErr } = await supabase
    .from("tracks")
    .select("id, title, order_index")
    .eq("skill_id", skillId)
    .order("order_index");

  if (tErr) {
    console.error("Error fetching tracks:", tErr);
    return;
  }

  // If there are extra tracks (e.g. 4), delete extra
  if (tracks.length > 3) {
    const extraTrackIds = tracks.slice(3).map((t) => t.id);
    await supabase.from("steps").delete().in("track_id", extraTrackIds);
    await supabase.from("tracks").delete().in("id", extraTrackIds);
    tracks = tracks.slice(0, 3);
  }

  const track1Id = tracks[0].id;
  const track2Id = tracks[1].id;
  const track3Id = tracks[2].id;

  // Update Track titles
  await supabase.from("tracks").update({ title: "Track 1: CPython Internals, Memory Management and the Object Model" }).eq("id", track1Id);
  await supabase.from("tracks").update({ title: "Track 2: Functional Programming, Coroutines, Iterators and Decorators" }).eq("id", track2Id);
  await supabase.from("tracks").update({ title: "Track 3: Asyncio Concurrency, Multiprocessing and Low-Level Profiling" }).eq("id", track3Id);

  // Delete existing steps
  await supabase.from("steps").delete().in("track_id", [track1Id, track2Id, track3Id]);

  // Steps Data (Graduate / CPython Internals level content)
  const steps = [
    // Track 1
    {
      track_id: track1Id,
      title: "CPython Virtual Machine, Bytecode and the GIL Architecture",
      order_index: 1,
      content: `### CPython Execution Pipeline and Runtime Architecture

Python is an interpreted, dynamically-typed language executed by the standard CPython runtime:

1. Compilation and Execution Pipeline:
   - Source Code (.py) -> Tokenization & Parsing -> Abstract Syntax Tree (AST) -> Bytecode (.pyc) -> CPython Virtual Machine Evaluation Loop (\`ceval.c\`).
   - Bytecode Inspection: Using the standard \`dis\` module (\`dis.dis(fn)\`) to inspect low-level stack instructions (\`LOAD_FAST\`, \`BINARY_OP\`, \`CALL\`, \`RETURN_VALUE\`).

2. The Global Interpreter Lock (GIL):
   - A mutex lock preventing multiple native OS threads from executing Python bytecode simultaneously within a single CPython process.
   - Purpose: Protects CPython internal memory structures and reference count counters from race conditions.
   - Consequence: Multi-threading achieves high concurrency for I/O-bound tasks (network/disk where GIL is released during system calls), but cannot achieve parallel execution for CPU-bound computational workloads on multi-core processors (requiring multiprocessing or free-threaded Python 3.13 PEP 703).`
    },
    {
      track_id: track1Id,
      title: "Memory Management: Reference Counting and Generational GC",
      order_index: 2,
      content: `### PyObject Memory Allocations and Cyclic Garbage Collection

1. The PyObject Structure:
   - Every object in CPython is represented by a C structure containing \`ob_refcnt\` (reference counter) and \`ob_type\` (pointer to type object).

2. Primary Memory Management: Reference Counting:
   - \`ob_refcnt\` increments on variable assignment, parameter passing, or appending to containers.
   - \`ob_refcnt\` decrements when variables leave scope or are deleted.
   - When \`ob_refcnt == 0\`, memory is instantly reclaimed without latency.

3. Cyclic Garbage Collector (\`gc\` module):
   - Reference counting fails to reclaim circular references (e.g. Object A referencing Object B while Object B references Object A).
   - Generational Collector: Classifies objects into 3 generations (Gen 0, Gen 1, Gen 2). Newly allocated objects enter Gen 0; objects surviving collection cycles are promoted to older generations with decreasing collection frequencies based on allocation thresholds (\`gc.get_threshold()\`).

4. Small Object Allocator (\`pymalloc\`):
   - Manages allocations <= 512 bytes via 256KB Arenas, 4KB Pools, and fixed-size Blocks to eliminate OS memory fragmentation.`
    },
    {
      track_id: track1Id,
      title: "The Python Data Model, Metaclasses and Descriptors",
      order_index: 3,
      content: `### Advanced Object-Oriented Protocols and Metaprogramming

1. Python Dunder Protocols:
   - Sequence Protocol: \`__len__\`, \`__getitem__\`, \`__setitem__\`.
   - Context Manager Protocol: \`__enter__\`, \`__exit__\`.
   - Callable Protocol: \`__call__\`.

2. Object Creation Lifecycle:
   - \`__new__(cls, *args, **kwargs)\`: Class-level static method allocating and returning the raw object instance.
   - \`__init__(self, *args, **kwargs)\`: Instance method initializing object state.

3. Descriptor Protocol:
   - Objects implementing \`__get__(self, instance, owner)\`, \`__set__(self, instance, value)\`, or \`__delete__(self, instance)\`.
   - Underpins \`@property\`, \`@classmethod\`, \`@staticmethod\`, and ORM model field validations.

4. Metaclasses (\`class Meta(type)\`):
   - Classes are instances of metaclasses (\`type\`). Intercepts class definition creation at import time (\`__new__\`), validating attributes, enforcing architectural standards, and auto-registering plugin registries.`
    },

    // Track 2
    {
      track_id: track2Id,
      title: "Iterators, Generator Coroutines and Lazy Evaluation",
      order_index: 1,
      content: `### Streaming Data Pipelines and Memory-Efficient Iteration

1. The Iterator Protocol:
   - Iterable: Implements \`__iter__()\` returning an iterator.
   - Iterator: Implements \`__next__()\`, returning sequential items or raising \`StopIteration\` when exhausted.

2. Generator Functions and Expressions:
   - Functions utilizing \`yield\` suspend local execution frame state and yield values lazily, processing gigabyte-scale datasets with constant O(1) memory footprint.

3. Advanced Coroutine Mechanics:
   - Bidirectional communication: Passing data into paused generators using \`generator.send(value)\`, raising exceptions with \`.throw()\`, and closing with \`.close()\`.
   - Subgenerator Delegation (\`yield from iterable\`): Establishes a transparent bidirectional communication pipeline between caller and subgenerator.

4. High-Performance Itertools:
   - Utilizing \`itertools.islice\`, \`itertools.chain\`, \`itertools.groupby\`, and \`functools.lru_cache\` for memoized computation.`
    },
    {
      track_id: track2Id,
      title: "Advanced Decorators, Closures and Scope (LEGB)",
      order_index: 2,
      content: `### Metaprogramming, Lexical Scoping and Higher-Order Functions

1. Lexical Scope and the LEGB Rule:
   - Variable name resolution order: Local -> Enclosing -> Global -> Built-in.
   - Modifying outer scopes requires explicit \`nonlocal\` (for enclosing functions) or \`global\` declarations.

2. Closures:
   - An inner function retaining access to variables in its enclosing lexical scope even after the outer function has finished executing (stored in \`__closure__\` cell objects).

3. Decorator Architecture:
   - Functions accepting callables and returning wrapped callables.
   - Parameterized Decorators: Requires three nested function layers (decorator factory -> decorator -> wrapper).
   - Preserving Metadata: Always apply \`@functools.wraps(func)\` to preserve original function names, docstrings, and type annotations (\`__name__\`, \`__doc__\`, \`__annotations__\`).`
    },
    {
      track_id: track2Id,
      title: "Context Managers, Resource Lifecycles and Exception Groups",
      order_index: 3,
      content: `### Deterministic Resource Management and Exception Topologies

1. The Context Manager Protocol:
   - \`__enter__()\`: Acquires system resources (file handles, database transactions, network sockets) and returns target object.
   - \`__exit__(exc_type, exc_val, exc_tb)\`: Guarantees cleanup upon exiting the \`with\` block; returning True suppresses raised exceptions.

2. Decorator Utilities:
   - Creating context managers via \`@contextlib.contextmanager\` generator pattern wrapping \`yield\` inside a \`try...finally\` construct.

3. Modern Exception Handling:
   - Exception Chaining (\`raise NewException from original_error\`): Sets \`__cause__\`, preserving full diagnostic tracebacks.
   - Exception Groups & \`except*\` (PEP 654): Handling multiple concurrent exceptions originating from asynchronous task groups or parallel threads.`
    },

    // Track 3
    {
      track_id: track3Id,
      title: "Asyncio Event Loop, Coroutines and Task Scheduling",
      order_index: 1,
      content: `### Asynchronous I/O and Non-Blocking Event Loops

1. The Asyncio Architecture:
   - Single-threaded cooperative multitasking operating on an underlying OS I/O event multiplexer (\`epoll\` on Linux, \`kqueue\` on macOS, IOCP on Windows).

2. Coroutines and Tasks:
   - Coroutine Functions (\`async def\`): Return coroutine objects that execute only when awaited or scheduled.
   - \`await\`: Suspends the current coroutine, yielding control back to the event loop until the awaited Future/I/O operation completes.
   - \`asyncio.create_task()\`: Wraps coroutines into background Tasks scheduled on the event loop.

3. Structured Concurrency:
   - \`asyncio.TaskGroup\` (Python 3.11+): Context manager guaranteeing that all child tasks complete or cancel cleanly on failure.
   - Preventing Loop Blocking: Offloading CPU-bound synchronous calls to background threads via \`asyncio.to_thread(sync_fn, *args)\`.`
    },
    {
      track_id: track3Id,
      title: "Multi-Threading vs Multi-Processing vs Asyncio",
      order_index: 2,
      content: `### Concurrency Paradigms and Parallel Execution Strategies

1. Multi-Threading (\`threading\`, \`concurrent.futures.ThreadPoolExecutor\`):
   - Native OS threads sharing single process memory and single GIL.
   - Best for: I/O-bound workloads (web scraping, API calls, file read/write).
   - Thread Synchronization: \`threading.Lock\`, \`threading.RLock\`, \`threading.Semaphore\`, \`threading.Event\` preventing data race conditions.

2. Multi-Processing (\`multiprocessing\`, \`ProcessPoolExecutor\`):
   - Spawns independent OS processes, each with distinct virtual memory space and its own dedicated CPython interpreter and GIL.
   - Best for: CPU-bound intensive computations (machine learning training, image processing, cryptography).
   - Inter-Process Communication (IPC): \`multiprocessing.Queue\`, \`multiprocessing.Pipe\`, and Shared Memory (\`multiprocessing.shared_memory\`).`
    },
    {
      track_id: track3Id,
      title: "Performance Profiling, Cython and Vectorized Optimization",
      order_index: 3,
      content: `### Runtime Diagnostics, Memory Profiling and Native Extensions

1. Profiling and Diagnostics:
   - Deterministic CPU Profiling: \`cProfile.run()\` analyzing call counts, total time (\`ttot\`), and cumulative time (\`tcum\`).
   - Memory Profiling: \`tracemalloc\` tracking memory block allocations and identifying object memory leaks.

2. Vectorized Computation:
   - Replacing pure Python loops with NumPy C-contiguous arrays and vectorized universal functions (\`ufuncs\`), executing loops directly in optimized C/Fortran SIMD CPU registers.

3. Native Acceleration:
   - Cython: Compiling Python/C hybrid code (\`.pyx\`) with static C type declarations (\`cdef double\`) into native shared C libraries.
   - PyBind11 / C-API Extensions: Binding high-performance C++ algorithms directly into Python modules.`
    }
  ];

  for (const step of steps) {
    const { error: sErr } = await supabase.from("steps").insert(step);
    if (sErr) console.error("Step insert error:", sErr);
  }

  console.log("Successfully inserted 9 expert steps across 3 tracks for Skill #54.");

  // 2. Clear old quiz questions and insert 15 expert quiz questions
  await supabase.from("quiz_questions").delete().eq("skill_id", skillId);

  const quizQuestions = [
    // 5 EASY (Correct indices: 2, 0, 3, 1, 2)
    {
      skill_id: skillId,
      question_text: "In CPython, what is the Global Interpreter Lock (GIL)?",
      options: [
        "A password required to install Python",
        "A software firewall blocking internet ports",
        "A mutex lock that prevents multiple native OS threads from executing Python bytecode simultaneously within a single CPython process",
        "A compiler that converts Python into HTML"
      ],
      correct_option_index: 2,
      explanation: "The GIL is a mutex in CPython that protects memory management by ensuring only one thread executes bytecode at any given moment.",
      difficulty: "easy",
      order_index: 1
    },
    {
      skill_id: skillId,
      question_text: "What Python keyword turns a standard function into a Generator that yields values lazily with constant O(1) memory?",
      options: [
        "yield",
        "return",
        "continue",
        "async"
      ],
      correct_option_index: 0,
      explanation: "The yield keyword suspends function execution state and returns a value lazily, forming a generator object.",
      difficulty: "easy",
      order_index: 2
    },
    {
      skill_id: skillId,
      question_text: "What primary memory management mechanism in CPython immediately reclaims memory as soon as an object's reference count drops to zero?",
      options: [
        "Virtual Memory Paging",
        "Manual Free Calls",
        "Hard Drive Compaction",
        "Reference Counting"
      ],
      correct_option_index: 3,
      explanation: "CPython uses reference counting as its primary memory manager, freeing objects immediately when ob_refcnt reaches 0.",
      difficulty: "easy",
      order_index: 3
    },
    {
      skill_id: skillId,
      question_text: "When creating custom Python decorators, what helper decorator from 'functools' must be applied to the wrapper function to preserve the original function's name and docstring?",
      options: [
        "@property",
        "@functools.wraps(func)",
        "@staticmethod",
        "@dataclass"
      ],
      correct_option_index: 1,
      explanation: "@functools.wraps copies the __name__, __doc__, and other metadata from the original function to the inner wrapper.",
      difficulty: "easy",
      order_index: 4
    },
    {
      skill_id: skillId,
      question_text: "In Python object instantiation, what is the difference between the magic methods '__new__' and '__init__'?",
      options: [
        "__new__ is written in C; __init__ is written in Java",
        "__init__ deletes the object; __new__ prints it",
        "__new__ is a static method that allocates and returns the raw object instance in memory, whereas __init__ initializes the instance attributes",
        "__new__ and __init__ are 100% identical"
      ],
      correct_option_index: 2,
      explanation: "__new__ is the constructor allocating the instance in memory, while __init__ initializes the already-created instance.",
      difficulty: "easy",
      order_index: 5
    },

    // 5 MODERATE (Correct indices: 1, 3, 0, 2, 1)
    {
      skill_id: skillId,
      question_text: "Why does CPython require a secondary 'Generational Cyclic Garbage Collector' (gc module) in addition to its primary reference counting system?",
      options: [
        "To speed up disk reads",
        "Reference counting cannot detect or deallocate circular reference cycles (where two or more objects reference each other with non-zero refcounts)",
        "To format string variables",
        "Because reference counting only works for numbers"
      ],
      correct_option_index: 1,
      explanation: "Cyclic garbage collection is required to detect and collect isolated reference cycles that reference counting alone cannot clean up.",
      difficulty: "moderate",
      order_index: 6
    },
    {
      skill_id: skillId,
      question_text: "In Python variable resolution, what is the 'LEGB' scoping rule order?",
      options: [
        "Loop -> Error -> Garbage -> Buffer",
        "Linked -> External -> Global -> Base",
        "Literal -> Evaluated -> Grouped -> Binary",
        "Local -> Enclosing -> Global -> Built-in"
      ],
      correct_option_index: 3,
      explanation: "Python resolves variable names in LEGB order: Local scope first, then Enclosing (nested functions), Global (module level), and Built-in.",
      difficulty: "moderate",
      order_index: 7
    },
    {
      skill_id: skillId,
      question_text: "In Python concurrency, what concurrency paradigm should be chosen for CPU-bound computational workloads (such as machine learning calculations) to achieve true multi-core parallel execution?",
      options: [
        "Multiprocessing (multiprocessing / ProcessPoolExecutor) because each process spawns a dedicated CPython interpreter and independent GIL",
        "Multi-threading with threading.Thread",
        "Asyncio with async/await",
        "A single while loop"
      ],
      correct_option_index: 0,
      explanation: "Multiprocessing bypasses the GIL by running separate CPython processes across multiple CPU cores.",
      difficulty: "moderate",
      order_index: 8
    },
    {
      skill_id: skillId,
      question_text: "What two methods must a Python class implement to satisfy the 'Context Manager Protocol' and be used with the 'with' statement?",
      options: [
        "__start__ and __stop__",
        "__open__ and __close__",
        "__enter__ and __exit__",
        "__iter__ and __next__"
      ],
      correct_option_index: 2,
      explanation: "The context manager protocol requires __enter__ (acquiring resource) and __exit__ (guaranteed cleanup on block exit).",
      difficulty: "moderate",
      order_index: 9
    },
    {
      skill_id: skillId,
      question_text: "In Asyncio, what occurs when a coroutine encounters an 'await' expression during execution?",
      options: [
        "The computer shuts down",
        "The coroutine yields execution control back to the event loop, allowing other scheduled tasks or I/O events to run until the awaited operation completes",
        "The Python program crashes",
        "The coroutine executes synchronously and blocks the entire thread"
      ],
      correct_option_index: 1,
      explanation: "await suspends the current coroutine, allowing the event loop to execute other concurrent tasks while waiting for I/O.",
      difficulty: "moderate",
      order_index: 10
    },

    // 5 DIFFICULT (Correct indices: 3, 0, 2, 1, 0)
    {
      skill_id: skillId,
      question_text: "In the Python Data Model, what is a 'Descriptor' and what methods define its protocol?",
      options: [
        "A text file that describes what a module does",
        "A graphical user interface button",
        "A comment written above a function",
        "An object attribute whose access, mutation, and deletion are intercepted by implementing __get__, __set__, or __delete__ methods (the foundation of @property and ORMs)"
      ],
      correct_option_index: 3,
      explanation: "Descriptors customize attribute lookup behavior via __get__, __set__, and __delete__, powering properties, methods, and ORMs.",
      difficulty: "difficult",
      order_index: 11
    },
    {
      skill_id: skillId,
      question_text: "In Python generator coroutines, what does the syntax 'yield from subgenerator' accomplish beyond simple iteration?",
      options: [
        "It establishes a transparent bidirectional communication channel, delegating .send(), .throw(), and .close() between the outer caller and the subgenerator",
        "It deletes the subgenerator from memory",
        "It compiles the generator into C++",
        "It prints all generator items to the terminal"
      ],
      correct_option_index: 0,
      explanation: "yield from establishes full bidirectional delegation, passing values, exceptions, and return values directly between caller and subgenerator.",
      difficulty: "difficult",
      order_index: 12
    },
    {
      skill_id: skillId,
      question_text: "In Asyncio programming, why is calling a CPU-intensive synchronous function directly inside an 'async def' coroutine considered an anti-pattern?",
      options: [
        "Because it consumes zero memory",
        "Because it makes the code run twice as fast",
        "Because it blocks the single-threaded event loop, preventing all other concurrent asynchronous tasks and network I/O from executing",
        "Because Python prohibits synchronous functions"
      ],
      correct_option_index: 2,
      explanation: "Blocking synchronous calls halt the entire single-threaded event loop; they must be offloaded using asyncio.to_thread().",
      difficulty: "difficult",
      order_index: 13
    },
    {
      skill_id: skillId,
      question_text: "In Python metaprogramming, what is a 'Metaclass' and when does its '__new__' method execute?",
      options: [
        "A class for managing metadata in databases",
        "A class whose instances are classes themselves; its __new__ method executes at module import time when the class definition is parsed to construct the class object",
        "A function that runs after the program terminates",
        "A built-in class in HTML"
      ],
      correct_option_index: 1,
      explanation: "Metaclasses (inheriting from type) define how classes are constructed, executing __new__ at import time to build class objects.",
      difficulty: "difficult",
      order_index: 14
    },
    {
      skill_id: skillId,
      question_text: "In performance optimization, why does vectorized NumPy code execute orders of magnitude faster than equivalent pure Python 'for' loops?",
      options: [
        "NumPy executes computations in compiled C loops over contiguous memory blocks, leveraging CPU SIMD vector registers and avoiding per-iteration bytecode evaluation",
        "NumPy uses quantum computing",
        "NumPy runs in the web browser",
        "NumPy skips mathematical calculations"
      ],
      correct_option_index: 0,
      explanation: "NumPy processes contiguous C arrays in compiled machine code with SIMD vectorization, bypassing Python interpreter overhead.",
      difficulty: "difficult",
      order_index: 15
    }
  ];

  for (const q of quizQuestions) {
    const { error: qErr } = await supabase.from("quiz_questions").insert(q);
    if (qErr) console.error("Quiz question insert error:", qErr);
  }

  console.log("Successfully inserted 15 expert quiz questions with randomized correct answers for Skill #54.");
  console.log("Skill #54 update completed successfully!");
}

run();
